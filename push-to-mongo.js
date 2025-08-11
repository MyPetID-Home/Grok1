const { MongoClient } = require('mongodb');

async function pushToMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('locationDB');
    // Placeholder for MongoDB operations
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB error:', error);
  } finally {
    await client.close();
  }
}

pushToMongo().catch(console.error);
