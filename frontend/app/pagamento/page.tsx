"use client"
import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import { authHeaders } from '../../utils/authHeaders'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://redacao-nota-10-backend-production.up.railway.app"

export default function Pagamento() {
  const [loading, setLoading] = useState(false)
  const [cpf, setCpf] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)
  const supabase = createClient()

  const handleCheckout = async () => {
    if (cpf.replace(/\D/g, '').length !== 11 && cpf.replace(/\D/g, '').length !== 14) {
      alert("Informe um CPF ou CNPJ válido.")
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Faça login primeiro.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/pagamento/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ user_id: user.id, email: user.email, name: user.user_metadata?.full_name || "Aluno", cpf_cnpj: cpf })
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 mb-8">
          <Link href="/dashboard" className="font-black text-slate-900 text-lg">
            Redação <span className="text-blue-600">Nota 10 AÍ</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Nova Redação</Link>
            <Link href="/historico" className="text-slate-600 hover:text-slate-900">Histórico</Link>
            <Link href="/pagamento" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Comprar Créditos</Link>
          </div>
        </nav>

        <div className="max-w-xl mx-auto p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-bold mb-4">Pacote PRO - 10 Correções</h1>
          <p className="text-gray-600 mb-8">Invista no seu futuro. Correção cirúrgica com IA para o ENEM.</p>
          
          {!qrCode ? (
            <>
            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF ou CNPJ" aria-label="CPF ou CNPJ" inputMode="numeric" className="block mx-auto mb-4 w-64 p-2 border rounded" />
            <button onClick={handleCheckout} disabled={loading} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700">
              {loading ? "Gerando Pix..." : "Comprar por R$ 29,90"}
            </button>
            </>
          ) : (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="font-bold text-green-700 mb-4">Escaneie o QR Code para pagar</h2>
              <img src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" className="mx-auto w-48 h-48 mb-4" />
              <textarea readOnly value={payload || ""} className="w-full text-xs p-2 border rounded" rows={3} />
              <Link href="/dashboard" className="block mt-6 text-blue-600 hover:underline">Ir para o Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
