let mongoose = require('mongoose')
let validator = require('validator')
let dataSchema = new mongoose.Schema({
    "userid": String,
    "years":[
      { "year": int,
        "weeks":[
            {
              "week": sString,
              "days": [
                {"day": String, "steps": int, "multiplier": double},
              ]
            }
          ]
        }
    ]
  })

  module.exports = mongoose.model('UserModel', dataSchema);