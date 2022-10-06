const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

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

app.use(express.json());

app.use(require('./routes/routes'));

app.use('/', require('./middlewares/auth'));

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));
app.use('*', require('./routes/notCorrectPath'));
