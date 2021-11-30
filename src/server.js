import express from 'express';

import cors from 'cors';

import listEndpoints from 'express-list-endpoints';

import authorsRouter from './authors/index.js';

const server = express;

const PORT = process.env.PORT || 5001;

const corsOptions = {
    origin: function (origin, callback) {
        console.log("Current origin: ", origin);
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error({ status: 500, message: "CORS Error"}));
        }
    }
};

server.use(cors(corsOptions));

server.use(express.json());

server.use("/authors", authorsRouter);

console.log(listEndpoints(server));

server.listen(PORT, () => console.log(`Server is running on port: `, PORT));

server.once("error", (error) => console.log(`Server is not running due to: ${error}`));