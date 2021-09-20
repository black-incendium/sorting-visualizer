let optionsMenu = {
    container: undefined,
    toggleVisibility: undefined,
    addNewMenu: function() {
        let o = document.createElement('div');
        let container = document.createElement('div');
        let toggleVisibility = document.createElement('div');
        o.classList.add('optionsMenu');
        container.classList.add('optionsMenu-container');
        toggleVisibility.classList.add('optionsMenu-toggleVisibility');
        toggleVisibility.innerText = "show options";
        o.appendChild(container);
        o.appendChild(toggleVisibility);
        document.body.appendChild(o);
        document.querySelector('.optionsMenu').style.top = "-9999px";
        optionsMenu.container = container;
        optionsMenu.toggleVisibility = toggleVisibility;
        optionsMenu.shown = false;
        document.querySelector('.optionsMenu').style.top = (document.querySelector('.optionsMenu-toggleVisibility').offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";
        document.querySelector('.optionsMenu-toggleVisibility').addEventListener('click', function(e){
            if (optionsMenu.shown) {
                e.target.innerText = "show options";
                document.querySelector('.optionsMenu').style.top = (e.target.offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";
            } 
            else {
                e.target.innerText = "hide options";
                document.querySelector('.optionsMenu').style.top = "10px"
            }
            optionsMenu.shown = !!((optionsMenu.shown + 1)%2);
        });
    },
    addNewOption: function({type = 'button', description = 'todo', func, inputClass, value, minValue = 0, maxValue = 100, step = 1, placeholder = "todo", actualizedProperty, optionsForList = [{text:"option", func: function(){}}]} = {}) {
        let optionDiv = document.createElement('div');
        optionDiv.classList.add('optionsMenu-option');

        let input = document.createElement('input'); 
        input.type = type;
        input.min = minValue;

        let labelDiv = document.createElement('div');
        labelDiv.classList.add("optionsMenu-label");
        labelDiv.innerHTML = description;

        let inputDiv = document.createElement('div');
        inputDiv.classList.add(`optionsMenu-${type}Input`);
        
        if (type!="list") {
            inputDiv.appendChild(input);
            optionDiv.appendChild(inputDiv);
            optionsMenu.container.appendChild(optionDiv);
        }

        let eventType = "input";

        func = func ?? 
        (type=="range" ? 
        function(e) {optionsMenu[actualizedProperty] = +e.target.value;} 
        : type=="checkbox" ? function(e) {optionsMenu[actualizedProperty] = e.target.checked;} : function(e) {optionsMenu[actualizedProperty] = e.target.value;});

        let newFunc = function(e) {func(e)}

        if (actualizedProperty!=undefined) optionsMenu[actualizedProperty] = value ?? undefined;

        switch (type) {
            case "button":
                input.value = description;
                eventType = "click";
            break;
            case "range":
                let rangeSpan = document.createElement('span');
                newFunc = function(e){
                    rangeSpan.innerText = e.target.value;
                    func(e);
                }
                input.min = minValue;
                input.max = maxValue;
                input.step = step;
                input.value = value ?? 0;
                optionsMenu[actualizedProperty] = value ?? 0;
                labelDiv.innerText = `${description}: `;
                rangeSpan.classList.add(inputClass+"Span");
                labelDiv.appendChild(rangeSpan);
                rangeSpan.innerText = input.value;
                optionDiv.insertBefore(labelDiv, optionDiv.firstChild);
            break;
            case "text":
                input.value = value ?? "";
                optionsMenu[actualizedProperty] = value ?? "";
                input.placeholder = placeholder;
                optionDiv.insertBefore(labelDiv, optionDiv.firstChild);
            break;
            case "checkbox":
                input.checked = value;
                input.insertAdjacentHTML("afterend", description);
            break;
            case "list":
                input = document.createElement('select');
                let opt;
                for (let i=0; i<optionsForList.length; i++) {
                    opt = document.createElement('option');
                    opt.value = optionsForList[i].value;
                    opt.innerText = optionsForList[i].text;
                    input.appendChild(opt);
                }
                inputDiv.appendChild(input);
                optionDiv.appendChild(inputDiv);
                optionsMenu.container.appendChild(optionDiv);
                optionDiv.insertBefore(labelDiv, optionDiv.firstChild);
            break;
        }
        if (inputClass != undefined) input.classList.add(inputClass);
        input.addEventListener(eventType, newFunc); 
        document.querySelector('.optionsMenu').style.top = (document.querySelector('.optionsMenu-toggleVisibility').offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";   
    }
}

window.addEventListener('load', function(){
    document.querySelector('.optionsMenu').style.top = (document.querySelector('.optionsMenu-toggleVisibility').offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";
}, {once: true});

optionsMenu.addNewMenu();

//({type = 'button', description = 'todo', func, inputClass, value, minValue = 0,
// maxValue = 100, step = 1, placeholder = "todo", actualizedProperty, 
//optionsForList = [{text:"option", func: function(){}}]} = {})

optionsMenu.gapSize = 1;
optionsMenu.mainColor = 'blue';
optionsMenu.maxDisplayedValue = 400;
optionsMenu.sortingAlgorithm = 'mergeSort';

optionsMenu.addNewOption({type: "range", description: "sorted numbers", value: 400, minValue: 10, maxValue: 1000, step: 1, actualizedProperty: 'howManySortedNumbers'});
optionsMenu.addNewOption({type: "range", description: "frames speed", value: 1, minValue: 0.1, maxValue: 10, step: 0.1, actualizedProperty: 'framesSpeed'});
optionsMenu.addNewOption({type: "list", description: "sort type", optionsForList: [
    {text: 'merge sort', value: 'mergeSort'},
    {text: 'bubble sort', value: 'bubbleSort'}], 
    func: function(e){
        optionsMenu.sortingAlgorithm = e.target.value
    }
});
optionsMenu.addNewOption({type: "button", description: "generate and sort", func: function(){
    optionsMenu.maxDisplayedValue = optionsMenu.howManySortedNumbers;
    restartAndSort();
}});

/* let options = {
	maxDisplayedValue: window.innerWidth/5,
	gapSize: 1,
} */