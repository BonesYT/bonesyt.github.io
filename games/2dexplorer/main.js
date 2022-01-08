function $(e) {
    return document.getElementById(e)
}

var game = {
    x: 8,
    y: 8,
    mx: 0,
    my: 0,
    ld: 0,
    lda: 0,
    map: {
        w: 16,
        h: 16,
        b: undefined,
        g: false
    },
    i: {
        wood: 0,
        stone: 0,
        iron: 0,
        diamond: 0,
        obsidian: 0,
        ascended: 0
    },
    gem: 0,
    pow: 1,
    p: {left: false, right: false, up: false, down: false, z: false},
    pt: {left: 0, right: 0, up: 0, down: 0, z: 0},
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
        var img, a, b, c, d, e
        game.map.b[game.mx][game.my].forEach((w,y)=>{
            w.forEach((v,x)=>{
                switch (v) {
                    case 0: img = 'txr/blocks/ground.png'; break
                    case 1: img = 'txr/blocks/wall.png'; break
                    case 2: img = 'txr/blocks/log.png'; break
                    case 3: img = 'txr/blocks/stone.png'; break
                    case 4: img = 'txr/blocks/iron.png'; break
                    case 5: img = 'txr/blocks/diamond.png'; break
                    case 6: img = 'txr/blocks/obsidian.png'; break
                    case 7: img = 'txr/blocks/ascended.png'; break
                }
                a = new Image
                a.src = img
                ctx.drawImage(a, y*32, x*32)
            })
        })
        c = new Image
        d = new Image
        e = new Image
        a.src = 'txr/player.png'
        c.src = 'txr/npc.png'
        d.src = 'txr/gem.png'
        e.src = 'txr/pick.png'
        b = game.ld * 32
        ctx.drawImage(a, b, 0, 32, 32, game.x*32, game.y*32, 32, 32)
        if (game.mx == 0 & game.my == 0) {
            ctx.drawImage(c, 0, 0, 32, 32, 96, 96, 32, 32)
            ctx.drawImage(c, 32, 0, 32, 32, 224, 96, 32, 32)
            ctx.drawImage(c, 64, 0, 32, 32, 352, 96, 32, 32)
        }
        ctx.font = '25px Arial'
        ctx.fillStyle='#ffffff'
        ctx.drawImage(d, 16, 16)
        ctx.strokeText(game.gem, 54, 40)
        ctx.fillText(game.gem, 54, 40)
        ctx.drawImage(e, 16, 50)
        ctx.strokeText(Math.floor(game.pow*10)/10, 54, 74)
        ctx.fillText(Math.floor(game.pow*10)/10, 54, 74)
    },
    map: {
        create: ()=>{
            a=[[[[]]]]
            for (var i=0; i<16; i++) {
                a[0][0][0].push(0)
            }
            for (var i=0; i<15; i++) {
                a[0][0].push(a[0][0][0])
            }
            for (var i=0; i<7; i++) {
                a[0].push(a[0][0])
            }
            for (var i=0; i<7; i++) {
                a.push(a[0])
            }
            game.map.b = JSON.parse(JSON.stringify(a))
        },
        gen: ()=>{
            var d = (e,f,v)=>{
                v[e] = JSON.parse(f)
            }
            var a = '[1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1]'
            var b = '[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]'
            var c = '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]'
            game.map.b.forEach(w=>{
                w.forEach(v=>{
                    d(0,a,v);d(1,b,v);d(2,b,v);d(3,b,v);d(4,b,v);d(5,b,v);d(6,b,v);d(7,c,v);
                    d(8,c,v);d(9,b,v);d(10,b,v);d(11,b,v);d(12,b,v);d(13,b,v);d(14,b,v);d(15,a,v);
                })
            })
            func.map.makesqr(5, 5, 7, 7, 1, 1, 2)
            func.map.makesqr(5, 4, 8, 9, 1, 2, 2)
            func.map.makesqr(3, 4, 11, 10, 2, 0, 3)
            func.map.makesqr(3, 4, 11, 10, 0, 2, 3)
            func.map.makesqr(2, 2, 12, 12, 2, 3, 4)
            func.map.makesqr(2, 2, 10, 12, 5, 4, 5)
            func.map.makesqr(3, 5, 7, 7, 2, 5, 6)
            func.map.makesqr(4, 4, 7, 7, 7, 7, 7)
            func.map.makesqr(2, 3, 11, 11, 7, 0, 7)
            game.map.b[0][0][3][3] = 1
            game.map.b[0][0][7][3] = 1
            game.map.b[0][0][11][3] = 1
        },
        makesqr: (sx, sy, w, h, ax, ay, t)=>{
            for (var x = sx; x < sx + w; x++) {
                for (var y = sy; y < sy + h; y++) {
                    game.map.b[ax][ay][x][y] = t
                }
            }
        },
        checkcomp: (sx, sy, w, h, ax, ay)=>{
            var a = true
            for (var x = sx; x < sx + w; x++) {
                for (var y = sy; y < sy + h; y++) {
                    if (game.map.b[ax][ay][x][y] != 0) a = false
                }
            }
            return a
        },
        a: ()=>{
            var a = func.map.checkcomp(5, 5, 7, 7, 1, 1)
            if (a) a = func.map.checkcomp(5, 4, 8, 9, 1, 2)
            if (a) a = func.map.checkcomp(3, 4, 11, 10, 2, 0)
            if (a) a = func.map.checkcomp(3, 4, 11, 10, 0, 2)
            if (a) a = func.map.checkcomp(2, 2, 12, 12, 2, 3)
            if (a) a = func.map.checkcomp(2, 2, 10, 12, 5, 4)
            if (a) a = func.map.checkcomp(3, 5, 7, 7, 2, 5)
            if (a) a = func.map.checkcomp(4, 4, 7, 7, 7, 7)
            if (a) a = func.map.checkcomp(2, 3, 11, 11, 7, 0)
            return a
        }
    },
    key: ()=>{
        Object.keys(game.p).forEach(v=>{
            if (game.p[v]) {
                game.pt[v]++
            } else {
                game.pt[v] = 0
            }
        })
    },
    tick: ()=>{
        if (game.pt.up == 1) {
            game.y--
            if (game.ld != 0) game.lda = 0
            game.ld = 0
        }
        func.a()
        if (game.map.b[game.mx][game.my][game.x][game.y] != 0) {
            func.mine(game.map.b[game.mx][game.my][game.x][game.y])
            game.y++
        }
        if (game.pt.right == 1) {
            game.x++
            if (game.ld != 1) game.lda = 0
            game.ld = 1
        }
        func.a()
        if (game.map.b[game.mx][game.my][game.x][game.y] != 0) {
            func.mine(game.map.b[game.mx][game.my][game.x][game.y])
            game.x--
        }
        if (game.pt.down == 1) {
            game.y++
            if (game.ld != 2) game.lda = 0
            game.ld = 2
        }
        func.a()
        if (game.map.b[game.mx][game.my][game.x][game.y] != 0) {
            func.mine(game.map.b[game.mx][game.my][game.x][game.y])
            game.y--
        }
        if (game.pt.left == 1) {
            game.x--
            if (game.ld != 3) game.lda = 0
            game.ld = 3
        }
        func.a()
        if (game.map.b[game.mx][game.my][game.x][game.y] != 0) {
            func.mine(game.map.b[game.mx][game.my][game.x][game.y])
            game.x++
        }

        if (game.mx==0&game.my==0&game.x<5&game.x>1&game.y<5&game.y>1 & game.pt.z == 1) {

            if (game.i.wood>0|game.i.stone>0|game.i.iron>0|game.i.diamond>0|game.i.obsidian>0|game.i.ascended>0) {
                var a = Math.floor(game.i.wood * 16.5) + Math.floor(game.i.stone * 75) + Math.floor(game.i.iron * 220) +
                        Math.floor(game.i.diamond * 840) + Math.floor(game.i.obsidian * 2300) + Math.floor(game.i.ascended * 10350)
                func.d(`Brown: Here's ${a} gems!`)
                game.gem += a
                game.i.wood = 0, game.i.stone = 0, game.i.iron = 0, game.i.diamond = 0, game.i.obsidian = 0, game.i.ascended = 0
                new Audio('sfx/sell.mp3').play()
            } else {
                func.d('Brown: Hey buddy, you got no items on you!')
            }

        }
        if (game.mx==0&game.my==0&game.x<9&game.x>5&game.y<5&game.y>1 & game.pt.z == 1) {

            if (game.gem >= 80) {
                var a = game.pow
                game.pow += game.gem / 400
                func.d(`Green: Here's your upgraded pickaxe! I made it +${Math.floor((game.pow/a-1)*10000)/100}% better.`)
                game.gem = 0
                new Audio('sfx/sell.mp3').play()
            } else {
                func.d('Green: You need at least 80 gems so i can upgrade your pickaxe!')
            }

        }
        if (game.mx==0&game.my==0&game.x<13&game.x>9&game.y<5&game.y>1 & game.pt.z == 1) {

            if (func.map.a()) {
                func.d('Purple: We have rebuilt everything!')
                func.map.makesqr(5, 5, 7, 7, 1, 1, 2)
                func.map.makesqr(5, 4, 8, 9, 1, 2, 2)
                func.map.makesqr(3, 4, 11, 10, 2, 0, 3)
                func.map.makesqr(3, 4, 11, 10, 0, 2, 3)
                func.map.makesqr(2, 2, 12, 12, 2, 3, 4)
                func.map.makesqr(2, 2, 10, 12, 5, 4, 5)
                func.map.makesqr(3, 5, 7, 7, 2, 5, 6)
                func.map.makesqr(4, 4, 7, 7, 7, 7, 7)
                func.map.makesqr(2, 3, 11, 11, 7, 0, 7)
                new Audio('sfx/rebuild.mp3').play()
            } else {
                func.d('Purple: You can\'t reset blocks yet! You will need to mine everything first.')
            }

        }
    },
    a: ()=>{
        if (game.x < 0) {
            game.x = 15
            game.mx--
            if (game.mx==-1) {
                game.x = 0
                game.mx++
            }
        }
        if (game.x > 15) {
            game.x = 0
            game.mx++
            if (game.mx==8) {
                game.x = 15
                game.mx--
            }
        }
        if (game.y < 0) {
            game.y = 15
            game.my--
            if (game.my==-1) {
                game.y = 0
                game.my++
            }
        }
        if (game.y > 15) {
            game.y = 0
            game.my++
            if (game.my==8) {
                game.y = 15
                game.my--
            }
        }
    },
    mine: a=>{
        switch (a) {
            case 2:
                game.lda += game.pow
                new Audio('sfx/mine.mp3').play()
                if (game.lda >= 12) {
                    game.map.b[game.mx][game.my][game.x][game.y] = 0
                    game.i.wood++
                    game.lda -= 12
                    func.d(`You got wood! You have ${game.i.wood} now.`)
                }
            break
            case 3:
                game.lda += game.pow
                new Audio('sfx/mine.mp3').play()
                if (game.lda >= 75) {
                    game.map.b[game.mx][game.my][game.x][game.y] = 0
                    game.i.stone++
                    game.lda -= 75
                    func.d(`You got stone! You have ${game.i.stone} now.`)
                }
            break
            case 4:
                game.lda += game.pow
                new Audio('sfx/mine.mp3').play()
                if (game.lda >= 220) {
                    game.map.b[game.mx][game.my][game.x][game.y] = 0
                    game.i.iron++
                    game.lda -= 220
                    func.d(`You got iron! You have ${game.i.iron} now.`)
                }
            break
            case 5:
                game.lda += game.pow
                new Audio('sfx/mine.mp3').play()
                if (game.lda >= 865) {
                    game.map.b[game.mx][game.my][game.x][game.y] = 0
                    game.i.diamond++
                    game.lda -= 865
                    func.d(`You got diamond! You have ${game.i.diamond} now.`)
                }
            break
            case 6:
                game.lda += game.pow
                new Audio('sfx/mine.mp3').play()
                if (game.lda >= 2867) {
                    game.map.b[game.mx][game.my][game.x][game.y] = 0
                    game.i.obsidian++
                    game.lda -= 2867
                    func.d(`You got obsidian! You have ${game.i.obsidian} now.`)
                }
            break
            case 7:
                game.lda += game.pow
                new Audio('sfx/mine.mp3').play()
                if (game.lda >= 15000) {
                    game.map.b[game.mx][game.my][game.x][game.y] = 0
                    game.i.ascended++
                    game.lda -= 15000
                    func.d(`You got ascended block! You have ${game.i.ascended} now.`)
                }
        }
    },
    d: a=>{
        $('dialogue').innerHTML = a
    }
}

