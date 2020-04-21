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
// app.use(cors({
//   origin: '*'
// }));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://catalyst-greece.herokuapp.com/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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



app.post('/api/messages', cors(), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://catalyst-greece.herokuapp.com/');
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