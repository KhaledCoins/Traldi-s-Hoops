# ✅ SETUP COMPLETO - TRALDI'S HOOPS

## 🎉 CONFIGURAÇÃO CONCLUÍDA!

Seu projeto está **100% configurado** e pronto para rodar!

---

## 📋 O QUE JÁ ESTÁ PRONTO

### ✅ Variáveis de Ambiente Configuradas
```env
VITE_SUPABASE_URL=https://mjunstpuynfizsxghkqx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ✅ Supabase Client Configurado
- Arquivo: `/lib/supabase.ts`
- Cliente criado e pronto para usar
- Todas as funções helper implementadas
- Realtime configurado

### ✅ Custom Hooks Implementados
- `useEvents()` - Gerenciar eventos
- `useQueuePlayers()` - Gerenciar fila
- `useRealtimeQueue()` - Atualização em tempo real
- `useAdmin()` - Funções administrativas

### ✅ Componentes Conectados
- PainelAdmin.tsx
- PainelTV.tsx
- FilaDigital.tsx
- Eventos.tsx

---

## 🚀 PRÓXIMOS PASSOS

### 1️⃣ INSTALAR DEPENDÊNCIAS

```bash
npm install
```

### 2️⃣ RODAR LOCALMENTE

```bash
npm run dev
```

**Abrir:** http://localhost:5173

---

## 🧪 CHECKLIST DE TESTES

Execute estes testes na ordem:

### ✅ Teste 1: Home e Navegação
- [ ] Home carrega
- [ ] Menu funciona
- [ ] Todos os links funcionam

### ✅ Teste 2: Eventos
- [ ] Ir em "Eventos"
- [ ] Deve mostrar 4 eventos (3 finalizados + 1 ativo)
- [ ] Verificar dados vêm do Supabase (não mock)

### ✅ Teste 3: Painel Admin
- [ ] Clicar no evento "Tardezinha Traldi's Hoops"
- [ ] Clicar em "Painel Admin"
- [ ] Verificar estatísticas aparecem
- [ ] Aba "Gerenciar Fila" carrega
- [ ] Adicionar jogador manualmente:
  - Nome: João Silva
  - Telefone: 12999999999
  - Instagram: @joaosilva (opcional)
- [ ] Jogador aparece na lista

### ✅ Teste 4: Painel TV
- [ ] No Painel Admin, clicar em "Ver Painel TV"
- [ ] Nova aba abre com o Painel TV
- [ ] Fila aparece vazia (ou com o jogador adicionado)

### ✅ Teste 5: REALTIME (MAIS IMPORTANTE!)
- [ ] Manter 2 abas abertas:
  - **Aba 1:** Painel TV (deixar visível)
  - **Aba 2:** Painel Admin
- [ ] No Painel Admin, adicionar mais um jogador:
  - Nome: Maria Santos
  - Telefone: 12988888888
- [ ] **OBSERVAR:** Painel TV atualiza AUTOMATICAMENTE! 🔥
- [ ] Se atualizar sozinho = REALTIME FUNCIONANDO ✅

### ✅ Teste 6: Check-in Público
- [ ] Voltar para a página do evento
- [ ] Clicar em "Entrar na fila agora"
- [ ] Preencher formulário de check-in
- [ ] Confirmar
- [ ] Verificar se aparece no Painel Admin
- [ ] Verificar se aparece no Painel TV

---

## 🗄️ VERIFICAÇÕES NO SUPABASE

### 1. Confirmar Tabelas
No Supabase Dashboard → Table Editor:
- [ ] events (deve ter 4 registros)
- [ ] queue_players (terá os jogadores que você adicionar)
- [ ] teams (vazia por enquanto)
- [ ] matches (vazia por enquanto)
- [ ] contact_messages (vazia por enquanto)

### 2. Confirmar RLS Ativo
Para cada tabela acima:
- Table Editor → Clique na tabela → Policies
- Deve ter pelo menos 2 policies

### 3. Confirmar Realtime Habilitado
- Settings → API → Realtime
- Verificar se está "Enabled"

### 4. Confirmar Evento Ativo
SQL Editor → Rodar:
```sql
SELECT id, title, status, is_paused 
FROM events 
WHERE status = 'active';
```

**Resultado esperado:**
```
id: c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
title: Tardezinha Traldi's Hoops
status: active
is_paused: false
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Failed to fetch" ou "Network Error"

