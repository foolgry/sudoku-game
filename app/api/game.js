'use server'

import { sudokulib } from "@/lib/sudokulib"
import {createGame, createUserGame, getGame, getUserGame } from "./data"

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
    const game = await getGame(gameId)
    let userGame = await getUserGame(userId, gameId)
    if (!userGame) {
        const userGameId = await createUserGame(userId, gameId)
        userGame = {id: userGameId, isOk: false, result: game.puzzle}
    }
    return {
        puzzle: sudokulib.board_string_to_grid(game.puzzle),
        userSolution: sudokulib.board_string_to_grid(userGame.result),
        isSolved: userGame.isOk,
        userGameId: userGame.id,
        gameId
    }
}