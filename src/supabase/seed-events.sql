-- ==========================================
-- INSERIR EVENTOS INICIAIS NO SUPABASE
-- ==========================================
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- 1. Evento PASSADO (Edição #1)
INSERT INTO events (id, title, date, time, location, address, status, is_paused, max_players, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
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

-- 2. Evento PASSADO (Racha Natal Solidário)
INSERT INTO events (id, title, date, time, location, address, status, is_paused, max_players, created_at, updated_at)
VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
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

-- 3. Evento ATUAL (Tardezinha Traldi's Hoops - HOJE 07/02/2026 - ATIVO)
INSERT INTO events (id, title, date, time, location, address, status, is_paused, max_players, created_at, updated_at)
VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
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

-- ==========================================
-- VERIFICAR INSERÇÃO
-- ==========================================
SELECT * FROM events ORDER BY date DESC;

-- ==========================================
-- COMANDOS ÚTEIS
-- ==========================================

-- Ver todos os eventos:
-- SELECT * FROM events ORDER BY date DESC;

-- Ativar evento:
-- UPDATE events SET status = 'active' WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

-- Pausar fila:
-- UPDATE events SET is_paused = true WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

-- Retomar fila:
-- UPDATE events SET is_paused = false WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
