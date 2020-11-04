const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const authRouter = require('./auth/auth.router');

const { error } = require('dotenv').config({ path: path.join(__dirname, '../.env')});

if (error) {
    throw new Error(error);
}


class Server {

    constructor() {
        this.server = null;
    }

    async start() {
        this.initServer();
        this.initMiddleware();
        this.initRoutes();
        this.initDBConnection();
        this.startListening();
        this.errrHandler();
    }

    initServer() {
        this.server = express();
    }

    initMiddleware() {
        this.server.use(logger('dev'));
        this.server.use(express.json());
    }

    initRoutes() {
        this.server.use('/auth', authRouter);
    }

    async initDBConnection() {
        try {
            mongoose.set('debug', true);

            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

            console.log('DB connected.')
        } catch(err) {
            console.log(err);
        }
    }

    startListening() {
        this.server.listen(process.env.PORT, () => {
            console.log('Server was started');
        })
    }

    errrHandler() {
        this.server.use((err, req, res, next) => {
            if (err) {
                const code = err.code || err.status || 500;
                const message = err.message || 'Unknown Error';
    
                return res.status(code).send({ message });
            }
            next();
        })
    }


}

module.exports = Server;