"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { authHeaders } from '@/utils/authHeaders'
import { DashboardNav } from '@/components/DashboardNav'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://redacao-nota-10-backend-production.up.railway.app"

export default function Pagamento() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [cpf, setCpf] = useState('')
  const [pacote, setPacote] = useState<'pacote_10' | 'pacote_30'>('pacote_30')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      setUser(user)
      setCheckingAuth(false)
    }
    checkUser()
  }, [router, supabase])

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
        body: JSON.stringify({ user_id: user.id, email: user.email, name: user.user_metadata?.full_name || "Aluno", cpf_cnpj: cpf, pacote })
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/70 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <DashboardNav
          userName={user?.user_metadata?.full_name}
          userEmail={user?.email}
        />

        <div className="max-w-xl mx-auto p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-bold mb-2">Comprar Créditos de Redação</h1>
          <p className="text-gray-600 mb-6 text-sm">Correção cirúrgica com IA para o ENEM e Concursos Públicos.</p>
          
          {!qrCode ? (
            <>
              {/* Seletor de Pacotes */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                <div 
                  onClick={() => setPacote('pacote_10')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${pacote === 'pacote_10' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Pacote Básico</p>
                  <p className="text-xl font-extrabold text-slate-900">10 Redações</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">R$ 29,90</p>
                  <p className="text-xs text-slate-500 mt-0.5">R$ 2,99 por redação</p>
                </div>

                <div 
                  onClick={() => setPacote('pacote_30')}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${pacote === 'pacote_30' ? 'border-red-600 bg-red-50/40' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="absolute -top-2.5 right-3 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                    Mais Popular
                  </span>
                  <p className="text-xs font-bold uppercase text-red-600 mb-1">Reta Final</p>
                  <p className="text-xl font-extrabold text-slate-900">30 Redações</p>
                  <p className="text-lg font-bold text-red-600 mt-1">R$ 59,90</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">R$ 1,99 por redação (-33%)</p>
                </div>
              </div>

              <input 
                value={cpf} 
                onChange={e => setCpf(e.target.value)} 
                placeholder="CPF ou CNPJ para o PIX" 
                aria-label="CPF ou CNPJ" 
                inputMode="numeric" 
                className="block mx-auto mb-4 w-full max-w-sm p-2.5 border rounded-lg text-sm" 
              />
              <button 
                onClick={handleCheckout} 
                disabled={loading} 
                className={`w-full max-w-sm mx-auto block text-white px-6 py-3.5 rounded-xl font-bold transition-colors ${pacote === 'pacote_30' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? "Gerando Pix..." : `Pagar R$ ${pacote === 'pacote_30' ? '59,90' : '29,90'} via PIX`}
              </button>
            </>
          ) : (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="font-bold text-green-700 mb-2">Escaneie o QR Code para pagar</h2>
              <p className="text-xs text-slate-500 mb-4">Pagamento instantâneo via PIX. Créditos liberados na hora.</p>
              <img src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" className="mx-auto w-48 h-48 mb-4 border p-2 rounded-lg" />
              <textarea readOnly value={payload || ""} className="w-full text-xs p-2 border rounded font-mono" rows={3} />
              <Link href="/dashboard" className="block mt-6 text-blue-600 font-bold hover:underline">Ir para o Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
