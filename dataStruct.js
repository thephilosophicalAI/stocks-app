function DataStruct(name, values, index) {
    this.name = name;
    this.values = values;
    this.index = index;
    this.combinedValues = []
    this.smoothedValues = [];
    this.numOfValues = 0;
    this.high = [];
    this.low = [];
    this.average = [];
    this.predictability = 0;
    this.yearPAverage = [0, 0, 0, 0, 0];
    for (let j = 0; j < this.values.length; j++) {
        this.high[j] = max(values[j]);
        this.low[j] = min(values[j]);
        this.average[j] = average(values[j]);
        this.combinedValues = this.combinedValues.concat(values[j]);
    }
    this.combinedSmoothedValues = smoothArray(this.combinedValues, 5);
    this.overallHigh = max(this.high);
    this.overallLow = min(this.low);
    this.overallAverage = average(this.average);
    for (let i = 0; i < this.values.length; i++) {
        this.smoothedValues[i] = this.combinedSmoothedValues.slice(this.numOfValues, this.numOfValues + this.values[i].length);
        this.numOfValues+=this.values[i].length;
    }
    
    this.calculatePredictability = function() {
        for (let j = 1; j < this.smoothedValues.length; j++) {  
            let theLesser = lesser(this.smoothedValues[j].length, this.smoothedValues[j-1].length);
            for (let i = 0; i < theLesser; i++) {
                this.yearPAverage[j-1] += abs(norm(this.smoothedValues[j][i], this.low[j], this.high[j]) - norm(this.smoothedValues[j-1][i], this.low[j-1], this.high[j-1]));
            }
            this.yearPAverage[j-1]/=this.smoothedValues[j-1].length;
        }
        return average(this.yearPAverage);
    }
    
    this.predictability = this.calculatePredictability();
    
    this.graphWithOutMapping = function(x, y, xScale, yScale) {
        graphFields.push([this.index, 0, x, y, xScale, yScale]);
        translate(x, y);
        let gridWidth = width*xScale;
        let gridHeight = height*yScale;
        let xdist = gridWidth / this.numOfValues;
        fill(255);
        rect(0, 0, gridWidth, gridHeight);
        stroke(0, 255, 0);
        line(0,map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0), gridWidth, map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0));
        let c = 0;
        for (let j = 0; j < this.values.length; j++) {
            stroke(255, 0, 0);
            line((this.values[j].length + c)* xdist, 0, (this.values[j].length + c) * xdist, gridHeight)
            stroke(0, 0, 255);
            noFill();
            beginShape();
            for (let i = this.values[j].length - 1; i >= 0; i--) {
                vertex(c*xdist, map(this.values[j][i], this.overallLow, this.overallHigh, gridHeight, 0));
                c++;
            }
            endShape();
        }
        fill(100);
        stroke(0);
        textSize(gridHeight / 8);
        rect(0, 0, textWidth(this.name), gridHeight / 7.5);
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        text(this.name, 0, 0);
        resetMatrix();
    }
    this.graphWithMapping = function(x, y, xScale, yScale) {
        graphFields.push([this.index, 1, x, y, xScale, yScale]);
        translate(x, y);
        let gridWidth = width*xScale;
        let gridHeight = height*yScale;
        let xdist = gridWidth / this.numOfValues;
        fill(255);
        rect(0, 0, gridWidth, gridHeight);
        stroke(0, 255, 0);
        line(0,map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0), gridWidth, map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0))
        let c = 0;
        for(let j = 0; j < this.values.length; j++) {
            stroke(255, 0, 0);
            line((this.values[j].length + c)* xdist, 0, (this.values[j].length + c) * xdist, gridHeight)
            stroke(0, 0, 255);
            noFill();
            beginShape();
            for (let i = 0; i < this.values[j].length; i++) {
                vertex(c*xdist, map(this.values[j][(this.values[j].length - i)], this.low[j], this.high[j], gridHeight, 0));
                c++;
            }
            endShape();
        }
        fill(100);
        stroke(0);
        textSize(gridHeight / 8);
        rect(0, 0, textWidth(this.name), gridHeight / 7.5);
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        text(this.name, 0, 0);
        resetMatrix();
    }
    this.graphSmoothWithOutMapping = function(x, y, xScale, yScale) {
        graphFields.push([this.index, 2, x, y, xScale, yScale]);
        translate(x, y);
        let gridWidth = width*xScale;
        let gridHeight = height*yScale;
        let xdist = gridWidth / this.numOfValues;
        fill(255);
        rect(0, 0, gridWidth, gridHeight);
        stroke(0, 255, 0);
        line(0,map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0), gridWidth, map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0))
        let c = 0;
        for (let j = 0; j < this.smoothedValues.length; j++) {
            stroke(255, 0, 0);
            line((this.smoothedValues[j].length + c)* xdist, 0, (this.smoothedValues[j].length + c) * xdist, gridHeight)
            stroke(0, 0, 255);
            noFill();
            beginShape();
            for (let i = this.smoothedValues[j].length - 1; i >= 0; i--) {
                vertex(c*xdist, map(this.smoothedValues[j][i], this.overallLow, this.overallHigh, gridHeight, 0));
                c++;
            }
            endShape();
        }
        fill(100);
        stroke(0);
        textSize(gridHeight / 8);
        rect(0, 0, textWidth(this.name), gridHeight / 7.5);
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        text(this.name, 0, 0);
        resetMatrix();
    }
    this.graphSmoothWithMapping = function(x, y, xScale, yScale) {
        graphFields.push([this.index, 3, x, y, xScale, yScale]);
        translate(x, y);
        let gridWidth = width*xScale;
        let gridHeight = height*yScale;
        let xdist = gridWidth / this.numOfValues;
        fill(255);
        rect(0, 0, gridWidth, gridHeight);
        stroke(0, 255, 0);
        line(0,map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0), gridWidth, map(this.overallAverage, this.overallLow, this.overallHigh, gridHeight, 0))
        let c = 0;
        for(let j = 0; j < this.smoothedValues.length; j++) {
            stroke(255, 0, 0);
            line((this.smoothedValues[j].length + c)* xdist, 0, (this.smoothedValues[j].length + c) * xdist, gridHeight)
            stroke(0, 0, 255);
            noFill();
            beginShape();
            for (let i = 0; i < this.smoothedValues[j].length; i++) {
                vertex(c*xdist, map(this.smoothedValues[j][(this.smoothedValues[j].length - i)], this.low[j], this.high[j], gridHeight, 0));
                c++;
            }
            endShape();
        }
        fill(100);
        stroke(0);
        textSize(gridHeight / 8);
        rect(0, 0, textWidth(this.name), gridHeight / 7.5);
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        text(this.name, 0, 0);
        resetMatrix();
    }
    
    this.textValue = function(infoArr) {
        let type = infoArr[1];
        translate(infoArr[2], infoArr[3]);
        let gridWidth = width*infoArr[4];
        let gridHeight = height*infoArr[5];
        let xdist = gridWidth / this.numOfValues;
        let xMapped = mouseX - infoArr[2];
        let index = xMapped / xdist;
        let val = this.combinedValues[index];
    }
    
    /* this.search(sf) {
        let lengthsArray = []
        for (let i = 0; i < this.smoothedValues.length - 1; i++) {
            lengthsArray[u] = this.smoothedValues[i].length;
        }
        let least = min(lengthsArray);
        for (let i = sf; i < least; i++) {
            let checkedArray
            for (let j = 0; j < this.lengthsArray[i]; j++) {
                
            }
        }
     
    } */
    
    
    this.logToConsole = function() {
        console.log("name: " + this.name);
        for (let i = 0; i < this.values.length; i++) {
            console.log("high year#" + i + ": " + this.high[i]);
            console.log("low year#" + i + ": " + this.low[i]);
            console.log("average year#" + i + ": " + this.average[i]);
        }
    }
}