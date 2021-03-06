var gameUtils = { //abstracting bc so DOM speciic - make code cleaner
    setCellStatus: function(cell, status) {
        cell.setAttribute('data-status', status);
        cell.className = status;
    },
    getCellStatus: function(cell) {
        return cell.getAttribute('data-status');
    },
    toggleStatus: function(cell) {
        if (gameUtils.getCellStatus(cell) === 'dead')
            gameUtils.setCellStatus(cell, 'alive');
        // this.className = "alive";
        // this.setAttribute('data-status', 'alive');
        else
            gameUtils.setCellStatus(cell, 'dead');
        // this.className = "dead";
        // this.setAttribute('data-status', 'dead');
    },
    getCellCoords: function(cell) {
        return cell.id.split('-').map(Number);
    },
    selectCellByCoords: function(x, y) {
        return document.getElementById(x + '-' + y);
    },
    getNeighbors: function(cell) {
        var neighbors = [];
        var coords = gameUtils.getCellCoords(cell)
        var x = coords[0];
        var y = coords[1];

        var sc = gameUtils.selectCellByCoords; //reasssign for readability

        neighbors.push(sc(x - 1, y)); //cell to the left
        neighbors.push(sc(x + 1, y)); //cell to the right
        neighbors.push(sc(x - 1, y - 1)); //above and left
        neighbors.push(sc(x, y - 1)); //directly above
        neighbors.push(sc(x + 1, y - 1)); //above and right
        neighbors.push(sc(x - 1, y + 1)); //below left
        neighbors.push(sc(x, y + 1)); //directly below
        neighbors.push(sc(x + 1, y + 1)); //below right

        return neighbors.filter(function(cell) {
            return cell !== null
        }); //returning all neighbors that actually exist

    },

    getAliveNeighbors: function(neighbors) {
        var aliveNeighbors = neighbors.filter(function(neighbor) {
            return gameUtils.getCellStatus(neighbor) === 'alive';
        })
        return aliveNeighbors.length;
    }


};

