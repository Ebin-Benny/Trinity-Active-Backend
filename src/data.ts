const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fuserid: String,
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
