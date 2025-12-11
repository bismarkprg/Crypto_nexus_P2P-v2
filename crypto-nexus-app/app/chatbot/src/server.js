require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getReply } = require('../lib/intents');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Salud
app.get('/', (req, res) => {
  res.send('🤖 Chatbot educativo de criptomonedas (Node.js + Express)');
});

// Conversación
app.post('/chat', (req, res) => {
  const input = (req.body.message || '').toLowerCase().trim();
  const reply = getReply(input);
  res.json({ reply });
});

// Inicio
app.listen(PORT, () => {
  console.log(`✅ Chatbot corriendo en http://localhost:${PORT}`);
});
