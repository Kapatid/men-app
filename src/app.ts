import UserRoutes from './routes/UserRoutes';

import express, { Application } from 'express';
import morgan from 'morgan';
import mongoose, { CallbackError } from 'mongoose';
import { json, urlencoded } from 'body-parser';


const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(json()) // for parsing application/json
   .use(urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded;
   .use(morgan('dev'))
   .use('/users', UserRoutes);

mongoose.connect(
  process.env.MONGODB_URI as string, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
  }, 
  (error: CallbackError) => {
    if (!error) {
      console.log('\x1b[1m\x1b[33m' + 'Database Connected!' + '\x1b[0m');

      app.listen(PORT, () => {
        (PORT === 3000) && console.log(`Server running in: http://localhost:${PORT}`);
      });
    }

    else console.log('\x1b[1m\x1b[31m' + '[ERROR] '+ '\x1b[0m' + error.message);
  }
);