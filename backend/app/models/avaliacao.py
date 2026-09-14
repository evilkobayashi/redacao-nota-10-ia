from pydantic import BaseModel
from typing import Optional, List

class RedacaoSubmit(BaseModel):
    tema: str
    texto: Optional[str] = None
    image_url: Optional[str] = None  # Se enviou foto do manuscrito
    aluno_nome: Optional[str] = None
    ano_escolar: Optional[str] = None

class FeedbackCompetencia(BaseModel):
    competencia: int  # 1 a 5
    nota: int  # 0, 40, 80, 120, 160, 200
    titulo: str
    comentarios: str
    pontos_fortes: List[str]
    pontos_melhoria: List[str]

class MarcacaoTexto(BaseModel):
    trecho_original: str
    trecho_corrigido: str
    tipo_erro: str  # gramatica, coesao, coerencia, tema
    explicacao: str

class AvaliacaoRedacao(BaseModel):
    nota_total: int
    competencias: List[FeedbackCompetencia]
    marcacoes: List[MarcacaoTexto]
    sugestao_reescrita: str  # Parágrafo sugerido reescrito
    comentario_geral: str
