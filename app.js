var currentStatus = "empty";
var currentSize;

var startElement;
var finishElement;

function generateField() {
    currentSize = document.getElementById("size").value;
    var astarPlace = document.querySelector(".astar-place");

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
}

function swapStatus(statusValue) {
    currentStatus = statusValue;
}

function addClickHandlerToCeils() {
    document.querySelectorAll(".ceil").forEach(function(ceil) {
        ceil.addEventListener("click", function() {
            let classes = ceil.className.split(" ");
            classes.pop();
            classes.push(currentStatus);
            ceil.className = classes.join(" ");
        });
    });
}

class Ceil {
    constructor(status, x, y, g, h, f) {
        this.status = status;
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.f = f;
        this.parent = null;
        this.isWay = false;
    }
}

function createCeilsArray() {
    var array = [];

    var i = 0;
    var j = 0;

    document.querySelectorAll(".ceil").forEach(function(ceil) {
        var obj = new Ceil(ceil.classList[1], i++, j, 0, 0, 0);
        array.push(obj);
        if (i == currentSize) {
            i = 0;
            j++;
        }
    });

    return array;
}

function astarSearch() {
    var array = createCeilsArray();
    
    var closedList = [];
    var openList = [];

    array.forEach(element => {
        if (element.status == "start") {
            startElement = element;
        }
        else if (element.status == "finish") {
            finishElement = element;
        }
    });

    openList.push(startElement);

    while (openList.length > 0) {
        console.log("итерация!")
        var currentElement = openList[0];
        // console.log(currentElement);
        openList.forEach(element => {
            if (element.f < currentElement.f) {
                currentElement = element;
            }
        });

        let index = openList.find(elem => elem.x == currentElement.x && elem.y == currentElement.y);
        openList.splice(index, 1);
        closedList.push(currentElement);

        // console.log(closedList);

        if (currentElement.status == "finish") {
            alert("Путь найден!");
            break;
        }

        array.forEach(element => {
            if (Math.abs(currentElement.x - element.x) <= 1 && Math.abs(currentElement.y - element.y) <= 1) {
                // console.log(element);
                let check = closedList.find(elem => elem == element);
                if (check == undefined) {
                    // console.log(element);
                    if (element.status != "wall") {
                        let tempF = getDistance(element, currentElement) + getHeuristic(element);
                        if (element.f == 0 || tempF < element.f) {
                            element.g = getDistance(element, currentElement);
                            element.h = getHeuristic(element);
                            element.f = element.g + element.h;
                            element.parent = currentElement;
                        }

                        let check = openList.find(elem => elem == element);
                        if (check == undefined) {
                            openList.push(element);
                        }
                    }
                }
            }
        });
    }

    let currentCeil = finishElement;
    while (currentCeil != null) {
        currentCeil.isWay = true;
        // console.log(currentCeil);
        currentCeil = currentCeil.parent;
    }
    
    console.log(array);

    let arr = document.querySelectorAll(".ceil");
    console.log(arr);
    for (let i = 0; i < currentSize * currentSize; i++) {
        if (array[i].isWay == true) {
            arr[i].classList.add("way");
        }
    }
}

function getDistance(ceil1, ceil2) {
    return Math.sqrt(Math.pow(ceil1.x - ceil2.x, 2) + Math.pow(ceil1.y - ceil2.y, 2));
}

function getHeuristic(ceil) {
    return Math.abs(ceil.x - finishElement.x);
}