'use client';

export function saveLocalData({ userId, gameId }) {
    window.localStorage.setItem('sudoku', JSON.stringify({ userId, gameId }));
}

export function saveTmpData(data) {
    window.localStorage.setItem('sudoku-tmp', JSON.stringify(data));
}

export function getLocalData() {
    return JSON.parse(window.localStorage.getItem('sudoku'));
}

export function getTmpData() {
    return JSON.parse(window.localStorage.getItem('sudoku-tmp'));
}

export function copyPuzzle(puzzles) {
    return puzzles.map((r) =>
        r.map((cell) => cell)
    );
};