import os
import re
import hmac
import httpx
from datetime import date, timedelta
from fastapi import APIRouter, HTTPException, Header, Depends, Request
from app.auth import get_user_id
from app.database import get_supabase_client
from pydantic import BaseModel

router = APIRouter(prefix="/api/pagamento", tags=["Pagamento"])
ASAAS_URL = os.getenv("ASAAS_URL", "https://api.asaas.com/v3")

def _get_asaas_headers():
    key = os.getenv("ASAAS_API_KEY", "")
    if not key:
        raise HTTPException(status_code=500, detail="ASAAS_API_KEY não configurada no servidor.")
    return {"access_token": key, "Content-Type": "application/json"}

class CheckoutRequest(BaseModel):
    user_id: str = ""
    email: str
    name: str
    cpf_cnpj: str
    pacote: str = "pacote_10"  # "pacote_10" (R$ 29,90 -> +10) ou "pacote_30" (R$ 59,90 -> +30)

def _credit_user_if_needed(user_id: str, creditos_adicionar: int):
    if not user_id:
        return
    db = get_supabase_client()
    res = db.table("user_credits").select("credits").eq("user_id", user_id).execute()
    if res.data:
        novos_creditos = res.data[0]["credits"] + creditos_adicionar
        db.table("user_credits").update({"credits": novos_creditos}).eq("user_id", user_id).execute()
    else:
        db.table("user_credits").insert({"user_id": user_id, "credits": 3 + creditos_adicionar}).execute()

@router.post("/checkout")
async def checkout_pix(req: CheckoutRequest, user_id: str = Depends(get_user_id)):
    headers = _get_asaas_headers()
    cpf_cnpj = re.sub(r"\D", "", req.cpf_cnpj or "")
    if len(cpf_cnpj) not in (11, 14):
        raise HTTPException(status_code=422, detail="CPF/CNPJ inválido")

    is_intensivo = req.pacote == "pacote_30"
    valor = 59.90 if is_intensivo else 29.90
    qtd_creditos = 30 if is_intensivo else 10
    descricao = "Pacote Intensivo 30 Correções - Redação Nota 10 AÍ" if is_intensivo else "Pacote 10 Correções - Redação Nota 10 AÍ"
    
    async with httpx.AsyncClient(timeout=20.0) as client:
        # 1. Buscar cliente existente pelo CPF/CNPJ ou criar novo
        cust_id = None
        search_res = await client.get(f"{ASAAS_URL}/customers", headers=headers, params={"cpfCnpj": cpf_cnpj})
        if search_res.status_code == 200:
            items = search_res.json().get("data", [])
            if items:
                cust_id = items[0].get("id")

        if not cust_id:
            res_cust = await client.post(
                f"{ASAAS_URL}/customers",
                headers=headers,
                json={"name": req.name or "Aluno Redação Nota 10", "email": req.email, "cpfCnpj": cpf_cnpj}
            )
            if res_cust.status_code != 200:
                err_msg = "Erro ao validar CPF/CNPJ no Asaas."
                try:
                    err_msg = res_cust.json().get("errors", [{}])[0].get("description", err_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=400, detail=err_msg)
            cust_id = res_cust.json().get("id")
        
        # 2. Criar cobrança UNDEFINED (permite PIX, Cartão e Boleto na fatura Asaas)
        payload = {
            "customer": cust_id,
            "billingType": "UNDEFINED",
            "value": valor,
            "dueDate": (date.today() + timedelta(days=1)).isoformat(),
            "description": descricao,
            "externalReference": f"{user_id}:{qtd_creditos}"
        }
        res_pay = await client.post(f"{ASAAS_URL}/payments", headers=headers, json=payload)
        if res_pay.status_code != 200:
            raise HTTPException(status_code=400, detail="Erro ao criar cobrança no Asaas.")
        pay_json = res_pay.json()
        pay_id = pay_json.get("id")
        invoice_url = pay_json.get("invoiceUrl")
        
        # 3. Obter QRCode PIX
        qr_code = None
        pix_payload = None
        res_qr = await client.get(f"{ASAAS_URL}/payments/{pay_id}/pixQrCode", headers=headers)
        if res_qr.status_code == 200:
            qr_json = res_qr.json()
            qr_code = qr_json.get("encodedImage")
            pix_payload = qr_json.get("payload")
        
        return {
            "payment_id": pay_id,
            "invoiceUrl": invoice_url,
            "qrCode": qr_code,
            "payload": pix_payload,
            "valor": valor,
            "creditos": qtd_creditos
        }

@router.get("/status/{payment_id}")
async def check_payment_status(payment_id: str, user_id: str = Depends(get_user_id)):
    headers = _get_asaas_headers()
    async with httpx.AsyncClient(timeout=15.0) as client:
        res = await client.get(f"{ASAAS_URL}/payments/{payment_id}", headers=headers)
        if res.status_code != 200:
            return {"confirmed": False, "status": "PENDING"}
        data = res.json()
        status = data.get("status", "PENDING")
        confirmed = status in ("RECEIVED", "CONFIRMED")
        return {"confirmed": confirmed, "status": status}

@router.post("/webhook")
async def asaas_webhook(request: Request, asaas_access_token: str = Header(default="")):
    expected = os.getenv("ASAAS_WEBHOOK_TOKEN", "")
    if not expected or not hmac.compare_digest(asaas_access_token, expected):
        raise HTTPException(status_code=401, detail="Token de webhook inválido")
    payload = await request.json()
    event = payload.get("event")
    
    if event in ("PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"):
        payment = payload.get("payment", {})
        raw_ref = payment.get("externalReference") or ""
        
        user_id = raw_ref
        creditos_adicionar = 10
        if ":" in raw_ref:
            partes = raw_ref.split(":", 1)
            user_id = partes[0]
            try:
                creditos_adicionar = int(partes[1])
            except ValueError:
                creditos_adicionar = 10
        
        _credit_user_if_needed(user_id, creditos_adicionar)
                
    return {"received": True}
