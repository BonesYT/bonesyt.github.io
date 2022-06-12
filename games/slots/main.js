const $ = e => document.getElementById(e),
      $e = e => document.querySelector(e)

const delay = ms => new Promise(r => setTimeout(r, ms));
const wuntil = f => new Promise(r => {
    setInterval(()=>{
        if (f()) r()
    })
})

$e('.gamescreen').style.display = 'none'
$e('.black').addEventListener('click', e => (
    e.target.remove(),
    new Audio('sfx/start.mp3').play(),
    $e('.gamescreen').style.display = '',
    updsymbols()
))

var game = new Game
var config = {
    betvals: [10, 25, 50, 100, 150, 250, 500, 750, 1e3],
    bet: 3,
    canvas: [],
    ctx: [],
    img: [],
    aud: [],
    press: false,

    spinspeed: 0.25
}

function update() {
    $('cred').innerHTML = game.cred
    $('won').innerHTML = game.won
    $('bet').innerHTML = game.bet
}
function updsymbols() {
    var size, width, height, x, pos, y
    game.reels.symbols.forEach((v,j) => {
        width = config.canvas[j].width
        height = config.canvas[j].height
        pos = game.reels.pos[j]
        config.ctx[j].clearRect(0, 0, width, height)
        v.forEach((v,i) => {
            if (v == 0) return
            size = ((1-Math.abs(i-2+(pos%1))/2)/2+1/2) * width / 1.25
            x = (width - size) / 2
            y = (height/2 - width/2) + ((i - 2 + pos % 1) * width)
            config.ctx[j].drawImage(config.img[v-1], 0,0,256,256,
                x,
                y + x,
                size, size
            )
        })
    })
}

function setbet() {
    if (game.playing) return
    config.bet = (config.bet + 1) % 9
    game.bet = config.betvals[config.bet]
    update()
    sfx('bet')
}

function sfx(src) {
    new Audio(`sfx/${src}.mp3`).play()
}

(()=>{

    for (var i = 0; i < 3; i++) {
        config.canvas.push($('r'+i))
        config.ctx.push($('r'+i).getContext('2d'))
    }
    var a = ['0','1','2','5','10','00'].map(v=>`txtr/${v}.png`), b
    for (var i = 0; i < 6; i++) {
        b = new Image
        b.src = a[i]
        config.img.push(b)
    }
    for (var i = 0; i < 4; i++) {
        b = new Audio(`sfx/theme/${i}.mp3`)
        b.loop = true
        config.aud.push(b)
    }

})()

update()

setInterval(updsymbols, 1e3/30)

