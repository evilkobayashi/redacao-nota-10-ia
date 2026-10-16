-- =========================================================================
-- REFORÇO DE ROW LEVEL SECURITY (RLS) - PRIVACIDADE DOS ALUNOS
-- =========================================================================

ALTER TABLE redacao_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ler apenas suas próprias redações" ON redacao_submissions;
CREATE POLICY "Usuários podem ler apenas suas próprias redações"
ON redacao_submissions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar apenas suas próprias redações" ON redacao_submissions;
CREATE POLICY "Usuários podem deletar apenas suas próprias redações"
ON redacao_submissions FOR DELETE
USING (auth.uid() = user_id);