var gameOfLife = {
    width: 12,
    height: 12,
    stepInterval: null,

    createAndShowBoard: function() {
        // create <table> element
        var boardSize = prompt("Please enter the size of the board, for example 10x10.");

        if (boardSize.match(/\d+x\d+/) === null) {
            alert("Please follow our format if you want to set your own board size.");
            this.width = 12;
            this.height = 12;
        } else {
            this.width = parseInt(boardSize.split("x")[0]);
            this.height = parseInt(boardSize.split("x")[1]);
        }


        var goltable = document.createElement("tbody");

        // build Table HTML
        var tablehtml = '';
        for (var h = 0; h < this.height; h++) {
            tablehtml += "<tr id='row+" + h + "'>";
            for (var w = 0; w < this.width; w++) {
                tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
            }
            tablehtml += "</tr>";
        }
        goltable.innerHTML = tablehtml;

        // add table to the #board element
        var board = document.getElementById('board');
        board.appendChild(goltable);

        // once html elements are added to the page, attach events to them
        this.setupBoardEvents();
    },

    forEachCell: function(iteratorFunc) {
        /*
          Write forEachCell here. You will have to visit
          each cell on the board, call the "iteratorFunc" function,
          and pass into func, the cell and the cell's x & y
          coordinates. For example: iteratorFunc(cell, x, y)
        */

        //var cells = Array.prototype.slice.call(document.getElementsByTagName('td'));
        var cells = [].slice.call(document.getElementsByTagName('td'));
        //all the td elements on the DOM are table cells
        //array like object so need to copy and convert to array to use for each

        cells.forEach(function(cell) {
            var idSplit = cell.id.split('-');
            iteratorFunc(cell, +idSplit[0], +idSplit[1]);
        });

        // for (var x = 0; x < this.width; x++) {
        // 	for (var y = 0; y < this.height; y++) {
        // 		iteratorFunc(document.getElementById(x + "-" + y), x, y);
        // 		// ES6 can use this `${x}-${y}`
        // 	}
        // }
    },

    setupBoardEvents: function() {
        // each board cell has an CSS id in the format of: "x-y"
        // where x is the x-coordinate and y the y-coordinate
        // use this fact to loop through all the ids and assign
        // them "on-click" events that allow a user to click on
        // cells to setup the initial state of the game
        // before clicking "Step" or "Auto-Play"

        // clicking on a cell should toggle the cell between "alive" & "dead"
        // for ex: an "alive" cell be colored "blue", a dead cell could stay white

        // EXAMPLE FOR ONE CELL
        // Here is how we would catch a click event on just the 0-0 cell
        // You need to add the click event on EVERY cell on the board

        var onCellClick = function(e) {
            gameUtils.toggleStatus(this);
            //     // QUESTION TO ASK YOURSELF: What is "this" equal to here?

            //     // how to set the style of the cell when it's clicked
            //     //if (this.getAttribute('data-status') == 'dead') {
            //     if (gameUtils.getCellStatus(this) === 'dead')
            //         gameUtils.setCellStatus(this, 'alive');
            //     // this.className = "alive";
            //     // this.setAttribute('data-status', 'alive');
            // } else {
            //     gameUtils.setCellStatus(this, 'dead');
            // this.className = "dead";
            // this.setAttribute('data-status', 'dead');
            //} //here <this> is the dom element being clicked
            //attributes are proprerties on an element
        }

        // var cell;
        // for (var x = 0; x < this.width; x++) {
        // 	for (var y = 0; y < this.height; y++) {
        // 		cell = document.getElementById(`${x}-${y}`);
        // 		cell.onclick = onCellClick;
        // 	}
        // }
        this.forEachCell(function(cell) {
            cell.addEventListener('click', onCellClick);
        });

        document.getElementById("step_btn").addEventListener("click", function() {
            gameOfLife.step();
        });

        document.getElementById("reset_btn").addEventListener("click", function() {
            gameOfLife.random();
        });

        document.getElementById("play_btn").addEventListener("click", function() {
            gameOfLife.toPlay();
        });

        document.getElementById("clear_btn").addEventListener("click", function() {
            gameOfLife.clear();
        });
    },

    // getNeighbors: function(x, y) {
    //         // x and y will be the x and y for the selfCell;
    //         var neighbors = [];
    //         for (var i = x - 1; i <= x + 1; i++) {
    //             for (var j = y - 1; j <= y + 1; j++) {
    //                 if (i === x && j === y) {} else {
    //                     neighbors.push(document.getElementById(`${i}-${j}`));
    //                 }
    //             }
    //         }
    //         return neighbors;
    //     },


    aliveCounts: function(neighbors) {
        var alives = 0;
        neighbors.forEach(function(neighbor) {
            if (neighbor !== null) {
                if (neighbor.getAttribute('data-status') === "alive") alives++;
            }

        });
        return alives;
    },


    step: function() {
            // Here is where you want to loop through all the cells
            // on the board and determine, based on it's neighbors,
            // whether the cell should be dead or alive in the next
            // evolution of the game.
            //
            // You need to:
            // 1. Count alive neighbors for all cells
            // 2. Set the next state of all cells based on their alive neighbors
            this.forEachCell(function(cell) {
                var neighbors = gameUtils.getNeighbors(cell);
                var numAliveNeighbors = gameUtils.getAliveNeighbors(neighbors);

                if (gameUtils.getCellStatus(cell) === 'alive') {
                    if (numAliveNeighbors < 2 || numAliveNeighbors > 3) {
                        gameUtils.toggleStatus(cell);
                    }
                } else {
                    if (numAliveNeighbors === 3) {
                        gameUtils.toggleStatus(cell);
                    }
                }
            });



        },
        //     var needToChange = [];
        //     this.forEachCell(function(cell, x, y) {
        //         var neighbors = gameOfLife.getNeighbors(x, y);
        //         var alives = gameOfLife.aliveCounts(neighbors);
        //         if (cell.getAttribute("data-status") === "alive") {
        //             if (alives < 2 || alives > 3) {
        //                 needToChange.push(cell);
        //             }
        //         } else {
        //             if (alives === 3) {
        //                 needToChange.push(cell);
        //             }
        //         }
        //     });
        //     this.toggle(needToChange);
        // },

    // toggle: function(cells) {
    //     cells.forEach(function(cell) {
    //         if (cell.getAttribute("data-status") === "alive") {
    //             cell.setAttribute("data-status", "dead");
    //             cell.className = "dead";
    //         } else {
    //             cell.setAttribute("data-status", "alive");
    //             cell.className = "alive";
    //         }
    //     })
    // },

        enableAutoPlay: function() {
        // Start Auto-Play by running the 'step' function
        // automatically repeatedly every fixed time interval
        this.stepInterval = setInterval(
            function() {
                gameOfLife.step()
            }, 75
        )
    },

    toPlay: function() {
        if (this.stepInterval === null) {
            this.enableAutoPlay();
        } else {
            clearInterval(gameOfLife.stepInterval);
            this.stepInterval = null;
        }
    },

    stepInterval: null,

    clear: function() {
        // var autoPlay = setInterval(function () {
        // 	gameOfLife.step()
        // }, 75);

        this.forEachCell(function(cell, x, y) {
            if (cell.getAttribute("data-status") === "alive") {
                cell.setAttribute("data-status", "dead");
                cell.className = "dead";
            }
        });
    },

    random: function() {
        this.forEachCell(function(cell) {
            var num = Math.round(Math.random());
            var status;
            if (num === 0) status = "dead";
            else status = "alive"

            cell.setAttribute("data-status", status);
            cell.className = status;
        })
    }
};

gameOfLife.createAndShowBoard();
