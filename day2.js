var tabFrequency = []
var tabSig = []
var tabSigInit = []


function processFile(inputFile) {
    var frequency = 0
    var fs = require('fs')
    var readline = require('readline')
    var instream = fs.createReadStream(inputFile)
    var outstream = new (require('stream'))()
    var rl = readline.createInterface(instream, outstream);
     
    rl.on('line', function (line) {
        var sig = parseInt(line)
        tabSigInit.push(sig)
    });
    
    rl.on('close', function (line) {
        console.log(line)
        mainLoop(tabSigInit, tabSig, tabFrequency)
        console.log('done reading file.')
    });
}

function mainLoop(tabSigInit, tabSig, tabFrequency){
    tabSig[0] = tabSigInit[0]
    tabFrequency[0] = tabSig[0]
    var frequencyToCalculate = 1

    for (let i = 0; i < tabSigInit.length; i++) {
        tabSig[frequencyToCalculate] = tabSigInit[i + 1]
        var newFreq = tabFrequency[frequencyToCalculate - 1] + tabSig[frequencyToCalculate]
        var exists = tabFrequency.indexOf(newFreq) != -1
        tabFrequency[frequencyToCalculate] = newFreq

        //console.log(`${tabSig[frequencyToCalculate]} | ${tabFrequency[frequencyToCalculate]}`)

        if (exists){
            console.log(`----> ${tabFrequency[frequencyToCalculate]} `)
            break
        }


        if (i === tabSigInit.length - 2){
            i = -2
            console.log(`Round ${(frequencyToCalculate+1)/(tabSigInit.length)}`)
        }
        // set the new frequency
        frequencyToCalculate++
    }

    console.log(`[ ${tabSigInit.length} ] tabSigInit`)
    console.log(`[ ${tabSig.length} ] tabSig`)
    console.log(`[ ${tabFrequency.length} ] tabFrequency`)
}



processFile('data2.txt');