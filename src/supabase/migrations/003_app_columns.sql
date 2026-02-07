-- ==========================================
-- Migration 003: Colunas extras para o app
-- Execute APÓS a 002 (schema Figma)
-- Adiciona colunas que o app usa para fila (avulsos + times)
-- ==========================================

-- queue_players: colunas para sistema de avulsos vs times
ALTER TABLE queue_players ADD COLUMN IF NOT EXISTS player_type TEXT DEFAULT 'solo';
ALTER TABLE queue_players ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE queue_players ADD COLUMN IF NOT EXISTS name TEXT;
UPDATE queue_players SET name = player_name WHERE name IS NULL AND player_name IS NOT NULL;

-- teams: colunas para nome e ordenação (Figma exige team_number, player_ids)
ALTER TABLE teams ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'random';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS position INTEGER;
UPDATE teams SET name = COALESCE(name, 'Time ' || COALESCE(team_number, 1)) WHERE name IS NULL;
UPDATE teams SET type = COALESCE(type, 'random') WHERE type IS NULL;
UPDATE teams SET position = COALESCE(position, COALESCE(team_number, 1)) WHERE position IS NULL;

-- contact_messages: coluna subject (app envia assunto)
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS subject TEXT;
