"use client"

import { useState } from "react"
import { Loader2, PenTool, AlertCircle, BookOpen, ArrowRight } from "lucide-react"

export function RedacaoForm() {
  const [tema, setTema] = useState("")
  const [texto, setTexto] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tema || !texto) {
      setErro("Preencha o tema e o texto da redação.")
      return
    }

    setIsLoading(true)
    setErro(null)

    try {
      // Mock request (conectaremos à API FastAPI em seguida)
      // const res = await fetch("http://localhost:8000/api/redacao/avaliar", { ... })
      
      // Simula delay de rede e correção detalhada pelo LLM
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      const mockResult = {
        nota_total: 880,
        competencias: [
          { competencia: 1, nota: 160, titulo: "Domínio da Norma Culta", comentarios: "Bons desvios, poucas crases." },
          { competencia: 2, nota: 200, titulo: "Compreensão e Repertório", comentarios: "Abordou bem o tema." },
          { competencia: 3, nota: 160, titulo: "Projeto de Texto", comentarios: "Argumentação consistente." },
          { competencia: 4, nota: 200, titulo: "Coesão", comentarios: "Ótimo uso de conectivos." },
          { competencia: 5, nota: 160, titulo: "Proposta de Intervenção", comentarios: "Faltou detalhamento." },
        ],
        sugestao_reescrita: "Cabe ao Estado agir de forma X, por meio de Y, para mitigar Z.",
        comentario_geral: "Ótima estrutura! Fique de olho na competência 5."
      }
      
      setResultado(mockResult)
    } catch (err: any) {
      setErro("Falha ao se conectar com a API de correção.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Coluna Esquerda: Formulário de Submissão */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Enviar Redação</h2>
            <p className="text-sm text-slate-500">Digite ou cole seu texto do modelo ENEM.</p>
          </div>
        </div>

        <form onSubmit={handleSubmeter} className="space-y-5">
          {erro && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {erro}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Qual é o tema da redação?</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: Os desafios da inteligência artificial na educação..."
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Texto da Redação</label>
            <textarea 
              className="w-full h-80 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Escreva sua redação aqui..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              disabled={isLoading}
            />
            <div className="text-right text-xs text-slate-400 font-medium">
              {texto.trim().split(/\s+/).filter(w => w.length > 0).length} palavras
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || texto.length < 50}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Avaliando com IA...</>
            ) : (
              <>Solicitar Correção Nota 1000 <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>

      {/* Coluna Direita: Feedback da Correção */}
      <div className="space-y-6">
        {resultado ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center mb-6">
              <h3 className="text-slate-500 font-semibold mb-1">Nota Final</h3>
              <div className="text-6xl font-black text-blue-700">{resultado.nota_total}</div>
            </div>

            <div className="space-y-4">
              {resultado.competencias.map((comp: any) => (
                <div key={comp.competencia} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-slate-800">
                      C{comp.competencia} - {comp.titulo}
                    </h4>
                    <span className="font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm">
                      {comp.nota} pts
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{comp.comentarios}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl mt-6">
              <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                <BookOpen className="w-5 h-5" /> Sugestão de Reescrita
              </div>
              <p className="text-sm text-emerald-900 leading-relaxed italic">
                "{resultado.sugestao_reescrita}"
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-100 rounded-xl border border-slate-200 border-dashed opacity-70">
            <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="font-bold text-slate-700 text-lg">Aguardando Redação</h3>
            <p className="text-sm text-slate-500 mt-2">
              Envie sua redação no formulário ao lado para receber um diagnóstico completo baseado nas 5 competências do ENEM.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
