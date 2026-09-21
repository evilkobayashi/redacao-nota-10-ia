"use client"
import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'

export default function Pagamento() {
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)
  const supabase = createClient()

  const handleCheckout = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Faça login primeiro.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://redacao-nota-10-backend-production.up.railway.app/api/pagamento/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, email: user.email, name: user.user_metadata?.full_name || "Aluno" })
      })
      if (res.ok) {
        const data = await res.json()
        setQrCode(data.qrCode)
        setPayload(data.payload)
      } else {
        alert("Erro ao gerar pagamento.")
      }
    } catch (e) {
      alert("Erro de conexão.")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Pacote PRO - 10 Correções</h1>
      <p className="text-gray-600 mb-8">Invista no seu futuro. Correção cirúrgica com IA para o ENEM.</p>
      
      {!qrCode ? (
        <button onClick={handleCheckout} disabled={loading} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700">
          {loading ? "Gerando Pix..." : "Comprar por R$ 29,90"}
        </button>
      ) : (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-bold text-green-700 mb-4">Escaneie o QR Code para pagar</h2>
          <img src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" className="mx-auto w-48 h-48 mb-4" />
          <textarea readOnly value={payload || ""} className="w-full text-xs p-2 border rounded" rows={3} />
          <Link href="/dashboard" className="block mt-6 text-blue-600 hover:underline">Ir para o Dashboard</Link>
        </div>
      )}
    </div>
  )
}
