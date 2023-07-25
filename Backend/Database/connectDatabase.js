require('dotenv').config('../.env')
const { MongoClient } = require('mongodb');
// const url = process.env.MONGODB_LINK_LOCAL
const url = process.env.MONGODB_LINK_CLOUD
const client = new MongoClient(url);


const connectDatabase = async () => {
  await client.connect();
  console.log('Connected successfully to server');
  var myDB = client.db(process.env.DB_NAME);
  return myDB;
}

module.exports = connectDatabase;
