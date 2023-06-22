/*
to pass the async errors to the error handler automatically
without the need to use next() with every route
*/
require('express-async-errors');

import 'reflect-metadata';
import * as path from 'path';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config, checkingEnvVariables } from '../config/config';

class MyApplication {
  public _express: express.Application = express();
  public port: number = parseInt(config.port);

  constructor() {
    checkingEnvVariables();

    this.appMiddlewares();
    this.appRoutes();
    this.conn();
    this._express.listen(this.port, () => {
      console.log(config.appName + ', Started At Port:' + this.port);
    });
  }

  /**
   * Express Midallwares & other configration ( Cookies, static path ..etc )
   */
  private appMiddlewares(): void {
    this._express.use(helmet());
    this._express.use(express.json());
    this._express.use(bodyParser.json());
    this._express.use(bodyParser.urlencoded({ extended: false }));
  }

  /**
   * Set All Application Routes from External Class's
   */
  private appRoutes(): void {
    this.errorRoutes();
  }

  private errorRoutes() {
    ////.... IF Request Route not Found.. THRO ERROR
    this._express.all('*', async (req, res) => {
      res.status(404).send('Not Found!');
    });
    this._express.use((err, req, res, next) => {
      res.status(500).send(err.stack);
    });
  }

  /**
   * Database Connection and Configration
   */
  public async conn() {
    mongoose
      .connect(config.mongoose.url, config.mongoose.options)
      .then(() => {
        console.log('Db Connected Successfully.');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default new MyApplication();
