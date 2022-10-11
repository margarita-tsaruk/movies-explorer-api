const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./errors/errorhandler');
const cors = require('./middlewares/cors');

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
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

app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.use(require('./routes/routes'));

app.use('/', require('./middlewares/auth'));

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));
app.use('*', require('./routes/notCorrectPath'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
