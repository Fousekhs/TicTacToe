
const guiHandler = (() => {
    let cells = [];
    const main_container = document.createElement("div");
    const content_container = document.querySelector(".content");
    const scores = [document.createElement("span"), document.createElement("span"), document.createElement("span")];
    scores.forEach(score => {
        score.innerText = "0";
    });
    let isAi = false;
    let playing = true;
    

    function remove(item) {
        item.dataset.state = "removed";
        setTimeout(() => {
            item.remove();
        }, 400);
    }

    function clear() {
        for (let child of main_container.children) {
            remove.call(document, child);
        }
    }

    function start() {
        main_container.classList.add("main-container");

        const play = document.createElement("h2");
        play.classList.add("btn");
        play.dataset.state = "shown";
        play.innerText = "Play";
        main_container.appendChild(play);
        play.addEventListener("click", () => {
            clear();
            setTimeout(() => chooseMode(), 400);
        });

        content_container.appendChild(main_container);
    }
    
    function chooseMode() {
        const pvp = document.createElement("h2");
        pvp.classList.add("btn");
        pvp.innerText = "Player v Player"
        pvp.dataset.state = "shown";
        
        const ai = document.createElement("h2");
        ai.classList.add("btn");
        ai.innerText = "Player v AI";
        ai.dataset.state = "shown";
        
        ai.addEventListener("click", () => {
            clear();
            setTimeout(() => {
                createTable();
                createPanel("AI");
                if (!isAi) clear_score();
                isAi = true;
            }, 400);
        })
        
        pvp.addEventListener("click", () => {
            clear();
            setTimeout(() => {
                createTable();
                createPanel("Player 2");
                if (isAi) clear_score();
                isAi = false;
            }, 400);
        });
        
        main_container.appendChild(ai);
        main_container.appendChild(pvp);
    }
    
    
    function playerInput(eventArgs) {
        playing = true;
        Gameboard.place(eventArgs.x, eventArgs.y);
    }

    function createTable() {
        cells = [];
        const game_container = document.createElement("div");
        game_container.classList.add("game-container");
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.dataset.index = i;
            cell.classList.add("cell");
            cell.addEventListener("click", () => {
                let index = cell.dataset.index;
                let y = Math.trunc(index / 3);
                let x = index % 3; 
                events.emit("place", {x, y});
                events.emit("redraw", {});
            })
            cells.push(cell);
            game_container.appendChild(cell);
        }
        game_container.dataset.state = "shown";
        main_container.appendChild(game_container);
    }

    const createPanel = (secondPlayer) => {
        const panel = document.createElement("div");
        panel.classList.add("panel");
        panel.dataset.state = "shown";

        const p1_score = document.createElement("div");
        p1_score.classList.add("player-one");
        p1_score.innerText = "Player 1: ";
        p1_score.appendChild(scores[0]);
        panel.appendChild(p1_score);

        const draws = document.createElement("div");
        draws.classList.add("draws");
        draws.innerText = "Draws: ";
        draws.appendChild(scores[1]);
        panel.appendChild(draws);

        const p2_score = document.createElement("div");
        p2_score.classList.add("player-two");
        p2_score.innerText = `${secondPlayer}: `;
        p2_score.appendChild(scores[2]);
        panel.appendChild(p2_score);

        const clear_btn = document.createElement("button");
        clear_btn.id = "clear_btn";
        clear_btn.innerText = "CLEAR SCORES";
        clear_btn.addEventListener("click", () => {
            clear_score();
        })
        panel.appendChild(clear_btn);

        const restart = document.createElement("button");
        restart.id = "restart";
        restart.innerText = "RESTART";
        restart.addEventListener("click", () => {
            events.emit("clear", {});
        })
        panel.appendChild(restart);

        const back = document.createElement("button");
        back.id = "back";
        back.innerText = "BACK";
        back.addEventListener("click", () => {
            Gameboard.clear();
            clear();
            setTimeout(() => start(), 600);
        })
        panel.appendChild(back);

        main_container.appendChild(panel);
    }

    const clear_table = () => {
        Gameboard.clear();
    }

    function draw() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const index = 3*j + i;
                cells[index].innerText = Gameboard.getCell(i, j);
                cells[index].dataset.symbol = Gameboard.getCell(i, j); 
            }
        }
    }

    const clear_score = () => {
        scores.forEach(score => {
            score.innerHTML = 0;
        })
    }

    events.on("place", playerInput);
    events.on("place", () => {
        if (!isAi) return;
        if (!playing) return;
        Gameboard.generateMove();
    })
    events.on("redraw", draw);
    events.on("clear", clear_table);
    events.on("clear", draw);
    events.on("game ended", result => {
        playing = false;
        const span = scores[result];
        span.innerText = parseInt(span.innerText) + 1;
    })
    start();

})();