const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const port = 8080;
const app = express();

// Serve todos os arquivos estáticos da pasta atual (onde o server.js está)
app.use(express.static(path.join(__dirname)));

// Rota principal que serve o controle.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'controle.html'));
});

// Cria um servidor HTTP a partir do express app
const server = http.createServer(app);

// Anexa o servidor WebSocket ao servidor HTTP
const wss = new WebSocket.Server({ server });

console.log(`Servidor HTTP e WebSocket iniciado na porta ${port}.`);
console.log(`Acesse http://localhost:${port} no seu navegador.`);

wss.on('connection', ws => {
  console.log('Um cliente se conectou!');

  ws.on('message', message => {
    const command = message.toString();
    console.log('Comando recebido: %s', command);

    // Reenvia o comando para todos os outros clientes
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(command);
        console.log('Comando "%s" retransmitido para outro cliente.', command);
      }
    });
  });

  ws.on('close', () => {
    console.log('Um cliente se desconectou.');
  });
  
  ws.on('error', (error) => {
    console.error('Ocorreu um erro no WebSocket:', error);
  });
});

// Inicia o servidor
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});