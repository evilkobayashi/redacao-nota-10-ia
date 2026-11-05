"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { authHeaders } from '@/utils/authHeaders'
import { DashboardNav } from '@/components/DashboardNav'
import { ShieldCheck, Check, Copy, CreditCard, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://redacao-nota-10-backend-production.up.railway.app"

export default function Pagamento() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [cpf, setCpf] = useState('')
  const [pacote, setPacote] = useState<'pacote_10' | 'pacote_30'>('pacote_30')
  const [error, setError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
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

  useEffect(() => {
    if (!paymentId || confirmed) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/pagamento/status/${encodeURIComponent(paymentId)}`, {
          headers: { ...(await authHeaders()) }
        })
        if (!res.ok) return
        const data = await res.json()
        if (data?.confirmed) {
          setConfirmed(true)
          clearInterval(interval)
          setTimeout(() => {
            router.push('/dashboard?payment_success=true')
          }, 2000)
        }
      } catch {
        // Ignora erro transitório de rede durante polling
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [paymentId, confirmed, router])

  const formatCpfCnpj = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 14)
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  const handleCopyPix = async () => {
    if (!payload) return
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  const handleCheckout = async () => {
    setError(null)
    const cleanCpf = cpf.replace(/\D/g, '')
    if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
      setError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.")
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Faça login primeiro.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/pagamento/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "Aluno Redação Nota 10",
          cpf_cnpj: cleanCpf,
          pacote
        })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setPaymentId(data.payment_id || null)
        setInvoiceUrl(data.invoiceUrl || null)
        setQrCode(data.qrCode || null)
        setPayload(data.payload || null)
      } else {
        setError(data.detail || "Erro ao gerar cobrança no Asaas.")
      }
    } catch {
      setError("Erro de conexão com o servidor de pagamentos.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div id="main-content" className="min-h-screen bg-gray-50/70 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <DashboardNav
          userName={user?.user_metadata?.full_name}
          userEmail={user?.email}
        />

        <div className="max-w-xl mx-auto p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Comprar Créditos de Redação</h1>
          <p className="text-slate-600 mb-6 text-sm">Correção cirúrgica com IA Sabiá-4 nas 5 competências do ENEM e Concursos.</p>
          
          {!paymentId && !qrCode ? (
            <>
              {/* Seletor de Pacotes */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                <button
                  type="button"
                  onClick={() => setPacote('pacote_10')}
                  className={`p-4 rounded-xl border-2 cursor-pointer text-left transition-all ${pacote === 'pacote_10' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <p className="text-xs font-bold uppercase text-slate-600 mb-1">Pacote Básico</p>
                  <p className="text-xl font-extrabold text-slate-900">10 Redações</p>
                  <p className="text-lg font-bold text-blue-700 mt-1">R$ 29,90</p>
                  <p className="text-xs text-slate-600 mt-0.5">R$ 2,99 por redação</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPacote('pacote_30')}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer text-left transition-all ${pacote === 'pacote_30' ? 'border-red-600 bg-red-50/40' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="absolute -top-2.5 right-3 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                    Mais Popular
                  </span>
                  <p className="text-xs font-bold uppercase text-red-700 mb-1">Reta Final</p>
                  <p className="text-xl font-extrabold text-slate-900">30 Redações</p>
                  <p className="text-lg font-bold text-red-700 mt-1">R$ 59,90</p>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">R$ 1,99 por redação (-33%)</p>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium text-left">
                  {error}
                </div>
              )}

              <div className="max-w-sm mx-auto text-left mb-4">
                <label htmlFor="redacao-cpf" className="block text-xs font-bold text-slate-700 mb-1">
                  CPF ou CNPJ (para emissão do PIX / Nota Fiscal):
                </label>
                <input 
                  id="redacao-cpf"
                  value={cpf} 
                  onChange={e => setCpf(formatCpfCnpj(e.target.value))} 
                  placeholder="000.000.000-00" 
                  aria-label="CPF ou CNPJ" 
                  inputMode="numeric" 
                  maxLength={18}
                  className="block w-full p-3 border border-slate-300 rounded-xl text-sm tracking-wider" 
                />
              </div>

              <button 
                type="button"
                onClick={handleCheckout} 
                disabled={loading} 
                className={`w-full max-w-sm mx-auto flex items-center justify-center gap-2 text-white px-6 py-3.5 rounded-xl font-bold transition-colors ${pacote === 'pacote_30' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Gerando Cobrança...
                  </>
                ) : (
                  `Pagar R$ ${pacote === 'pacote_30' ? '59,90' : '29,90'} (PIX ou Cartão)`
                )}
              </button>
              <p className="mt-4 text-xs text-slate-600 max-w-md mx-auto flex items-center justify-center gap-1 flex-wrap">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" /> Preço final em Reais (R$) · Sem renovação automática · Garantia de 7 dias (<Link href="/reembolso" className="text-red-700 underline font-semibold">Política de Reembolso CDC</Link>).
              </p>
            </>
          ) : confirmed ? (
            <div className="py-8 space-y-4">
              <CheckCircle2 className="size-16 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-extrabold text-slate-900">Pagamento Confirmado!</h2>
              <p className="text-sm text-slate-600">Seus créditos de redação já foram liberados. Redirecionando para o Dashboard...</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                ⚡ Aguardando confirmação automática...
              </div>
              <h2 className="font-bold text-slate-900 text-lg">Escaneie o QR Code PIX ou pague com Cartão</h2>
              <p className="text-xs text-slate-600">Pagamento instantâneo via PIX ou Cartão de Crédito. Créditos liberados na hora.</p>

              {qrCode && (
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code PIX para compra de créditos no Redação Nota 10 AÍ"
                  className="mx-auto w-48 h-48 border p-2 rounded-xl bg-white"
                />
              )}

              {payload && (
                <div className="space-y-2">
                  <textarea
                    readOnly
                    aria-label="Código PIX Copia e Cola"
                    value={payload}
                    className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-mono text-slate-700"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? 'Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}
                  </button>
                </div>
              )}

              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <CreditCard className="size-4" /> Abrir Fatura Asaas (Cartão de Crédito / Boleto) <ExternalLink className="size-3.5" />
                </a>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentId(null)
                    setQrCode(null)
                    setPayload(null)
                    setInvoiceUrl(null)
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Alterar pacote ou CPF
                </button>
                <Link href="/dashboard" className="block text-blue-700 font-bold text-sm hover:underline">
                  Voltar ao Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
