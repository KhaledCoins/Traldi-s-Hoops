# 🏀 TRALDI'S HOOPS - Sistema de Fila Digital

Sistema completo para eventos presenciais de basquete com fila digital em tempo real, painel administrativo e painel de TV.

---

## 🎯 SOBRE O PROJETO

**TRALDI'S HOOPS** é um projeto de basquete + lifestyle que organiza eventos presenciais em São José dos Campos, SP. 

### Estética da Marca
- 🎨 Urbana, forte, minimalista
- 🏀 Influência street basketball
- ⚫⚪ Logo monocromática (preto e branco)
- 💪 Tom direto, confiante, competitivo mas inclusivo

### Princípios do Sistema
- 📱 **Mobile-first** (maioria acessa via QR Code no evento)
- 🔍 **Clareza absoluta** da fila
- ❌ **Zero ambiguidade** nas regras
- 🚫 **Sem furo de fila** (sistema automático)
- ⚡ **Performance > Efeitos visuais**

---

## 🛠️ TECNOLOGIAS

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Deploy:** Vercel
- **Icons:** Lucide React

---

## 📂 ESTRUTURA DO PROJETO

```
traldis-hoops/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LiveQueue.tsx
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Eventos.tsx
│   │   ├── FilaDigital.tsx
│   │   ├── PainelAdmin.tsx
│   │   ├── PainelTV.tsx
│   │   └── ...
│   ├── hooks/              # Custom hooks do Supabase
│   │   ├── useEvents.ts
│   │   ├── useQueuePlayers.ts
│   │   └── useRealtimeQueue.ts
│   ├── lib/                # Configurações
│   │   └── supabase.ts
│   ├── styles/             # Estilos globais
│   │   └── globals.css
│   └── App.tsx             # Componente principal
├── public/                 # Assets estáticos
├── .env                    # Variáveis de ambiente (NÃO COMMITAR!)
├── .env.example           # Template de variáveis
├── vercel.json            # Config Vercel
├── DEPLOY-INSTRUCTIONS.md # Instruções de deploy
├── SUPABASE-SQL.md        # Scripts SQL completos
└── README.md              # Este arquivo
```

---

## 🚀 QUICK START

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase
1. Copiar `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Preencher com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key
```

3. Executar os scripts SQL (veja `SUPABASE-SQL.md`)

### 3. Rodar localmente
```bash
npm run dev
```

Abrir: **http://localhost:5173**

---

## 📱 FUNCIONALIDADES

### 🏠 Site Institucional
- Home com hero e CTA
- Sobre o projeto
- Lista de eventos
- Regras e informações
- Formulário de contato

### 📋 Fila Digital
- Check-in via QR Code
- Visualização em tempo real da posição
- Sistema automático sem furo de fila
- Mobile-first design

### 👨‍💼 Painel Admin
- Gerenciar evento (pausar/retomar)
- Visualizar fila completa
- Adicionar jogadores manualmente
- Remover jogadores
- Estatísticas em tempo real
- Formação de times (próxima feature)

### 📺 Painel TV
- Visualização para exibir no evento
- Fila ao vivo
- Jogo atual
- Próximos times
- Atualização automática (Realtime)

---

## 🗄️ BANCO DE DADOS (Supabase)

### Tabelas
- `events` - Eventos
- `queue_players` - Fila de jogadores
- `teams` - Times formados
- `matches` - Partidas
- `contact_messages` - Mensagens de contato

### Regras
- ✅ Row Level Security (RLS) habilitado
- 🔓 Leitura pública para eventos e fila
- 🔒 Apenas admins podem editar/deletar
- 📡 Realtime habilitado para `queue_players`

Veja todos os scripts em: **`SUPABASE-SQL.md`**

---

## 🌐 DEPLOY

### Opção 1: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Opção 2: GitHub + Vercel
1. Criar repositório no GitHub
2. Push do código
3. Conectar no Vercel
4. Adicionar variáveis de ambiente
5. Deploy!

Instruções completas em: **`DEPLOY-INSTRUCTIONS.md`**

---

## 🔑 VARIÁVEIS DE AMBIENTE

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key
```

⚠️ **NUNCA COMMITAR O ARQUIVO `.env`!**

---

## 📦 SCRIPTS DISPONÍVEIS

```bash
# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Limpar e reinstalar
rm -rf node_modules dist
npm install
```

---

## 🎨 DESIGN SYSTEM

### Cores Principais
- **Background:** `#000000` (preto absoluto)
- **Texto:** `#FFFFFF` (branco)
- **Accent:** Amarelo/Laranja (CTAs)
- **Cards:** `#111111` / `#1a1a1a`

### Tipografia
- **Font:** System UI (sem Google Fonts)
- **Tamanhos:** Definidos no `globals.css`

### Componentes
- Button (primary, secondary, accent, ghost)
- Card
- Input
- LiveQueue
- StatusBadge

---

## 🧪 TESTES

### Testar localmente:
1. Rodar `npm run dev`
2. Acessar evento ativo
3. Fazer check-in
4. Abrir Painel Admin
5. Abrir Painel TV em outra aba
6. Adicionar jogador no Admin
7. Verificar atualização no Painel TV (Realtime)

### URLs de teste:
```
Home: http://localhost:5173
Eventos: http://localhost:5173/#eventos
Fila: http://localhost:5173/#fila?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
Admin: http://localhost:5173/#painel-admin?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
TV: http://localhost:5173/#painel-tv?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
```

---

## 📋 REGRAS DO SISTEMA

1. ✅ **UM evento ativo** por vez
2. ✅ **UMA quadra** por evento
3. ✅ **SEM furo de fila** (ordem automática)
4. ✅ Quem joga **volta para o final** da fila
5. ✅ **Mobile-first** (maioria acessa via QR Code)

---

## 🔒 SEGURANÇA

- ✅ Row Level Security (RLS) no Supabase
- ✅ Variáveis de ambiente protegidas
- ✅ Headers de segurança no Vercel
- ✅ Validação de dados no frontend
- ⚠️ **NÃO armazenar dados sensíveis** (PII)

---

## 📞 SUPORTE

Para problemas ou dúvidas:
1. Verificar `DEPLOY-INSTRUCTIONS.md`
2. Verificar `SUPABASE-SQL.md`
3. Logs do Vercel: https://vercel.com/dashboard
4. Logs do Supabase: Dashboard > Logs

---

## 🎯 ROADMAP

### ✅ Fase 1 - MVP (Concluído)
- [x] Site institucional
- [x] Sistema de fila digital
- [x] Painel Admin
- [x] Painel TV
- [x] Integração Supabase
- [x] Realtime

### 🔄 Fase 2 - Melhorias (Próximo)
- [ ] Formação automática de times
- [ ] Sistema de placares
- [ ] Estatísticas de jogadores
- [ ] Notificações push
- [ ] PWA (Progressive Web App)

### 🔮 Fase 3 - Expansão (Futuro)
- [ ] Multi-eventos simultâneos
- [ ] Multi-quadras
- [ ] Ranking de jogadores
- [ ] Sistema de reservas
- [ ] Pagamento online

---

## 📄 LICENÇA

Este projeto é proprietário da marca **TRALDI'S HOOPS**.

---

## 🏀 SOBRE A MARCA

**TRALDI'S HOOPS** - Basquete + Lifestyle  
São José dos Campos - SP  

Eventos presenciais de streetball com sistema digital de gestão de filas.

---

**Desenvolvido com ❤️ para a comunidade de basquete de São José dos Campos**
