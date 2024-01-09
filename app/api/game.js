import { sudokulib } from "@/lib/sudokulib"
import { createGame, createUserGame, createUserGameHistory, getGame, getUserGame, updateUserGame } from "./data"
import { unstable_noStore as noStore } from 'next/cache';

export async function createUserGames(userId, level) {
    const puzzleStr = sudokulib.generate(level)
    const gameId = await createGame(puzzleStr)
    const userGameId = createUserGame(userId, gameId)
    const puzzle = sudokulib.board_string_to_grid(puzzleStr)
    return {
        puzzle,
        gameId,
        userGameId
    }
}

export async function getUserGames(userId, gameId) {
    noStore();
    const game = await getGame(gameId)
    let userGame = await getUserGame(userId, gameId)
    console.log("getUserGames2", { userGame })
    if (!userGame) {
        const userGameId = await createUserGame(userId, gameId)
        userGame = { id: userGameId, isOk: false, usersolution: game.puzzle }
    }
    // console.log("getUserGames", {game, userGame})
    return {
        puzzle: sudokulib.board_string_to_grid(game.puzzle),
        userSolution: sudokulib.board_string_to_grid(userGame.usersolution),
        isSolved: userGame.isOk,
        userGameId: userGame.id,
        gameId
    }
}

export async function updateUserSolution(userGameId, userSolution, isSolved, row, col, val, step) {
    const userSolutionStr = sudokulib.board_grid_to_string(userSolution)
    console.log({ userSolutionStr })
    updateUserGame(userGameId, userSolutionStr, 0, isSolved)
    createUserGameHistory(userGameId, row, col, val, step)
}