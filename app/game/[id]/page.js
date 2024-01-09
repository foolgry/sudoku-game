'use client';
import Sudoku from '@/components/sudoku'
import { saveLocalData, getLocalData, saveTmpData } from '@/lib/utils';
import { createUser } from "@/app/api/data"
import { getUserGames } from "@/app/api/game"
import { useState, useEffect } from 'react';
import { copyPuzzle } from '@/lib/utils'

async function initializeGame(id) {
  let userId, gameId;
  const local = getLocalData();
  if (local) {
    userId = local.userId;
    gameId = local.gameId;
  }

  if (!userId) {
    userId = await createUser()
  }

  gameId = id || gameId
  if (gameId) {
    const data = await getUserGames(userId, gameId)
    let { puzzle, userSolution, isSolved, userGameId } = data;
    if (!userSolution || userSolution.length === 0) {
      userSolution = copyPuzzle(puzzle);
    }
    saveTmpData({ puzzle, userSolution, isSolved, userGameId })
    return { puzzle, userSolution, isSolved, userGameId };
  }

  saveLocalData({ userId, gameId })
}

export default function Page({ params }) {
  const id = params.id;
  const [sudokuData, setSudokuData] = useState(null);

  useEffect(() => {
    initializeGame(id).then(data => setSudokuData(data));
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {sudokuData ? <Sudoku data={sudokuData} /> : <div>Loading...</div>}
    </main>
  )
}
