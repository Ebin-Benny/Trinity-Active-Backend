const mongoose1 = require('mongoose');

const leagueSchema = mongoose1.Schema({
  leagueId: String,
  leagueName: String,
  members: [
    {
      memberId: String,
      multiplier: Number,
      score: Number,
    },
  ],
});

module.exports = mongoose1.model('League', leagueSchema);
