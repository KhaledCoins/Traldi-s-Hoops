# 🏀 TRALDI'S HOOPS - Instruções de Deploy

## 📌 RESUMO DO PROJETO

Projeto de basquete + lifestyle com sistema de fila digital em tempo real.

**Stack:**
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS v4
- Backend: Supabase (PostgreSQL + Realtime)
- Deploy: Vercel

---

## ✅ CHECKLIST PRÉ-DEPLOY

### 1. Supabase já configurado ✅
- Tabelas criadas: `events`, `queue_players`, `teams`, `matches`, `contact_messages`
- Row Level Security (RLS) habilitado
- Políticas configuradas
- Evento ativo: `c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33`

### 2. Variáveis de ambiente:
Arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

---

## 🚀 DEPLOY NO VERCEL

### **OPÇÃO 1: Deploy via CLI (Recomendado)**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login na Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy em produção
vercel --prod
```

### **OPÇÃO 2: Deploy via GitHub**

1. Criar repositório no GitHub
2. Push do código:
```bash
git init
git add .
git commit -m "Initial commit - Traldi's Hoops"
git branch -M main
git remote add origin https://github.com/seu-usuario/traldis-hoops.git
git push -u origin main
```

3. Conectar no Vercel:
   - Ir em https://vercel.com/new
   - Importar repositório do GitHub
   - Configurar:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

4. Adicionar variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

5. Deploy!

---

## 🔧 CONFIGURAÇÃO DO VERCEL

### vercel.json (já criado no projeto)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📱 PÓS-DEPLOY

### 1. Testar funcionalidades:
- [ ] Home carrega corretamente
- [ ] Lista de eventos aparece
- [ ] Check-in funciona
- [ ] Painel Admin carrega
- [ ] Painel TV carrega
- [ ] Realtime funciona (adicionar jogador e ver no Painel TV)

### 2. Configurar domínio customizado (opcional):
- Na Vercel: Settings > Domains
- Adicionar: `traldishoops.com.br` ou similar

### 3. Gerar QR Code para eventos:
Usar a URL do evento ativo:
```
https://seu-site.vercel.app/#fila?event=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
```

Gerar QR Code em: https://www.qr-code-generator.com/

---

## 🔍 TROUBLESHOOTING

### Erro: "Failed to fetch"
- Verificar se as variáveis de ambiente estão corretas
- Verificar se RLS está habilitado no Supabase
- Verificar se as políticas estão corretas

### Realtime não funciona
- Verificar se o Supabase Realtime está habilitado
- No Supabase: Settings > API > Realtime

### Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📂 ESTRUTURA DO PROJETO

```
traldis-hoops/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/            # Páginas da aplicação
│   ├── hooks/            # Custom hooks (Supabase)
│   ├── lib/              # Supabase client
│   └── styles/           # CSS global
├── public/               # Assets estáticos
├── .env                  # Variáveis de ambiente (NÃO COMMITAR!)
├── vercel.json          # Configuração Vercel
└── package.json         # Dependências
```

---

## 🔐 SEGURANÇA

### ⚠️ NUNCA COMMITAR:
- `.env` (está no .gitignore)
- Chaves de API
- Senhas do Supabase

### ✅ COMMITIR:
- `.env.example` (template sem valores reais)

---

## 📞 COMANDOS ÚTEIS

```bash
# Rodar localmente
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Limpar tudo e reinstalar
rm -rf node_modules dist .vercel
npm install
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Deploy no Vercel
2. 🔄 Testar sistema completo
3. 📱 Gerar QR Codes para eventos
4. 🎨 Customizar domínio (opcional)
5. 📊 Monitorar analytics no Vercel
6. 🔔 Configurar notificações (futuro)

---

## 🆘 SUPORTE

Se tiver problemas:
1. Verificar logs no Vercel: https://vercel.com/dashboard
2. Verificar logs no Supabase: Dashboard > Logs
3. Testar localmente primeiro: `npm run dev`

---

**Projeto criado com ❤️ para TRALDI'S HOOPS**
São José dos Campos, SP 🏀
