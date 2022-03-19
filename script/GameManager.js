import Sudoku from "./Sudoku.js"
import SudokuGraphic from "./SudokuGraphic.js";

window.onload = () => {
    var CANVAS, SUDOKU, SUDOKU_GRAPHIC;
    const loading$ = new Rx.BehaviorSubject(true);
    const initGame$ = new Rx.BehaviorSubject(false);

    const initGame = () => {
        CANVAS = document.getElementById("canvas");
        SUDOKU = new Sudoku();
        SUDOKU_GRAPHIC = new SudokuGraphic(CANVAS, SUDOKU);
        SUDOKU_GRAPHIC.clearEntireSudoku();
        SUDOKU_GRAPHIC.drawGridSudoku();
        SUDOKU_GRAPHIC.drawNumberIntoGrid();

        let mouseClick = Rx.Observable.fromEvent(CANVAS, 'click');
        let subscriber1 = mouseClick.subscribe((e) => handleMouseMoveOn(e));
    }

    const handleMouseMoveOn = (event) => {
        const pos = {
            "x": event.clientX - CANVAS.offsetLeft,
            "y": event.clientY - CANVAS.offsetTop
        };
        SUDOKU_GRAPHIC.fillColorSelectedAreaByPosition(pos);
    }

    const showLoading = (isEnabled) => {
        const style = isEnabled ? 'block' : 'none';
        console.count("showLoading");
        document.getElementById("splash-screen").style.display = style;
    }

    console.log("WebFont");
    // WebFont.load({
    //     google: {
    //         families: ['Inter']
    //     },
    //     active: () => {
    //         loading$.subscribe((value) => {
    //             showLoading(value);
    //         });

    //         initGame$.subscribe(() => {
    //             initGame()
    //             loading$.next(false);
    //         });
    //     }
    // });
    initGame();
    loading$.subscribe((value) => {
        showLoading(value);
    });
    loading$.next(false);
}