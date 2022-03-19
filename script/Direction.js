export default class Direction {
    // Create new instances of the same class as static attributes
    static UP = new Direction([0, -1]);
    static DOWN = new Direction([0, 1]);
    static RIGHT = new Direction([1, 0]);
    static LEFT = new Direction([-1, 0]);
    static UP_RIGHT = new Direction([1, -1]);
    static UP_LEFT = new Direction([-1, -1]);
    static DOWN_RIGHT = new Direction([1, 1]);
    static DOWN_LEFT = new Direction([-1, 1]);

    constructor(vector) {
        this.vector = vector
    }
}