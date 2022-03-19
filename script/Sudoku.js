import { CONST } from "./GlobalVariable.js"
import Utils from "./Utils.js";

export default class Sudoku {
    static SIZE = 9;
    static SUB_GRID_SIZE = 3;
    static NUMB_SQUARES = this.SIZE * this.SIZE;
    constructor() {
        this.GRID = [];
        this.createZeroGrid();
        this.fillRandomValueIntoGrid();
    }

    createZeroGrid() {
        for (let i = 0; i < Sudoku.SIZE; i++) {
            this.GRID[i] = Array(Sudoku.SIZE).fill(0);
        }
    }

    fillRandomValueIntoGrid() {
        let row, col;
        for (let i = 0; i < Sudoku.NUMB_SQUARES; i++) {
            row = Math.floor(i / Sudoku.SIZE);
            col = i % Sudoku.SIZE;

            if (this.GRID[row][col] != 0) continue;

            for (const value of Utils.getRandomNumbsFromOneToNine()) {
                //check value do not exist in row
                if (this.GRID[row].includes(value)) continue;

                //check value do not exist in col
                if (Utils.checkValueExistAtCol(this.GRID, col, value)) continue;

                //check value do not exist SubGrid - 3x3 square
                let subGrid = this.getSubGridAt(
                    Math.floor(col / Sudoku.SUB_GRID_SIZE),
                    Math.floor(row / Sudoku.SUB_GRID_SIZE)
                );
                if (subGrid.includes(value)) continue;

                this.GRID[row][col] = value;
                if (this.isFullGrid())
                    return true;
                else {
                    if (this.fillRandomValueIntoGrid())
                        return true;
                }
            }

            break;
        }
        this.GRID[row][col] = 0;
    }

    isFullGrid(grid = this.GRID) {
        for (let r = 0; r < Sudoku.SIZE; r++) {
            for (let c = 0; c < Sudoku.SIZE; c++) {
                if (grid[r][c] == 0) return false;
            }
        }
        return true;
    }

    getSubGridAt(x, y, grid = this.GRID) {
        let arr = [];
        for (let i = 0; i < Sudoku.SIZE; i++) {
            let c = x * Sudoku.SUB_GRID_SIZE + i % Sudoku.SUB_GRID_SIZE;
            let r = y * Sudoku.SUB_GRID_SIZE + Math.floor(i / Sudoku.SUB_GRID_SIZE);
            arr[i] = grid[r][c];
        }
        return arr;
    }
}