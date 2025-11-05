# Crypto Landing — Next.js 15.3.2 + TypeScript (Footer global)

- Footer global en `components/Footer.tsx` renderizado en `app/page.tsx` (visible en todas las pestañas).
- Tabs con estado React; CSS sin `display:none` en `.content`.
- Rewrites a Flask (`next.config.mjs`), `.env.local.example` y placeholders en `/public/images`.

## Uso
npm install
cp .env.local.example .env.local
npm run dev
