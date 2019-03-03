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
                multiplier: Number,
                steps: Number,
              },
            ],
            week: String,
          },
        ],
        year: String,
      },
    ],
  },
});

module.exports = mongoose.model('User', userSchema);
