"use client"
import Sudoku from '../components/sudoku'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Sudoku />
    </main>
  )
}
