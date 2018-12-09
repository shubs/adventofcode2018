var tabSigInit = []
var dataTree = require('data-tree')
var tree = dataTree.create();
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

    var data = tabSigInit[0].split(' ')
    //console.log(data)

    var currentKey = 'A'
    var nbchild = parseInt(data.shift())
    var nbMeta = parseInt(data.shift())
    var meta = []

    for (let i = 0; i < nbMeta; i++) {
        meta.push(parseInt(data.pop()))
    }

    var root = {
        key: 'A',
        value: { val:0, nbMeta:nbMeta, meta: meta}
    }
    var rootNode = tree.insert(root);

    parseChildrens(nbchild, currentKey, data, rootNode)

    // var s = 0 
    // tree.traverser().traverseBFS(function(node){
    //     var t = node.data().value.meta
    //     s += node.data().value.meta.reduce(function(a, b) { return parseInt(a) + parseInt(b); }, 0);
    // });
    // console.log(s)
    //printTree()
    console.log(calculateValues(rootNode))

}

function calculateValues (myNode){
    if (myNode._childNodes == 0)
        return myNode._data.value.meta.reduce(function(a, b) { return parseInt(a) + parseInt(b); }, 0);
    else {
        var sum = 0
        var meta = myNode._data.value.meta
        meta.forEach(e => {
            if(myNode._childNodes[e-1])
                sum += calculateValues(myNode._childNodes[e-1])
        });
        return sum
        
    }
}

function printTree(){
    console.log('--=-=-=-=-=-=-=-=-=-=-=-=-')
    tree.traverser().traverseBFS(function(node){
        console.log(node.data());
    });
}
function printNode(a){
    console.log(a._data)
}

function parseChildrens(nbchildrens, currentKey, data, parent){
    var lenOfArray = 0

    if (nbchildrens == 0)
        return 0

    for (let i = 0; i < nbchildrens; i++) {
        var currentKey = String.fromCharCode(currentKey.charCodeAt(0)+1)
        var nbchild = parseInt(data.shift())
        var nbMeta = parseInt(data.shift())

        var newNodeData = {
            key: currentKey,
            value: { val:0, nbMeta:nbMeta, meta: meta}
        }

        var newNode = tree.insertToNode(parent, newNodeData);

        lenOfArray += 2
        var lenDesFils = parseChildrens(nbchild, currentKey, data, newNode)

        var meta = data.splice(0, nbMeta).map(function(a) { return parseInt(a); });
        lenOfArray += nbMeta

        if(newNode._data)
            newNode._data.value.meta = meta

    }

    return lenOfArray
}

processFile('data8.txt')