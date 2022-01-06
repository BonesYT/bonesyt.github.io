function $(e) {
    return document.getElementById(e)
}

var game = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    b: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    p: {left: false, right: false, up: false, q: false, w: false},
    j: false,
    t: 0,
    pa: false,
    m: 0,
    tas: {
        r: false,
        p: false,
        k: []
    }
}

var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

var func = {
    draw: ()=>{
        var tile = 480 / 18
        game.b.forEach((w,y)=>{
            w.forEach((v,x)=>{
                switch (v) {
                    case 0: ctx.fillStyle = '#FFFFFF'; break
                    case 1: ctx.fillStyle = '#000000'; break
                    case 2: ctx.fillStyle = '#FF0000'; break
                    case 3: ctx.fillStyle = '#00FF00'; break
                }
                ctx.fillRect(x*tile, y*tile, tile, tile)
            })
        })
        ctx.fillStyle = '#222222'
        ctx.fillRect(game.x, game.y, tile, tile)
    },
    tick: ()=>{
        switch (game.m) {
            case 0:
                game.x += game.xv
                game.y += game.yv
                game.yv += 2
                game.xv /= 1.2
                if (game.p.up & game.j) game.yv = -14
                if (game.p.right) game.xv += 1.5
                if (game.p.left) game.xv -= 1.5
            break
            case 1:
                game.x += game.xv
                game.y += game.yv
                game.yv += 2
                if (game.p.up & game.j) game.yv = -14
                game.xv = 0
                if (game.p.right) game.xv = 6
                if (game.p.left) game.xv = -6
            break
        }
        if (func.coll(0,0,0,21)[1]) while (func.coll(0,0,0,21)[1]) {
            game.y--
            game.yv = 0
                game.x -= game.xv
                if (func.coll(0,-2,21)[1] | func.coll(21,-2)[1]) {
                    game.x += game.xv
                } else {
                    while (!(func.coll(0,0,21)[1] | func.coll(21)[1])) {
                        game.x += Math.sign(game.xv)
                    }
                    game.x -= Math.sign(game.xv) * 2
                    game.xv = 0
                }
        }
        if (func.coll(0,21)[1]) while (func.coll(0,21)[1]) {
            game.y++
            game.yv = 0
        }
        if (game.x < 0 | game.x > 826.67) {
            game.x = Math.max(Math.min(game.x, 826.67), 0)
            game.xv = 0
        }
        if (game.y < 0) {
            game.y = 0
            game.yv = 0
        }
        if (func.coll()[2]) {
            game.x = 0
            game.y = 0
            game.xv = 0
            game.yv = 0
            new Audio('sfx/lose.mp3').play()
        }
        if (func.coll()[3]) {
            game.x = 0
            game.y = 0
            game.xv = 0
            game.yv = 0
            new Audio('sfx/win.mp3').play()
        }
        game.y++
        game.j = func.coll(0,0,0,21)[1]
        game.y--
        game.t++
    },
    coll: (xno=0, yno=0, xxo=0, yxo=0)=>{
        var tile = 480 / 18,
            touch = [false, false, false, false],
            xn, yn, xx, yx
        game.b.forEach((w,y)=>{
            w.forEach((v,x)=>{
                if (v != 0) {
                    xn = (x - 1) * tile + xno
                    yn = (y - 1) * tile + yno
                    xx = (x + 1) * tile - xxo
                    yx = (y + 1) * tile - yxo
                    if (game.x > xn & game.y > yn & game.x < xx & game.y < yx) {
                        touch[0] = true
                        touch[v] = true
                    }
                }
            })
        })
        return touch
    },
    TAS: i=>{
        switch (i) {
            case 0:
                game.tas.r = true
                game.t = 0
                $('start').innerHTML = 'Stop TAS'
                game.tas.k = []
                new Audio('sfx/start.mp3').play()
            break
            case 1:
                game.tas.r = false
                $('start').innerHTML = 'Start TAS'
                $('tasinput').value = btoa(JSON.stringify(game.tas.k))
                new Audio('sfx/stop.mp3').play()
            break
            case '':
                if (game.tas.r) {
                    func.TAS(1)
                } else {
                    func.TAS(0)
                }
            break
            case 2:
                game.tas.p = true
                game.t = 0
                game.tas.k = JSON.parse(atob($('tasinput').value))
            break
        }
    }
}

document.addEventListener('keydown', e=>{
    if (!game.tas.p) {
        switch (e.key) {
            case 'ArrowUp': game.p.up = true; break
            case 'ArrowLeft': game.p.left = true; break
            case 'ArrowRight': game.p.right = true; break
            case 'w': game.p.up = true; break
            case 'a': game.p.left = true; break
            case 'd': game.p.right = true; break
            case 'q': game.p.q = true; break
            case 'e': game.p.e = true; break
        }
    }
})
document.addEventListener('keyup', e=>{
    if (!game.tas.p) {
        switch (e.key) {
            case 'ArrowUp': game.p.up = false; break
            case 'ArrowLeft': game.p.left = false; break
            case 'ArrowRight': game.p.right = false; break
            case 'w': game.p.up = false; break
            case 'a': game.p.left = false; break
            case 'd': game.p.right = false; break
            case 'q': game.p.q = false; break
            case 'e': game.p.e = false; break
        }
    }
})

var hold = 0
var int = setInterval(()=>{
    if (game.tas.p) {
        if (game.t >= game.tas.k.length) {
            game.tas.p = false
        } else {
            game.p.left = game.tas.k[game.t][0]
            game.p.right = game.tas.k[game.t][1]
            game.p.up = game.tas.k[game.t][2]
        }
    }
    if (!game.pa) {
        func.tick()
        func.draw()
        if (game.tas.r) {
            game.tas.k.push([game.p.left, game.p.right, game.p.up])
        }
    }
    if (game.p.q) {
        game.pa = true
        if (!hold) {
            func.tick()
            func.draw()
            if (game.tas.r) {
                game.tas.k.push([game.p.left, game.p.right, game.p.up])
            }
        }
        hold++
    }
    if (!game.p.q) {
        hold = 0
    }
    if (game.p.e) {
        game.pa = false
    }
}, 33)