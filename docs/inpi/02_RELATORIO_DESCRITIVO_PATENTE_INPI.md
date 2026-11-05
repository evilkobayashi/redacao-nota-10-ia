# Relatório Descritivo de Pedido de Patente de Invenção (INPI)

> **Titular:** Aí Tecnologia e Educação Inova Simples (I.S.) / Aí Tecnologia e Educação Ltda. ("AÍ")
> **Enquadramento:** Empresa Simples de Inovação — Inova Simples (`Natureza Jurídica 234-8`, LC nº 167/2019 e LC nº 182/2021) com direito a **Trâmite Prioritário de Patente (Portaria INPI/PR nº 365/2020 — GRU 279)** e alinhamento estratégico ao **Plano Brasileiro de Inteligência Artificial (PBIA 2024–2028 / MCTI / FINEP)** com inferência prioritária em **Modelos de IA Nacionais (Sabiá-4 / Sabiazinho-4 / SoberanIA / Tucano)**.
> **Normativa:** Lei nº 9.279/96 (LPI), IN INPI/PR nº 30/2013 e Diretrizes de Exame de Invenções Implementadas por Computador (IIC).

---

## TÍTULO DA INVENÇÃO
**MÉTODO E SISTEMA IMPLEMENTADOS POR COMPUTADOR PARA TRANSCRIÇÃO ÓPTICA FIEL DE REDAÇÕES MANUSCRITAS, AUDITORIA MULTIDIMENSIONAL EM MATRIZ DE COMPETÊNCIAS E REESCRITA ASSISTIDA DE PARÁGRAFOS CRÍTICOS**

---

## CAMPO DA INVENÇÃO
**[001]** A presente invenção pertence ao campo da engenharia de sistemas computacionais aplicados a reconhecimento óptico de caracteres manuscritos (HTR/OCR Vision) preservador de desvios ortográficos, avaliação automatizada de textos dissertativo-argumentativos e geração estruturada de feedback corretivo.

---

## FUNDAMENTOS DA TÉCNICA E PROBLEMAS DO ESTADO DA TÉCNICA
**[002]** No estado da técnica, sistemas convencionais apresentam limitações estruturais severas que impedem a automação confiável, determinística, soberana e auditável do fluxo proposto:

**[003]** Autocorreção indesejada em motores de OCR comerciais durante a leitura de redações manuscritas, mascarando desvios ortográficos e gramaticais que deveriam ser avaliados na Competência 1;
**[004]** Subjetividade e falta de granularidade linha a linha em corretores automatizados que emitem apenas notas globais sem mapear desvios específicos por competência;
**[005]** Ausência de demonstração prática de melhoria textual sobre o próprio argumento original do estudante.

---

## SUMÁRIO DA INVENÇÃO
**[006]** A presente invenção soluciona os problemas técnicos do estado da técnica por meio de um sistema computacional integrado (100) e respectivo método de execução estruturado nos seguintes estágios cooperantes:
- (110) Unidade de Ingestão Híbrida de Redações (Texto Digital ou Captura Fotográfica de Folha Manuscrita com Pré-Processamento de Imagem);
- (120) Motor de Transcrição Óptica Vision Fiel (HTR sem Autocorreção Ortográfica) para Preservação Integral de Evidências Gramaticais;
- (130) Avaliador Matricial Determinístico nas 5 Competências Oficiais do ENEM (Pontuação 0-200 por Competência com Saída JSON Estrita);
- (140) Mapeador de Anotações Linha a Linha de Desvios Sintáticos, Semânticos, Coesivos e de Proposta de Intervenção;
- (150) Motor de Refatoração e Reescrita Comparativa do Parágrafo Mais Crítico e Indexação Histórica Evolutiva do Aluno.
- (160) Barramento de Anonimização em Trânsito (LGPD Art. 14) e Roteamento Prioritário para Modelos de Inteligência Artificial Soberanos Nacionais (família Sabiá-4 / Sabiazinho-4 / SoberanIA / Tucano) hospedados em jurisdição brasileira (`-br-sp`).

---

## BREVE DESCRIÇÃO DAS FIGURAS
**[007]** **A Figura 1** ilustra o diagrama de blocos da arquitetura do sistema **(100)** e seus módulos operacionais **(110 a 160)**.

---

## DESCRIÇÃO DETALHADA DA INVENÇÃO
**[008]** Com referência à **Figura 1**, o sistema **(100)** compreende um terminal cliente reativo **(105)** em comunicação segura com um servidor de aplicação **(108)**, barramento de inferência soberana nacional **(160)** e banco de dados distribuído em território nacional **(165)**.
**[009]** Durante a operação do método, os subsistemas **(110 a 160)** operam de maneira encadeada sobre estruturas de dados tipadas em memória e persistidas em banco relacional/vetorial, aplicando mascaramento determinístico de dados pessoais antes de qualquer chamada de inferência e priorizando modelos de linguagem treinados nativamente na língua portuguesa e nas matrizes normativas brasileiras (BNCC, ENEM e legislação educacional), garantindo rastreabilidade ponta a ponta, determinismo estrutural nas saídas geradas e eliminação dos gargalos de latência e inconsistência técnica verificados no estado da técnica.
