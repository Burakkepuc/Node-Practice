import express, { Express, Request, Response } from 'express';
import { PORT } from './secret'
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { notFoundHandler } from './middlewares/not-found-handler';


const app: Express = express();
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hİ!!')
})


export const prisma = new PrismaClient({
  log: ['query']
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo},${addr.city},${addr.country}-${addr.pincode}`
        }
      }
    }
  }
})

app.use('/api', rootRouter)
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log('App is working on port', PORT);
}) 