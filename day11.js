function main (serial) {
    var g = createGrid(serial)
    // console.log(g[90][269])
    // console.log(calcSumPowerOfX(90,269,12,g))
    // console.log(findLargestTotalPower(g, 12))
    console.log(findlargestoflargest(g))
    
}
function findlargestoflargest(grid){
    var max = {
        x : 0,
        y : 0,
        sum : 0,
        size : 0
    }

    for (let size = 0; size < 280; size++) {
        console.log(size)
        var s = findLargestTotalPower(grid, size)
        if (s.sum > max.sum){
            max = {
                x : s.x,
                y : s.y,
                sum : s.sum,
                size : size
            }
            console.log(max)
        }
    }
    return max
}
function findLargestTotalPower(grid, size){
    var max = {
        x : 0,
        y : 0,
        sum : 0
    }
    for (let i = 1; i <= (300 - size); i++) {
        for (let j = 1; j <= (300 - size); j++) {
            var sum = calcSumPowerOfX(i,j,size, grid)
            if (sum > max.sum){
                max = {
                    x : i,
                    y : j,
                    sum : sum
                }
            }
        }
    }
    return max
}

function calcSumPowerOfX(x,y,size, grid){
    if (x > (300 - size) || y > (298 - size))
        return -1

    var sum = 0

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            sum += grid[x+i][y+j]
        }
    }

    return sum
}

function calcSumPowerOf3(x,y, grid){
    if (x > 298 || y > 298)
        return -1

    var sum = 0
    sum += grid[x][y]
    sum += grid[x+1][y]
    sum += grid[x+2][y]

    sum += grid[x][y+1]
    sum += grid[x+1][y+1]
    sum += grid[x+2][y+1]

    sum += grid[x][y+2]
    sum += grid[x+1][y+2]
    sum += grid[x+2][y+2]

    return sum
}

function createGrid(serial){
    var grid = []
    for (let i = 1; i <= 300 ;i++) {
        for (let j = 1; j <= 300; j++) {
            if (!grid[i])
                grid[i] = []
            grid[i][j] = power(i, j, serial)
        }
    }
    return grid
}

function printGrid(grid){
    var toPrint = ''
    for (let i = 1; i <= 300 ;i++) {
        for (let j = 1; j <= 300; j++) {
           toPrint += grid[i][j]
           toPrint += ','
        }
        toPrint += '\n'
    }
    console.log(toPrint)
}

function power(x, y, serial){
    var rackId = x + 10
    var power = rackId * y
    power += serial 
    power *= rackId
    var hundredsDigitPower = Math.trunc((power/100)%10)
    hundredsDigitPower -= 5
    return hundredsDigitPower
}

main(4172)