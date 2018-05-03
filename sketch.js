const apiKey = "T3MJBA1ODIL84CIP"
let dataStructs = [];
let today = new Date();
let ready = false;
let graphFields = [];
let symbols = ["AAPL","ADBE","ADI","ADP","ADSK","AKAM","ALTR","ALXN","AMAT","AMGN","AMZN","ATVI","AVGO","BBBY","BIDU","BIIB","BRCM","CA","CELG","CERN","CHKP","CHRW","CHTR","CMCSA","COST","CSCO","CTRX","CTSH","CTXS","DISCA","DISH","DLTR","DTV","EBAY","EQIX","ESRX","EXPD","EXPE","FAST","FB","FFIV","FISV","FOXA","GILD","GMCR","GOOG","GOOGL","GRMN","HSIC","ILMN","INTC","INTU","ISRG","KLAC","KRFT","LBTYA","LINTA","LLTC","LMCA","MAR","MAT","MDLZ","MNST","MSFT","MU","MXIM","MYL","NFLX","NTAP","NVDA","NXPI","ORLY","PAYX","PCAR","PCLN","QCOM","REGN","ROST","SBAC","SBUX","SIAL","SIRI","SNDK","SPLS","SRCL","STX","SYMC","TRIP","TSCO","TSLA","TXN","VIAB","VOD","VRSK","VRTX","WDC","WFM","WYNN","XLNX","YHOO"];
let index;
let displayIndex = 0;
let loadA;
let loadR;

function setup() {
    createCanvas(windowWidth * .99, windowHeight * .99);
    background(255, 0, 0);
    strokeWeight(3);
    textAlign(CENTER);
    index = floor(random(symbols.length));
    getData(symbols[index]);
    loadA = 0;
    loadR = width / 20;
}

function draw() {
    background(0);
    if (ready) {
        noLoop();
        //dataStructs[dataStructs.length - 1].graphWithOutMapping(0, 0, 1, .495);
        //dataStructs[dataStructs.length - 1].graphWithMapping(0, height / 2, .5, .5);
        //dataStructs[dataStructs.length - 1].graphSmoothWithOutMapping(0, 0, 1, .495);
        dataStructs[dataStructs.length - 1].graphAverage(0, 0, 1, .495);
        dataStructs[dataStructs.length - 1].graphSmoothWithMapping(0, height / 2, 1, .5);
        let col = color(random(255), random(255), random(255));
        stroke(col);
        textSize(100);
        fill(col);
        text(dataStructs[dataStructs.length - 1].calculatePredictability(), width /2, height / 2);
    } else {
        textSize(100);
        fill(255);
        stroke(255);
        translate(width / 2, height / 2);
        text("loading data...", 0, -loadR * 1.5);
        let maxA = PI * 1.6;
        for (let i = 0; i < maxA; i+=.1) {
            ellipse(cos(loadA - i) * loadR, sin(loadA - i) * loadR, loadR / 3 * (maxA - i) / maxA, loadR / 3 * (maxA - i) / maxA);
        }
        loadA += map(sin(loadA), -1, 1, .1, .3);
    }
}


