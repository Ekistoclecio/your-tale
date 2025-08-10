# 📌 Canvas de Planejamento de Escalabilidade — YourTale

## 1. Objetivo da Escalabilidade
Preparar a plataforma YourTale para suportar milhares de sessões de RPG online com IA generativa de forma simultânea, mantendo:
- Tempo médio de resposta da IA abaixo de **2 segundos**.
- Latência mínima em interações de chat, rolagem de dados e atualizações de mapas.
- Custos de infraestrutura proporcionais ao uso real.

---

## 2. Volume Esperado de Interações
- **Cenário Atual**: 
  - ~50 sessões ativas por mês.
  - ~1.000 mensagens trocadas/mês entre jogadores e IA.
  - ~500 rolagens de dados/mês.
- **Cenário Escalado**:
  - ~500 sessões ativas por mês.
  - ~5.000 mensagens/mês.
  - ~2.000 rolagens de dados/mês.

---

## 3. Requisitos de Infraestrutura
- **Servidores**: 
  - Múltiplas instâncias de backend com escalonamento automático (AWS/GCP).
- **Banco de Dados**:
  - Particionamento por sessão e replicação para leitura.
  - Instância escalável com alta disponibilidade (PostgreSQL).
- **Rede**:
  - Balanceamento de carga global.
  - Largura de banda otimizada para picos de tráfego.
- **IA**:
  - Integração com múltiplos provedores (Google Gemini, alternativos) para redundância.
  - Cache inteligente de respostas para prompts recorrentes.

---

## 4. Estratégias de Escalabilidade
- **Horizontal**: Escalonamento automático de serviços backend e workers de IA.
- **Vertical**: Aumento de capacidade de memória e CPU em servidores críticos.
- **Mensageria**: BullMQ/Redis para processamento assíncrono de prompts.
- **Frontend**: Lazy loading, code splitting e renderização virtualizada para dados pesados.

---

## 5. Custo Estimado (Mensal no Cenário Escalado)
- **Servidores Backend**: ~R$ 1.200
- **Banco de Dados Escalável**: ~R$ 800  
- **Infra de IA (APIs)**: ~R$ 1.000  
- **Rede e Balanceamento**: ~R$ 300  
- **Monitoramento e Logs**: ~R$ 200  

---

## 6. Riscos e Mitigação
- **Sobrecarga no LLM** → Mitigação: Uso de múltiplos provedores com multiplas api keys (para ajudar na concorrência de chamadas).
- **Custo elevado com IA** → Mitigação: Otimização de prompts e limitação de tokens (entrada e saída).
- **Queda de performance com alto volume** → Mitigação: Testes de carga contínuos + otimização de queries.
- **Falha em provedor de IA** → Mitigação: Fallback automático para modelos alternativos.

---

## 7. Monitoramento de Escalabilidade
- Ferramentas: New Relic, Grafana, Prometheus.
- Alertas configurados para:
  - Latência > 2 segundos.
  - Uso de CPU > 80%.
  - Falhas de requisições para IA > 5% em 5 minutos.
- Dashboards em tempo real para sessões ativas e custos.

---

## 8. Plano de Teste em Ambiente Escalado
- Testes de carga com JMeter simulando **2.000 usuários simultâneos**.
- Testes de concorrência em banco com consultas complexas.
- Simulação de falha de provedor de IA para validar fallback.
- Benchmarks de cache e mensageria sob alta demanda.

---

## Conclusão
Este plano garante que o **YourTale** esteja preparado para crescer de forma sustentável, preservando a qualidade narrativa, mantendo custos sob controle e assegurando alta disponibilidade mesmo em picos de uso.
