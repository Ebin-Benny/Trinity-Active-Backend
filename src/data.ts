const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  totalSteps: Number,
  year: {
    index: false,
    type: [
      {
        week: [
          {
            day: [
              {
                day: String,
                goal: Number,
                steps: Number,
              },
            ],
            week: String,
          },
        ],
        year: Number,
      },
    ],
  },
});
module.exports = mongoose.model('User', userSchema);

// const leagueSchema = mongoose.Schema({
//   leagueId: String,
//   leagueName: String,
//   members: [
//     {
//       memberId: String,
//       multiplier: Number,
//       score: Number,
//     },
//   ],
// });

// module.exports = mongoose.model('League', leagueSchema);
