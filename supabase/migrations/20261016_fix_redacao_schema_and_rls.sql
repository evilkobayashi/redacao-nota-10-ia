-- Migration: Align redacao_submissions schema with backend & enforce RLS on user_credits

ALTER TABLE public.redacao_submissions
  ADD COLUMN IF NOT EXISTS banca TEXT DEFAULT 'ENEM',
  ADD COLUMN IF NOT EXISTS nota_total NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nota_maxima NUMERIC DEFAULT 1000,
  ADD COLUMN IF NOT EXISTS is_plagio BOOLEAN DEFAULT FALSE,
  ALTER COLUMN score_c1 SET DEFAULT 0,
  ALTER COLUMN score_c2 SET DEFAULT 0,
  ALTER COLUMN score_c3 SET DEFAULT 0,
  ALTER COLUMN score_c4 SET DEFAULT 0,
  ALTER COLUMN score_c5 SET DEFAULT 0;

-- Fix INSERT policy on redacao_submissions
DROP POLICY IF EXISTS "Apenas admins (Service Key) podem inserir resultados" ON public.redacao_submissions;
CREATE POLICY "Usuários autenticados podem inserir suas próprias redações"
  ON public.redacao_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_credits
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ler apenas seus próprios créditos" ON public.user_credits;
CREATE POLICY "Usuários podem ler apenas seus próprios créditos"
  ON public.user_credits
  FOR SELECT
  USING (auth.uid() = user_id);
