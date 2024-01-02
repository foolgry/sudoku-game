"use client"
import { saveLocalData, getLocalData, saveTmpData } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { getUserGames, createUserGames } from "@/app/api/game"
import { createUser } from "@/app/api/data"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  const [curGameId, setCurGameId] = useState(null)

  const init = async () => {
    // get user id from local storage
    let userId, gameId;
    const localData = getLocalData();
    if (localData) {
      userId = localData.userId;
      gameId = localData.gameId;
    }

    if (!userId) {
      // create user
      userId = await createUser()
      console.log('create user id', userId);
    }

    if (gameId) {
      console.log({ gameId })
      const data = await getUserGames(userId, gameId)
      console.log("get user game", data)
      const { puzzle, userSolution, isSolved, userGameId } = data;
      saveTmpData({ puzzle, userSolution, isSolved, userGameId })
    } else {
      // create game
      const data = await createUserGames()
      const { userGameId, puzzle } = data
      gameId = data.gameId
      saveTmpData({ puzzle, isSolved: false, userGameId })
    }

    saveLocalData({ userId, gameId })
    return { userId, gameId }
  }

  useEffect(() => {
    init().then(({ gameId }) => {
        setCurGameId(gameId)
    })
  }, [])

  useEffect(() => {
    if (curGameId) {
      router.push(`/game/${curGameId}`)
    }
  }, [curGameId])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )
}
