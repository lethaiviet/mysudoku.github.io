import Direction from "./Direction.js";
import { CONST } from "./GlobalVariable.js"
import Sudoku from "./Sudoku.js";
import Utils from "./Utils.js";

export default class SudokuGraphic {
    static BLOCK_SIZE = CONST.SQUARE_SIZE;
    static GRID_SIZE = Sudoku.SIZE * SudokuGraphic.BLOCK_SIZE;
    static TEXT_SIZE = SudokuGraphic.BLOCK_SIZE * 0.7;
    static PADDING = 10;

    static STYLE = {
        thinLine: 'gray',
        thickLine: 'black',
        backGround: 'white',
        numbText: '#3C5068',
        selectedArea: '#E2EBF3',
        selectedBlock: '#BBDEFB',
        selectedBlockValue: '#C3D7EA',
        numbTextFont: `300 ${SudokuGraphic.TEXT_SIZE}px Inter`,
    };

    constructor(canvas, sudoku) {
        this.canvas = canvas;
        this.sudoku = sudoku;
        this.autoResizeCanvas();
        this.ctx = this.canvas.getContext('2d');

        //MAP_BLOCK contains all the vertices of block
        //Ex: MAP_BLOCK[0][0].topLeft.x is the x coordinate top left of the block at (0,0)
        this.MAP_BLOCK = [];
        this.initMapBlock();
    }

    autoResizeCanvas() {
        this.canvas.width = SudokuGraphic.GRID_SIZE + SudokuGraphic.PADDING;
        this.canvas.height = this.canvas.width;
    }

    initMapBlock() {
        const topLeftGrid = { x: SudokuGraphic.PADDING / 2, y: SudokuGraphic.PADDING / 2 };
        const N = Sudoku.SIZE + 1;
        const distance = SudokuGraphic.BLOCK_SIZE;

        for (let r = 0; r < N; r++) {
            this.MAP_BLOCK[r] = [];
            for (let c = 0; c < N; c++) {
                let topLeft = {
                    x: topLeftGrid.x + c * distance,
                    y: topLeftGrid.y + r * distance
                };

                let topRight = Utils.getPosByDirection(topLeft, Direction.RIGHT, distance);
                let bottomLeft = Utils.getPosByDirection(topLeft, Direction.DOWN, distance);
                let bottomRight = Utils.getPosByDirection(topLeft, Direction.DOWN_RIGHT, distance);
                let center = Utils.getPosByDirection(topLeft, Direction.DOWN_RIGHT, distance * 0.5);

                this.MAP_BLOCK[r][c] = {
                    topLeft: topLeft,
                    topRight: topRight,
                    bottomLeft: bottomLeft,
                    bottomRight: bottomRight,
                    center: center
                }
            }
        }
    }

    clearEntireSudoku() {
        this.ctx.clearRect(
            this.MAP_BLOCK[0][0].topLeft.x,
            this.MAP_BLOCK[0][0].topLeft.y,
            SudokuGraphic.GRID_SIZE,
            SudokuGraphic.GRID_SIZE
        );
    }

    drawBackGround() {
        this.ctx.fillStyle = SudokuGraphic.STYLE.backGround;
        this.ctx.fillRect(0, 0, CONST.FULL_SCREEN.w, CONST.FULL_SCREEN.h);
    }

    drawGridSudoku() {
        const N = Sudoku.SIZE + 1;

        for (let i = 0; i < N; i++) {
            this.ctx.beginPath();

            (i % 3 == 0) ? this.setThickLineStyle(): this.setThinLineStyle();

            this.ctx.moveTo(this.MAP_BLOCK[i][0].topLeft.x, this.MAP_BLOCK[i][0].topLeft.y);
            this.ctx.lineTo(this.MAP_BLOCK[i][9].topLeft.x, this.MAP_BLOCK[i][9].topLeft.y);
            this.ctx.stroke();

            this.ctx.moveTo(this.MAP_BLOCK[0][i].topLeft.x, this.MAP_BLOCK[0][i].topLeft.y);
            this.ctx.lineTo(this.MAP_BLOCK[9][i].topLeft.x, this.MAP_BLOCK[9][i].topLeft.y);
            this.ctx.stroke();
        }
    }

    drawNumberIntoGrid() {
        for (let r = 0; r < Sudoku.SIZE; r++) {
            for (let c = 0; c < Sudoku.SIZE; c++) {
                this.drawNumberAtIdxBlock(r, c);
            }
        }
    }

