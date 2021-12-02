let input
let analyzer

function setup(){
    createCanvas(1000,600)
    input = new p5.AudioIn()
    input.start()
}

function draw(){
    const currentVol = input.getLevel()
    let points = []
    if(currentVol>0.1){
        points = makeSimplePoints(currentVol)
    } else if (currentVol>0.5){
        points=makeFirePoints(currentVol)
    }
    console.log(points)
    drawPoints(points)
}

function makeSimplePoints(vol){
    let numPoints;
    if(vol>0){
        numPoints = map(vol, 0.0, 1.0, 20,2000)
    }else{
        numPoints=1
    }

    const arr = Array.from({length: numPoints}, (el, i) => {
        const x = i
        const y = 300
        const col = [i,0,0]
        return{x,y,col}
    })
    return arr
}

function makeFirePoints(vol){
    let numPoints;
    if(vol>0){
        numPoints = map(vol, 0.0, 1.0, 20,2000)
    }else{
        numPoints=1
    }
    
    const arr = Array.from({length: numPoints}, (el, i) => {
        const x = i
        const y = 300
        const col = [i,0,0]
        return{x,y,col}
    })
    return arr
}

function drawPoints(points){
    points.forEach(point => {
        fill(point.col)
        ellipse(point.x,point.y,10)
    })
}