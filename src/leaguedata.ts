const mongoose1 = require('mongoose');

const leagueSchema = mongoose1.Schema({
  goal: Number,
  leagueId: String,
  leagueName: String,
  members: [
    {
      dateJoined: String,
      memberId: String,
      multiplier: Number,
      name: String,
      score: Number,
    },
  ],
});

module.exports = mongoose1.model('League', leagueSchema);
