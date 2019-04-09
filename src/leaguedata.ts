const mongoose1 = require('mongoose');

const leagueSchema = mongoose1.Schema({
  goal: Number,
  leagueId: String,
  leagueName: String,
  members: [
    {
      memberId: String,
      multiplier: Number,
      name: String,
      score: Number,
      updatedToday: Boolean,
    },
  ],
});

module.exports = mongoose1.model('League', leagueSchema);
