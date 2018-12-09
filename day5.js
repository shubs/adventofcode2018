var tabSigInit = []
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
    var lettres = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var min = {
        lettre : null,
        value : null
    }
    lettres.forEach(l => {
        var c_string = (traiter(l, tabSigInit[0]))

        var rep = getNewString2(c_string)
        while (rep.more){
            rep = getNewString2(rep.chaine)
        }

        if (!min.value){
            min.value = rep.len
            min.lettre = l
        }
        if (rep.len < min.value){
            min.value = rep.len
            min.lettre = l
        }
        console.log(`[${rep.len}] | [${l}] | MIN = ${min.lettre} ${min.value}`)
    });
}

function traiter(char, s) {
    var reg = new RegExp(char, "gi");
    var ret = s.replace(reg, "");
    return (ret)
}
function getNewString2(s){

    //console.log(`round -> for ${s}`)
    var newChaine = ""
    var ret = {
        chaine : null,
        len : null,
        more : null
    }
    for (let i = 0; i < s.length - 1; i++) {
        const a = s[i];
        const b = s[i+1];
        var achar = s[i].charCodeAt(0)
        var bchar = s[i+1].charCodeAt(0)
        var diff = Math.abs(achar - bchar)

        // console.log(`compare ${a} != ${b} = ${diff}`)

        if (diff == 32){
            //console.log(`removing ${a}${b}`)
            var otherPart = s.slice(i+2)
            newChaine = newChaine + otherPart
            ret = {
                chaine : newChaine,
                len : newChaine.length,
                more : true
            }
            return ret
        }
        else {
            newChaine += a
        }
    }
    newChaine += s[s.length - 1]

    //console.log(`new = ${newChaine}`)
    return {
        chaine : newChaine,
        len : newChaine.length,
        more : false
    }
}

function getNewString(s){
    var newChaine = ""
    for (let i = 0; i < s.length - 1; i++) {
        const a = s[i];
        const b = s[i+1];
        var achar = s[i].charCodeAt(0)
        var bchar = s[i+1].charCodeAt(0)
        var diff = Math.abs(achar - bchar)

        // console.log(`compare ${a} != ${b} = ${diff}`)

        if (diff == 32){
            var otherPart = s.slice(i+2)
            newChaine = newChaine + otherPart
            return(getNewString(newChaine))
        }
        else {
            newChaine += a
        }
    }
    newChaine += s[s.length - 1]
    return newChaine
}


processFile('data5.txt');
//processFile('data5test.txt');