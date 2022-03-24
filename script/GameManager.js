import Sudoku from "./Sudoku.js"
import SudokuGraphic from "./SudokuGraphic.js";
import Utils from "./Utils.js";
const {
    BehaviorSubject,
    fromEvent,
    merge,
    interval,
    NEVER,
} = rxjs;

const {
    mapTo,
    scan,
    startWith,
    switchMap,
    tap,
    throttleTime
} = rxjs.operators;

window.onload = () => {
    var CANVAS, LEVEL, PLAY_PAUSE_BTN;
    var SUDOKU, SUDOKU_GRAPHIC;

    const isLoading$ = new BehaviorSubject(true);
    const levelGame$ = new BehaviorSubject(1);
    var fromClickOnSudokuGrid$;

    const initGame = () => {
        CANVAS = document.querySelector("#canvas");
        LEVEL = document.querySelector("#level-game");
        PLAY_PAUSE_BTN = document.querySelector("#play-pause-btn");
        initAllEventsInGame();
    }

    const initAllEventsInGame = () => {
        initClickOnGridSudokuEvent();
        initShowLoadingEvent();
        initSelectLevelEvent();
        initWatchStopEvent();
        initNewGameEvent();
        initNumPadsEvent();
        initToggleAutoCheckMistake();
        initGameControlsEvent();
    }

    const initWatchStopEvent = () => {
        const eventStopWatch$ = merge(
            fromClickToMap("play-pause-btn", {
                typeEvent: "click-on-toggle"
            }),

            levelGame$.pipe(mapTo({
                typeEvent: "select-dropdown",
                count: true,
                value: 0
            })),

            fromClickOnSudokuGrid$.pipe(
                throttleTime(1000),
                mapTo({
                    typeEvent: "click-on-grid",
                    count: false
                }))
        );

        const stopWatch$ = eventStopWatch$.pipe(
            startWith({
                count: true,
                speed: 1000,
                value: 0
            }),
            scan((state, curr) => {
                state = {...state,
                    ...curr
                };
                if (!SUDOKU.isCompleted() && state.typeEvent == "click-on-toggle") {
                    state.count = !state.count;
                    state.count ? SUDOKU_GRAPHIC.drawPlayScreen() : SUDOKU_GRAPHIC.drawPauseScreen();
                } else {
                    state.count = true;
                }

                return state;
            }, {}),
            tap(state => {
                setIconPlayPauseBtn(state.count);
                setValueWatchStop(state.value)
            }),
            switchMap(state => state.count ? interval(1000).pipe(
                tap(() => state.value += 1),
                tap(() => setValueWatchStop(state.value))
            ) : NEVER)
        );
        stopWatch$.subscribe();
    }

    const initSelectLevelEvent = () => {
        const selectLevel$ = fromEvent(LEVEL, 'change');
        selectLevel$.subscribe((e) => {
            isLoading$.next(true);

            //Set time out = 50ms to avoid initSudoku func block render/repair the splash screen. 
            setTimeout(() => levelGame$.next(e.target.value), 50);
        });

        levelGame$.subscribe((level) => {
            initSudoku(level);
            isLoading$.next(false);
        });
    }

    const initNewGameEvent = () => {
        const clickEvent$ = fromClick("new-game-btn");
        clickEvent$.subscribe(() => {
            isLoading$.next(true);

            //Set time out = 50ms to avoid initSudoku func block render/repair the splash screen. 
            setTimeout(() => levelGame$.next(LEVEL.value), 50);
        });
    }

    const initClickOnGridSudokuEvent = () => {
        fromClickOnSudokuGrid$ = fromEvent(CANVAS, 'click');
        fromClickOnSudokuGrid$.subscribe((e) => handleClickOnSudokuGrid(e));
    }

    const initShowLoadingEvent = () => {
        isLoading$.subscribe((value) => {
            showLoading(value);
        });
    }

    const initNumPadsEvent = () => {
        const event$ = merge(
            fromClickToMap("numpad-1", {
                value: 1
            }),
            fromClickToMap("numpad-2", {
                value: 2
            }),
            fromClickToMap("numpad-3", {
                value: 3
            }),
            fromClickToMap("numpad-4", {
                value: 4
            }),
            fromClickToMap("numpad-5", {
                value: 5
            }),
            fromClickToMap("numpad-6", {
                value: 6
            }),
            fromClickToMap("numpad-7", {
                value: 7
            }),
            fromClickToMap("numpad-8", {
                value: 8
            }),
            fromClickToMap("numpad-9", {
                value: 9
            }),
            fromClickToMap("eraser-btn", {
                value: 0
            }),
        );

        const numpad$ = event$.pipe(
            throttleTime(200),
            tap((state) => SUDOKU_GRAPHIC.changeBlockValueAndDraw(state.value))
        )

        numpad$.subscribe();
    }

    const initGameControlsEvent = () => {
        fromClick("pencil-btn").pipe(
            scan((state) => !state, false)
        ).subscribe((state) => {
            state ? document.getElementById("pencil-btn").classList.add("btn-force-hover") :
                document.getElementById("pencil-btn").classList.remove("btn-force-hover");
            SUDOKU_GRAPHIC.enablePencilMode(state);
        });

        fromClick("undo-btn").subscribe(() => SUDOKU_GRAPHIC.undoAndDraw());
        fromClick("hint-btn").subscribe(() => SUDOKU_GRAPHIC.useHintAndDraw());
    }

    const initToggleAutoCheckMistake = () => {
        fromClick("auto-check-mistake-toggle").subscribe((e) => {
            SUDOKU_GRAPHIC.enableCheckingMistakes(e.target.checked);
            SUDOKU_GRAPHIC.fillColorSelectedAreaByIdx();
        });
    }

    const initSudoku = (level = 1) => {
        SUDOKU = new Sudoku(level);
        SUDOKU_GRAPHIC = new SudokuGraphic(CANVAS, SUDOKU);
        SUDOKU_GRAPHIC.drawPlayScreen();
    }

    const handleClickOnSudokuGrid = (event) => {
        if (SUDOKU.isCompleted()) return;
        const pos = {
            "x": event.clientX - CANVAS.offsetLeft,
            "y": event.clientY - CANVAS.offsetTop
        };

        SUDOKU_GRAPHIC.fillColorSelectedAreaByPosition(pos);
    }

    const showLoading = (isEnabled) => {
        const style = isEnabled ? 'block' : 'none';
        document.getElementById("splash-screen").style.display = style;
    }

    const fromClick = (id) => fromEvent(document.getElementById(id), 'click');

    const fromClickToMap = (id, obj) => fromClick(id).pipe(mapTo(obj));

    const setValueWatchStop = (value) => {
        SUDOKU.isCompleted() || (document.querySelector("#timer").innerHTML = Utils.formatSeconds(value));
    }

    const setIconPlayPauseBtn = (isCounting) => {
        const attribute = isCounting ? "fa fa-pause" : "fa fa-play";
        PLAY_PAUSE_BTN.querySelector("i").setAttribute("class", attribute);
    }

    WebFont.load({
        google: {
            families: ['Inter']
        },
        active: () => {
            initGame();
        }
    });

}