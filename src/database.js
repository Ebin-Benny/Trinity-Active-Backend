//const uri = "mongodb+srv://SWeng37:Abc1234567@cluster0-4spo1.mongodb.net/test?";
import insert from "data.js";
let mongoose = require('mongoose');
const server = 'mongodb://SWeng37:Abc1234567@cluster0-shard-00-00-4spo1.mongodb.net:27017,cluster0-shard-00-01-4spo1.mongodb.net:27017,cluster0-shard-00-02-4spo1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'; // REPLACE WITH YOUR DB SERVER
const database = 'SWeng37';      // REPLACE WITH YOUR DB NAME
class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
         insert();
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()
