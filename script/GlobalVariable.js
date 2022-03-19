const CONST = {
    NUMBS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    FULL_SCREEN: {
        w: window.innerWidth,
        h: window.innerHeight
    },
    RATIO: 0.085, //ratio = BLOCK.height / FULL_SCREEN.height
    get SQUARE_SIZE() { return this.RATIO * this.FULL_SCREEN.h }
}

export { CONST };