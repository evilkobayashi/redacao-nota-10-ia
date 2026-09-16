import logging
import base64
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks, Response
from pydantic import BaseModel
from app.models.avaliacao import RedacaoSubmit, AvaliacaoRedacao
from app.services.avaliador_service import avaliar_redacao_gemini, verificar_plagio, extrair_texto_ocr
from app.database import get_supabase_client
from fpdf import FPDF

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/redacao", tags=["Redação"])

@router.post("/avaliar", response_model=AvaliacaoRedacao)
async def avaliar_endpoint(payload: RedacaoSubmit):
    """
    Recebe o tema e o texto da redação (ou imagem manuscrita),
    verifica plágio, avalia via Gemini e salva no Supabase.
    """
    if not payload.texto and not payload.image_base64:
        raise HTTPException(status_code=400, detail="Obrigatório enviar o texto ou a imagem (Base64).")
        
    texto_para_avaliar = payload.texto
    texto_ocr = None
    
    # 1. OCR Multimodal: Extrai texto da foto de caderno usando Gemini Vision
    if payload.image_base64 and not payload.texto:
        try:
            texto_para_avaliar = await extrair_texto_ocr(payload.image_base64)
            texto_ocr = texto_para_avaliar
        except Exception as e:
            logger.error(f"Erro no OCR: {e}")
            raise HTTPException(status_code=500, detail="Não conseguimos ler sua caligrafia. Tente tirar uma foto melhor.")

    # 2. Anti-Plágio: Bater contra a web usando DuckDuckGo (apenas se for texto longo)
    plagio_info = await verificar_plagio(texto_para_avaliar)
    if plagio_info["is_plagio"]:
        logger.warning(f"PLÁGIO DETECTADO! Fonte: {plagio_info['fonte']}")
        # Aqui o produto decide se veta e dá nota zero ou avisa a IA.
        # Vamos passar pra IA mas avisar no retorno que é plágio.

    try:
        # 3. Processa Inteligência Artificial (Gemini 1.5 Pro)
        resultado = await avaliar_redacao_gemini(
            tema=payload.tema, 
            texto=texto_para_avaliar,
            banca=payload.banca,
            is_plagio=plagio_info["is_plagio"]
        )
        
        # Injetar metadados de plágio e OCR no resultado
        resultado.is_plagio = plagio_info["is_plagio"]
        resultado.fonte_plagio = plagio_info.get("fonte")
        resultado.texto_extraido_ocr = texto_ocr
        
        # 4. Persiste os dados no Banco de Dados (Supabase)
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
                "nota_maxima": resultado.nota_maxima_possivel,
                "is_plagio": resultado.is_plagio
            }
            db.table("redacao_submissions").insert(insercao).execute()
        except Exception as db_err:
            logger.error(f"Erro ao salvar redação no banco: {db_err}")
        
        return resultado
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/exportar-pdf")
async def exportar_pdf(avaliacao: AvaliacaoRedacao):
    """
    Gera um relatório profissional em PDF com as notas, 
    correções e referências de leitura.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="REDAÇÃO NOTA 10 AÍ - Relatório Oficial", ln=True, align='C')
    
    pdf.set_font("Arial", '', 12)
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Nota Final: {avaliacao.nota_total} / {avaliacao.nota_maxima_possivel}", ln=True)
    
    if avaliacao.is_plagio:
        pdf.set_text_color(255, 0, 0)
        pdf.cell(200, 10, txt=f"ALERTA DE PLÁGIO DETECTADO. Fonte provável: {avaliacao.fonte_plagio}", ln=True)
        pdf.set_text_color(0, 0, 0)
        
    pdf.ln(5)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Comentário Geral do Avaliador:", ln=True)
    pdf.set_font("Arial", '', 11)
    pdf.multi_cell(0, 8, txt=avaliacao.comentario_geral)
    
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Desempenho por Critério:", ln=True)
    
    for c in avaliacao.criterios:
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(200, 8, txt=f"{c.nome_criterio} ({c.nota_obtida}/{c.nota_maxima})", ln=True)
        pdf.set_font("Arial", '', 11)
        pdf.multi_cell(0, 6, txt=c.comentarios)
        pdf.ln(3)
        
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Repertório Sociocultural Recomendado:", ln=True)
    pdf.set_font("Arial", '', 11)
    for ref in avaliacao.referencias_leitura:
        pdf.multi_cell(0, 6, txt=f"- {ref}")
        
    # Salva binário em memória para retornar
    pdf_content = pdf.output(dest='S').encode('latin1')
    
    return Response(
        content=pdf_content, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=relatorio_redacao.pdf"}
    )
