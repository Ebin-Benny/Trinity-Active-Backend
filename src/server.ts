import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import mongoose from 'mongoose';
import logger from 'morgan';
// import * as request from 'request'
import { getUsers } from './database';

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

// getUsers();
const yearArr: string[] = [];
// yearArr.push('2019');
const user = new User({
  _id: new mongoose.Types.ObjectId(),
  name: 'dave',
  year: [
    { week: [{ day: [{ day: '01-03', multiplier: '1', steps: '10000' }], week: '25-02' }], year: '2019' },
    { year: '2018' },
  ],
});
user
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
