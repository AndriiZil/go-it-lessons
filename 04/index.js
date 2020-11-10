const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const host = '127.0.0.1';
const port = 7000;

const clients = [];

const adminNamespace = io.of('/admin');
const usersNamespace = io.of('/users');

adminNamespace.on('connection', (socket) => {
    const socketId = socket.id;

    console.log(`Client with socket id: "${socketId}" was connected`);
    clients.push(socketId);

    socket.emit('data', {
        id: 'admin',
        name: 'Admin'
    });

    socket.on('message', (message) => {
        console.log('Message ', message);
    });

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socketId), 1);

        console.log(`Client with socket id: "${socketId}" was disconnected'`);
    });
});

usersNamespace.on('connection', (socket) => {
    const socketId = socket.id;

    console.log(`Client with socket id: "${socketId}" was connected`);
    clients.push(socketId);

    socket.emit('data', {
        id: 'user',
        name: 'User'
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

server.listen(port, host, () => {
    console.log(`Server started listen http://${host}:${port}`);
});
