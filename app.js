require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/rateLimiter');

const { PORT = 3000 } = process.env;
const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./errors/errorhandler');
const cors = require('./middlewares/cors');

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    await app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

app.use(helmet());
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(limiter);
app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
