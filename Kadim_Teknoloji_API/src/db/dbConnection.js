const mongoose = require('mongoose')


mongoose.connect(process.env.DB_URL).then(() => {
  console.log('Database connect is done');
}).catch((err) => {
  console.log('Database error: ' + err);
})