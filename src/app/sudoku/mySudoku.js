"use client"

import { useState, useEffect } from 'react';
import Sudoku from '../lib/Sudoku';

const sudokuObj = Sudoku();

function generateSudoku(level) {
  const puzzleStr = sudokuObj.generate(level)
  const puzzle = sudokuObj.board_string_to_grid(puzzleStr);
  console.log(puzzle)
  return puzzle;
}

// 检查用户解答的函数
const checkSolution = (userSolution, isAll) => {
  const hasDuplicates = (arr) => {
    const checkArr = isAll ? arr : arr.filter(el => el != null);
    return new Set(checkArr).size !== checkArr.length;
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

const SudokuGame = () => {
  
  const copyPuzzle = (puzzles) => {
    return puzzles.map((r) =>
      r.map((cell) => cell)
    );
  };

  const [puzzle, setPuzzle] = useState(Array(9).fill(Array(9).fill(null)));
  const [userSolution, setUserSolution] = useState(Array(9).fill(Array(9).fill(null)));
  const [isSolved, setIsSolved] = useState(false);
  const [errorCells, setErrorCells] = useState([]);

  useEffect(() => {
    handleGeneratePuzzle('easy');
  }, []);

  // 检查所有格子是否正确
  const handleCheckSolution = () => {
    const isSolved = checkSolution(userSolution, true);
    setIsSolved(isSolved);
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
      return;
    }
    if (!checkSolution(updatedUserSolution, false)) {
      setErrorCells([row, col]);
      return;
    }
    setErrorCells([]);
  };

  const handleGeneratePuzzle = (level) => {
    const puzzle = generateSudoku(level)
    setPuzzle(puzzle);
    setUserSolution(() => copyPuzzle(puzzle));
    setIsSolved(false);
  };

  const isErrorCell = (row, col) => {
    return errorCells[0] === row && errorCells[1] === col;
  }

  return (
    <div>
      {/* 数独格子 */}
      <div className="grid grid-cols-9 gap-1">
        {puzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              min="1"
              max="9"
              value={userSolution[rowIndex][colIndex] ?? ''}
              onChange={(e) => handleCellChange(rowIndex, colIndex, parseInt(e.target.value) || null)}
              disabled={cell !== null}
              className={`w-10 h-10 text-center border border-gray-300 rounded ${isErrorCell(rowIndex, colIndex) ? 'text-red-500' : ''}`}
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
        {/* <button onClick={(e) => handleGeneratePuzzle(e, 'insane')} className="mx-2 px-4 py-2 bg-green-500 text-white rounded">
        insane
        </button> */}
        
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
