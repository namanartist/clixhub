const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
    console.log('Testing direct MongoDB connection...');
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('SUCCESS: Connected successfully to server');
    } catch (err) {
        console.error('FAILED: Connection error details follow:');
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
