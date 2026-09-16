import logging
from fastapi import APIRouter, HTTPException
from app.models.avaliacao import RedacaoSubmit, AvaliacaoRedacao
from app.services.avaliador_service import avaliar_redacao_gemini
from app.database import get_supabase_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/redacao", tags=["Redação"])

@router.post("/avaliar", response_model=AvaliacaoRedacao)
async def avaliar_endpoint(payload: RedacaoSubmit):
    """
    Recebe o tema e o texto da redação, avalia via Gemini e salva no Supabase.
    """
    if not payload.texto and not payload.image_url:
        raise HTTPException(status_code=400, detail="Obrigatório enviar o texto ou a imagem.")
        
    texto_para_avaliar = payload.texto
    
    # Fase 2: OCR da Imagem (Placeholder para Gemini Flash Vision)
    if payload.image_url and not payload.texto:
        texto_para_avaliar = "Texto extraído fictício de OCR da imagem."

    try:
        # 1. Processa Inteligência Artificial (Gemini 1.5 Pro)
        resultado = await avaliar_redacao_gemini(
            tema=payload.tema, 
            texto=texto_para_avaliar,
            banca=payload.banca
        )
        
        # 2. Persiste os dados no Banco de Dados (Supabase)
        try:
            db = get_supabase_client()
            
            insercao = {
                "tema": payload.tema,
                "banca": payload.banca,
                "raw_text": texto_para_avaliar,
                "aluno_nome": payload.aluno_nome,
                "ano_escolar": payload.ano_escolar,
                "feedback_json": resultado.model_dump(),
                "nota_total": resultado.nota_total,
                "nota_maxima": resultado.nota_maxima_possivel
            }
            
            # Se houvesse um UUID do usuário autenticado no JWT, colocaríamos aqui.
            # "user_id": payload.user_id 
            
            db.table("redacao_submissions").insert(insercao).execute()
            logger.info("Redação salva no Supabase com sucesso.")
            
        except Exception as db_err:
            # Em caso de falha do banco, não quebraremos a entrega da resposta ao usuário
            logger.error(f"Erro ao salvar redação no banco: {db_err}")
        
        return resultado
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
