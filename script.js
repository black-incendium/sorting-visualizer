let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 2*window.innerWidth;
canvas.height = 2*window.innerHeight;
let mainArray = [1];
let copyArray = [1];
let actions = [];
let timeout;

function drawAtPosition({value = 0, position = 0} = {}) {
	let width = (canvas.width-optionsMenu.gapSize)/mainArray.length - optionsMenu.gapSize;
	//coordinates of upper left corner of the drawn rectangle
	let x = position*(canvas.width - optionsMenu.gapSize)/mainArray.length + optionsMenu.gapSize;
	let y = canvas.height*(1 - value/optionsMenu.maxDisplayedValue);

	ctx.clearRect(x-optionsMenu.gapSize, 0, width+optionsMenu.gapSize*2, canvas.height);
	ctx.fillStyle = `hsl(${value/optionsMenu.howManySortedNumbers*360},100,50)`;
	ctx.fillRect(x, y, width, canvas.height*value/optionsMenu.maxDisplayedValue);
}

function swap(pos1 = 0, pos2 = 0) {
	let temporary = mainArray[pos1];
	mainArray[pos1] = mainArray[pos2];
	mainArray[pos2] = temporary;
	drawAtPosition({value: mainArray[pos1], position: pos1});
	drawAtPosition({value: mainArray[pos2], position: pos2});
}

function randomizeArray1(min, max) {
	mainArray = [];
	copyArray = [];
	let temporaryArray = [];
	for (let i=1; i<max-min+2; i++) {
		temporaryArray.push(i);
	}
	for (let i=0; i<max-min+1; i++) {
		mainArray.push(temporaryArray.splice(Math.floor(Math.random()*temporaryArray.length), 1)[0]);
		copyArray.push(mainArray[mainArray.length-1]);
	}
	for (let i=0; i<mainArray.length; i++) {
		drawAtPosition({position: i, value: mainArray[i]});
	}
}

function randomizeArray2(elements, min, max) {
	mainArray = [];
	copyArray = [];
	let temp = 0;
	for (let i=0; i<elements; i++) {
		temp = Math.floor(Math.random()*(max-min)+min);
		mainArray.push(temp);
		copyArray.push(temp);
	}
}

function doBubbleSort() {
	actions = [];
	let temp = 0;
	let actualRunSwaps = 0;
	do {
		actualRunSwaps = 0;
		for (let i=0; i<copyArray.length-1; i++) {
			//actions.push({type: "compare", first: i, second: i+1, firstValue: copyArray[i], secondValue: copyArray[i+1]});
			if (copyArray[i]>copyArray[i+1]) {
				actions.push({type: "swap", first: i, second: i+1});
				temp = copyArray[i+1];
				copyArray[i+1] = copyArray[i];
				copyArray[i] = temp;
				actualRunSwaps += 1;
			}
		}
	} while (actualRunSwaps != 0)
}

function doMergeSort() {
	actions = [];
	let auxiliaryArray = [];

	mergeSort(0, copyArray.length-1);

	function mergeSort(ind1, ind2) {
		if (ind1 + 1 >= ind2) {
			merge(ind1, ind1, ind2, ind2);
			return;
		}
		let m = Math.floor((ind1 + ind2)/2);
		mergeSort(ind1, m);
		mergeSort(m+1, ind2);
		merge(ind1, m, m+1, ind2);
	}

	function merge(p1, q1, p2, q2) {
		let limit1 = p1;	
		let limit2 = q2;
		for (let i=0; i<limit2-limit1+1; i++) {
			if (p1 > q1) {
				auxiliaryArray.push(copyArray[p2]);
				p2++;
			}
			else if (p2 > q2) {
				auxiliaryArray.push(copyArray[p1]);
				p1++;
			}
			else if (copyArray[p1] < copyArray[p2]) {
				auxiliaryArray.push(copyArray[p1]);
				p1++;
			}
			else {
				auxiliaryArray.push(copyArray[p2]);
				p2++;
			}
		}
		transferFromAux(limit1,limit2);
	}

	function transferFromAux(p, q) {
		for (let i=0; i<q-p+1; i++) {
			copyArray[p+i] = auxiliaryArray.splice(0,1)[0];
			actions.push({first: p+i, firstValue: copyArray[p+i], type: "placeValue"});
		}
	}
}

let renderMultiple = (function(){
	let lastCompared = {
		first: -1,
		second: 0,
		firstValue: 0,
		secondValue: 0
	};
	let leftToRender = 0;
	lastRendered = -1;
	return {
		go: function(x){
			leftToRender += x;
			while (leftToRender>=1) {
				if (lastCompared.first != -1) {
					drawAtPosition({position: lastCompared.first, value: lastCompared.firstValue});
					drawAtPosition({position: lastCompared.second, value: lastCompared.secondValue});
					lastCompared.first = -1;
				}

				if (actions[lastRendered+1].type == "swap") {
					swap(actions[lastRendered+1].first, actions[lastRendered+1].second);
				}
				else if (actions[lastRendered+1].type == "placeValue") {
					drawAtPosition({position: actions[lastRendered+1].first, value: actions[lastRendered+1].firstValue})
				}
				/* else if (actions[lastRendered+1].type == "compare") {
					drawAtPosition({position: actions[lastRendered+1].first, value: actions[lastRendered+1].firstValue, color: optionsMenu.secondaryColor});
					drawAtPosition({position: actions[lastRendered+1].second, value: actions[lastRendered+1].secondValue, color: optionsMenu.secondaryColor});
					lastCompared = actions[lastRendered+1];
				} */
				lastRendered++;
				if (lastRendered == actions.length-1) return false;
				leftToRender--;
			}
			return true;
		}, 
		restart: function(){
			lastCompared = {
				first: -1,
				second: 0,
				firstValue: 0,
				secondValue: 0
			};
			leftToRender = 0;
			lastRendered = -1;
		}
	}
})()

randomizeArray1(1,optionsMenu.howManySortedNumbers-1)

function foo() {
	if (renderMultiple.go(optionsMenu.framesSpeed)) timeout = setTimeout(foo, 0)
}

function restartAndSort() {
	clearTimeout(timeout);
	renderMultiple.restart();
	randomizeArray1(1,optionsMenu.howManySortedNumbers-1);
	switch(optionsMenu.sortingAlgorithm) {
		case 'mergeSort': doMergeSort(); break;
		case 'bubbleSort': doBubbleSort(); break;
	}
	foo();
}

restartAndSort();
