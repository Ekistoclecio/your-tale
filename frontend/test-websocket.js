const { io } = require('socket.io-client');

const SERVER_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000';

console.log('🧪 Testando conectividade WebSocket...');
console.log('📍 URL do servidor:', SERVER_URL);

// Teste básico de conexão
const testConnection = () => {
  console.log('🔌 Tentando conectar...');
  
  const socket = io(`${SERVER_URL}/chat`, {
    timeout: 10000,
    forceNew: true,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✅ Conectado com sucesso!');
    console.log('🆔 Socket ID:', socket.id);
    socket.disconnect();
    process.exit(0);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Erro de conexão:', error.message);
    console.error('🔍 Detalhes:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    process.exit(1);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Desconectado:', reason);
  });

  // Timeout após 15 segundos
  setTimeout(() => {
    console.error('⏰ Timeout - Servidor não respondeu em 15 segundos');
    socket.disconnect();
    process.exit(1);
  }, 15000);
};

// Teste com autenticação
const testWithAuth = (token) => {
  console.log('🔐 Testando com autenticação...');
  
  const socket = io(`${SERVER_URL}/chat`, {
    auth: { token },
    timeout: 10000,
    forceNew: true,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✅ Conectado com autenticação!');
  });

  socket.on('connected', (data) => {
    console.log('🔐 Autenticado com sucesso:', data);
    socket.disconnect();
    process.exit(0);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Erro de autenticação:', error.message);
    process.exit(1);
  });

  setTimeout(() => {
    console.error('⏰ Timeout na autenticação');
    socket.disconnect();
    process.exit(1);
  }, 15000);
};

// Executar testes
if (process.argv.includes('--auth') && process.argv[3]) {
  testWithAuth(process.argv[3]);
} else {
  testConnection();
} 