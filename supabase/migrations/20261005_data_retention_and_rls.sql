-- =========================================================================
-- POLITICA DE RETENÇÃO DE DADOS - LGPD E MARCO CIVIL DA INTERNET
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION delete_old_academic_data() RETURNS void AS $$
BEGIN
  -- Marco Civil / LGPD: Limpeza de dados de redações (possui textos de alunos)
  -- Apagar redações e notas antigas após 6 meses
  DELETE FROM redacao_submissions WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule(
    'delete_academic_data_job', 
    '0 0 * * 0', 
    'SELECT delete_old_academic_data()'
);

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
