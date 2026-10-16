'use client'

import Link from "next/link"
import { RedacaoForm } from "@/components/RedacaoForm"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 mb-8">
          <Link href="/dashboard" className="font-black text-slate-900 text-lg">
            Redação <span className="text-blue-600">Nota 10 AÍ</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/dashboard" className="text-blue-600">Nova Redação</Link>
            <Link href="/historico" className="text-slate-600 hover:text-slate-900">Histórico</Link>
            <Link href="/pagamento" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Comprar Créditos</Link>
          </div>
        </nav>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900">Nova Redação</h1>
          <p className="text-gray-500 mt-2">Envie seu texto e receba a correção instantânea nos padrões do ENEM.</p>
        </header>
        <RedacaoForm />
      </div>
    </div>
  )
}
