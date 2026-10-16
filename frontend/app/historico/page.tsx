"use client"
import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import { authHeaders } from '../../utils/authHeaders'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://redacao-nota-10-backend-production.up.railway.app"

export default function Historico() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHistory() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const res = await fetch(`${API_URL}/api/redacao/history/${user.id}`, { headers: await authHeaders() })
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      }
      setLoading(false)
    }
    fetchHistory()
  }, [])

  if (loading) return <div className="p-12 text-center">Carregando histórico...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 mb-8">
          <Link href="/dashboard" className="font-black text-slate-900 text-lg">
            Redação <span className="text-blue-600">Nota 10 AÍ</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Nova Redação</Link>
            <Link href="/historico" className="text-blue-600">Histórico</Link>
            <Link href="/pagamento" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Comprar Créditos</Link>
          </div>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meu Histórico</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Voltar</Link>
        </div>
        {history.length === 0 ? (
          <p className="text-gray-500">Nenhuma redação avaliada ainda.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="border p-4 rounded-lg shadow-sm bg-white">
                <h3 className="font-bold text-lg">{item.tema}</h3>
                <p className="text-sm text-gray-500 mb-2">Banca: {item.banca} - Nota: {item.nota_total ?? item.total_score}/{item.nota_maxima ?? 1000} - Status: {item.status}</p>
                <p className="text-sm line-clamp-2 italic text-gray-600 mb-2">&quot;{item.raw_text}&quot;</p>
                {item.status === 'review_pending' && (
                  <button 
                    onClick={async () => {
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
