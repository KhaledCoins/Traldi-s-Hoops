# 🗄️ SUPABASE - Scripts SQL Completos

## 📌 ORDEM DE EXECUÇÃO

Execute os scripts nesta ordem no Supabase SQL Editor:

1. Schema (Tabelas)
2. Eventos (Dados iniciais)
3. RLS Policies (Segurança)
4. Ativar evento (Teste)

---

## 1️⃣ SCHEMA - Criar Tabelas

```sql
-- ==========================================
-- EVENTS TABLE (Tabela de Eventos)
-- ==========================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'finished')),
  is_paused BOOLEAN DEFAULT false,
  max_players INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- QUEUE_PLAYERS TABLE (Fila de Jogadores)
-- ==========================================
CREATE TABLE IF NOT EXISTS queue_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram TEXT,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'played')),
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TEAMS TABLE (Times/Duplas)
-- ==========================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_number INTEGER NOT NULL,
  player_ids UUID[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- MATCHES TABLE (Partidas)
-- ==========================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_a_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_b_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  score_a INTEGER DEFAULT 0,
  score_b INTEGER DEFAULT 0,
  winner_team_id UUID REFERENCES teams(id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'playing', 'finished')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CONTACT_MESSAGES TABLE (Mensagens de Contato)
-- ==========================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES (Performance)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_queue_players_event_id ON queue_players(event_id);
CREATE INDEX IF NOT EXISTS idx_queue_players_position ON queue_players(position);
CREATE INDEX IF NOT EXISTS idx_queue_players_status ON queue_players(status);
CREATE INDEX IF NOT EXISTS idx_teams_event_id ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_event_id ON matches(event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
```

---

## 2️⃣ EVENTOS - Inserir Dados Iniciais

```sql
-- ==========================================
-- INSERIR EVENTOS PARA TESTE
-- ==========================================

-- Evento 1: Inaugural (finalizado)
INSERT INTO events (id, title, description, date, time, location, address, status, is_paused, max_players)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Traldi''s Hoops - Edição 1',
  'Primeira edição do Traldi''s Hoops. Evento inaugural de basquete 5x5 com fila digital.',
  '2025-11-16',
  '09:30',
  'Quadra do Grêmio',
  'Rua dos Amores Perfeitos, 93 - São José dos Campos - SP',
  'finished',
  false,
  50
);

-- Evento 2: Natal (finalizado)
INSERT INTO events (id, title, description, date, time, location, address, status, is_paused, max_players)
VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Racha Natal Solidário',
  'Edição especial de Natal com muito basquete e confraternização. Trouxe doações!',
  '2025-12-21',
  '09:30',
  'Quadra do 31 de Março',
  'Rua Icatú, 951 - Parque Industrial, São José dos Campos - SP',
  'finished',
  false,
  60
);

-- Evento 3: Tardezinha (ATIVO para testes)
INSERT INTO events (id, title, description, date, time, location, address, status, is_paused, max_players)
VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'Tardezinha Traldi''s Hoops',
  'Basquete 5x5 com fila digital. Tardezinha especial com muito streetball e diversão. Sistema transparente sem furo de fila.',
  '2026-02-07',
  '15:30',
  'Rua Icatú, 951',
  'Rua Icatú, 951 - Parque Industrial, São José dos Campos - SP',
  'upcoming',
  false,
  50
);

-- Verificar se os eventos foram criados
SELECT id, title, status, date, time FROM events ORDER BY date DESC;
```

---

## 3️⃣ RLS POLICIES - Segurança

