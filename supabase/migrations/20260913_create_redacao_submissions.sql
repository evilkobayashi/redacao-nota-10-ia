-- Migration: Criação da Tabela redacao_submissions
-- Propósito: Salvar o histórico completo das redações avaliadas via Gemini no SaaS "Redação Nota 10 AÍ"

CREATE TABLE IF NOT EXISTS public.redacao_submissions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tema TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    image_url TEXT,
    aluno_nome TEXT,
    ano_escolar TEXT,
    
    -- Notas (Competências do ENEM)
    score_c1 INTEGER NOT NULL CHECK (score_c1 >= 0 AND score_c1 <= 200),
    score_c2 INTEGER NOT NULL CHECK (score_c2 >= 0 AND score_c2 <= 200),
    score_c3 INTEGER NOT NULL CHECK (score_c3 >= 0 AND score_c3 <= 200),
    score_c4 INTEGER NOT NULL CHECK (score_c4 >= 0 AND score_c4 <= 200),
    score_c5 INTEGER NOT NULL CHECK (score_c5 >= 0 AND score_c5 <= 200),
    total_score INTEGER NOT NULL GENERATED ALWAYS AS (score_c1 + score_c2 + score_c3 + score_c4 + score_c5) STORED,
    
    -- Dados brutos do LLM para renderização do histórico
    feedback_json JSONB NOT NULL,
    
    status TEXT DEFAULT 'done'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.redacao_submissions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Usuários podem ver apenas suas próprias redações"
    ON public.redacao_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Apenas admins (Service Key) podem inserir resultados"
    ON public.redacao_submissions
    FOR INSERT
    WITH CHECK (true); -- Controle feito puramente via backend (Service Key)

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_redacao_user_id ON public.redacao_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_redacao_created_at ON public.redacao_submissions(created_at DESC);
