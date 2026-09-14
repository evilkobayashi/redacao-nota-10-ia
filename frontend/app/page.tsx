'use client'

import Link from 'next/link'
import { FileText, Sparkles, Target, BarChart3, ArrowRight, CheckCircle2, PenTool, BookOpen, TrendingUp, Zap, Shield, Award, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left">
        <span className="text-base font-semibold text-gray-900">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-red-100">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-950 text-xl tracking-tight">
              Redação <span className="text-red-600">Nota 10</span> <span className="text-amber-500">AÍ</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Entrar
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md shadow-red-600/20 transition-all">
                Criar Conta Grátis
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-red-500/10 blur-[140px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              Treinada nos Manuais Oficiais do INEP
            </div>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeIn}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.15] max-w-4xl mx-auto">
            Sua redação corrigida por{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-600">
              Inteligência Artificial
            </span>
            {' '}em segundos
          </motion.h1>

          <motion.p initial="hidden" animate="visible" custom={2} variants={fadeIn}
            className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Feedback detalhado nas 5 competências do ENEM, com nota individual, pontos fracos mapeados e sugestões de reescrita. Tudo em menos de 30 segundos.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="h-14 px-8 text-base rounded-full bg-gray-950 text-white hover:bg-gray-800 shadow-xl font-bold flex items-center gap-2 transition-all">
                Corrigir Minha Redação <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/login">
              <button className="h-14 px-8 text-base rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold transition-all">
                Já tenho conta
              </button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}
            className="flex items-center justify-center gap-5 text-xs text-gray-400 font-semibold pt-3">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3 correções grátis</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resultado em 30s</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nota por competência</span>
          </motion.div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight">Como funciona</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Um processo simples, rápido e brutalmente honesto.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Envie sua Redação', desc: 'Cole o texto ou envie uma foto do caderno. A IA aceita os dois formatos.', icon: <FileText className="w-6 h-6 text-red-600" /> },
              { step: '2', title: 'IA Analisa Tudo', desc: 'O Gemini 1.5 Pro processa sua redação usando a mesma matriz do INEP, nota a nota.', icon: <Sparkles className="w-6 h-6 text-amber-600" /> },
              { step: '3', title: 'Receba o Diagnóstico', desc: 'Nota individual em cada competência, erros destacados e sugestões de reescrita.', icon: <BarChart3 className="w-6 h-6 text-emerald-600" /> },
            ].map((s) => (
              <div key={s.step} className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-4 right-5 text-7xl font-black text-gray-100 pointer-events-none select-none">{s.step}</div>
                <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-6">{s.icon}</div>
                <h3 className="text-xl font-bold text-gray-950 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-950 tracking-tight">Correção de verdade</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Não é um corretor genérico. É uma IA treinada especificamente para o ENEM.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Target className="w-7 h-7" />, title: 'Nota nas 5 Competências', desc: 'Cada competência (C1 a C5) recebe uma nota individual de 0 a 200, com justificativa detalhada.', color: 'from-red-500 to-red-600' },
              { icon: <BookOpen className="w-7 h-7" />, title: 'Manual do INEP Embutido', desc: 'A IA foi calibrada com os documentos oficiais de correção do INEP, não com achismos.', color: 'from-amber-500 to-amber-600' },
              { icon: <PenTool className="w-7 h-7" />, title: 'Sugestões de Reescrita', desc: 'Cada trecho com problema recebe uma proposta de reescrita para você entender o erro.', color: 'from-indigo-500 to-indigo-600' },
              { icon: <TrendingUp className="w-7 h-7" />, title: 'Histórico de Evolução', desc: 'Acompanhe sua curva de notas ao longo do tempo e veja quais competências estão melhorando.', color: 'from-emerald-500 to-emerald-600' },
              { icon: <Zap className="w-7 h-7" />, title: 'Resultado em 30 Segundos', desc: 'Enquanto cursinho leva 7 dias para devolver, nós entregamos em menos de meio minuto.', color: 'from-purple-500 to-purple-600' },
              { icon: <Shield className="w-7 h-7" />, title: 'Privacidade Total', desc: 'Sua redação não é armazenada nem usada para treinar modelos. Texto processado e descartado.', color: 'from-slate-700 to-slate-800' },
            ].map((f, i) => (
              <div key={i} className="h-full p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${f.color} shadow-md`}>{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-950 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-amber-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Planos para cada nível de preparo</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Comece grátis com 3 correções. Evolua quando sentir que precisa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Básico */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Plano Estudante</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">R$ 15</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mb-8">3 correções grátis para testar</p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Até 20 correções por mês', 'Nota nas 5 competências (C1-C5)', 'Feedback detalhado com erros destacados', 'Sugestões de reescrita por trecho', 'Histórico das últimas 10 redações'].map(item => (
                  <li key={item} className="flex gap-3 text-gray-200 items-start text-sm">
                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full h-14 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-lg shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all">
                Assinar Estudante
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col relative">
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full">Mais Popular</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Plano Vestibulanda</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">R$ 30</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mb-8">Para quem quer a nota 1000 de verdade</p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Tudo do Plano Estudante', 'Correções ilimitadas', 'Comparação com redações nota 1000', 'Plano de estudos personalizado pela IA', 'Gráficos de evolução por competência', 'Modo simulado (timer de 5h30)', 'Suporte prioritário'].map(item => (
                  <li key={item} className="flex gap-3 text-gray-200 items-start text-sm">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-lg shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all">
                Assinar Vestibulanda
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-gray-950 text-center mb-12">Perguntas Frequentes</h2>
          <FAQItem q="A correção é realmente confiável?" a="Sim. A IA usa como base os manuais oficiais de correção do INEP e a matriz de referência das 5 competências. A nota gerada tem margem de erro comparável a de corretores humanos treinados." />
          <FAQItem q="Posso enviar foto da redação escrita à mão?" a="Sim. O sistema aceita texto digitado ou imagem fotografada do caderno. A IA usa visão computacional para extrair o texto antes de corrigir." />
          <FAQItem q="Minha redação fica armazenada?" a="Não. O texto é processado em memória e descartado após a geração do relatório. Nenhum dado é usado para treinamento de modelos." />
          <FAQItem q="Funciona para outros vestibulares além do ENEM?" a="Atualmente o foco é exclusivamente no ENEM, que representa a maior demanda. Outros vestibulares podem ser adicionados no futuro." />
          <FAQItem q="Posso cancelar a assinatura a qualquer momento?" a="Sim, sem multa e sem burocracia. Basta ir nas configurações da sua conta." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center text-white">
              <PenTool className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-gray-950 text-lg tracking-tight">Redação <span className="text-red-600">Nota 10</span> <span className="text-amber-500">AÍ</span></span>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} AÍ Tecnologia e Educação Ltda. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
