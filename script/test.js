

const { db } = require('@vercel/postgres');

async function userGames(client) {
  try {
    const rs = await client.sql`
    SELECT * FROM userGames WHERE gameid='6dd7dc45-a9c6-4316-98b6-fbc1d7797898' and userid='6fb913a4-551b-4cdb-85ff-ff4afdac7d9c'
    `;

    console.log(rs.rows);

  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
}


async function main() {
    const client = await db.connect();
  
    await userGames(client);
  
    await client.end();
  }
  
  main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });