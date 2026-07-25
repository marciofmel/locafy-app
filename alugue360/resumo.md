# Alugue360

## Info
- Backend: Express + Prisma + PostgreSQL (localhost:3001, Render Postgres prod)
- Frontend: React + Vite + TailwindCSS + PWA (localhost:5173)
- Admin: React + Vite + TailwindCSS (dark theme), static site separado
- DB: PostgreSQL 16 local (senha `123456`, banco `alugue360`) + Render Postgres (`locafy-db`)
- Repo: `https://github.com/marciofmel/locafy-app` (branch `main`)
- Render Web Service: `locafy-app` (`srv-d9a24i6cjfls7394qs20`)
- Render Admin Static Site: `locafy-admin-v2` (`srv-d9i861vaqgkc739m2gb0`)

## URLs
- App principal: `https://locafy-app.onrender.com`
- Admin panel: `https://locafy-admin-v2.onrender.com/#/login`
- Stripe: placeholder (`sk_test_placeholder`) — precisa de keys reais

## Admin
- **Login**: email `guilhermeferreiramelo2017@gmail.com` (admin)
- **HashRouter** (rotas com `#/`): `/#/login`, `/#/usuarios`, `/#/categorias`, `/#/planos`, `/#/anuncios`
- **Recursos**: Dashboard (gráfico), Usuários (CRUD), Anúncios (excluir), Categorias (CRUD inline), Planos (CRUD inline)
- **Build**: `cd alugue360/admin && npm install && npm run build` → dist commitado

## Navbar Condicional
- "Planos" no header aparece só para **não assinantes**
- "Upgrad" no dropdown aparece só para **assinantes com plano pago** (≥ R$49,99)

## Home
- Hero com imagem de fundo sutil (opacity 8%)
- Cards categorias menores no mobile (`h-40` vs `h-52`)

## Deploy
- Push p/ main → auto-deploy no web service + static site (autoDeploy=yes)
- Forçar deploy manual: `render_trigger_deploy` com serviceId

## Admin User Promovido
- `guilhermeferreiramelo2017@gmail.com` role = admin
- Setup endpoint `/api/setup-admin` removido

## Próximos Passos
1. Stripe keys reais
2. Upload de imagens
3. Deploy Bridge Telegram + ZapRecados
