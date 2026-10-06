'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { Camera, Check, PenTool, ScanText, Sparkles } from 'lucide-react'

const btn3d =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition-all active:translate-y-1 active:border-b-0 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-red-300'
const btnPrimary = `${btn3d} bg-red-600 text-white border-b-4 border-red-800 hover:bg-red-500`
const btnGhost = `${btn3d} bg-white text-red-600 border-2 border-b-4 border-slate-200 hover:bg-slate-50`

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

const bancas = ['ENEM', 'VUNESP', 'FCC', 'CESPE/CEBRASPE', 'FGV', 'Vestibulares', 'Concursos', 'Ensino Médio', 'Cursinhos']

const competencias = [
  { c: 'C1', t: 'Norma culta', n: 160 },
  { c: 'C2', t: 'Tema e repertório', n: 200 },
  { c: 'C3', t: 'Argumentação', n: 160 },
  { c: 'C4', t: 'Coesão', n: 200 },
  { c: 'C5', t: 'Proposta de intervenção', n: 200 },
]

const linhas = {
  backgroundImage: 'repeating-linear-gradient(transparent 0 27px, #fecaca 27px 28px)',
  lineHeight: '28px',
}

function Logo({ small }: { small?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`grid place-items-center rounded-xl border-b-4 border-red-800 bg-red-600 text-white ${small ? 'size-8' : 'size-9'}`}>
        <PenTool className="size-4" aria-hidden />
      </span>
      <span className={`font-extrabold tracking-tight text-slate-800 ${small ? 'text-lg' : 'text-xl'}`}>
        redação <span className="text-red-600">nota 10</span> <span className="text-amber-500">aí</span>
      </span>
    </span>
  )
}

function Bolha({ emoji, className, delay }: { emoji: string; className: string; delay: number }) {
  return (
    <motion.span
      aria-hidden
      className={`absolute z-10 grid size-14 place-items-center rounded-2xl border-2 border-b-4 border-slate-200 bg-white text-2xl shadow-sm md:size-16 ${className}`}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {emoji}
    </motion.span>
  )
}

