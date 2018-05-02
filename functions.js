//test

function gotData(data) {
    dates = Object.keys(data["Time Series (Daily)"]);
    let closingNumbers =[[],[],[],[],[],[]];
    let thisYear = today.getFullYear();
    for (let i = 0; i < dates.length; i++) {
        let yearsAgo = thisYear - Number(dates[i].substring(0, 4));
        if (yearsAgo <= 5) {
            closingNumbers[5 - yearsAgo].push(Number(data["Time Series (Daily)"][dates[i]]["4. close"]));
        }
    }
    for (let i = 5; i >= 0; i--) {
        if (closingNumbers[i].length == 0) {
            closingNumbers.splice(i, 1);
        }
    }
    dataStructs.push(new DataStruct(data["Meta Data"]["2. Symbol"], closingNumbers, dataStructs.length));
    ready = true;
}

function getData(symb) {
    loadJSON("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol="+symb+"&apikey=" + apiKey, gotData);
}

function average(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum+=array[i];
    }
    return sum / array.length;
}

function lesser(val1, val2) {
    if (val1 < val2) {
        return val1
    } else {
        return val2
    }
}

function getRandomStock() {
    index = floor(random(symbols.length));
    getData(symbols[index]);
    return symbols[index];
}

function mousePressed() {
    //noLoop();
}

function windowResized() {
    resizeCanvas(windowWidth * .99, windowHeight * .99);
    loadR = width / 20;
}

function smoothArray(array, smoothFactor) {
    let smoothedArray = []
    for (let i= 0; i < smoothFactor; i++) {
        smoothedArray[i] = average(array.slice(0, i+smoothFactor));
    }
    for (let i = smoothFactor; i < array.length - smoothFactor + 1; i++) {
        for (let p = 1; p < smoothFactor; p++) {
            smoothedArray[i] = average(array.slice(i-p, i+p));
        }
    }
    for (let i= array.length - smoothFactor + 1; i < array.length; i++) {
        smoothedArray[i] = average(array.slice(i - smoothFactor, array.length - 1));
    }
    return smoothedArray;
}