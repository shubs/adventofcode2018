var tabSigInit = []
var map = []

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

    for (let i = 0; i < tabSigInit.length; i++) {
        const e = tabSigInit[i]

        var infos = parseLine(e)
        buildMap2(infos)

    }
    console.log(calculateOverlap())
    console.log(agrementMap())
    

}

function parseLine(line){
    const reclamationObject = {
        ref : null,
        left : null,
        top : null,
        width : null,
        height : null,
    }
    reclamationObject.ref = line.split("@")[0].trim()
    const otherside = line.split("@")[1].trim()
    const parties = otherside.split(': ')

    const taille = parties[1].trim()
    const coordonnes = parties[0].trim()

    reclamationObject.width = parseInt(taille.split('x')[0])
    reclamationObject.height = parseInt(taille.split('x')[1])

    reclamationObject.left = parseInt(coordonnes.split(',')[0])
    reclamationObject.top = parseInt(coordonnes.split(',')[1])

    return reclamationObject
}


function buildMap2(ref) {
    const wMap = ref.left + ref.width
    const hMap = ref.top + ref.height

    var existe

    for (let i = 1; i <= hMap; i++) {
        for (let j = 1; j <= wMap; j++) {
            var stringi = String(i)
            var stringj = String(j)
            if (!map[i])
                map[i] = []

            if (!map[i][j])
                map[i][j] = 0

            if (i >  ref.top && j >  ref.left)
                map[i][j] += 1
        }
    }
}



function buildMap(ref) {
    const wMap = ref.left + ref.width
    const hMap = ref.top + ref.height

    var existe

    for (let i = 1; i <= hMap; i++) {
        for (let j = 1; j <= wMap; j++) {
            existe = false
            // si ca existe
            for (let index = 0; index < map.length; index++) {
                const e = map[index];
                if (e.x == j && e.y == i){
                    
                    if (i >  ref.top && j >  ref.left)
                        e.val += 1
                    existe = true
                    break
                }
            }
            if (!existe){
                var o = {
                    x : j,
                    y : i,
                    val : 0
                }
                if (i >  ref.top && j >  ref.left)
                    o.val += 1
                map.push(o)
                
            }
        }
    }
}

function showMap(){
    var v = ''
    i = 1
    map.forEach(element => {
        if (i != element.y){
            v += '\n'
            i++
        }
        if (element.val != 0)
            v = v + element.val
        else
            v = v + '.'
    });
    return v
}

function calculateOverlap() {
    var res = 0
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {

            if (map[i] && map[j])
            {
                const element = map[i][j];
                if (element > 1)
                    res += 1
            }
        }
        
    }
    return res
}

function agrementMap(){
    var colisionList = []
    tabSigInit.forEach(e => {
        var stillFalse = true
        var ref = parseLine(e)
        const wMap = ref.left + ref.width
        const hMap = ref.top + ref.height

        for (let i = ref.top +1; i <= hMap; i++) {
            for (let j = ref.left +1; j <= wMap; j++) {
                if (map[i] && map[j]){
                    if (map[i][j] > 1)
                        stillFalse = false
                }
            }
        }
        if (stillFalse == true)
            colisionList.push(ref.ref)
    });
    return colisionList
}

processFile('dataDay3.txt');