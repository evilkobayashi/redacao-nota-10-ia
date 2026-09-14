import { RedacaoForm } from "@/components/RedacaoForm"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Correção Implacável. Evolução Rápida.
        </h2>
        <p className="text-slate-600">
          Nossa IA foi treinada com os manuais oficiais dos corretores do INEP. 
          Descubra seus pontos fracos e alcance a nota 1000 no ENEM.
        </p>
      </div>

      <RedacaoForm />
    </div>
  )
}
