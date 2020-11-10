const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const host = '127.0.0.1';
const port = 7000;

const clients = [];

io.on('connection', (socket) => {
    const socketId = socket.id;

    console.log(`Client with socket id: "${socketId}" was connected`);
    clients.push(socketId);

    socket.emit('data', {
        id: '#458',
        name: 'Andrii'
    });

    socket.on('message', (message) => {
        console.log('Message ', message);
    });

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socketId), 1);

        console.log(`Client with socket id: "${socketId}" was disconnected'`);
    });
});

app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile('index.html'));

app.get('/client-count', (req, res) => {

    res.send({ countClients: io.engine.clientsCount });
});

app.post('/client/:id', (req, res) => {
    const socketId = req.params.id;

    if (clients.includes(socketId)) {
        io.to(socketId).emit(
            'private message',
            `Message to client with id ${socketId}`
        )
        return res.send({ message: `Message was sent to client with id ${socketId}` });
    } else {
        return res.send({ message: 'Client was not found' });
    }

})

server.listen(port, host, () => {
    console.log(`Server started listen http://${host}:${port}`);
});
