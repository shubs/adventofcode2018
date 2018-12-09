var tabSigInit = []
var _ = require('lodash');
var Graph = require("graph-data-structure");
var graph = Graph();

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
        mainLoop3(tabSigInit)
        console.log('done reading file.')
    });
}
function pickkWork(worker){

}

function calculateDuration(node){
    return parseInt(node.charCodeAt(0) - 4)
}
function mainLoop3(tabSigInit){
    //creation graph
    for (let i = 0; i < tabSigInit.length; i++) {
        const points = parseline(tabSigInit[i]);
        //graph.addEdge(points.from, points.to, calculateDuration(points.from));
        graph.addEdge(points.from, points.to, calculateDuration(points.from));
    }
    var seconds = 0

    var dispos = []
    var ordre = []
    var workers = [
        {id:1, time:0, status:null},
        {id:2, time:0, status:null},
        {id:3, time:0, status:null},
        {id:4, time:0, status:null},
        {id:5, time:0, status:null},
    ]

    // var workers = [
    //     {id:1, time:0, status:null},
    //     {id:2, time:0, status:null},
    // ]
        
    dispos = _.concat(dispos, findDispo(graph))
    dispos = _.sortBy(dispos)
    dispos = _.sortedUniq(dispos)

    do {

        for (let i = 0; i < workers.length; i++) {
            const w = workers[i];
            
            if (w.time == 0){
                var firstime = (w.status == null && w.time == 0)
                if (!firstime){
                    ordre.push(w.status)
                    graph.removeNode(w.status)

                    dispos = _.concat(dispos, findDispo2(graph, workers))
                    dispos = _.sortBy(dispos)
                    dispos = _.sortedUniq(dispos)

                }
                
                if (dispos.length != 0 && _.filter(workers, {status : dispos[0]}).length == 0){
                    w.status = dispos.shift()
                    w.time = calculateDuration(w.status)
                } 
                else {
                    w.status = null
                }
            }
            if (w.status && w.status != '.')
                w.time--
        }
       
        //console.log(`${seconds}\t${workers[0].status}\t\t${workers[1].status}\t\t${ordre}`)
        
        console.log(`${seconds}\t${workers[0].status}\t\t${workers[1].status}\t\t${workers[2].status}\t\t${workers[3].status}\t\t${workers[4].status}\t${ordre}`)
        seconds++;
    } while (findDispo(graph) != 0);
    
}
function mainLoop2(tabSigInit){
    //creation graph
    for (let i = 0; i < tabSigInit.length; i++) {
        const points = parseline(tabSigInit[i]);
        //graph.addEdge(points.from, points.to, calculateDuration(points.from));
        graph.addEdge(points.from, points.to, calculateDuration(points.from));
    }

    var seconds = 0

    var dispos = []
    var ordre = []
    var w1 = null
    var w1Time = 0
    var w2 = null
    var w2Time = 0
    console.log(`Seconds\tWorker 1\tWorker 2\tDone`)
    do {
        
        dispos = _.concat(dispos, findDispo(graph))
        dispos = _.sortBy(dispos)
        dispos = _.sortedUniq(dispos)

        
        if (w1Time == 0){
            if (w1){
                ordre.push(w1)
                graph.removeNode(w1)
            }
            else{
                w1 = dispos.shift()
                w1Time = calculateDuration(w1)
            }
        
        }

        if (w2Time == 0){
            if (w2){
                ordre.push(w2)
                graph.removeNode(w2)
            }

            if (dispos.length == 0){
                w2 = '.'
            }
            else{
                w2 = dispos.shift()
                w2Time = calculateDuration(w2)
            }
    
        
        }
        if (w1 != '.')
            w1Time--
        if (w2 != '.')
            w2Time--

        console.log(`${seconds}\t${w1}\t\t${w2}\t${ordre}`)
        seconds++;
    } while (findDispo(graph) != 0);
    
}
function findDispo(graph){
    var dispos = []
    graph.nodes().forEach(e => {
        if (graph.indegree(e) == 0)
            dispos.push(e)
    });
    return dispos
}
function findDispo2(graph, workers){
    var dispos = []
    graph.nodes().forEach(e => {
        if (graph.indegree(e) == 0)
            dispos.push(e)
    });
    workers = _.flatMap(workers, (n) => {return n.status})
    var filterd = _.pullAll(dispos, workers)
    return filterd
}
function mainLoop(tabSigInit){
    //creation graph
    for (let i = 0; i < tabSigInit.length; i++) {
        const points = parseline(tabSigInit[i]);
        graph.addEdge(points.from, points.to);
    }
    var dispos = []
    var ordre = []

    do {
        dispos = _.concat(dispos, findDispo(graph))
        dispos = _.sortBy(dispos)
        dispos = _.sortedUniq(dispos)

        var selected = dispos.shift()
        ordre.push(selected)
        graph.removeNode(selected)

        
        console.log(`ORDRE : \t\t${ordre} \nDispos : \t\t${dispos}\n-------------------------------------`)
        
    } while (findDispo(graph).length != 0);    
    
}



function parseline(l){
    var from = l.split("Step ")[1][0]
    var to = l.slice(36, 37)
    return {
        from : from,
        to: to
    }
}


//processFile('data7.txt');
processFile('data7test.txt');