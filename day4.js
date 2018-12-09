var tabSigInit = []
var entrees = []
var sortedEntrees = []
var guardlogs = []
var moment = require('moment');
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
    for (let i = 0; i < tabSigInit.length; i++) {
        const e = tabSigInit[i]
        var infos = parseLine(e)
        entrees.push(infos)
    }
    sortedEntrees = entrees.sort(compareEntrees)
    agrementSortedEntrees(sortedEntrees)
    printEntrees(sortedEntrees)
    console.log('-=-=-=-=-=-=-=-=-=-=-')
    var sleepers = calculateGuardTime(sortedEntrees)
    var i = 0
    for (let index = 0; index < sleepers.length; index++) {
        const element = sleepers[index];
        if (element){
            console.log(`GUARD : ${index} sleeps ${element} min`)
        }
    }
}

function calculateGuardTime(entrees){
    var timeAsleepArray = []
    var chunk = []
    //init
    var currentG = entrees[0].guardRef

    entrees.forEach(e => {
        if (e.guardRef != currentG){
            if (!timeAsleepArray[String(e.guardRef)]) {timeAsleepArray[String(e.guardRef)] = 0}
            timeAsleepArray[String(e.guardRef)] += calculateTimeForChunk(chunk)
            chunk = []
            currentG = e.guardRef
        }
        chunk.push(e)
    });
    //final push
    timeAsleepArray[entrees[entrees.length - 1].guardRef] += calculateTimeForChunk(chunk)

    return timeAsleepArray
}
function calculateTimeForChunk(chunk){
    var firstElt = chunk.shift()
    var sleepingTime = 0

    var sleepTime = null
    var wakeUpTime = null
    chunk.forEach(e => {
        if(e.type == "falls asleep") {
            sleepTime = moment(`1518-${e.month}-${e.day} ${e.hour}:${e.min}`, "YYYY-MM-DD HH:mm");
        }
        if(e.type == "wakes up") {
            wakeUpTime = moment(`1518-${e.month}-${e.day} ${e.hour}:${e.min}`, "YYYY-MM-DD HH:mm");
            var sleepDuration = wakeUpTime.diff(sleepTime, "minutes")
            sleepingTime += sleepDuration
        }
    });
    console.log(`${firstElt.guardRef} -> ${sleepingTime}`)
    return sleepingTime
}

function parseLine(line){
    const reclamationObject = {
        month : null,
        day : null,
        min : null,
        hour : null,
        type : null,
        guardRef : null,
    }
    const a = line.split("]")
    const action = a[1].trim()
    const timestamp = a[0].slice(6)
    reclamationObject.month = parseInt(timestamp.split('-')[0])
    reclamationObject.day = parseInt(timestamp.split('-')[1].split(' ')[0])

    const time = timestamp.split('-')[1].split(' ')[1]
    reclamationObject.min = parseInt(time.split(':')[1])
    reclamationObject.hour = parseInt(time.split(':')[0])

    if (action.search('begins shift') > 0){
        reclamationObject.type = 'begin'
        reclamationObject.guardRef = parseInt(action.split(' begins')[0].split('#')[1])
    }
    else
        reclamationObject.type = action

    return reclamationObject
}

function agrementSortedEntrees(eArray){
    var currentGuard = null
    eArray.forEach(e => {
        if (e.type == 'begin')
            currentGuard = e.guardRef
        else
            e.guardRef = currentGuard
    });
}

function printEntrees(eArray){
    eArray.forEach(e => {
        console.log(`[${persoParse(e.month)}-${persoParse(e.day)} ${persoParse(e.hour)}:${persoParse(e.min)}]\t|${persoParse(e.guardRef)}|\t${e.type}`)
    });
}

function persoParse(num){
    if (num < 10)
        return '0'+String(num)
    return String(num)
}

function hashCalculator(e) {
    return persoParse(e.month)+persoParse(e.day)+persoParse(e.hour)+persoParse(e.min)
}

function compareEntrees(a, b) {
    if (a.month < b.month)
       return -1;
    if (a.month > b.month)
        return 1;

    if (a.day < b.day)
       return -1;
    if (a.day > b.day)
        return +1;

    if (a.hour < b.hour)
        return -1;
    if (a.hour > b.hour)
        return 1;

    if (a.min < b.min)
        return -1;
    if (a.min > b.min)
        return 1;

    // a doit être égal à b
    return 0;
}

//processFile('data4.txt');
processFile('dataDay4Test.txt');