**Solução 1: Verificar .env**
```bash
cat .env
```
Deve mostrar suas credenciais corretas.

**Solução 2: Verificar RLS**
Rodar no Supabase SQL Editor:
```sql
-- Ver todas as policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

Deve retornar 11 policies.

**Solução 3: Recriar policies**
Copiar e rodar todo o SQL de `SUPABASE-SQL.md` seção 3️⃣

### Realtime não funciona

**Solução: Habilitar Realtime para queue_players**
```sql
-- No Supabase SQL Editor
ALTER PUBLICATION supabase_realtime ADD TABLE queue_players;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
```

### Build falha

```bash
# Limpar tudo
rm -rf node_modules package-lock.json dist

# Reinstalar
npm install

# Testar build
npm run build
```

---

## 📦 DEPLOY NO VERCEL

Depois de todos os testes locais passarem:

### Opção 1: GitHub + Vercel (Recomendado)

```bash
# 1. Criar repo no GitHub
# https://github.com/new

# 2. Inicializar Git
git init
git add .
git commit -m "Initial commit - Traldi's Hoops"
git branch -M main

# 3. Conectar ao GitHub
git remote add origin https://github.com/SEU-USUARIO/traldis-hoops.git
git push -u origin main

# 4. Deploy na Vercel
# - Ir em: https://vercel.com/new
# - Import Git Repository
# - Selecionar repositório
# - Framework: Vite
# - Build Command: npm run build
# - Output Directory: dist
# - Environment Variables:
#   VITE_SUPABASE_URL=https://mjunstpuynfizsxghkqx.supabase.co
#   VITE_SUPABASE_ANON_KEY=eyJhbGci...

# 5. Deploy!
```

### Opção 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
# Adicionar variáveis quando solicitado
vercel --prod
```

---

## 🎯 URLs DO PROJETO

### Supabase
- Dashboard: https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx
- Database: https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx/editor
- API: https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx/settings/api

### Evento Ativo (ID)
```
c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
```

### URLs Locais (após npm run dev)
```
Home:   http://localhost:5173
Fila:   http://localhost:5173/#fila?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
Admin:  http://localhost:5173/#painel-admin?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
TV:     http://localhost:5173/#painel-tv?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
```

---

## 📱 GERAR QR CODES (APÓS DEPLOY)

Após deploy na Vercel, gerar QR Codes:

**URL para QR Code:**
```
https://SEU-SITE.vercel.app/#fila?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
```

**Sites para gerar:**
- https://www.qr-code-generator.com
- https://www.qrcode-monkey.com

---

## ✅ CHECKLIST FINAL

Antes de considerar concluído:

- [ ] npm install executado
- [ ] npm run dev funciona
- [ ] Todos os 6 testes passaram
- [ ] Realtime funciona localmente
- [ ] Verificações no Supabase OK
- [ ] npm run build passa sem erros
- [ ] Deploy na Vercel concluído
- [ ] Variáveis de ambiente na Vercel configuradas
- [ ] Site em produção funciona
- [ ] Realtime funciona em produção
- [ ] QR Codes gerados

---

## 🎉 ESTÁ TUDO PRONTO!

Agora é só:

1. **Rodar:** `npm run dev`
2. **Testar:** Seguir checklist acima
3. **Deploy:** Vercel
4. **Usar:** No próximo evento! 🏀

---

**Boa sorte! Se precisar de ajuda, consulte DEPLOY-INSTRUCTIONS.md** 🚀
