const { db } = require('@vercel/postgres');

async function createUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
      );
    `;

    console.log('table users created');

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}


async function createGames(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "games" table if it doesn't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS games (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        puzzle VARCHAR(100)
      );
    `;

    console.log('table games created');
  } catch (error) {
    console.error('Error seeding games:', error);
    throw error;
  }
}

async function createUserGames(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS userGames (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        userId UUID,
        gameId UUID,
        result VARCHAR(100),
        costTime integer,
        isOk BOOLEAN,
        createTime TIMESTAMP
      );
    `;

    console.log('table userGames created');
  } catch (error) {
    console.error('Error create UserGames:', error);
    throw error;
  }
}


async function createUserGameHistory(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS userGameHistory (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        userGameId UUID,
        row smallint,
        col smallint,
        val smallint,
        step int
      );
    `;

    console.log('table userGameHistory created');

  } catch (error) {
    console.error('Error create GameHistory:', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await createUsers(client);
  await createGames(client);
  await createUserGames(client);
  await createUserGameHistory(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