function Secao({ titulo, texto, cor, invertido, children }: { titulo: string; texto: ReactNode; cor: string; invertido?: boolean; children: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
      <motion.div {...reveal} className={invertido ? 'md:order-2' : ''}>{children}</motion.div>
      <motion.div {...reveal}>
        <h2 className={`text-3xl font-extrabold leading-tight md:text-4xl ${cor}`}>{titulo}</h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-500">{texto}</p>
      </motion.div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-white text-slate-700 selection:bg-red-100">
        {/* Nav */}
        <nav className="sticky top-0 z-20 border-b-2 border-slate-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <Link href="/" aria-label="Redação Nota 10 AÍ - início"><Logo /></Link>
            <Link href="/login" className={`${btnGhost} px-4 py-2.5 text-xs`}>Entrar</Link>
          </div>
        </nav>

        {/* Hero */}
        <header className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-12 pt-10 md:grid-cols-2 md:pb-20 md:pt-16">
          <div className="relative mx-auto w-full max-w-sm py-8">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="rounded-3xl border-2 border-b-4 border-slate-200 bg-[#FFFDF7] p-6"
            >
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">Tema: Desafios da educação digital no Brasil</p>
              <p className="font-serif text-[15px] text-slate-700" style={linhas}>
                A tecnologia transformou a forma de aprender. No entanto, muitos estudantes{' '}
                <span className="underline decoration-red-500 decoration-wavy decoration-2 underline-offset-4">não possui</span>{' '}
                acesso à internet de qualidade, o que{' '}
                <span className="rounded bg-amber-100 px-1">aprofunda as desigualdades</span>{' '}
                já existentes no país.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full border-2 border-red-200 bg-red-50 px-3 py-1 text-red-600">C1 · concordância verbal</span>
                <span className="rounded-full border-2 border-amber-200 bg-amber-50 px-3 py-1 text-amber-600">C3 · bom argumento!</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 }}
              className="absolute -right-3 top-0 z-20 grid size-24 place-items-center rounded-full border-b-[6px] border-emerald-700 bg-emerald-500 text-center text-white shadow-lg"
              aria-label="Nota 920"
            >
              <span>
                <span className="block text-3xl font-extrabold leading-none">920</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">nota</span>
              </span>
            </motion.div>
            <Bolha emoji="✍️" className="-left-6 top-2" delay={0} />
            <Bolha emoji="📚" className="-bottom-2 -left-4" delay={1.2} />
            <Bolha emoji="🎯" className="-bottom-6 right-6" delay={1.8} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-red-100 bg-red-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-red-600">
              <Sparkles className="size-4" aria-hidden /> Baseada nos critérios do INEP
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-800 md:text-5xl">
              Sua redação rumo à <span className="text-red-600">nota 1000</span>, corrigida pela{' '}
              <span className="text-amber-500">IA</span> em segundos.
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Envie o texto ou uma <strong className="text-slate-700">foto do caderno</strong> e receba a nota nas 5 competências do ENEM,
              com cada erro explicado e sugestões de reescrita.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mx-auto sm:max-w-xs md:mx-0">
              <Link href="/signup" className={btnPrimary}>Corrigir grátis</Link>
              <Link href="/login" className={btnGhost}>Já tenho uma conta</Link>
            </div>
          </motion.div>
        </header>

        {/* Faixa de bancas */}
        <div className="overflow-hidden border-y-2 border-slate-100 bg-slate-50 py-4" aria-label="Bancas e públicos atendidos">
          <motion.ul className="flex w-max gap-3" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
            {[...bancas, ...bancas].map((b, i) => (
              <li
                key={i}
                aria-hidden={i >= bancas.length}
                className="whitespace-nowrap rounded-full border-2 border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-slate-500"
              >
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Competências */}
        <Secao
          cor="text-red-600"
          titulo="Nota em cada uma das 5 competências"
          texto={<>Nada de nota “no chute”. A IA avalia sua redação com a mesma matriz usada na correção oficial e mostra <strong>quanto você tirou em cada competência</strong> — e por quê.</>}
        >
          <div className="rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-extrabold text-slate-800">Sua correção</span>
              <span className="text-2xl font-extrabold text-emerald-500">920</span>
            </div>
            <ul className="space-y-3">
              {competencias.map((c, i) => (
                <li key={c.c}>
                  <div className="mb-1 flex justify-between text-sm font-bold">
                    <span className="text-slate-600"><span className="text-red-600">{c.c}</span> · {c.t}</span>
                    <span className="text-slate-800">{c.n}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={`h-full rounded-full ${c.n === 200 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.n / 2}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.12 * i }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Secao>

        {/* Reescrita */}
        <Secao
          invertido
          cor="text-amber-500"
          titulo="Errou? A IA mostra como reescrever."
          texto={<>Cada trecho com problema vem marcado, com a <strong>explicação do erro</strong> e uma <strong>sugestão de reescrita</strong>. Você entende o que mudar e aprende pra próxima.</>}
        >
          <div className="space-y-3 rounded-3xl border-2 border-b-4 border-slate-200 bg-slate-50 p-5">
            <div className="rounded-2xl border-2 border-red-200 bg-white px-4 py-3 text-sm">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-500">Trecho original</span>
              <p className="mt-1 font-serif text-slate-600">“muitos estudantes <span className="text-red-500 line-through">não possui</span> acesso”</p>
            </div>
            <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm border-2 border-slate-200 bg-white px-4 py-2.5 text-sm">
              O sujeito “muitos estudantes” está no plural, então o verbo também precisa ir pro plural. 😉
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
            >
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="font-serif">“muitos estudantes <strong>não possuem</strong> acesso”</span>
            </motion.div>
          </div>
        </Secao>

        {/* Foto do caderno */}
        <Secao
          cor="text-emerald-500"
          titulo="Escreveu à mão? Manda a foto."
          texto={<>Treine como no dia da prova: escreva no papel, fotografe e pronto. A IA <strong>lê sua letra</strong>, transcreve o texto e corrige. Todas as correções ficam no seu <strong>histórico</strong> pra você acompanhar a evolução.</>}
        >
          <div className="flex items-center justify-center gap-3 py-4" aria-hidden>
            {[
              { i: <Camera className="size-7" />, t: 'Foto', c: 'bg-slate-700 border-slate-900' },
              { i: <ScanText className="size-7" />, t: 'Leitura', c: 'bg-amber-500 border-amber-700' },
              { i: <Check className="size-7" />, t: 'Nota', c: 'bg-emerald-500 border-emerald-700 ring-8 ring-emerald-100' },
            ].map((s, k) => (
              <div key={s.t} className="flex items-center gap-3">
                {k > 0 && <span className="h-1 w-6 rounded-full bg-slate-200 md:w-10" />}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.15 * k }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className={`grid size-16 place-items-center rounded-full border-b-[6px] text-white ${s.c}`}>{s.i}</span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{s.t}</span>
                </motion.span>
              </div>
            ))}
          </div>
        </Secao>

        {/* Planos */}
        <section className="bg-slate-50 px-6 py-16 md:py-24">
          <motion.h2 {...reveal} className="text-center text-3xl font-extrabold text-slate-800 md:text-4xl">
            Comece grátis. Treine mais com <span className="text-red-600">créditos</span>.
          </motion.h2>
          <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
            {[
              { t: 'Grátis', p: 'R$ 0', f: ['3 correções para começar', 'Nota nas 5 competências', 'Sugestões de reescrita', 'Correção por foto do caderno'], destaque: false },
              { t: 'Pacote 10', p: 'R$ 29,90', f: ['+10 correções completas', 'Pagamento único via PIX', 'Histórico de redações', 'Tudo do plano grátis'], destaque: true },
            ].map(pl => (
              <motion.div
                key={pl.t}
                {...reveal}
                className={`rounded-3xl border-2 border-b-4 bg-white p-6 ${pl.destaque ? 'border-red-300' : 'border-slate-200'}`}
              >
                <h3 className={`text-xl font-extrabold ${pl.destaque ? 'text-red-600' : 'text-slate-800'}`}>{pl.t}</h3>
                <p className="mt-1 text-2xl font-extrabold text-slate-800">{pl.p}</p>
                <ul className="mt-4 space-y-2">
                  {pl.f.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <Check className="size-4 shrink-0 text-emerald-500" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-red-600 px-6 py-16 text-center md:py-24">
          <motion.div {...reveal} className="mx-auto max-w-xl">
            <span className="mx-auto mb-6 grid size-20 place-items-center rounded-3xl border-b-[6px] border-amber-600 bg-amber-400 text-4xl" aria-hidden>✍️</span>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Bora escrever a próxima nota 1000?</h2>
            <p className="mt-3 text-lg text-red-100">Crie sua conta em menos de 1 minuto e corrija sua primeira redação.</p>
            <Link href="/signup" className={`${btn3d} mt-8 w-full max-w-xs border-b-4 border-amber-600 bg-amber-400 text-slate-900 hover:bg-amber-300`}>
              Corrigir grátis
            </Link>
          </motion.div>
        </section>

        <footer className="bg-red-700 px-6 py-8 text-center text-sm text-red-200">
          <p>© {new Date().getFullYear()} <strong className="text-white">AÍ Tecnologia e Educação Ltda.</strong> — Todos os direitos reservados.</p>
        </footer>

{/* Disclaimer CDC */}
<div className="w-full bg-gray-900 text-gray-400 py-6 text-center text-xs px-4">
  <p className="max-w-4xl mx-auto">
    Aviso Legal: Esta plataforma é uma ferramenta de <strong>assistência pedagógica baseada em Inteligência Artificial</strong>. 
    Não garantimos resultados acadêmicos absolutos, notas ou aprovação automática. O uso das ferramentas requer supervisão 
    do educador ou responsável legal.
  </p>
</div>

      </div>
    </MotionConfig>
  )
}
