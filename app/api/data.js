'use server'
import { sql } from '@vercel/postgres';

export async function createUser() {
    try {
        const result = await sql`
    INSERT INTO users DEFAULT VALUES RETURNING id
    `;
        const insertedId = result.rows[0].id;
        console.log('createUser record ID:', insertedId);
        return insertedId;
    } catch (error) {
        console.error('Error create users:', error);
        throw error;
    }
}

export async function createGame(puzzle) {
    try {
        const result = await sql`
      INSERT INTO games (puzzle) VALUES (${puzzle}) RETURNING id
      `;
        const insertedId = result.rows[0].id;
        console.log('createGame record ID:', insertedId);
        return insertedId;
    } catch (error) {
        console.error('Error create games:', error);
        throw error;
    }
}

export async function getGame(gameId) {
    console.log('getGame', gameId)
    try {
        const result = await sql`
      SELECT * FROM games WHERE id=${gameId}
      `;
        return result.rows[0];
    } catch (error) {
        console.error('Error get games:', error);
        throw error;
    }
} 


export async function createUserGame(userId, gameId) {
    console.log('createUserGame', userId, gameId)
    const createTime = new Date();
    try {
        const result = await sql`
      INSERT INTO userGames (userId, gameId, isOk, createTime) VALUES (${userId}, ${gameId}, false, ${createTime}) RETURNING id
      `;
        const insertedId = result.rows[0].id;
        console.log('createUserGame record ID:', insertedId);
        return insertedId;
    } catch (error) {
        console.error('Error create user game:', error);
        throw error;
    }
}


export async function getUserGame(userId, gameId) {
    try {
        const result = await sql`
      SELECT * FROM userGames WHERE userId=${userId} and gameId=${gameId}
      `;
        return result.rows[0];
    } catch (error) {
        console.error('Error get user game:', error);
        throw error;
    }

}


export async function updateUserGame(id, { result, costTime, isOk }) {
    try {
        let query = 'update userGames set ';
        let params = [];

        if (result !== undefined && result !== null) {
            query += 'result=${result},';
            params.push(result);
        }

        if (costTime !== undefined && costTime !== null) {
            query += ' costTime=${costTime},';
            params.push(costTime);
        }

        if (isOk !== undefined && isOk !== null) {
            query += ' isOk=${isOk},';
            params.push(isOk);
        }

        // Remove the last comma
        query = query.slice(0, -1);

        query += ' where id=${id}';
        params.push(id);

        const res = await sql(query, ...params);
    } catch (error) {
        console.error('Error create games:', error);
        throw error;
    }
}


/**
 * createUserGameHistory
 * @returns 
 * id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        userGameId UUID,
        row smallint,
        col smallint,
        step int
 */
export async function createUserGameHistory(userGameId, row, col, step) {
    try {
        const result = await sql`
      INSERT INTO userGameHistory (userGameId, row, col, step) 
      VALUES (${userGameId}, ${row}, ${col}, ${step}) RETURNING id
      `;
        const insertedId = result.rows[0].id;
        console.log('createUserGameHistory record ID:', insertedId);
        return insertedId;
    } catch (error) {
        console.error('Error create user game history:', error);
        throw error;
    }
}