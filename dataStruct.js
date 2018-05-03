function DataStruct(name, values, index) {
    this.name = name;
    this.values = values;
    this.index = index;
    this.combinedValues = []
    this.smoothedValues = [];
    this.intervals = [];
    this.smoothedMappedValues = [];
    this.averagedVals = [];
    this.shortest = 0;
    this.numOfValues = 0;
    this.high = [];
    this.low = [];
    this.average = [];
    this.tenMinimums = [[]];
    this.tenMaximums = [[]];
    this.predictability = 0;
    this.yearPAverage = [0, 0, 0, 0, 0];
    for (let j = 0; j < this.values.length; j++) {
        this.high[j] = max(values[j]);
        this.low[j] = min(values[j]);
        this.average[j] = average(values[j]);
        this.combinedValues = this.combinedValues.concat(values[j]);
    }
    this.combinedSmoothedValues = smoothArray(this.combinedValues, 10);
    this.overallHigh = max(this.high);
    this.overallLow = min(this.low);
    this.overallAverage = average(this.average);
    for (let i = 0; i < this.values.length; i++) {
        this.smoothedValues[i] = this.combinedSmoothedValues.slice(this.numOfValues, this.numOfValues + this.values[i].length);
        this.numOfValues+=this.values[i].length;
    }
    for (let j = 0; j < this.values.length; j++) {
        this.smoothedMappedValues[j] = smoothArray(this.values[j], 7);
        let low = min(this.smoothedMappedValues[j]);
        let high = max(this.smoothedMappedValues[j]);
        for (let i = 0; i < this.smoothedMappedValues[j].length; i++) {
            this.smoothedMappedValues[j][i] = map(this.smoothedMappedValues[j][i], low, high, 0, 1);
        }
        if (this.smoothedMappedValues[j].length < this.smoothedMappedValues[this.shortest].length && j != 5) {
            this.shortest = j;
        }
    }
    for (let i = 0; i < this.smoothedMappedValues[this.shortest].length; i++) {
        let averagable = [];
        for (let j = 0; j < this.smoothedMappedValues.length - 1; j++) {
            averagable[j] = this.smoothedMappedValues[j][i]
        }
        this.averagedVals[i] = average(averagable);
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
    
    this.setMaxAndMins = function() {
        //let blank = [];
        for (let i = 0; i < this.smoothedValues.length; i++) {
            this.tenMaximums[i] = [];
            this.tenMinimums[i] = [];
        }
    }
    
    this.calculateMaxAndMins = function() {
        let foundMins = 0;
        let foundMaxs = 0;
        
        this.setMaxAndMins();
        
        for (let j = 0; j < this.smoothedMappedValues.length; j++) {
            foundMins = 0;
            foundMaxs = 0;
            for (let i = 1; i < this.smoothedMappedValues[j].length - 1; i++) {
                if (this.smoothedMappedValues[j][i] > this.smoothedMappedValues[j][i+1] && this.smoothedMappedValues[j][i] > this.smoothedMappedValues[j][i-1]) {
                    this.tenMaximums[j][foundMaxs] = createVector(i, this.smoothedMappedValues[j][i]); 
                    foundMaxs++;
                } else if (this.smoothedMappedValues[j][i] < this.smoothedMappedValues[j][i+1] && this.smoothedMappedValues[j][i] < this.smoothedMappedValues[j][i-1]) {
                    this.tenMinimums[j][foundMins] = createVector(i, this.smoothedMappedValues[j][i]);
                    foundMins++;
                }
            }
        }
    }
    
    
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
            for (let i = 0; i < this.smoothedMappedValues[j].length; i++) {
                vertex(c*xdist, map(this.smoothedMappedValues[j][(this.smoothedMappedValues[j].length - i)], 0, 1, gridHeight, 0));
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
    
    this.graphAverage = function(x, y, xScale, yScale) {
        //graphFields.push([this.index, 3, x, y, xScale, yScale]);
        translate(x, y);
        let gridWidth = width*xScale;
        let gridHeight = height*yScale;
        let xdist = gridWidth / this.averagedVals.length;
        fill(255);
        rect(0, 0, gridWidth, gridHeight);
        stroke(0, 255, 0);
        line(0,map(average(this.averagedVals), 0, 1, gridHeight, 0), gridWidth, map(average(this.averagedVals), 0, 1, gridHeight, 0))
        let c = 0;
        stroke(0, 0, 255);
        noFill();
        beginShape();
        for (let i = 0; i < this.averagedVals.length; i++) {
            vertex(c*xdist, map(this.averagedVals[(this.averagedVals.length - i)], 0, 1, gridHeight, 0));
            c++;
        }
        endShape();
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
    
    this.pickIntervals = function() {
        for (let j = 0; j < this.averagedVals.length - 1; j++) {
            let xdist = (this.averagedVals[j].length - 1) / 10;
            for (let i = 0; i <= 10; i++) {
                if (this.averagedVals[j][xdist*(i+1)] - this.averagedVals[j][xdist*i] > .1) {
                    this.intervals.push(new intervalToStudy(xdist*i, xdist*(i+1)));
                }
            }
        }
    }
    
    
    this.logToConsole = function() {
        console.log("name: " + this.name);
        for (let i = 0; i < this.values.length; i++) {
            console.log("high year#" + i + ": " + this.high[i]);
            console.log("low year#" + i + ": " + this.low[i]);
            console.log("average year#" + i + ": " + this.average[i]);
        }
    }
}

function intervalToStudy(start, end) {
    this.start = start;
    this.end = end;
}