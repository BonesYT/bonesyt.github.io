function $(e) {
    return document.getElementById(e)
}

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var game = {
    start: false,
    points: 0,
    highscore: 0,
    lives: 5,
    area: {
        x: 0,
        y: 0,
        r: 80
    }
}
var main = {
    tick: 0,
    next: 0,
    curr: 0,
    delay: 120,
    c: {x:0,y:0}
}

function start() {
    game.lives = 5
    game.points = 0
    game.start = true
    main.tick = 0
    main.next = 120
    main.delay = 120
    main.curr = 0
    game.area = {
        x: Math.random()*400,
        y: Math.random()*400,
        r: 80
    }
    $('main').style.display = 'none'
    $('game').style.display = 'block'
    int = setInterval(()=>{
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, 400, 400)
        ctx.fillStyle = 'blue'
        ctx.fillRect(0, 0, (main.tick-main.curr)/(main.next-main.curr)*400, 80)
        ctx.fillStyle = 'yellow'
        ctx.beginPath()
        ctx.arc(game.area.x,game.area.y,game.area.r,0,Math.PI*2)
        ctx.fill()
        ctx.closePath()
        $('pts').innerHTML = 'Points: ' + game.points
        $('lives').innerHTML = 'Lives: ' + game.lives
        if (main.tick > main.next) {
            main.curr = main.next
            main.next += main.delay
            main.delay = Math.max(15, main.delay-4.8)
            var dist = Math.sqrt((game.area.x - main.c.x) ** 2 + (game.area.y - main.c.y) ** 2)
            if (dist <= game.area.r) {
                game.points++
            } else {
                game.lives--
                if (game.lives <= 0) {
                    clearInterval(int)
                    $('main').style.display = 'block'
                    $('game').style.display = 'none'
                    game.highscore = Math.max(game.highscore, game.points)
                    $('high').innerHTML = 'Highscore: ' + game.highscore
                }
            }
            game.area.x = Math.random()*400
            game.area.y = Math.random()*400
            game.area.r = Math.max(16, game.area.r-4)
        }
        main.tick++
    }, 33)
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    main.c.x = event.clientX - rect.left
    main.c.y = event.clientY - rect.top
}
canvas.addEventListener('mousemove', function(e) {
    getCursorPosition(canvas, e)
})

function save() {
    localStorage.setItem('GettoArea', btoa(JSON.stringify(game)))
}
function load() {
    if (localStorage.getItem('GettoArea') == null) return false
    var game = JSON.parse(atob(localStorage.getItem('GettoArea')))
}

load()

saveint = setInterval(()=>{
    save()
}, 3000)

$('high').innerHTML = 'Highscore: ' + game.highscore