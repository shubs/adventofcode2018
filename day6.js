var tabSigInit = []
var _ = require('lodash');
var map = null

function processFile(inputFile) {
    var fs = require('fs')
    var readline = require('readline')
    var instream = fs.createReadStream(inputFile)
    var outstream = new (require('stream'))()
    var rl = readline.createInterface(instream, outstream);
     
    rl.on('line', function (line) {
        var sig = String(line)
        tabSigInit.push(sig)
    });
    
    rl.on('close', function (line) {
        console.log(line)
        mainLoop(tabSigInit)
        console.log('done reading file.')
    });
}

function mainLoop(tabSigInit){
    var maxX = 0
    var maxY = 0

    for (let i = 0; i < tabSigInit.length; i++) {
        const c = tabSigInit[i];
        tabSigInit[i] = parseXY(i, c)
        if (tabSigInit[i].x > maxX)
            maxX = tabSigInit[i].x 
        if (tabSigInit[i].y > maxY)
            maxY = tabSigInit[i].y
    }

    checkAllPosition(maxX, maxY, tabSigInit)
}

function checkAllPosition(maxX, maxY, pointTab){
    var selectedPositionTab = []
    var temp = null
    console.log(`maxX : ${maxX}, maxY : ${maxY}`)
    for (let i = 0; i <= maxX; i++) {
        for (let j = 0; j <= maxY; j++) {
            temp = checkPosition_selected(i, j, maxX, maxY, pointTab)
            if (temp)
                selectedPositionTab.push(temp)
        }
    }
    console.log(`selectedPositionTab :::::: `)
    //console.log(selectedPositionTab)
    console.log(selectedPositionTab.length)
}

function checkPosition_selected(x,y, maxX, maxY, pointTab){
    var distanceTab = []

    pointTab.forEach(p => {
        var e = {
            destinationElementID : p.id,
            destinationDistance : calculateDistance(x, y, p.x, p.y)
        }
        distanceTab.push(e)
    });
    var sumDistances = _.sumBy(distanceTab, 'destinationDistance')
    if (sumDistances < 10000){
        return {
            x : x,
            y : y,
            sum : sumDistances
        }
        //console.log(`for ${x},${y} -> sum : ${_.sumBy(distanceTab, 'destinationDistance')}`)
    }
    // var plusProche = distanceTab.pop()
    // var secondProche = distanceTab.pop()
    // if (plusProche.destinationDistance != secondProche.destinationDistance){
    //     if (x == 0 || y == 0 || x == maxX || y == maxY)
    //         tabSigInit[plusProche.destinationElementID].numLocations = Math.log(0)
    //     else
    //         tabSigInit[plusProche.destinationElementID].numLocations += 1
    // }
}
function checkPosition(x,y, maxX, maxY, pointTab){
    var distanceTab = []

    pointTab.forEach(p => {
        var e = {
            destinationElementID : p.id,
            destinationDistance : calculateDistance(x, y, p.x, p.y)
        }
        distanceTab.push(e)
    });
    
    distanceTab = _.orderBy(distanceTab, ['destinationDistance'], ['desc'])

    var plusProche = distanceTab.pop()
    var secondProche = distanceTab.pop()
    if (plusProche.destinationDistance != secondProche.destinationDistance){
        if (x == 0 || y == 0 || x == maxX || y == maxY)
            tabSigInit[plusProche.destinationElementID].numLocations = Math.log(0)
        else
            tabSigInit[plusProche.destinationElementID].numLocations += 1
    }
}
function calculateDistance(xa, ya, xb, yb){
    return (Math.abs(xa - xb) + Math.abs(ya - yb))
}

function parseXY(index, c){
    var x = parseInt(c.split(', ')[0])
    var y = parseInt(c.split(', ')[1])
    
    return {
        id : index,
        x : x,
        y : y,
        numLocations : 0,
    }
}


processFile('data6.txt');
//processFile('data6test.txt');