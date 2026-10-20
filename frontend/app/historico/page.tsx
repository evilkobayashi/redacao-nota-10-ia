"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { authHeaders } from '@/utils/authHeaders'
import { DashboardNav } from '@/components/DashboardNav'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://redacao-nota-10-backend-production.up.railway.app"

export default function Historico() {
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [expandedId, setExpandedId] = useState<string | number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHistory() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      setUser(user)

      try {
        const res = await fetch(`${API_URL}/api/redacao/history/${user.id}`, { headers: await authHeaders() })
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (e) {
        console.error("Erro ao buscar histórico:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [router, supabase])

  if (loading) {
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Meu Histórico</h1>
          <Link href="/dashboard" className="text-sm font-bold text-red-600 hover:underline">← Voltar para Nova Redação</Link>
        </div>
        {history.length === 0 ? (
          <p className="text-gray-500">Nenhuma redação avaliada ainda.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item, i) => {
              const cardKey = item.id ?? i
              const isExpanded = expandedId === cardKey
              const fb = item.feedback_json
              return (
                <div
                  key={cardKey}
                  onClick={() => setExpandedId(isExpanded ? null : cardKey)}
                  className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{item.tema}</h3>
                    <span className="text-xs text-blue-600 font-semibold">{isExpanded ? 'Ocultar detalhes ▲' : 'Ver correção ▼'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Banca: {item.banca} - Nota: {item.nota_total ?? item.total_score}/{item.nota_maxima ?? 1000} - Status: {item.status}</p>
                  <p className={`text-sm italic text-gray-600 mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>&quot;{item.raw_text}&quot;</p>
                  {item.status === 'review_pending' && (
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation()
                        const res = await fetch(`${API_URL}/api/redacao/aprovar/${item.id}`, { method: 'PUT', headers: await authHeaders() })
                        if (res.ok) {
                          setHistory(h => h.map(x => x.id === item.id ? { ...x, status: 'done' } : x))
                        }
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Aprovar Nota
                    </button>
                  )}
                  {isExpanded && fb && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                      {fb.comentario_geral && (
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                          <strong className="block text-slate-900 mb-1">Comentário Geral:</strong>
                          {fb.comentario_geral}
                        </div>
                      )}
                      {fb.criterios?.length > 0 && (
                        <div className="space-y-2">
                          <strong className="block text-sm text-slate-900">Competências / Critérios:</strong>
                          {fb.criterios.map((c: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-200 rounded-lg text-sm">
                              <div className="flex justify-between font-bold text-slate-800 mb-1">
                                <span>{c.nome_criterio}</span>
                                <span className="text-blue-700">{c.nota_obtida} / {c.nota_maxima}</span>
                              </div>
                              <p className="text-slate-600 text-xs">{c.comentarios}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {fb.marcacoes?.length > 0 && (
                        <div className="space-y-2">
                          <strong className="block text-sm text-amber-800">Correções no Texto:</strong>
                          {fb.marcacoes.map((m: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                              <span className="line-through text-rose-600 mr-2">{m.trecho_original}</span>
                              <span className="font-semibold text-emerald-700">→ {m.trecho_corrigido}</span>
                              {m.explicacao && <p className="text-slate-600 mt-1">{m.explicacao}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
