const express = require('express');

const app = express();

app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' }
    ])
});

const server = app.listen(3000, () => {
    console.log('Server was started.');
});

module.exports = server;
