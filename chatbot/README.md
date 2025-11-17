# 🤖 Chatbot educativo de criptomonedas (Node.js + Express)

Endpoint `POST /chat` que responde con explicaciones para principiantes sobre criptomonedas y contexto general de Bolivia.

## Uso local
1. npm install
2. npm start
3. POST a http://localhost:3000/chat con JSON:
{
  "message": "¿qué es una criptomoneda?"
}

## Estructura
- src/server.js: servidor Express y endpoint /chat
- lib/intents.js: lógica de respuestas por palabras clave

## Integración
- Frontend (Next.js): hacer fetch al endpoint /chat
- Backend existente: montar el router bajo /api/chat
