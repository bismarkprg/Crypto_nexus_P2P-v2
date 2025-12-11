// Respuestas simples y didácticas para principiantes
const replies = {
  bienvenida: '¡Hola! Soy un bot educativo sobre criptomonedas. Pregúntame: "¿qué es una criptomoneda?", "¿cómo funcionan?", "riesgos", o "Bolivia cripto".',
  queEsCripto: 'Una criptomoneda es dinero digital. Usa criptografía para asegurar transacciones y funciona en redes descentralizadas (sin bancos). Bitcoin fue la primera, creada en 2009.',
  comoFunciona: 'Las transacciones se registran en una cadena de bloques (blockchain). Cada bloque guarda operaciones verificadas por la red. Es público, difícil de alterar y no necesita intermediarios.',
  paraQueSirve: 'Sirve para enviar dinero, ahorrar, invertir o pagar en lugares que aceptan cripto. También para transferencias internacionales más rápidas y, a veces, con menos comisiones.',
  riesgos: 'Cripto puede ser volátil. Hay riesgo de pérdida, estafas, y seguridad de llaves privadas. Infórmate, usa plataformas confiables y nunca inviertas más de lo que estás dispuesto a perder.',
  seguridad: 'Usa billeteras seguras, activa doble factor, cuida tus semillas/llaves, y verifica enlaces. Evita promesas de “ganancias garantizadas” y proyectos sin transparencia.',
  boliviaIntro: 'En Bolivia el interés por cripto ha crecido. Hay conversación sobre educación financiera, prevención de estafas y uso responsable. Antes de usar cripto, infórmate y verifica fuentes confiables.',
  masInfo: 'Puedo explicarte términos como blockchain, billetera (wallet), exchange, stablecoin, o minado. Escribe uno de esos términos y te doy una explicación breve.',
  desconocido: 'No entendí eso, pero puedo ayudarte con: "¿qué es una criptomoneda?", "blockchain", "wallet", "riesgos", o "Bolivia cripto".',
  blockchain: 'Blockchain es un registro público y distribuido. Agrupa transacciones en bloques enlazados con criptografía. Hace que los datos sean verificables y difíciles de alterar.',
  wallet: 'Una wallet (billetera) guarda tus llaves para usar criptomonedas. Puede ser móvil, hardware o software. Cuida tu frase semilla: quien la tiene, tiene tus fondos.',
  exchange: 'Un exchange es una plataforma para comprar, vender o intercambiar criptomonedas por dinero tradicional u otras cripto. Elige uno con buena seguridad y reputación.',
  stablecoin: 'Una stablecoin busca mantener precio estable, generalmente vinculado al dólar (ej: USDT, USDC). Sirve para reducir volatilidad al mover fondos entre cripto.',
  minado: 'Minar (en redes que lo usan) es validar transacciones y asegurar la red a cambio de recompensas. Hoy muchas redes usan otros mecanismos como prueba de participación (staking).',
};

// Emparejar mensajes a respuestas por palabras clave
function getReply(input) {
  if (!input) return replies.bienvenida;

  if (includesAny(input, ['hola', 'buenas', 'hey'])) return replies.bienvenida;

  if (includesAny(input, ['qué es una criptomoneda', 'que es una criptomoneda', 'que es cripto', 'qué es cripto', 'definicion criptomoneda']))
    return replies.queEsCripto;

  if (includesAny(input, ['cómo funciona', 'como funciona', 'funciona cripto', 'funciona blockchain']))
    return replies.comoFunciona;

  if (includesAny(input, ['para qué sirve', 'para que sirve', 'sirve cripto']))
    return replies.paraQueSirve;

  if (includesAny(input, ['riesgos', 'peligros', 'riesgo']))
    return replies.riesgos;

  if (includesAny(input, ['seguridad', 'seguro', 'estafas']))
    return replies.seguridad;

  if (includesAny(input, ['bolivia cripto', 'cripto en bolivia', 'bolivia']))
    return replies.boliviaIntro;

  if (includesAny(input, ['blockchain'])) return replies.blockchain;
  if (includesAny(input, ['wallet', 'billetera'])) return replies.wallet;
  if (includesAny(input, ['exchange'])) return replies.exchange;
  if (includesAny(input, ['stablecoin', 'usdt', 'usdc'])) return replies.stablecoin;
  if (includesAny(input, ['minado', 'minar', 'mining'])) return replies.minado;

  if (includesAny(input, ['ayuda', 'help'])) return replies.masInfo;

  return replies.desconocido;
}

function includesAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

module.exports = { getReply };
