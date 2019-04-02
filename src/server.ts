import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import {
  addLeagueMember,
  createNewLeague,
  createNewUser,
  getLeague,
  getUserHomePage,
  updateUserSteps,
  userLookup,
} from './database';

const mongoose = require('mongoose');
const User = require('./data');
const API_PORT = 3001;
const app = express();
const router = express.Router();
const dbRoute =
  'mongodb://SWeng37:SWeng37@cluster0-shard-00-00-4spo1.mongodb.net:27017,cluster0-shard-00-01-4spo1.mongodb.net:27017,cluster0-shard-00-02-4spo1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

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

router.get('/getUserHomepage/:id', cors(), (req, res) => {
  const id = req.params.id;
  getWeek();
  if (!id) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getUserHomePage(
    id,
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

router.get('/updateUser/:id', (req, res) => {
  const id = req.params.id;
  const userSteps = req.query.steps;
  console.log(id + '  ' + userSteps);
  if (!userSteps) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  updateUserSteps(
    id,
    userSteps,
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

router.get('/userLookup/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  if (!id) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  userLookup(
    id,
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

router.get('/getLeague/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getLeague(
    id,
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

router.post('/createNewUser/:id', cors(), (req, res) => {
  console.log('1');
  const fuserID = req.params.id;
  const userName = req.query.name;
  const goal = 10000;
  const stepCount = req.query.steps;
  console.log('2');
  createNewUser(
    fuserID,
    userName,
    getYear(),
    getWeek(),
    getDay(),
    goal,
    stepCount,
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

router.post('/createNewLeague', cors(), (req, res) => {
  console.log('yr');
  const leagueName = req.query.name;
  const memberId = req.query.memberId;
  createNewLeague(
    makeId(),
    leagueName,
    memberId,
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

router.patch('/addLeagueMember', cors(), (req, res) => {
  console.log('yr');
  const leagueId = req.query.leagueId;
  const memberId = req.query.memberId;
  addLeagueMember(
    leagueId,
    memberId,
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

export function getDay() {
  const d = new Date();
  const currentDate = d.getDate() + '-' + (d.getMonth() + 1);
  console.log(currentDate);
  return currentDate;
}

export function getWeek() {
  const d = new Date();
  let dayInNum = d.getDay() - 1;
  if (d.getDay() === 0) {
    dayInNum = 6;
  }
  const week = d.getDate() - dayInNum + '-' + (d.getMonth() + 1);
  console.log(week);
  return week;
}

function getYear() {
  const d = new Date();
  const year = d.getFullYear();
  return year;
}

function makeId() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
