function $(e) {
    return document.getElementById(e);
};

//ingame
var boxes = []
var tick = 0
var tickUntil = 30
var tickUntil2 = 600
var lives = 5
var pointsgain = 0
var gets = 0
var delay = 1
var speed = 3.25
var start = false

//outgame
var points = 0
var highscore = 0
var plays = 0

var gameStart = false

var canvas = $('canvas');
var ctx = canvas.getContext('2d'); 
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (gameStart) {
        for (var i in boxes) {
            if (x >= boxes[i][0] & x < (boxes[i][0]+50) & y >= boxes[i][1] & y < (boxes[i][1]+50)) {
                gets++
                pointsgain += Math.floor(90 + (-boxes[i][1]-50)/9)
                if (boxes[i][2] == 1) {
                    lives++
                    new Audio('LifeCollect.wav').play()
                } else {
                    new Audio('Collect.wav').play()
                }
                boxes.splice(i, 1)
            }
        }
    }
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function startGame() {
    start = true
    plays++
    gameStart = true
    $('main').style.display = 'none'
    $('gameStats').style.display = 'block'
}

function update() {
    $('pts').innerHTML = 'You have ' + points + ' points.'
    $('high').innerHTML = 'Highscore: ' + highscore
    $('plays').innerHTML = 'Plays: ' + plays
}

function save() {
    save2 = {pts: points, high: highscore, plays: plays}
    document.cookie = JSON.stringify(save2)
}
function load() {
    var isJSON = true
    try {
        JSON.parse(document.cookie)
    } catch {
        isJSON = false
    }
    if (isJSON) {
        load = JSON.parse(document.cookie)
        points = load.pts
        highscore = load.high
        plays = load.plays
        update()
    } else {
        save()
        load()
    }
}

load()

int = setInterval(()=>{
    if (start) {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i in boxes) {
        if (boxes[i][2] == 1) {
            ctx.fillStyle = 'blue';
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(boxes[i][0], boxes[i][1], 50, 50);
        boxes[i][1] += speed
        if (boxes[i][1] >= 400) {
            new Audio('Miss.mp3').play()
            boxes.splice(i, 1)
            lives--
            if (lives == 0) {
                $('main').style.display = 'block'
                $('gameStats').style.display = 'none'
                points += pointsgain
                if (pointsgain > highscore) highscore = pointsgain
                update()
                boxes = []
                tick = 0
                tickUntil = 30
                tickUntil2 = 600
                lives = 5
                pointsgain = 0
                gets = 0
                delay = 1
                speed = 3.25
                save()
                start = false
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }
    if (tick > tickUntil) {
        tickUntil += (Math.random()*40+55)*delay
        boxes.push([Math.random()*600, -50, 0])

        delay /= 1.055
        delay = Math.max(delay, 0.25)
        speed *= 1.055
        speed = Math.min(speed, 12)
    }
    if (tick > tickUntil2) {
        tickUntil2 += 450
        boxes.push([Math.random()*600, -50, 1])
    }

    tick++

    $('ptsg').innerHTML = 'You gained ' + pointsgain + ' points!'
    $('amm').innerHTML = 'You got ' + gets + ' boxes!'
    $('liv').innerHTML = 'You have ' + lives + ' lives!'

    }
}, 33)