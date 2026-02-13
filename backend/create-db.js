const { Client } = require('pg');
require('dotenv').config();

const targetDbName = 'gym_access_marketplace';

// Create a connection string to the 'postgres' database to perform administrative tasks
const connectionString = process.env.DATABASE_URL.replace(`/${targetDbName}`, '/postgres');

const client = new Client({
    connectionString: connectionString,
});

async function createDatabase() {
    try {
        await client.connect();
        console.log('Connected to postgres database');

        // Check if database exists
        const checkRes = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${targetDbName}'`);
        if (checkRes.rowCount === 0) {
            console.log(`Database ${targetDbName} does not exist. Creating...`);
            await client.query(`CREATE DATABASE ${targetDbName}`);
            console.log(`Database ${targetDbName} created successfully.`);
        } else {
            console.log(`Database ${targetDbName} already exists.`);
        }

    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
