
'use client';
import Sudoku from '@/components/sudoku'
import { saveLocalData, getLocalData, saveTmpData, getTmpData } from '@/lib/utils';
import { createUser } from "@/app/api/data"
import { getUserGames } from "@/app/api/game"
import { useState , useEffect} from 'react';
import {copyPuzzle} from '@/lib/utils'

export default function Page({ params }) {
  const id = params.id;

  console.log('page id', id)

  const [sudokuData, setSudokuData] = useState(null);

  useEffect(() => {

    const init = async () => {
      // get user id from local storage
      let userId, gameId;
      const local = getLocalData();
      console.log({local})
      if (local) {
        userId = local.userId;
        gameId = local.gameId;
      }
  
      if (!userId) {
        // create user
        userId = await createUser()
        console.log('create user id', userId);
      }
  
      gameId = id || gameId
      if (gameId) {
        console.log({ gameId })
        const data = await getUserGames(userId, gameId)
        console.log("get user game", data)
        let { puzzle, userSolution, isSolved, userGameId } = data;
        if (!userSolution || userSolution.length === 0) {
            userSolution = copyPuzzle(puzzle);
        }
        saveTmpData({ puzzle, userSolution, isSolved, userGameId })
        setSudokuData({ initPuzzle: puzzle, initUserSolution: userSolution, initIsSolved: isSolved })
      }
  
      saveLocalData({ userId, gameId })
    }

    init()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {sudokuData ? <Sudoku data={sudokuData} /> : <div>Loading...</div>}
    </main>
  )
}