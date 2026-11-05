-- ============================================================================
-- MIGRAÇÃO DE CONFORMIDADE LGPD (Lei 13.709/2018), ECA DIGITAL (Lei 15.211/2025)
-- E DIREITO AO ESQUECIMENTO (Art. 18, VI) — REDAÇÃO NOTA 10 AÍ
-- Data: 05/11/2026
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lgpd_consent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NULL,
    email TEXT NULL,
    product_name TEXT NOT NULL DEFAULT 'Redação Nota 10 AÍ',
    age_verified_18_or_guardian BOOLEAN NOT NULL DEFAULT true,
    terms_accepted BOOLEAN NOT NULL DEFAULT true,
    privacy_accepted BOOLEAN NOT NULL DEFAULT true,
    cookie_preference TEXT NOT NULL DEFAULT 'essential',
    consent_version TEXT NOT NULL DEFAULT 'v2.1-2026-11-05',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lgpd_consent_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.lgpd_unsubscribes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL DEFAULT 'Redação Nota 10 AÍ',
    unsubscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lgpd_unsubscribes ENABLE ROW LEVEL SECURITY;

-- RLS nas tabelas de redações e créditos
ALTER TABLE IF EXISTS public.redacao_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios deletam proprias redacoes LGPD" ON public.redacao_submissions;
CREATE POLICY "Usuarios deletam proprias redacoes LGPD"
ON public.redacao_submissions FOR DELETE
USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Usuarios deletam proprios creditos LGPD" ON public.user_credits;
CREATE POLICY "Usuarios deletam proprios creditos LGPD"
ON public.user_credits FOR DELETE
USING (auth.uid()::text = user_id::text);
