"use client"

import { useState } from "react"
import { Loader2, PenTool, AlertCircle, BookOpen, ArrowRight, BookMarked, GraduationCap, Image as ImageIcon, Download, FileWarning } from "lucide-react"

const BANCAS_DISPONIVEIS = [
  { id: "ENEM", label: "ENEM (Exame Nacional do Ensino Médio)" },
  { id: "VUNESP", label: "VUNESP (Vestibulares e Concursos SP)" },
  { id: "FCC", label: "FCC (Fundação Carlos Chagas)" },
  { id: "CESPE", label: "CESPE / CEBRASPE" },
  { id: "FGV", label: "FGV (Fundação Getulio Vargas)" }
]

export function RedacaoForm() {
  const [banca, setBanca] = useState("ENEM")
  const [tema, setTema] = useState("")
  const [texto, setTexto] = useState("")
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      // Pega apenas a string base64 sem o cabeçalho data:image/jpeg;base64,
      const base64String = (event.target?.result as string).split(',')[1]
      setImageBase64(base64String)
      setTexto("") // Limpa o texto se o usuário subir imagem
    }
    reader.readAsDataURL(file)
  }

  const handleSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tema) {
      setErro("O tema da redação é obrigatório.")
      return
    }
    if (!texto && !imageBase64) {
      setErro("Forneça o texto da redação ou a foto do caderno.")
      return
    }

    setIsLoading(true)
    setErro(null)
    setResultado(null)

    try {
      const payload: any = { tema, banca }
      if (texto) payload.texto = texto
      if (imageBase64) payload.image_base64 = imageBase64

      const res = await fetch("https://redacao-nota-10-backend-production.up.railway.app/api/redacao/avaliar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error("Falha ao avaliar redação")
      }

      const data = await res.json()
      setResultado(data)
    } catch (err: any) {
      setErro("Falha ao se conectar com a API de correção. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resultado) return
    setIsDownloading(true)
    try {
      const res = await fetch("https://redacao-nota-10-backend-production.up.railway.app/api/redacao/exportar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultado)
      })
      if (!res.ok) throw new Error("Erro ao gerar PDF")
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Boletim_Redacao_${banca}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert("Erro ao baixar o PDF.")
    } finally {
      setIsDownloading(false)
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
            <p className="text-sm text-slate-500">Selecione a banca e envie seu texto (digitado ou foto).</p>
          </div>
        </div>

        <form onSubmit={handleSubmeter} className="space-y-5">
          {erro && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {erro}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Banca Avaliadora
            </label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={banca}
              onChange={(e) => setBanca(e.target.value)}
              disabled={isLoading}
            >
              {BANCAS_DISPONIVEIS.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

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
            <label className="text-sm font-semibold text-slate-700">Modo de Envio: Texto ou Foto</label>
            
            {!imageBase64 ? (
              <textarea 
                className="w-full h-56 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
                placeholder="Escreva sua redação aqui OU envie uma foto da folha pautada logo abaixo..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div className="w-full h-56 p-3 border border-indigo-200 bg-indigo-50 rounded-lg flex flex-col items-center justify-center text-indigo-700 text-sm">
                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                <span className="font-bold">Imagem Carregada com Sucesso</span>
                <span className="opacity-70 mt-1">{imageName}</span>
                <button 
                  type="button" 
                  onClick={() => { setImageBase64(null); setImageName(null) }}
                  className="mt-4 text-xs font-bold underline hover:text-indigo-900"
                >
                  Remover imagem e digitar texto
                </button>
              </div>
            )}

            {!texto && !imageBase64 && (
              <div className="mt-2">
                <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                    <ImageIcon className="w-5 h-5" />
                    Tirar Foto da Redação Manuscrita (OCR)
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            )}

            {texto && !imageBase64 && (
              <div className="text-right text-xs text-slate-400 font-medium">
                {texto.trim().split(/\s+/).filter(w => w.length > 0).length} palavras
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || (!texto && !imageBase64)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {imageBase64 ? 'Extraindo OCR e Analisando...' : `Analisando Padrão ${banca}...`}</>
            ) : (
              <>Solicitar Correção Nota Máxima <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>

      {/* Coluna Direita: Feedback da Correção */}
      <div className="space-y-6">
        {resultado ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Nota Final */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center mb-6 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 ${resultado.is_plagio ? 'bg-red-600' : 'bg-blue-600'}`} />
              
              <div className="absolute top-4 right-4">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  title="Baixar Relatório em PDF"
                >
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                </button>
              </div>

              <h3 className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-sm">Nota Final ({banca})</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-6xl font-black ${resultado.is_plagio ? 'text-red-600' : 'text-blue-700'}`}>
                  {resultado.nota_total}
                </span>
                <span className="text-xl font-medium text-slate-400">/ {resultado.nota_maxima_possivel}</span>
              </div>
              <p className="text-sm text-slate-600 mt-3">{resultado.comentario_geral}</p>
            </div>

            {/* Plágio Alert */}
            {resultado.is_plagio && (
              <div className="bg-red-50 border border-red-200 p-5 rounded-xl flex gap-3 items-start animate-pulse">
                <FileWarning className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800">Alerta de Plágio Detectado!</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Encontramos partes idênticas deste texto na internet. Essa prática configura plágio e zera a nota automaticamente.
                  </p>
                  {resultado.fonte_plagio && (
                    <a href={resultado.fonte_plagio} target="_blank" rel="noreferrer" className="text-xs text-red-900 font-bold underline mt-2 block">
                      Ver possível fonte original &rarr;
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Texto OCR */}
            {resultado.texto_extraido_ocr && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Texto extraído da sua imagem (OCR)</span>
                <p className="text-sm text-slate-600 italic leading-relaxed bg-white p-3 rounded border border-slate-100">
                  &quot;{resultado.texto_extraido_ocr}&quot;
                </p>
              </div>
            )}

            {/* Critérios */}
            <div className="space-y-4">
              {resultado.criterios.map((crit: any, idx: number) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-800">
                      {crit.nome_criterio}
                    </h4>
                    <span className={`font-black bg-slate-50 px-3 py-1 rounded-full text-sm whitespace-nowrap ${resultado.is_plagio ? 'text-red-600' : 'text-blue-700'}`}>
                      {crit.nota_obtida} / {crit.nota_maxima}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{crit.comentarios}</p>
                  
                  {crit.pontos_melhoria?.length > 0 && (
                    <div className="mt-2">
                      <strong className="text-xs text-rose-600 uppercase tracking-wide">Atenção:</strong>
                      <ul className="list-disc list-inside text-sm text-slate-600 mt-1">
                        {crit.pontos_melhoria.map((p: string, i: number) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Referências de Leitura */}
            {resultado.referencias_leitura && resultado.referencias_leitura.length > 0 && !resultado.is_plagio && (
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl mt-6">
                <div className="flex items-center gap-2 text-indigo-800 font-bold mb-3">
                  <BookMarked className="w-5 h-5" /> Repertório Sociocultural Recomendado
                </div>
                <ul className="space-y-3">
                  {resultado.referencias_leitura.map((ref: string, i: number) => (
                    <li key={i} className="text-sm text-indigo-900 leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 font-bold mt-0.5">•</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reescrita */}
            {!resultado.is_plagio && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl mt-6">
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                  <BookOpen className="w-5 h-5" /> Sugestão Prática de Reescrita
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed italic">
                  &quot;{resultado.sugestao_reescrita}&quot;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-100 rounded-xl border border-slate-200 border-dashed opacity-70">
            <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="font-bold text-slate-700 text-lg">Aguardando Redação</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Selecione a banca no formulário e envie seu texto (digitado ou foto) para receber a correção cirúrgica.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