document.addEventListener('keydown', e=>{
    if (!game.tas.p) {
        switch (e.key) {
            case 'ArrowUp': game.p.up = true; break
            case 'ArrowDown': game.p.down = true; break
            case 'ArrowLeft': game.p.left = true; break
            case 'ArrowRight': game.p.right = true; break
            case 'w': game.p.up = true; break
            case 's': game.p.down = true; break
            case 'a': game.p.left = true; break
            case 'd': game.p.right = true; break
            case 'z': game.p.z = true; break
        }
    }
})
document.addEventListener('keyup', e=>{
    if (!game.tas.p) {
        switch (e.key) {
            case 'ArrowUp': game.p.up = false; break
            case 'ArrowDown': game.p.down = false; break
            case 'ArrowLeft': game.p.left = false; break
            case 'ArrowRight': game.p.right = false; break
            case 'w': game.p.up = false; break
            case 's': game.p.down = false; break
            case 'a': game.p.left = false; break
            case 'd': game.p.right = false; break
            case 'z': game.p.z = false; break
        }
    }
})
//avoid
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

canvas.addEventListener('mousedown', e=>{
    var x = e.offsetX
    var y = e.offsetY
    if (x>140&y>140&x<372&y<372) {
        game.p.z = true
    } else {
        if (x-y>0&x+y<512) {
            game.p.up = true
        }
        if (x-y>0&x+y>512) {
            game.p.right = true
        }
        if (x-y<0&x+y>512) {
            game.p.down = true
        }
        if (x-y<0&x+y<512) {
            game.p.left = true
        }
    }
})
canvas.addEventListener('mouseup', ()=>{
    game.p.up = false
    game.p.right = false
    game.p.down = false
    game.p.left = false
    game.p.z = false
})

func.map.create()
func.map.gen()

var int = setInterval(()=>{
    func.key()
    func.tick()
    func.draw()
}, 1000/30)