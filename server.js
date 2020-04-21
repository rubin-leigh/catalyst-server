const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;

console.log(process.env);

const client = require('twilio')(
    process.env.TWILIO_ACCOUT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

 
const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
});



app.post('/api/messages', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Content-Type', 'application/json');
    const body = req.body.body;
    const numbers = req.body.numbers;
    const bindings = numbers.map(number => {
      return JSON.stringify({ binding_type: 'sms', address: number });
    });
    console.log(bindings)
    service.notifications
  .create({
        toBinding: bindings,
        body: body
  })
  .then(notification => {
        console.log(notification.sid);
  })
  .catch(err => {
        console.error(err);
  });
  });

app.listen(PORT, () =>
  console.log('Express server is running on port ' + PORT)
);