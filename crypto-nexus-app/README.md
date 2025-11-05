# Crypto Landing — Next.js 15.3.2 + TS (Navbar ancho = Footer)

- Barra del **navbar** ocupa todo el ancho de la pantalla, con **contenedor interno** (`.navbar-inner`) limitado a `max-width: var(--max-w)` y centrado, igual que el **footer**.
- Diseño responsive para desktop, tablet y móvil.
- Rewrites a Flask (`next.config.mjs`) y `.env.local.example`.

## Cómo correr
npm install
cp .env.local.example .env.local
npm run dev
