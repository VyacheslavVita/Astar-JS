var currentStatus = "empty";

var startElement;
var finishElement;

var astarPlace;
var currentSize;

var hasStart = false;
var hasFinish = false;

var startButton = document.getElementById("start_button");
var finishButton = document.getElementById("finish_button");
var generateButton = document.getElementById("generate_button");
var resetButton = document.getElementById("reset_button");
var searchButton = document.getElementById("search_button");

class Ceil {
    constructor(status, x, y, g, h, f) {
        this.status = status;
        this.parent = null;
        this.isWay = false;
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.f = f;
        
    }
}


function generateField() {
    currentSize = document.getElementById("size").value;
    astarPlace = document.querySelector(".astar-place");

    if (currentSize < 2 || currentSize > 10) {
        alert("Введите значение от 2 до 10");
    } 
    else {
        for (let i = 0; i < currentSize; i++) {
            let line = document.createElement("div");
            line.classList.add("line");

            for (let j = 0; j < currentSize; j++) {
                let ceil = document.createElement("div");
                ceil.classList.add("ceil");
                ceil.classList.add("empty");
                line.appendChild(ceil);
            }

            astarPlace.appendChild(line);
        }

        addClickHandlerToCeils();

        document.querySelectorAll(".btn").forEach(btn => {
            if (btn.id != "generate_button" && btn.id != "search_button") {
                btn.removeAttribute("disabled");
            }
            else {
                btn.setAttribute("disabled", true);
            }
        });
    }
}


function deleteField() {
    astarPlace = document.querySelector(".astar-place");

    while (astarPlace.firstChild) {
        astarPlace.removeChild(astarPlace.firstChild);
    }

    document.querySelectorAll(".btn").forEach(btn => {
        if (btn.id != "generate_button") {
            btn.setAttribute("disabled", true);
        }
        else {
            btn.removeAttribute("disabled");
        }
    });
}


function swapStatus(statusValue) {
    currentStatus = statusValue;
}


function addClickHandlerToCeils() {
    document.querySelectorAll(".ceil").forEach(function(ceil) {
        ceil.addEventListener("click", function() {

            if (currentStatus == "start") {
                startButton.setAttribute("disabled", true);
                hasStart = true;
            }
            else if (currentStatus == "finish") {
                finishButton.setAttribute("disabled", true);
                hasFinish = true;
            }
            else if (currentStatus == "wall" || currentStatus == "empty") {
                if (ceil.classList[1] == "start") {
                    startButton.removeAttribute("disabled");
                    hasStart = false;
                }
                else if (ceil.classList[1] == "finish") {
                    finishButton.removeAttribute("disabled");
                    hasFinish = false;
                }
            }

            if (hasStart && hasFinish) {
                searchButton.removeAttribute("disabled");
            }
            else {
                searchButton.setAttribute("disabled", true);
            }

            let classes = ceil.className.split(" ");
            classes.pop();
            classes.push(currentStatus);
            ceil.className = classes.join(" ");

            if (currentStatus == "start" || currentStatus == "finish") {
                currentStatus = "empty";
            }
        });
    });
}


function createCeilsArray() {
    let array = document.querySelectorAll(".ceil");
    let ceilsArray = [];

    for (let i = 0; i < currentSize; i++) {
        for (let j = 0; j < currentSize; j++) {
            let ceil = new Ceil(array[i * currentSize + j].classList[1], i, j, 0, 0, 0);
            ceilsArray.push(ceil);
        }
    }

    return ceilsArray;
}


function astarSearch() {
    let ceilsArray = createCeilsArray();
    let closedList = [];
    let openList = [];
    let hasWay = false;

    searchStartAndFinish(ceilsArray);

    openList.push(startElement);

    while (openList.length > 0) {
        let currentCeil = openList[0];
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < currentCeil.f) {
                currentCeil = openList[i];
            }
        }

        let indexCurrentCeil = openList.findIndex(ceil => ceil.x == currentCeil.x && ceil.y == currentCeil.y);
        openList.splice(indexCurrentCeil, 1);
        closedList.push(currentCeil);

        if (currentCeil.status == "finish") {
            hasWay = true;
            break;
        }

        ceilsArray.forEach(neighbor => {
            if (Math.abs(currentCeil.x - neighbor.x) <= 1 && Math.abs(currentCeil.y - neighbor.y) <= 1) {
                
                let neighborInClosedList = ceilInArray(neighbor, closedList);
                
                if (neighborInClosedList == false && neighbor.status != "wall") {
                    if (neighbor.parent == null) {
                        neighbor.parent = currentCeil;
                    }

                    let tempG = currentCeil.g + getDistance(currentCeil, neighbor);

                    if (neighbor.g == 0 || tempG < neighbor.g) {
                        neighbor.g = tempG;
                        neighbor.h = getHeuristic(neighbor);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = currentCeil;
                    }

                    let neighborInOpenList = ceilInArray(neighbor, openList);
                    
                    if (neighborInOpenList == false) {
                        openList.push(neighbor);
                    }
                }
            }
        });
    }

    if (hasWay) {
        recoveryWay(ceilsArray);
    }
    else {
        alert("Путь не найден :(");
    }
    
    document.querySelectorAll(".btn").forEach(btn => {
        if (btn.id != "reset_button") {
            btn.setAttribute("disabled", true);
        }
    });
}


function ceilInArray(ceil, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].x == ceil.x && array[i].y == ceil.y) {
            return true;
        }
    }

    return false;
}


function searchStartAndFinish(array) {
    array.forEach(ceil => {
        if (ceil.status == "start") {
            startElement = ceil;
        }
        else if (ceil.status == "finish") {
            finishElement = ceil;
        }
    });
}


function recoveryWay(ceilsArray) {
    while (finishElement != null) {
        finishElement.isWay = true;
        finishElement = finishElement.parent;
    }

    let array = document.querySelectorAll(".ceil");
    for (let i = 0; i < currentSize * currentSize; i++) {
        if (ceilsArray[i].isWay && ceilsArray[i].status != "start" && ceilsArray[i].status != "finish") {
            array[i].classList.add("way");
        }
    }
}


function getDistance(ceil1, ceil2) {
    return Math.sqrt(Math.pow(ceil1.x - ceil2.x, 2) + Math.pow(ceil1.y - ceil2.y, 2));
}


function getHeuristic(ceil) {
    return Math.abs(finishElement.x - ceil.x);
}