import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { getUser, getUserSteps } from './database';

const mongoose = require('mongoose');
const User = require('./data');
const API_PORT = 3001;
const app = express();
const router = express.Router();
const dbRoute =
  'mongodb://SWeng37:Abc1234567@cluster0-shard-00-00-4spo1.mongodb.net:27017,cluster0-shard-00-01-4spo1.mongodb.net:27017,cluster0-shard-00-02-4spo1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

app.use(cors());

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true },
);

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

const d = new Date();

const currentDate = d.getDate() + '-' + d.getMonth();
console.log(currentDate);

router.get('/getUser', cors(), (req, res) => {
  const userName = req.query.name;
  console.log(userName);
  if (!userName) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getUser(
    userName,
    data => {
      return res.json({ data, success: true });
    },
    () => {
      return res.json({
        success: false,
      });
    },
  );
});

router.get('/getUserSteps', cors(), (req, res) => {
  const userStepsQuery = req.query.name;
  const split = userStepsQuery.split('/');
  const userName = split[0];
  const date = split[1];
  console.log(userName);
  console.log(date);
  if (!userStepsQuery || !userName || !date) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getUserSteps(
    userName,
    currentDate,
    data => {
      return res.json({ data, success: true });
    },
    () => {
      return res.json({
        success: false,
      });
    },
  );
});

// const user = new User({
//   _id: new mongoose.Types.ObjectId(),
//   name: 'John Ryan',
//   totalSteps: '20000',
//   year: [
//     { week: [{ day: [{ day: currentDate, multiplier: '1', steps: '10000' }], week: '25-02' }], year: '2019' },
//   ],
// });
// user
//   .save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(err);
//   });
