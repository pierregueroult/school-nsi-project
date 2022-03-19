var currentMin = 1;
var currentMax = 6;

function loadData(min, max) {
    var ws = new WebSocket(`ws://127.0.0.1:3000/${min}-${max}`)

    console.log(min, max);

    function removeElements() {
        e = document.querySelector('.result__list')
        u = document.querySelectorAll('.result__list__child')
        u.forEach(el => {
            e.removeChild(el);
        })
    }

    function addNowList(list = []) {
        e = document.querySelector('.result__list');
        list.forEach(el => {
            let elContainer = document.createElement("li");
            elContainer.className = 'result__list__child';
            el.forEach(ele => {
                let eleData = document.createElement('p');
                eleData.innerHTML = ele
                elContainer.appendChild(eleData);
            })
            e.appendChild(elContainer);
        })
    }
    
    ws.onmessage = function (event) {
        let rawData = event.data;

        let rowReg = /\(([^)]+)\)/g;
        let rowData = [...rawData.match(rowReg)].flat();

        let elReg = /'(.*?)'/g

        let fullResult =  [];

        rowData.forEach(el => {
            e = [...el.match(elReg)]

            let result = [];

            e.forEach(ele => {
                x = ele.replace("'", "").replace("'", "")
                result.push(x)
            });

            fullResult.push(result);
        });

        console.log(fullResult)

        removeElements();

        addNowList(fullResult);

    }
}


loadData(currentMin, currentMax)


document.querySelector('#before').onclick = function () {
    if (currentMin != 1) {
        currentMin -= 5;
        currentMax -= 5;
    } else {
        window.alert('Impossible')
    }
    loadData(currentMin, currentMax);
}

document.querySelector('#after').onclick = function () {
    currentMin += 5;
    currentMax += 5;
    loadData(currentMin, currentMax);
}