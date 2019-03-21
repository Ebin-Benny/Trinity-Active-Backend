import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { resolve } from 'url';
import { getUser, getUserHomePage, getUserSteps, updateUserSteps } from './database';

const mongoose = require('mongoose');
const User = require('./data');
const League = require('./data');
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

router.get('/getUserHomepage/:id', cors(), (req, res) => {
  const id = req.params.userID;
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

// router.post('/:userID', (req, res, next) => {
//   const id = req.params.userID;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   updateUserSteps(
//     id,
//     data => {
//       return res.json({ data, success: true });
//     },
//     () => {
//       return res.json({
//         success: false,
//       });
//     },
//   );
// });

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
  const currentDate = d.getDate() + '-' + d.getMonth() + 1;
  // console.log(currentDate);
  return currentDate;
}

// const user = new User({
//   _id: new mongoose.Types.ObjectId(),
//   name: 'Dave Yurt',
//   totalSteps: '100000',
//   year: [
//     {
//       week: [
//         {
//           day: [{ day: '16-3', goal: '20000', steps: '18000' }, { day: '17-3', goal: '20000',steps: '15000' }],
//           week: '11-3',
//         },
//         {
//           day: [
//             { day: '18-3', goal: '20000', steps: '13000' }
//            // { day: getDay(), multiplier: '2', steps: '21000' },
//           ],
//           week: '18-3',
//         },
//       ],
//       year: '2019',
//     },
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

const league = new League({
  // _id: new mongoose.Types.ObjectId(),
  leagueName: 'Group 37',
  members: [
    {
      memberId: '5c922bb005ab5f61938c9135',
      multiplier: '2',
    },
    {
      memberId: '5c90f90d81c4aa258c62516d',
      multiplier: '2.5',
    },
  ],
});
league
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
