import os
import re
import hmac
import httpx
from datetime import date, timedelta
from fastapi import APIRouter, HTTPException, Header, Depends
from app.auth import get_user_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/pagamento", tags=["Pagamento"])
ASAAS_API_KEY = os.getenv("ASAAS_API_KEY", "")

class CheckoutRequest(BaseModel):
    user_id: str
    email: str
    name: str
    cpf_cnpj: str
    pacote: str = "pacote_10"  # "pacote_10" (R$ 29,90 -> +10) ou "pacote_30" (R$ 59,90 -> +30)

@router.post("/checkout")
async def checkout_pix(req: CheckoutRequest, user_id: str = Depends(get_user_id)):
    if not ASAAS_API_KEY:
        raise HTTPException(status_code=500, detail="ASAAS_API_KEY não configurada")
    cpf_cnpj = re.sub(r"\D", "", req.cpf_cnpj)
    if len(cpf_cnpj) not in (11, 14):
        raise HTTPException(status_code=422, detail="CPF/CNPJ inválido")
    headers = {"access_token": ASAAS_API_KEY, "Content-Type": "application/json"}

    is_intensivo = req.pacote == "pacote_30"
    valor = 59.90 if is_intensivo else 29.90
    qtd_creditos = 30 if is_intensivo else 10
    descricao = f"Pacote Intensivo 30 Correções - Redação Nota 10 AÍ" if is_intensivo else "Pacote 10 Correções - Redação Nota 10 AÍ"
    
    async with httpx.AsyncClient() as client:
        res_cust = await client.post("https://api.asaas.com/v3/customers", headers=headers, json={"name": req.name, "email": req.email, "cpfCnpj": cpf_cnpj})
        if res_cust.status_code != 200: raise HTTPException(400, "Erro ao criar cliente Asaas")
        cust_id = res_cust.json().get("id")
        
        payload = {
            "customer": cust_id, "billingType": "PIX", "value": valor, "dueDate": (date.today() + timedelta(days=1)).isoformat(),
            "description": descricao, "externalReference": f"{user_id}:{qtd_creditos}"
        }
        res_pay = await client.post("https://api.asaas.com/v3/payments", headers=headers, json=payload)
        if res_pay.status_code != 200: raise HTTPException(400, "Erro ao criar cobrança Asaas")
        pay_id = res_pay.json().get("id")
        
        res_qr = await client.get(f"https://api.asaas.com/v3/payments/{pay_id}/pixQrCode", headers=headers)
        if res_qr.status_code != 200: raise HTTPException(400, "Erro ao obter QRCode")
        
        return {"payment_id": pay_id, "qrCode": res_qr.json().get("encodedImage"), "payload": res_qr.json().get("payload"), "valor": valor, "creditos": qtd_creditos}

from fastapi import Request
from app.database import get_supabase_client

@router.post("/webhook")
async def asaas_webhook(request: Request, asaas_access_token: str = Header(default="")):
    expected = os.getenv("ASAAS_WEBHOOK_TOKEN", "")
    if not expected or not hmac.compare_digest(asaas_access_token, expected):
        raise HTTPException(status_code=401, detail="Token de webhook inválido")
    payload = await request.json()
    event = payload.get("event")
    
    if event == "PAYMENT_RECEIVED":
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
        
        if user_id:
            db = get_supabase_client()
            # Busca créditos atuais ou usa 3 (grátis) se não existir
            res = db.table("user_credits").select("credits").eq("user_id", user_id).execute()
            if res.data:
                novos_creditos = res.data[0]["credits"] + creditos_adicionar
                db.table("user_credits").update({"credits": novos_creditos}).eq("user_id", user_id).execute()
            else:
                db.table("user_credits").insert({"user_id": user_id, "credits": 3 + creditos_adicionar}).execute()
                
    return {"received": True}