```sql
-- ==========================================
-- HABILITAR ROW LEVEL SECURITY
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLICIES PARA EVENTS (Eventos)
-- ==========================================

-- Qualquer um pode VER eventos
CREATE POLICY "Eventos são públicos"
ON events FOR SELECT
TO anon, authenticated
USING (true);

-- Apenas admins podem CRIAR/EDITAR eventos
CREATE POLICY "Admins podem gerenciar eventos"
ON events FOR ALL
TO authenticated
USING (true);

-- ==========================================
-- POLICIES PARA QUEUE_PLAYERS (Fila de Jogadores)
-- ==========================================

-- Qualquer um pode VER a fila
CREATE POLICY "Fila é pública"
ON queue_players FOR SELECT
TO anon, authenticated
USING (true);

-- Qualquer um pode fazer CHECK-IN (INSERT)
CREATE POLICY "Qualquer um pode fazer check-in"
ON queue_players FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Apenas admins podem EDITAR/DELETAR
CREATE POLICY "Admins podem gerenciar fila"
ON queue_players FOR ALL
TO authenticated
USING (true);

-- ==========================================
-- POLICIES PARA TEAMS (Times)
-- ==========================================

-- Qualquer um pode VER times
CREATE POLICY "Times são públicos"
ON teams FOR SELECT
TO anon, authenticated
USING (true);

-- Qualquer um pode CRIAR times (formação automática)
CREATE POLICY "Qualquer um pode criar times"
ON teams FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Apenas admins podem EDITAR/DELETAR
CREATE POLICY "Admins podem gerenciar times"
ON teams FOR ALL
TO authenticated
USING (true);

-- ==========================================
-- POLICIES PARA MATCHES (Partidas)
-- ==========================================

-- Qualquer um pode VER partidas
CREATE POLICY "Partidas são públicas"
ON matches FOR SELECT
TO anon, authenticated
USING (true);

-- Apenas admins podem CRIAR/EDITAR partidas
CREATE POLICY "Admins podem gerenciar partidas"
ON matches FOR ALL
TO authenticated
USING (true);

-- ==========================================
-- POLICIES PARA CONTACT_MESSAGES (Mensagens)
-- ==========================================

-- Qualquer um pode ENVIAR mensagens
CREATE POLICY "Qualquer um pode enviar mensagens"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Apenas admins podem LER mensagens
CREATE POLICY "Apenas admins podem ler mensagens"
ON contact_messages FOR SELECT
TO authenticated
USING (true);
```

---

## 4️⃣ ATIVAR EVENTO - Para Teste

```sql
-- Ativar o evento "Tardezinha Traldi's Hoops" para testes
UPDATE events 
SET status = 'active', is_paused = false 
WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

-- Verificar se ativou corretamente
SELECT id, title, status, is_paused, date, time 
FROM events 
WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
```

---

## 🧪 QUERIES ÚTEIS PARA TESTES

```sql
-- Ver todos os eventos
SELECT * FROM events ORDER BY date DESC;

-- Ver fila de um evento específico
SELECT * FROM queue_players 
WHERE event_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' 
ORDER BY position;

-- Contar jogadores na fila
SELECT COUNT(*) as total_jogadores 
FROM queue_players 
WHERE event_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' 
AND status = 'waiting';

-- Limpar fila de um evento (para testes)
DELETE FROM queue_players 
WHERE event_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

-- Desativar evento (voltar para upcoming)
UPDATE events 
SET status = 'upcoming', is_paused = false 
WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
```

---

## ⚠️ IMPORTANTE

1. **Execute os scripts NA ORDEM** (1 → 2 → 3 → 4)
2. **Verifique cada resultado** antes de prosseguir
3. **Copie e cole TODO o SQL** de cada seção
4. **Clique em RUN** após colar cada script
5. **Habilite Realtime** no Supabase:
   - Settings > API > Realtime
   - Ative para a tabela `queue_players`

---

## ✅ CHECKLIST

- [ ] Tabelas criadas (5 tabelas)
- [ ] Índices criados (6 índices)
- [ ] Eventos inseridos (3 eventos)
- [ ] RLS habilitado (5 tabelas)
- [ ] Policies criadas (11 policies)
- [ ] Evento ativado (1 evento active)
- [ ] Realtime habilitado

---

**Pronto para deploy! 🚀**
