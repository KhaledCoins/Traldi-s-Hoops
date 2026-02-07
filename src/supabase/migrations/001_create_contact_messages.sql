-- Criar tabela para armazenar mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para buscar mensagens mais recentes
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública (qualquer um pode enviar mensagem)
CREATE POLICY "Qualquer um pode enviar mensagem de contato"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Apenas usuários autenticados podem ler mensagens (para painel admin futuro)
CREATE POLICY "Apenas admins podem ler mensagens"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Apenas usuários autenticados podem atualizar mensagens (marcar como lida)
CREATE POLICY "Apenas admins podem atualizar mensagens"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Comentários nas colunas
COMMENT ON TABLE contact_messages IS 'Armazena mensagens enviadas pelo formulário de contato do site';
COMMENT ON COLUMN contact_messages.name IS 'Nome de quem enviou a mensagem';
COMMENT ON COLUMN contact_messages.email IS 'Email de contato para resposta';
COMMENT ON COLUMN contact_messages.subject IS 'Assunto/motivo do contato';
COMMENT ON COLUMN contact_messages.message IS 'Conteúdo da mensagem';
COMMENT ON COLUMN contact_messages.read IS 'Indica se a mensagem foi lida pela equipe';
