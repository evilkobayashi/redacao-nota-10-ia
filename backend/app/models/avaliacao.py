from pydantic import BaseModel
from typing import Optional, List

class RedacaoSubmit(BaseModel):
    tema: str
    banca: str = "ENEM"  # Ex: ENEM, VUNESP, CESPE, FCC, FGV
    texto: Optional[str] = None
    image_url: Optional[str] = None
    aluno_nome: Optional[str] = None
    ano_escolar: Optional[str] = None

class FeedbackCriterio(BaseModel):
    nome_criterio: str
    nota_obtida: float
    nota_maxima: float
    comentarios: str
    pontos_fortes: List[str]
    pontos_melhoria: List[str]

class MarcacaoTexto(BaseModel):
    trecho_original: str
    trecho_corrigido: str
    tipo_erro: str  # gramatica, coesao, coerencia, tema, estrutura
    explicacao: str

class AvaliacaoRedacao(BaseModel):
    nota_total: float
    nota_maxima_possivel: float
    criterios: List[FeedbackCriterio]
    marcacoes: List[MarcacaoTexto]
    sugestao_reescrita: str  # Parágrafo sugerido reescrito (geralmente conclusão ou introdução)
    comentario_geral: str
    referencias_leitura: List[str]  # Recomendações de livros, artigos ou filósofos para enriquecer o repertório
