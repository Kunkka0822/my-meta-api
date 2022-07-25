import * as bodyParser from "body-parser";
const path = require('path');
import express from "express";
import routes from "./routes/index";
import { ControllerError } from "./lib/exceptions/controller_exception";
import cors from 'cors';

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(express.static(path.join(__dirname, '../ui/build')));
        this.express.use(cors());
    }

    private routes(): void {
        routes.forEach((route) => {
            this.express[route.method](route.path, ...(route.middleware || []), (req, res) => {
                route.handler(req)
                    .then(data => res.json(data))
                    .catch((e: ControllerError) => {
                        console.log(e)
                        res.status(e.status || 400).json({ message: e.message });
                    })
            })
        })

        this.express.use("*", (req, res, next) => {
            res.send("Invalid api route");
        });
    }
}

export default new App().express;