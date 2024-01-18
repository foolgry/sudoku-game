"use client"

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { createUserGames, updateUserSolution } from '@/app/api/game';
import { getLocalData, saveLocalData } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

const SudokuGame = (params) => {
  noStore();
  const copyPuzzle = (puzzles) => {
    return puzzles.map((r) =>
      r.map((cell) => cell)
    );
  };

  const [puzzle, setPuzzle] = useState(Array(9).fill(Array(9).fill(null)));
  const [userSolution, setUserSolution] = useState(Array(9).fill(Array(9).fill(null)));
  const [isSolved, setIsSolved] = useState(false);
  const [errorCells, setErrorCells] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userGameId, setUserGameId] = useState(null);
  const [step, setStep] = useState(0);
  const { replace } = useRouter()

  useEffect(() => {
    console.log('data', params.data)
    const { puzzle, userSolution, isSolved, userGameId } = params.data
    if (puzzle) {
      setPuzzle(puzzle);
      setUserSolution(userSolution);
      setIsSolved(isSolved);
      setUserGameId(userGameId);
    }

    const { userId, gameId } = getLocalData()
    setUserId(userId)
  }, []);

  const handleGeneratePuzzle = async (level) => {
    const { puzzle, gameId, userGameId } = await createUserGames(userId, level)
    setPuzzle(puzzle);
    setUserGameId(userGameId);
    setUserSolution(() => copyPuzzle(puzzle));
    setIsSolved(false);
    saveLocalData({ userId, gameId });
    replace(`/game/${gameId}`)
  }

  // 检查所有格子是否正确
  const handleCheckSolution = () => {
    const isSolved = checkFillAll(userSolution) && checkSolution(userSolution);
    setIsSolved(isSolved);
  };

  const checkFillAll = (userSolution) => {
    for (let i = 0; i < 9; i++) {
      if (userSolution[i].includes(null)) return false;
    }
    return true;
  }

  // 检查用户解答的函数
  const checkSolution = (userSolution) => {
    const hasDuplicates = (arr) => {
      arr = arr.filter(el => el != null);
      return new Set(arr).size !== arr.length;
    }

    for (let i = 0; i < 9; i++) {
      if (hasDuplicates(userSolution[i]) || hasDuplicates(userSolution.map(row => row[i]))) return false;
    }

    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        let square = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            square.push(userSolution[row + i][col + j]);
          }
        }
        if (hasDuplicates(square)) return false;
      }
    }

    return true;
  };

  const handleCellChange = (row, col, value) => {
    // 更新用户解答
    const updatedUserSolution = userSolution.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
    );
    setUserSolution(updatedUserSolution);
    // 检查这一步是否正确
    if (value === null) {
      setErrorCells([]);
      return;
    };
    if (value < 1 || value > 9) {
      setErrorCells([row, col]);
      setIsSolved(false);
      return;
    }

    const right = checkSolution(updatedUserSolution)
    if (!right) {
      setErrorCells([row, col]);
      return;
    } else if (checkFillAll(updatedUserSolution)) {
      setIsSolved(true);
      setErrorCells([]);
      return;
    }
    setErrorCells([]);
    setIsSolved(false);
  };

  const handleBlur = (row, col, value) => {
    // 更新用户解答
    if (!value) {
      return;
    }
    setStep(step + 1)
    updateUserSolution(userGameId, userSolution, isSolved, row, col, value, step)
  }

  const isErrorCell = (row, col) => {
    return errorCells[0] === row && errorCells[1] === col;
  }

  const borderStyle = (row, col) => {
    let style = ''
    if (row == 0 || row == 3 || row == 6) {
      style += 'border-t-gray-600 '
    }
    if (row == 2 || row == 5 || row == 8) {
      style += 'border-b-gray-600 '
    }
    if (col == 0 || col == 3 || col == 6) {
      style += 'border-l-gray-600 '
    }
    if (col == 2 || col == 5 || col == 8) {
      style += 'border-r-gray-600 '
    }
    return style
  }

  return (
    <div>
      {/* 数独格子 */}
      <div className="grid grid-cols-9 gap-0">
        {puzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              min="1"
              max="9"
              value={userSolution[rowIndex][colIndex] ?? ''}
              onChange={(e) => handleCellChange(rowIndex, colIndex, parseInt(e.target.value) || null)}
              onBlur={(e) => handleBlur(rowIndex, colIndex, parseInt(e.target.value))}
              disabled={cell !== null}
              className={clsx(
                'w-12 h-12 text-center border border-gray-300 rounded',
                isErrorCell(rowIndex, colIndex) ? 'text-red-500' : '',
                borderStyle(rowIndex, colIndex)
              )}
            />
          ))
        )}
      </div>

      {/* 按钮：检查解答、生成新题目 */}
      <div className="mt-4">

        <button onClick={() => handleGeneratePuzzle('easy')} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
          easy
        </button>
        <button onClick={() => handleGeneratePuzzle('medium')} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
          medium
        </button>
        <button onClick={() => handleGeneratePuzzle('hard')} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
          hard
        </button>
        <button onClick={() => handleGeneratePuzzle('very-hard')} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
          very-hard
        </button>

      </div>
      <div className="mt-4">
        <button onClick={handleCheckSolution} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded">
          check solution
        </button>
      </div>

      {/* 提示信息 */}
      {isSolved && <p className="mt-4 text-green-500">恭喜你，解答正确！</p>}
    </div>
  );
};

export default SudokuGame;