async function spin() {

    if (game.cred < game.bet) {
        sfx('low')
        return
    } 

    if (game.playing) return

    game.won = 0
    game.playing = true

    game.cred -= game.bet
    game.tloss += game.bet
    game.spins++

    update()
    document.querySelectorAll('.dis').forEach(v => {
        v.setAttribute('disabled', '')
    })

    var vel = [-0.05, -0.05, -0.05]

    var aud = config.aud[Math.floor(Math.random() * config.aud.length)] // select random theme,
        dur = [
            Math.random() * 200 + 1.9e3,
            Math.random() * 80 + 460,
            Math.random() * 80 + 460
        ]
        
    aud.play()

    // reel speed control
    function setint(i) {
        if (block.includes(i)) return
        sfx('reelspin')
        var a = true
        int[i] = setInterval(()=>{
            if (a) game.reels.spin(vel[i], i)
            if (vel[i] < config.spinspeed & !stop[i]) vel[i] += 0.125
            if ((!!max[i]) & pos[i] >= max[i] & !stop[i]) {
                stop[i] = true
                sfx('reelstop')
                vel[i] = 0.1
            }
            if (stop[i]) {
                vel[i] -= 0.05
                if (pos[i] < max[i] - 0.25) {
                    game.reels.setspin(i, Math.round((max[i] - 0.25) * 2) / 2)
                    clearInterval(int[i])
                    a = false
                }
            }
        }, 1e3/30)
    }

    var int2 = setInterval(()=>{
        if (!game.playing) clearInterval(int2)
        updsymbols()
    }, 1e3/30)

        pos = game.reels.pos,
        max=0,
        int=0,
        stop=0,
        block = []

    async function anim() {
        max=[]
        int=[]
        stop=[0,0,0]

        // Start spin animation
        setint(0)
        await delay(200)
        setint(1)
        if (!block.includes(1)) await delay(200)
        setint(2)

        await delay(dur[0])
        max[0] = Math.floor(pos[0] * 2) / 2 + 0.75
        if (!block.includes(1)) await delay(dur[1])
        max[1] = Math.floor(pos[1] * 2) / 2 + 0.75   
        if (!block.includes(2)) await delay(dur[2])
        max[2] = Math.floor(pos[2] * 2) / 2 + 0.75  

        await delay(500)
        aud.pause()

    }

    await anim()

    var s = getSymbols(), t

    if (hasOnlyZero(s)) {

        async function anim2() {
            sfx('respin')
            var a = 0
            var int3 = setInterval(() => {
    
                config.canvas.forEach((v,i) => {
                    if (a % 2 == 0) v.setAttribute('bright', '')
                    else v.removeAttribute('bright')
                })
                a++
    
            }, 167)
    
            await delay(1550)
            clearInterval(int3)
            config.canvas.forEach((v,i) => {
                if (a % 2 == 0) v.setAttribute('bright', '')
                else v.removeAttribute('bright')
            })
    
            if (s[1] == 1 | s[1] == 6 & !block.includes(1))  {
                block.push(1)
            }
            if (s[2] == 1 | s[2] == 6 & !block.includes(2)) {
                block.push(2)
            }

            dur = [
                Math.random() * 200 + 1.9e3 + block.length * 800,
                Math.random() * 80 + 460 + block.length * 800,
                Math.random() * 80 + 460 + block.length * 800
            ]

            aud.play()
        }

        await anim2()
        await anim()

        s = getSymbols()
        t = getSymbols()
        t.splice(block[0], 1)
        if (block[1]) t.splice(block[1], 1)

        if (hasOnlyZero(t)) {

            await anim2()
            await anim()
    
        }

    }

    var w = getWin()       // win value (the number)
    var m = game.bet / 100 // bet multiplier (100 = 1x)
    var c = w * m          // credit add
    var cr = game.cred

    game.twin += c

    if (w > 0) {
        if (w <= 20) { // small win

            game.won += c
            game.cred += c
            sfx('win/small')
    
        } else if (w < 1e3) { // normal win
    
            var waud = new Audio('sfx/win/normal.mp3')
            waud.play()
            int = setInterval(() => {
                game.cred += 180 / 30 * m
                game.won += 180 / 30 * m
                update()
            }, 33)
    
            await wuntil(() => game.cred >= cr + c | config.press)
            clearInterval(int)
            game.cred = cr + c
            game.won = c
    
            waud.currentTime = 6.667
    
        } else { // BIG win
    
            var waud = new Audio('sfx/win/big.mp3')
            waud.play()
            int = setInterval(() => {
                game.cred += 720 / 30 * m
                game.won += 720 / 30 * m
                update()
            }, 33)
    
            $('bigwin').setAttribute('on', '')
            setTimeout(()=>$('bigwin').style.top = '50%', 50)
    
            await wuntil(() => game.cred >= cr + c | config.press)
            clearInterval(int)
            game.cred = cr + c
            game.won = c
    
            waud.pause()
            sfx('win/BigEnd')
    
            $('bigwin').style.top = '115%'
            setTimeout(() => {
                $('bigwin').removeAttribute('on')
                $('bigwin').style.top = ''
            }, 1e3)
    
        }
    }
    update()

    document.querySelectorAll('.dis').forEach(v => {
        v.removeAttribute('disabled')
    })
    game.playing = false
    aud.currentTime = 0

}

function getSymbols() {

    var o = []
    for (var i = 0; i < 3; i++) {
        o.push(game.reels.pos[i] % 1 == 0.5
            ? 0
            : game.reels.symbols[i][2]
        )
    }

    return o

}
function hasOnlyZero(i) {

    var o = true,
        p = false
    for (var j = 0; j < 3; j++) {
        if (i[j] > 1 & i[j] != 6) o = false
        if (i[j] == 1 | i[j] == 6) p = true
    }  
    return o & p

}

function getWin() {

    var a = getSymbols()
    var b = ['', '0', '1', '2', '5', '10', '00']
    a = a.map(v => b[v])

    return Number(a.join(''))

}

function wipe() {
    if (game.playing) return
    for (var i = 0; i < 3; i++) {
        if (!confirm(`Are you sure you want to wipe your progress? This action is irreversible! \
(Press confirm ${3 - i} more times to wipe.)`)) return
    }
    game = new Game
    update()
    updsymbols()
}

window.addEventListener('keydown', e => {
    if (e.key == ' ') config.press = true
})
window.addEventListener('keyup', e => {
    if (e.key == ' ') config.press = false
})

function save() {

    if (game.playing) return

    try {
        var a = JSON.parse(atob(localStorage.getItem('SlotMachines')))
    } catch {
        var a = {}
    }

    a['Cash Machine'] = {
        credits: game.cred,
        lastwin: game.won,
        twin: game.twin,
        tloss: game.tloss,
        bet: config.bet,
        spins: game.spins,
        version: '1.0'
    }

    localStorage.setItem('SlotMachines', btoa(JSON.stringify(a)))

}
function load() {
    try {

        var a = JSON.parse(atob(localStorage.getItem('SlotMachines')))['Cash Machine']

        game.cred = a.credits
        game.won = a.lastwin
        game.twin = a.twin
        game.tloss = a.tloss
        config.bet = a.bet
        game.bet = config.betvals[a.bet]
        game.spins = a.spins
        update()

    } catch {}
}

setTimeout(load, 100)
setInterval(save, 5e3)
addEventListener('unload', save)