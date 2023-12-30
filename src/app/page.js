"use client"
import Sudoku from './sudoku/mySudoku'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Sudoku />
    </main>
  )
}
