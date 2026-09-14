'use client'

import { RedacaoForm } from "@/components/RedacaoForm"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900">Nova Redação</h1>
          <p className="text-gray-500 mt-2">Envie seu texto e receba a correção instantânea nos padrões do ENEM.</p>
        </header>
        <RedacaoForm />
      </div>
    </div>
  )
}
