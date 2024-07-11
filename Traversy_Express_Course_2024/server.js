import express from 'express';
import path from 'path';
import indexRouter from './routes/index.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js'
import notFound from './middleware/notFound.js'
import { fileURLToPath } from 'url';

const port = 8000;
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setup static folder
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//logger middleware
app.use(logger);
app.use('/', indexRouter);

// Global Not Found Handler
app.use(notFound)

//Error handler
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});