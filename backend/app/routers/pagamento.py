import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/pagamento", tags=["Pagamento"])
ASAAS_API_KEY = os.getenv("ASAAS_API_KEY", "")

class CheckoutRequest(BaseModel):
    user_id: str
    email: str
    name: str

@router.post("/checkout")
async def checkout_pix(req: CheckoutRequest):
    if not ASAAS_API_KEY:
        raise HTTPException(status_code=500, detail="ASAAS_API_KEY não configurada")
    headers = {"access_token": ASAAS_API_KEY, "Content-Type": "application/json"}
    
    async with httpx.AsyncClient() as client:
        res_cust = await client.post("https://api.asaas.com/v3/customers", headers=headers, json={"name": req.name, "email": req.email, "cpfCnpj": "00000000000"})
        if res_cust.status_code != 200: raise HTTPException(400, "Erro ao criar cliente Asaas")
        cust_id = res_cust.json().get("id")
        
        payload = {
            "customer": cust_id, "billingType": "PIX", "value": 29.90, "dueDate": "2026-10-10",
            "description": "Pacote 10 Correções - Redação Nota 10 AÍ", "externalReference": req.user_id
        }
        res_pay = await client.post("https://api.asaas.com/v3/payments", headers=headers, json=payload)
        if res_pay.status_code != 200: raise HTTPException(400, "Erro ao criar cobrança Asaas")
        pay_id = res_pay.json().get("id")
        
        res_qr = await client.get(f"https://api.asaas.com/v3/payments/{pay_id}/pixQrCode", headers=headers)
        if res_qr.status_code != 200: raise HTTPException(400, "Erro ao obter QRCode")
        
        return {"payment_id": pay_id, "qrCode": res_qr.json().get("encodedImage"), "payload": res_qr.json().get("payload")}

from fastapi import Request
from app.database import get_supabase_client

@router.post("/webhook")
async def asaas_webhook(request: Request):
    payload = await request.json()
    event = payload.get("event")
    
    if event in ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"]:
        payment = payload.get("payment", {})
        user_id = payment.get("externalReference")
        
        if user_id:
            db = get_supabase_client()
            # Busca créditos atuais ou usa 3 (grátis) se não existir
            res = db.table("user_credits").select("credits").eq("user_id", user_id).execute()
            if res.data:
                novos_creditos = res.data[0]["credits"] + 10
                db.table("user_credits").update({"credits": novos_creditos}).eq("user_id", user_id).execute()
            else:
                db.table("user_credits").insert({"user_id": user_id, "credits": 13}).execute() # 3 free + 10 comprados
                
    return {"received": True}
