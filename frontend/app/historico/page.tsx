"use client"
import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'

export default function Historico() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHistory() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const res = await fetch(`https://redacao-nota-10-backend-production.up.railway.app/api/redacao/history/${user.id}`)
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
    <div className="max-w-4xl mx-auto p-6">
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
              <p className="text-sm text-gray-500 mb-2">Banca: {item.banca} - Nota: {item.nota_total}/{item.nota_maxima}</p>
              <p className="text-sm line-clamp-2 italic text-gray-600">"{item.raw_text}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
