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

PROMPT_SISTEMA_ENEM = """
Você é o mais rigoroso e didático avaliador oficial de redação do ENEM do Brasil.
Sua missão é corrigir o texto fornecido pelo usuário com base nas 5 competências do ENEM.
Você deve ser criterioso, mas o feedback deve ser altamente pedagógico.

AS 5 COMPETÊNCIAS DO ENEM (Notas de 0 a 200, pulando de 40 em 40):
C1: Domínio da norma culta da língua escrita.
C2: Compreender o tema e aplicar conceitos das várias áreas de conhecimento.
C3: Selecionar, relacionar, organizar e interpretar informações em defesa de um ponto de vista.
C4: Demonstrar conhecimento dos mecanismos linguísticos (coesão).
C5: Elaborar proposta de intervenção respeitando os direitos humanos.
"""

async def avaliar_redacao_gemini(tema: str, texto: str) -> AvaliacaoRedacao:
    """
    Chama a API do Google Gemini 1.5 Pro utilizando o Structured Outputs 
    para garantir que a IA devolva exatamente o Pydantic format `AvaliacaoRedacao`.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Se a chave não existir (ambiente de desenvolvimento local), retornamos um Mock imediato.
    # Se a chave existir, usamos a API real.
    if not api_key or api_key.startswith("mock-"):
        logger.info("Chave GEMINI_API_KEY não configurada. Usando mock.")
        return _gerar_mock_avaliacao()
        
    client = genai.Client(api_key=api_key)
    
    prompt_usuario = f"TEMA DA REDAÇÃO:\n{tema}\n\nTEXTO DO ALUNO:\n{texto}"
    
    try:
        # A SDK `google-genai` permite passar o schema Pydantic diretamente, 
        # o que elimina o risco do LLM errar o formato do JSON.
        response = client.models.generate_content(
            model='gemini-1.5-pro',
            contents=prompt_usuario,
            config=types.GenerateContentConfig(
                system_instruction=PROMPT_SISTEMA_ENEM,
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


def _gerar_mock_avaliacao() -> AvaliacaoRedacao:
    """Retorna um objeto Pydantic fake para testes sem custo de API."""
    mock_response = {
        "nota_total": 880,
        "competencias": [
            {
                "competencia": 1,
                "nota": 160,
                "titulo": "Domínio da Norma Culta",
                "comentarios": "Apresenta alguns desvios gramaticais de vírgula e crase.",
                "pontos_fortes": ["Bom vocabulário", "Ortografia geralmente correta"],
                "pontos_melhoria": ["Uso da crase", "Pontuação antes de conjunções conclusivas"]
            },
            {
                "competencia": 2,
                "nota": 200,
                "titulo": "Compreensão e Repertório",
                "comentarios": "Abordou bem o tema e trouxe referências sociológicas.",
                "pontos_fortes": ["Citação de Zygmunt Bauman encaixada com sentido"],
                "pontos_melhoria": []
            },
            {
                "competencia": 3,
                "nota": 160,
                "titulo": "Projeto de Texto e Argumentação",
                "comentarios": "Argumentação consistente, mas o D2 poderia ser mais explorado.",
                "pontos_fortes": ["Tese clara na introdução"],
                "pontos_melhoria": ["Aprofundar a justificativa no segundo desenvolvimento"]
            },
            {
                "competencia": 4,
                "nota": 200,
                "titulo": "Coesão e Conectivos",
                "comentarios": "Uso excelente de conectivos intra e interparágrafos.",
                "pontos_fortes": ["Operadores argumentativos diversificados (Por conseguinte, Ademais)"],
                "pontos_melhoria": []
            },
            {
                "competencia": 5,
                "nota": 160,
                "titulo": "Proposta de Intervenção",
                "comentarios": "Faltou detalhamento do modo/meio de ação.",
                "pontos_fortes": ["Agente, ação, efeito presentes e claros"],
                "pontos_melhoria": ["Adicionar 'Como isso será feito de forma prática?'"]
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
        "sugestao_reescrita": "Portanto, cabe ao Estado, por meio do Ministério da Educação, criar campanhas educacionais nas escolas (modo/meio), a fim de mitigar a problemática.",
        "comentario_geral": "Texto muito bem estruturado! Foque apenas em revisar as regras de vírgula e garantir que a proposta final tenha os 5 elementos necessários."
    }
    return AvaliacaoRedacao(**mock_response)
