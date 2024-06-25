require('dotenv').config();
const {MongoClient} = require("mongodb");

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  // const db = client.db("cosmic_works");
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}
main().catch(console.error);