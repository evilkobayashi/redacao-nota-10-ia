# 📝 Redação Nota 10 AÍ

> **Produto SaaS de Correção Automática de Redações ENEM**
> Arquitetura Oficial: Next.js (Vercel) + FastAPI (Railway) + Supabase (Multi-tenant)

## 📌 Escopo do Produto
Plataforma onde alunos (B2C) ou escolas (B2B) enviam redações (digitadas ou foto do manuscrito) e a IA faz a correção baseada rigorosamente nas **5 competências do ENEM**, entregando:
1. Nota final detalhada (0 a 1000).
2. Marcações linha a linha no texto (erros gramaticais, de coesão, etc).
3. Feedback qualitativo: O que foi bom e o que precisa melhorar.
4. Sugestão de reescrita do parágrafo mais problemático.

## ⚙️ Stack & Tecnologias
- **Frontend:** Next.js 15, TailwindCSS, shadcn/ui.
- **Backend:** FastAPI (Python), integração nativa com LLM.
- **IA (LLM Core):** **Google Gemini 1.5 Pro** (Escolhido por ter a maior janela de contexto do mercado, permitindo analisar múltiplas redações históricas do aluno simultaneamente, e pelas suas fortes capacidades de Structured Outputs JSON).
- **OCR (Foto para texto):** Vision API nativa do Gemini.
- **Banco de Dados:** Supabase Compartilhado (tabela `redacao_submissions`).

## 🗄️ Modelagem de Banco (Supabase)
Tabela principal projetada: `redacao_submissions`
- `id` (uuid)
- `user_id` (fk)
- `tema` (text)
- `raw_text` (text)
- `image_url` (text - caso seja upload de foto)
- `score_c1` (int 0-200) - Domínio da Norma Culta
- `score_c2` (int 0-200) - Compreensão do Tema / Repertório
- `score_c3` (int 0-200) - Organização e Argumentação
- `score_c4` (int 0-200) - Coesão e Conectivos
- `score_c5` (int 0-200) - Proposta de Intervenção
- `total_score` (int 0-1000)
- `feedback_json` (jsonb)
- `status` (text - pending, done, error)

## 🚀 Fases de Desenvolvimento
- [ ] Fase 1: Setup Backend (FastAPI + Modelos + Prompt Claude 3.5 Sonnet).
- [ ] Fase 2: Motor OCR para Manuscritos (Visão Computacional).
- [ ] Fase 3: Setup Frontend (Next.js) e Editor de Redação.
- [ ] Fase 4: Integração Supabase e Checkout B2C.
