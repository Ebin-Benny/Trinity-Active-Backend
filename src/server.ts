import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { resolve } from 'url';
import { getUser, getUserSteps, updateUserSteps } from './database';

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

router.get('/getUser', cors(), (req, res) => {
  const userName = req.query.name;
  // console.log(req);
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
  // console.log(res);
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
    getDay(),
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

// var dayNum = d.getDay();
// if(dayNum = 1{})

router.post('/:userID', (req, res, next) => {
  const id = req.params.userID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  updateUserSteps(
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

// db.collection.update(
//   { _id : ObjectId("57315ba4846dd82425ca2408")},
//   { $pull: {"myarray.userId": ObjectId("570ca5e48dbe673802c2d035")}}
// )
// db.collection.update(
//   { _id : ObjectId("57315ba4846dd82425ca2408")},
//   { $push: {"myarray": {
//       userId:ObjectId("570ca5e48dbe673802c2d035"),
//       point: 10
//   }}
// )

// router.patch('/:productId', (req, res, next) => {
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
// updateUserSteps(
//   id,
//   data => {
//     return res.json({ data, success: true });
//   },
//   () => {
//     return res.json({
//       success: false,
//     });
//   },
// );
// });

router.patch('/:userId', (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

function getDay() {
  const d = new Date();
  const currentDate = d.getDate() + '-' + d.getMonth();
  // console.log(currentDate);
  return currentDate;
}

const user = new User({
  _id: new mongoose.Types.ObjectId(),
  name: 'Johnny Yurt',
  totalSteps: '100000',
  year: [
    {
      week: [
        {
          day: [{ day: '16-3', multiplier: '1', steps: '18000' }, { day: '17-3', multiplier: '1.5', steps: '15000' }],
          week: '11-3',
        },
        {
          day: [
            { day: '18-3', multiplier: '1.75', steps: '13000' },
            { day: getDay(), multiplier: '2', steps: '21000' },
          ],
          week: '18-3',
        },
      ],
      year: '2019',
    },
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
