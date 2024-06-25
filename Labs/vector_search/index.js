require('dotenv').config();
const { MongoClient } = require('mongodb');
const {OpenAIClient, AzureKeyCredential} = require("@azure/openai");

// set up the MongoDB client
const dbClient = new MongoClient(process.env.MONGODB_URI);
// set up the Azure OpenAI client
const embeddingsDeploymentName = "embeddings";
const completionsDeploymentName = "completions";
const aoaiClient = new OpenAIClient(
  "https://udvale-openai.openai.azure.com/",
  new AzureKeyCredential("c9c7094d18a6487aba714e8d8e756338")
);
// const aoaiClient = new OpenAIClient(
//   process.env.AOAI_ENDPOINT,
//   new AzureKeyCredential(process.env.AOAI_KEY)
// );

async function main() {
  try {
    await dbClient.connect();
    console.log("Connected to MongoDB");
    const db = dbClient.db("cosmic_works");
    console.log(await generateEmbeddings("Hello, world!"));
  } catch (err) {
    console.error(err);
  } finally {
    await dbClient.close();
    console.log("Disconnected from MongoDB");
  }
  async function generateEmbeddings(text) {
    const embeddings = await aoaiClient.getEmbeddings(
      embeddingsDeploymentName,
      text
    );
    // Rest period to avoid rate limiting on Azure OpenAI
    await new Promise((resolve) => setTimeout(resolve, 500));
    return embeddings.data[0].embedding;
  }
}

main().catch(console.error);