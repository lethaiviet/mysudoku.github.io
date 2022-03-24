import {
    CONST
} from './GlobalVariable.js';

export default class Utils {
    static getPosByDirection(startPos, direction, distance) {
        return {
            x: startPos.x + direction.vector[0] * distance,
            y: startPos.y + direction.vector[1] * distance
        };
    }

    static getRandomNumbsFromOneToNine() {
        const newArr = CONST.NUMBS.slice()
        for (let i = newArr.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr
    }

    static randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static checkValueExistAtCol(matrix, c, value) {
        for (let r = 0; r < matrix.length; r++) {
            if (value == matrix[r][c]) return true;
        }
        return false;
    }

    static isInsideRect(pos, topLeft, width, height) {
        return pos.x >= topLeft.x &&
            pos.x <= topLeft.x + width &&
            pos.y >= topLeft.y &&
            pos.y <= topLeft.y + height;
    }

    static isInsideSquare(pos, topLeft, size) {
        return Utils.isInsideRect(pos, topLeft, size, size);
    }

    static clone(items) {
        return items.map(item => Array.isArray(item) ? Utils.clone(item) : item);
    };

    static formatSeconds(secs) {
        const pad = (n) => n < 10 ? `0${n}` : n;

        // const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;

        return `${pad(m)}:${pad(s)}`;
    }

    static mergeMatrix(matrix1, matrix2) {
        const N = matrix1.length;
        let matrix = [];

        for (let i = 0; i < N; i++) {
            matrix[i] = [];
            for (let j = 0; j < N; j++) {
                matrix[i][j] = matrix2[i][j] != 0 ? matrix2[i][j] : matrix1[i][j];
            }
        }
        return matrix;
    }

    static creatIdxObj(r, c) {
        return {
            r: r,
            c: c
        };
    }

    static creatBlockObj(r, c, value) {
        return {
            r: r,
            c: c,
            value: value
        };
    }

    static arrayRemove(arr, value) {
        return arr.filter(function(val) {
            return value != val
        });
    }

    static convertStrToIdxObj = (str) => {
        let arr = str.split(",");
        return Utils.creatIdxObj(parseInt(arr[0]), parseInt(arr[1]));
    }

    static isEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    static checkDuplicatedValueInArray(arr) {
        return new Set(arr).size != arr.length;
    }
}