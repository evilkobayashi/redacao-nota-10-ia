from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import redacao

app = FastAPI(
    title="Redação Nota 10 AÍ - API",
    description="API de avaliação de redações do ENEM usando Google Gemini 1.5 Pro.",
    version="1.0.0"
)

# Adicionando CORS para o frontend (Vercel) conseguir fazer requisições
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em prod, coloque os domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra os routers
app.include_router(redacao.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Redação Nota 10 AÍ (Gemini Powered)"}
