-- ==========================================
-- Migration 004: Permitir ações admin via anon
-- O painel admin usa a chave anon (sem login).
-- Sem isso: pausar fila, remover avulso e limpar fila falham.
-- ==========================================

-- events: permitir UPDATE (pausar/retomar fila) para anon
DROP POLICY IF EXISTS "Admins podem gerenciar eventos" ON events;
CREATE POLICY "Admins podem gerenciar eventos"
ON events FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- queue_players: permitir UPDATE/DELETE (remover avulso, limpar fila) para anon
DROP POLICY IF EXISTS "Admins podem gerenciar fila" ON queue_players;
CREATE POLICY "Admins podem gerenciar fila"
ON queue_players FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- teams: permitir UPDATE/DELETE (remover time, limpar fila) para anon
DROP POLICY IF EXISTS "Admins podem gerenciar times" ON teams;
CREATE POLICY "Admins podem gerenciar times"
ON teams FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- matches: permitir UPDATE/DELETE para consistência (encerrar partida, etc.)
DROP POLICY IF EXISTS "Admins podem gerenciar partidas" ON matches;
CREATE POLICY "Admins podem gerenciar partidas"
ON matches FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
