var tabSigInit = []
var _ = require('lodash');
var plotly = require('plotly')('shubham92i','Di8Br5H8aCRs55WWpEd8');

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

    var points = _.map(tabSigInit, parseLine)
    var distance = null
    var bestmap = points
    var minDistance = 100000000
    var besttime = 0
    for (let s = 0; s < 10600; s++) {
        distance = calculDisatance(points)
        if (minDistance > distance){
            minDistance = distance
            bestmap = points
            besttime = s
        }
        point = evolution(points)
        if (s == 10514){
            points.forEach(e => {
                console.log(`${e.x}`)
            });
            console.log('---------------------------')
            points.forEach(e => {
                console.log(`${e.y}`)
            });
        }
        console.log(besttime + ' -> ' +minDistance)
    }
    printPoints(bestmap)
    
}
function calculDisatance(points){
    var sortedy = _.sortBy(points, 'y')
    var sortedx = _.sortBy(points, 'x')
    var maxy = sortedy.pop()
    var miny = sortedy.shift()
    var maxx = sortedx.pop()
    var minx = sortedx.shift()

    d = Math.abs(miny.y - maxy.y) + Math.abs(minx.x - maxx.x) 
    return d
}

function evolution (points){
    points.forEach(p => {
        p.x += p.vx
        p.y += p.vy
    });
    return points
}


function printPoints(points){
    var i = 0
    var trace2 = {
        x: [],
        y: [],
        mode: "markers",
        name: "Europe",
        text: [],
        marker: {
          color: "rgb(255, 217, 102)",
          size: 12,
          line: {
            color: "white",
            width: 0.5
          }
        },
        type: "scatter"
      };
      points.forEach(p => {
          trace2.x.push(p.x)
          trace2.y.push(p.y)
          trace2.text.push(i)
          i++
      });
      
      
      var data = [trace2];
      var layout = {
        title: "Quarter 1 Growth",
        xaxis: {
          title: "GDP per Capita",
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          title: "Percent",
          showline: false
        }
      };
      var graphOptions = {layout: layout, filename: "line-style", fileopt: "overwrite"};
      plotly.plot(data, graphOptions, function (err, msg) {
          console.log(msg);
      });
}




function parseLine(line){
    return {
        x : parseInt(line.split('position=<')[1].split(',')[0].trim()),
        y : parseInt(line.split('position=<')[1].split(', ')[1].split('>')[0].trim()),
        vx : parseInt(line.split('position=<')[1].split(',')[1].split('<')[1].trim()),
        vy : parseInt(line.split('position=<')[1].split(',')[2].split('>')[0].trim()),
        s : 0
    }
}
processFile('data10.txt')