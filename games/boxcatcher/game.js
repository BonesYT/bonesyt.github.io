function $(e) {
    return document.getElementById(e);
};

//ingame
var boxes = []
var tick = 0
var tickUntil = 30
var lives = 5
var pointsgain = 0
var gets = 0
var delay = 1
var speed = 3.25

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
                boxes.splice(i, 1)
            }
        }
    }
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function startGame() {
    plays++
    gameStart = true
    $('main').style.display = 'none'
    $('gameStats').style.display = 'block'
    int = setInterval(()=>{
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (var i in boxes) {
            ctx.fillStyle = 'white';
            ctx.fillRect(boxes[i][0], boxes[i][1], 50, 50);
            boxes[i][1] += speed
            if (boxes[i][1] >= 400) {
                boxes.splice(i, 1)
                lives--
                if (lives == 0) {
                    $('main').style.display = 'block'
                    $('gameStats').style.display = 'none'
                    update()
                    points += pointsgain
                    if (points > highscore) highscore = points
					save()
                    clearInterval(int)
                }
            }
        }
        if (tick > tickUntil) {
            tickUntil += (Math.random()*40+55)*delay
            boxes.push([Math.random()*600, -50])

            delay /= 1.055
            delay = Math.max(delay, 0.25)
            speed *= 1.055
            speed = Math.min(speed, 12)
        }

        tick++

        $('ptsg').innerHTML = 'You gained ' + pointsgain + ' points!'
        $('amm').innerHTML = 'You got ' + gets + ' boxes!'
        $('liv').innerHTML = 'You have ' + lives + ' lives!'
    }, 33)
}

function update() {
    $('pts').innerHTML = 'You have ' + points + ' points.'
    $('high').innerHTML = 'Highscore: ' + highscore
    $('plays').innerHTML = 'Plays: ' + plays
}

function save() {
    save = {pts: points, high: highscore, plays: plays}
    document.cookie = JSON.stringify(save)
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