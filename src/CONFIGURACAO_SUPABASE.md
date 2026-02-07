# ⚡ AÇÃO IMEDIATA - CONFIGURAR SUPABASE

## 🎯 O QUE FAZER AGORA

### 1️⃣ INSERIR EVENTOS NO BANCO (OBRIGATÓRIO)

**Acesse:** https://mjunstpuynfizsxghkqx.supabase.co

1. Faça login no Supabase
2. Clique em **SQL Editor** (ícone de banco de dados no menu lateral)
3. Clique em **"New Query"**
4. Copie o SQL abaixo e cole:

\`\`\`sql
-- Evento 1 (PASSADO)
INSERT INTO events (id, title, date, time, location, address, status, is_paused, max_players, created_at, updated_at)
VALUES (
  '1',
  'Traldi''s Hoops - Edição 1',
  '2025-12-15',
  '14:00',
  'Centro Esportivo',
  'Av. Principal, 100 - Centro, São José dos Campos',
  'finished',
  false,
  50,
  '2025-12-01 10:00:00',
  '2025-12-15 18:00:00'
);

-- Evento 2 (PASSADO)
INSERT INTO events (id, title, date, time, location, address, status, is_paused, max_players, created_at, updated_at)
VALUES (
  '2',
  'Racha Natal Solidário',
  '2025-12-24',
  '16:00',
  'Ginásio Municipal',
  'Rua do Esporte, 250 - Jardim Apolo, São José dos Campos',
  'finished',
  false,
  60,
  '2025-12-10 10:00:00',
  '2025-12-24 20:00:00'
);

-- Evento 3 (HOJE - 07/02/2026)
INSERT INTO events (id, title, date, time, location, address, status, is_paused, max_players, created_at, updated_at)
VALUES (
  '3',
  'Tardezinha Traldi''s Hoops',
  '2026-02-07',
  '16:00',
  'Parque Industrial',
  'Quadra Pública - Parque Industrial, São José dos Campos - SP',
  'active',
  false,
  80,
  '2026-01-20 10:00:00',
  NOW()
);
\`\`\`

5. Clique em **RUN** (botão verde no canto inferior direito)

✅ **Pronto!** Os eventos estão no banco.

---

### 2️⃣ TESTAR O SISTEMA

Após inserir os eventos, teste:

#### A) **Página de Eventos**
- Acesse a home do app
- Clique em "Ver Eventos"
- Você verá os 3 eventos (2 finalizados, 1 ativo)

#### B) **Check-in (Fila Digital)**
- Clique no evento "Tardezinha Traldi's Hoops"
- Clique em "Entrar na Fila"
- Faça um check-in de teste como avulso

#### C) **Painel Admin**
- Na página do evento, clique no botão "Admin" (ícone de engrenagem)
- Você verá o jogador que acabou de adicionar
- Teste adicionar mais jogadores manualmente

#### D) **Painel TV**
- No painel admin, clique em "Ver Painel TV"
- Você verá a fila em formato de TV
- **Deixe essa aba aberta**

#### E) **Teste Realtime**
- Com o Painel TV aberto em uma aba
- Volte para o Painel Admin em outra aba
- Adicione um jogador
- **OBSERVE:** O Painel TV atualiza automaticamente! 🎉

---

## ✅ O QUE ESTÁ FUNCIONANDO

### **Supabase Realtime:**
- ✅ Updates automáticos em todas as telas
- ✅ Quando alguém faz check-in → todos veem
- ✅ Quando admin inicia jogo → todos veem
- ✅ Quando admin encerra jogo → todos veem

### **Sistema de Fila:**
- ✅ Check-in como avulso
- ✅ Formação automática de times (5 avulsos = 1 time)
- ✅ Check-in como time pronto (futuramente)
- ✅ Ordem automática e imutável
- ✅ Times voltam pro final após jogar

### **Painel Admin:**
- ✅ Ativar/pausar evento
- ✅ Adicionar jogadores manualmente
- ✅ Iniciar próximo jogo
- ✅ Encerrar partida
- ✅ Remover jogadores/times
- ✅ Limpar fila
- ✅ Gerar QR Code

### **Painel TV:**
- ✅ Visualização em tempo real
- ✅ Mostra jogo atual
- ✅ Mostra próximos times
- ✅ Estatísticas ao vivo

---

## 🎯 FLUXO REAL DO EVENTO

### **DIA DO EVENTO:**

1. **Antes de começar:**
   - Admin acessa `/painel-admin`
   - Garante que evento está **ATIVO**
   - Gera QR Code e divulga

2. **Participantes chegam:**
   - Escaneia QR Code
   - Faz check-in (avulso ou time pronto)
   - Sistema adiciona na fila automaticamente

3. **Quando tiver 2+ times:**
   - Admin clica "Iniciar Próximo Jogo"
   - Times #1 e #2 começam a jogar
   - Painel TV mostra ao vivo

4. **Após o jogo:**
   - Admin clica "Encerrar Partida"
   - Ambos voltam pro final da fila
   - Próximos times sobem automaticamente

5. **Ciclo continua:**
   - Sempre os 2 primeiros jogam
   - Sem furo de fila
   - Sistema 100% automático e justo

---

## 🔥 RECURSOS AVANÇADOS

### **Pausar Fila:**
Se precisar dar um tempo no evento:
- Admin clica "Pausar Fila"
- Novos check-ins são bloqueados
- Mensagem aparece para quem tentar entrar
- Quando retomar, check-ins são liberados novamente

### **Limpar Fila:**
Para resetar tudo:
- Admin clica "Limpar Fila"
- Remove TODOS os jogadores e times
- Use com cuidado!

### **Remover Individual:**
Para remover alguém específico:
- Admin clica no ícone de lixeira ao lado do jogador/time
- Confirma a remoção
- Sistema reorganiza automaticamente

---

## 📱 DICAS DE USO

### **Mobile-First:**
- A maioria dos participantes usará celular (QR Code)
- Interface otimizada para touch
- Formulário simples e rápido

### **Tablet para Admin:**
- Recomendado usar tablet para o painel admin
- Ou notebook mesmo
- Precisa de acesso fácil aos botões

### **TV/Projetor:**
- Painel TV em fullscreen
- Mostra tudo grande e legível
- Atualiza sozinho, não precisa tocar

---

## 🐛 TROUBLESHOOTING

### **"Supabase não conecta"**
- Verifique se o arquivo `.env` existe na raiz
- Confirme que contém:
  - `VITE_SUPABASE_URL=https://mjunstpuynfizsxghkqx.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=eyJhbG...`

### **"Não consigo fazer check-in"**
- Verifique se o evento está **ATIVO** (não "upcoming")
- Verifique se a fila não está **PAUSADA**
- Execute no SQL Editor:
  \`\`\`sql
  UPDATE events SET status = 'active', is_paused = false WHERE id = '3';
  \`\`\`

### **"Realtime não funciona"**
- Verifique se o Supabase Realtime está habilitado
- Acesse: Project Settings → API → Realtime
- Deve estar **ENABLED**

### **"Erro 403 ao inserir dados"**
- Verifique as Row Level Security policies
- Devem permitir INSERT/SELECT com role anon

### **"Pausar fila", "Remover avulso" ou "Limpar fila" não funcionam"**
- O painel admin usa a chave anon (sem login)
- Execute a migration 004 no SQL Editor do Supabase:
- Acesse **SQL Editor** → **New Query** → cole o conteúdo de `src/supabase/migrations/004_anon_admin_policies.sql` → **RUN**

---

## 🎉 ESTÁ TUDO PRONTO!

Agora é só:
1. Inserir os eventos (SQL acima)
2. Testar o fluxo completo
3. Usar no evento real!

**Qualquer dúvida, me chama!** 🚀
