'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PenTool, LogOut, Sparkles, History, ShoppingCart, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface DashboardNavProps {
  userEmail?: string | null
  userName?: string | null
}

export function DashboardNav({ userEmail, userName }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [credits, setCredits] = useState<number | null>(null)
  const [displayName, setDisplayName] = useState<string>(userName || '')

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (!userName) {
        setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Aluno')
      }

      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!error && data) {
        setCredits(data.credits)
      } else {
        setCredits(3) // 3 correções grátis iniciais padrão
      }
    }
    loadData()
  }, [supabase, userName])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'DIREITO AO ESQUECIMENTO (LGPD - Art. 18, VI):\n\nTem certeza que deseja excluir permanentemente sua conta e apagar todas as suas redações e dados pessoais? Esta ação não pode ser desfeita.'
    )
    if (!confirmed) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://redacao-nota-10-backend-production.up.railway.app'
      if (session?.access_token) {
        await fetch(`${apiUrl}/api/redacao/account`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => {})
      }
      if (user) {
        await supabase.from('redacao_submissions').delete().eq('user_id', user.id)
        await supabase.from('user_credits').delete().eq('user_id', user.id)
      }
      localStorage.clear()
      await supabase.auth.signOut()
      alert('Seus dados pessoais e histórico foram apagados com sucesso conforme a LGPD.')
      router.replace('/')
    } catch {
      await supabase.auth.signOut()
      router.replace('/')
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 mb-8">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <span className="grid place-items-center size-8 rounded-lg bg-red-600 text-white shadow-sm">
          <PenTool className="size-4" />
        </span>
        <span className="font-extrabold text-slate-900 text-lg tracking-tight">
          Redação <span className="text-red-600">Nota 10</span> <span className="text-amber-500">AÍ</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1 sm:gap-2 text-sm font-bold">
        <Link
          href="/dashboard"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PenTool className="size-3.5" />
          <span>Nova Redação</span>
        </Link>

        <Link
          href="/historico"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            isActive('/historico') ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="size-3.5" />
          <span>Histórico</span>
        </Link>

        <Link
          href="/pagamento"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            isActive('/pagamento') ? 'bg-red-600 text-white' : 'bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white'
          }`}
        >
          <ShoppingCart className="size-3.5" />
          <span>Comprar Créditos</span>
        </Link>
      </div>

      {/* User Section & Logout */}
      <div className="flex items-center gap-3">
        {credits !== null && (
          <div
            title="Correções disponíveis"
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold"
          >
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{credits} {credits === 1 ? 'crédito' : 'créditos'}</span>
          </div>
        )}

        {displayName && (
          <span className="text-xs font-semibold text-slate-700 hidden md:inline-block max-w-[120px] truncate">
            {displayName}
          </span>
        )}

        <button
          type="button"
          onClick={handleDeleteAccount}
          title="Excluir Conta e Apagar Meus Dados (LGPD)"
          aria-label="Excluir Conta e Apagar Meus Dados (LGPD)"
          className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Apagar Dados (LGPD)</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          title="Sair da conta"
          aria-label="Sair da conta"
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </nav>
  )
}