    drawNumberAtIdxBlock(r, c) {
        this.drawNumberAt(this.sudoku.GRID[r][c], this.MAP_BLOCK[r][c].center);
    }

    drawNumberAt(num, center) {
        if (num == 0) return;
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = SudokuGraphic.STYLE.numbText;
        this.ctx.font = SudokuGraphic.STYLE.numbTextFont;

        const wText = this.ctx.measureText(num).width;
        const hText = this.ctx.measureText('M').width;

        this.ctx.fillText(num, center.x - wText / 2, center.y + hText / 2, wText);
        this.ctx.stroke();
    }

    fillColorSelectedAreaByIdx(idx) {
        this.clearEntireSudoku();
        this.fillColorBlocksInRowAndColByIdx(idx);
        this.fillColorBlocksInSubGridByIdx(idx);
        this.fillColorBlockByValue(idx);
        this.fillColorBlockByIdx(idx, SudokuGraphic.STYLE.selectedBlock);
        this.drawGridSudoku();
        this.drawNumberIntoGrid();
    }

    fillColorSelectedAreaByPosition(pos) {
        if (!this.isInsideGrid(pos)) return;
        const idx = this.findIdxBlockByPos(pos);
        this.fillColorSelectedAreaByIdx(idx);
    }

    fillColorBlockByIdx(idx, fillStyle) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(
            this.MAP_BLOCK[idx.r][idx.c].topLeft.x,
            this.MAP_BLOCK[idx.r][idx.c].topLeft.y,
            SudokuGraphic.BLOCK_SIZE,
            SudokuGraphic.BLOCK_SIZE
        );
    }

    fillColorBlocksInRowAndColByIdx(idx) {
        for (let i = 0; i < Sudoku.SIZE; i++) {
            this.fillColorBlockByIdx({ r: idx.r, c: i }, SudokuGraphic.STYLE.selectedArea);
            this.fillColorBlockByIdx({ r: i, c: idx.c }, SudokuGraphic.STYLE.selectedArea);
        }
    }

    fillColorBlocksInSubGridByIdx(idx) {
        let n = Sudoku.SUB_GRID_SIZE;
        let y = Math.floor(idx.r / n);
        let x = Math.floor(idx.c / n);
        for (let i = 0; i < Sudoku.SIZE; i++) {
            let c = x * n + i % n;
            let r = y * n + Math.floor(i / n);
            this.fillColorBlockByIdx({ r: r, c: c }, SudokuGraphic.STYLE.selectedArea);
        }
    }

    fillColorBlockByValue(idx) {
        let value = this.sudoku.GRID[idx.r][idx.c];
        for (let r = 0; r < Sudoku.SIZE; r++) {
            for (let c = 0; c < Sudoku.SIZE; c++) {
                if (value == 0 || value != this.sudoku.GRID[r][c]) continue;
                this.fillColorBlockByIdx({ r: r, c: c }, SudokuGraphic.STYLE.selectedBlockValue);
            }
        }
    }

    isInsideGrid(pos) {
        return Utils.isInsideSquare(pos, this.MAP_BLOCK[0][0].topLeft, SudokuGraphic.GRID_SIZE);
    }


    findColIdxBlockByPos(pos) {
        for (let i = 0; i < Sudoku.SIZE; i++) {
            if (pos.x > this.MAP_BLOCK[0][i].topLeft.x &&
                pos.x < this.MAP_BLOCK[0][i].topRight.x) {
                return i;
            }
        }
        return -1;
    }

    findRowIdxBlockByPos(pos) {
        for (let i = 0; i < Sudoku.SIZE; i++) {
            if (pos.y > this.MAP_BLOCK[i][0].topLeft.y &&
                pos.y < this.MAP_BLOCK[i][0].bottomLeft.y) {
                return i;
            }
        }
        return -1;
    }

    findIdxBlockByPos(pos) {
        return {
            c: this.findColIdxBlockByPos(pos),
            r: this.findRowIdxBlockByPos(pos)
        };
    }

    setThinLineStyle() {
        this.ctx.strokeStyle = SudokuGraphic.STYLE.thinLine;
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineWidth = 1;
    }

    setThickLineStyle() {
        this.ctx.strokeStyle = SudokuGraphic.STYLE.thickLine;
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = 2;
    }
}