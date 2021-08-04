import { connectDatabase } from "./db/connectDatabase";
import UserController from './controllers/UserController'

import express, { Application } from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';


const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app
  .use(json()) // for parsing application/json
  .use(urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded;
  .use(morgan('dev'))
  .use('/users', UserController);

(async () => {
  await connectDatabase();
})();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});