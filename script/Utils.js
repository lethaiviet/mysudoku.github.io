import { CONST } from "./GlobalVariable.js";

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
}