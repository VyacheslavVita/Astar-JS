var currentStatus = "empty";

function generateField() {
    var size = document.getElementById("size").value;
    var astarPlace = document.querySelector(".astar-place");

    for (let i = 0; i < size; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        for (let j = 0; j < size; j++) {
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
        })
    })
}