var tabSigInit = []
var DLL = require('./doubly-linked-list.js');
var _ = require('lodash');
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

    // a dupliquer plus tard
    tabSigInit.forEach(e => {
        console.log(e)
        var gameInitData = parseGame(e)
        playGame(gameInitData)
    });


    
}

function playGame(gameInitData){
    var players = [] 
    for (let i = 1; i <= gameInitData.nbPlayers; i++) {
        const p = {
            id : i,
            score : 0
        }
        players.push(p)
    }
    var marbels = _.range(1, gameInitData. lastMarbelPoint);

    var currentMarbel = null
    
    var circle = new DLL.DoublyLinkedList();
    currentMarbel = circle.append(0)
    var currentPlayer = players[players.length - 1]
    

    // turns
    do {
        currentPlayer = getNextPlayer(players, currentPlayer, gameInitData.nbPlayers)
        
        // action
        var playedMarbel = marbels.shift()

        //check
        if (playedMarbel % 23 == 0){

            currentPlayer.score += playedMarbel
            
            var removedMarbel = currentMarbel
            for (let i = 0; i < 7; i++) {
                if (removedMarbel.prev) 
                    removedMarbel = removedMarbel.prev
                else
                    removedMarbel = circle._tail
            }

            if (removedMarbel.next)
                currentMarbel = removedMarbel.next
            else
                currentMarbel = circle._head
            
            removedMarbel.remove()
            currentPlayer.score += removedMarbel.data

            //assignation
            //celui qui etait a coté de celui remové devient le current
            //currentMarbel = removedMarbel
            //_.findIndex - 7
        }
        else{
            var nextOne = null
            if (currentMarbel.next){
                nextOne  = currentMarbel.next
            }
            else {
                nextOne = circle._head
            }
            
            currentMarbel = nextOne.append(playedMarbel)

            // assignation
        }
        
        // end action

    } while (marbels.length != 0)
    
    printWinner(players)
}


function getNextPlayer (players, currentPlayer, nblayers){
    if (currentPlayer.id != nblayers)
        return players[currentPlayer.id]
    
    return players[0]
}

function parseGame(line){
    return {
        nbPlayers : parseInt(line.split(' players')[0]),
        lastMarbelPoint : parseInt(line.split('worth ')[1].split(' points')[0]),
    }
}

function stringGame(circle){
    var node = circle.head()
    var r = ''
    for (let i = 0; i < circle.size(); i++) {
        r += (node.data + ',')
        node = node.next;
    }
    return r
}

function printTour(circle, currentPlayer){
    console.log(`[${currentPlayer.id}] ${stringGame(circle)}`)
}

function printPlayers(players){
    _.each(players, (p) => {
        console.log(`#${p.id} -> ${p.score}`)
    })
}
function printWinner(players) {
    console.log(_.sortBy(players, ['score']).pop())
}
processFile('data9.txt')