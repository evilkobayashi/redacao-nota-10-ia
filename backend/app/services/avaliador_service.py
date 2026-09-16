"""
Serviço principal de avaliação usando Google Gemini 1.5 Pro.
Recebe o texto bruto e retorna a avaliação estruturada forçando a saída em JSON nativo.
"""
import os
import json
import logging
from google import genai
from google.genai import types
from app.models.avaliacao import AvaliacaoRedacao

logger = logging.getLogger(__name__)

PROMPT_BASE = """
Você é o mais rigoroso e didático avaliador oficial de redação de concursos e vestibulares do Brasil.
Sua missão é corrigir o texto fornecido pelo usuário com base nos critérios específicos da banca: {banca}.
Você deve ser criterioso, mas o feedback deve ser altamente pedagógico.

CRITÉRIOS GERAIS DA BANCA {banca}:
- Se a banca for ENEM: 5 competências (200 pontos cada, total 1000).
- Se a banca for VUNESP: Tema (3), Estrutura/Gênero (4), Expressão/Gramática (3). Total 10 ou 100 dependendo da prova (adote escala de 0 a 100 para facilitar).
- Se a banca for FCC: Conteúdo, Estrutura, Expressão. (Escala 0 a 100).
- Se a banca for CESPE/CEBRASPE: Apresentação/Estrutura e Desenvolvimento do Tema (Escala de 0 a 100).
- Se for outra banca, adapte os critérios ao padrão conhecido dessa banca (escala de 0 a 100).

Obrigatório: Forneça referências de leitura (livros, artigos, filósofos, citações, notícias) que o candidato poderia ter usado para enriquecer o repertório sociocultural deste exato tema.
"""

async def avaliar_redacao_gemini(tema: str, texto: str, banca: str = "ENEM") -> AvaliacaoRedacao:
    """
    Chama a API do Google Gemini 1.5 Pro utilizando o Structured Outputs 
    para garantir que a IA devolva exatamente o Pydantic format `AvaliacaoRedacao`.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Se a chave não existir (ambiente de desenvolvimento local), retornamos um Mock imediato.
    # Se a chave existir, usamos a API real.
    if not api_key or api_key.startswith("mock-"):
        logger.info("Chave GEMINI_API_KEY não configurada. Usando mock.")
        return _gerar_mock_avaliacao(banca)
        
    client = genai.Client(api_key=api_key)
    
    prompt_usuario = f"TEMA DA REDAÇÃO:\n{tema}\n\nBANCA ALVO:\n{banca}\n\nTEXTO DO ALUNO:\n{texto}"
    prompt_sistema = PROMPT_BASE.format(banca=banca)
    
    try:
        # A SDK `google-genai` permite passar o schema Pydantic diretamente, 
        # o que elimina o risco do LLM errar o formato do JSON.
        response = client.models.generate_content(
            model='gemini-1.5-pro',
            contents=prompt_usuario,
            config=types.GenerateContentConfig(
                system_instruction=prompt_sistema,
                response_mime_type="application/json",
                response_schema=AvaliacaoRedacao,
                temperature=0.2, # Baixa temperatura pois queremos rigor técnico, não criatividade poética na nota
            ),
        )
        
        # O Gemini já nos devolve a string JSON perfeita. Basta parsear.
        dados_json = json.loads(response.text)
        return AvaliacaoRedacao(**dados_json)
        
    except Exception as e:
        logger.error(f"Erro na avaliação via Gemini: {e}")
        raise ValueError("Falha ao se comunicar com a inteligência artificial do Google.")


def _gerar_mock_avaliacao(banca: str) -> AvaliacaoRedacao:
    """Retorna um objeto Pydantic fake para testes sem custo de API."""
    mock_response = {
        "nota_total": 880 if banca == "ENEM" else 85,
        "nota_maxima_possivel": 1000 if banca == "ENEM" else 100,
        "criterios": [
            {
                "nome_criterio": "Domínio da Norma Culta" if banca == "ENEM" else "Expressão e Gramática",
                "nota_obtida": 160 if banca == "ENEM" else 25,
                "nota_maxima": 200 if banca == "ENEM" else 30,
                "comentarios": "Apresenta alguns desvios gramaticais de vírgula e crase.",
                "pontos_fortes": ["Bom vocabulário", "Ortografia geralmente correta"],
                "pontos_melhoria": ["Uso da crase", "Pontuação antes de conjunções conclusivas"]
            },
            {
                "nome_criterio": "Compreensão e Repertório" if banca == "ENEM" else "Estrutura e Conteúdo",
                "nota_obtida": 200 if banca == "ENEM" else 60,
                "nota_maxima": 200 if banca == "ENEM" else 70,
                "comentarios": "Abordou bem o tema e trouxe referências sociológicas.",
                "pontos_fortes": ["Citação encaixada com sentido", "Boa progressão textual"],
                "pontos_melhoria": ["Poderia aprofundar mais a tese"]
            }
        ],
        "marcacoes": [
            {
                "trecho_original": "as pessoas costuma pensar",
                "trecho_corrigido": "as pessoas costumam pensar",
                "tipo_erro": "gramatica",
                "explicacao": "Erro de concordância verbal. 'As pessoas' (plural) exige o verbo no plural 'costumam'."
            }
        ],
        "sugestao_reescrita": "Portanto, cabe ao Estado, por meio do Ministério da Educação, criar campanhas educacionais nas escolas, a fim de mitigar a problemática.",
        "comentario_geral": f"Texto muito bem estruturado para o padrão {banca}! Foque em revisar as regras de vírgula.",
        "referencias_leitura": [
            "Livro: 'Modernidade Líquida' - Zygmunt Bauman (para embasar as relações superficiais)",
            "Artigo: Constituição Federal de 1988, Artigo 5º (para usar como argumento de autoridade em direitos básicos)"
        ]
    }
    return AvaliacaoRedacao(**mock_response)
