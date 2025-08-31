var ALGO_START_DELAY = 2000;
var ALGO_EXEC_SPEED = 2000;

var rubik = null;
var lastInitState = null;
var lastAlgoToBeExec = null;
var lastRotation = null;
var currentTimeout = null;

rubikWindow = document.getElementById("rubik-window");
rubikAlgoText = document.getElementById("rubik-algo-text");

function initRubik(initState, rotation, updateAlgo=null) {
    rubik = new Rubik(rubikWindow, rotation.X, rotation.Y, Rubik._parseState(initState)); // setTimeout(() => rubik._updateByAlgo(["x", "l", "U", "l'", "B'", "l", "U", "U", "l'", "B'"]), 100);
    if (updateAlgo != void 0) setTimeout(() => rubik._updateByAlgo(updateAlgo), 100);
}

function init_and_demonstrate(initState, algoToBeExec, rotation={X: -20, Y: -30}, updateAlgo=null) {
    lastAlgoToBeExec = algoToBeExec;
    lastInitState = initState;
    lastRotation = rotation;

    initRubik(initState, rotation, updateAlgo);
    refreshSpeed();
    refreshRubikAlgoText(rubikAlgoText, parseAlgo(algoToBeExec), -1);
    execAlgo(rubik, rubikAlgoText, parseAlgo(algoToBeExec), ALGO_EXEC_SPEED, ALGO_START_DELAY);
}

function parseAlgo(algoStr) {
    return algoStr.split(" ");
}

function refreshRubikAlgoText(rubikAlgoTextObj, rubikAlgo, currentStepIndex) {
    function findHighlightIndex() {
        let accumulatedSteps = 0;
        for (let i = 0; i < rubikAlgo.length; i++) {
            const steps = rubikAlgo[i].includes('2') ? 2 : 1;
            if (currentStepIndex < accumulatedSteps + steps) {
                return i;
            }
            accumulatedSteps += steps;
        }
        return -1; // 若currentStepIndex超出範圍，不高亮
    }

    function getRubikAlgoHTML(rubikAlgo, highlightIdx) {
        return rubikAlgo.map((move, i) => 
            i === highlightIdx 
                ? `<span class="highlighted-move">${move}</span>`
                : move
        ).join(' ');
    }

    const highlightIdx = currentStepIndex === -1 ? -1 : findHighlightIndex();
    rubikAlgoTextObj.innerHTML = getRubikAlgoHTML(rubikAlgo, highlightIdx);
}




Array.from(document.getElementsByClassName("algo-body")).forEach(cardElement => {
    const button = cardElement.getElementsByTagName("button")[0];
    const algoText = cardElement.getElementsByClassName("algo-display-box")[0];
    algoText.innerText = button.getAttribute("exec-algo");
});



function execAlgo(rubikObj, rubikAlgoTextObj, algoArr, speed=1000, startDelay=1000) {
    function getAtomicArr(complexArr) {
        var result = [];
        complexArr.forEach(element => {
            if (/^.+2$/.test(element)) { result.push(element[0], element[0]); }
            else { result.push(element); }
        })
        return result;
    }

	function recurExec(recurArr) {
		if (recurArr.length == 0) return;
		rubikObj._execTurn(recurArr[0]);
        refreshRubikAlgoText(rubikAlgoTextObj, algoArr, atomicAlgoArr.length - recurArr.length);
		currentTimeout = setTimeout(() => { recurExec(recurArr.slice(1))}, speed / getSpeedAdjustment());
	}

    clearTimeout(currentTimeout);
    var atomicAlgoArr = getAtomicArr(algoArr);
    currentTimeout = setTimeout(() => { recurExec(atomicAlgoArr) }, startDelay);
}

function getSpeedAdjustment() { return parseFloat(localStorage.getItem("speed_adjustment")) || 1;}
function setSpeedAdjustment(speed) { localStorage.setItem("speed_adjustment", speed); }
function refreshSpeed() { document.getElementById("speed-text").innerText = getSpeedAdjustment() + "x"; }

document.getElementById("slower-btn").onclick = function() {
    let speed_adjustment = Math.max(0.5, Math.round((getSpeedAdjustment() - 0.1) * 10) / 10);
    localStorage.setItem("speed_adjustment", speed_adjustment);
    document.getElementById("speed-text").innerText = speed_adjustment + "x";
}

document.getElementById("faster-btn").onclick = function() {
    let speed_adjustment = Math.min(1.5, Math.round((getSpeedAdjustment() + 0.1) * 10) / 10);
    localStorage.setItem("speed_adjustment", speed_adjustment);
    document.getElementById("speed-text").innerText = speed_adjustment + "x";
}


function stopCube() {
    ALGO_START_DELAY = 9999999;
    ALGO_EXEC_SPEED = 9999999;
}

function startCube() {
    ALGO_START_DELAY = 2000;
    ALGO_EXEC_SPEED = 2000;
}

function tmpStop() {
    stopCube();
    setTimeout(() => startCube(), 10000);
}