'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { DashboardNav } from "@/components/DashboardNav"
import { RedacaoForm } from "@/components/RedacaoForm"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Estudante'

  return (
    <div className="min-h-screen bg-gray-50/70 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <DashboardNav
          userName={user?.user_metadata?.full_name}
          userEmail={user?.email}
        />

        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Olá, {firstName}! 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Envie sua redação (digitada ou foto) para receber feedback instantâneo nas 5 competências do ENEM.
            </p>
          </div>
        </header>

        <RedacaoForm />
      </div>
    </div>
  )
}
