var currentStatus = "empty";
var currentSize;
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
    constructor(status, x, y, g, h) {
        this.status = status;
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
    }

    
}

function createCeilsArray() {
    var array = [];

    var i = 0;
    var j = 0;

    document.querySelectorAll(".ceil").forEach(function(ceil) {
        var obj = new Ceil(ceil.classList[1], i++, j, 0, 0);
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
    var wayList = [];

    var startElement;
    

    array.forEach(element => {
        if (element.status == "start") {
            startElement = element;
        }
        else if (element.status == "finish") {
            finishElement = element;
        }
    });

    startElement.g = 0;
    startElement.h = getHeuristic(startElement);

    openList.push(startElement);
    console.log(openList);
}

function getDistance(ceil1, ceil2) {
    return Math.sqrt(Math.pow(ceil1.x - ceil2.x, 2) + Math.pow(ceil1.y - ceil2.y, 2));
}

function getHeuristic(ceil) {
    return Math.abs(ceil.x - finishElement.x) - 1;
}