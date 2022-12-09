/** Create custom maps
  * 
  * Native values:
  * -1 Image Entity
  * 
  * 0 White/any = air
  * 1 Black = absorb (output pixel)
  * 2 Blue = reflect
  * 3 Green = transmission (goes through, add effects)
  * 4 [null] = Textured wall (absorb)
  * 
  *   Magenta = Orbs
  *   #8F8 = Player spawn
  *   #F88 = NextBot spawn
  */

const $ = i => document.getElementById(i)
let game = new Game

function run() {
    if (game.map.t && game.running) {
        simulation()
        controls()
        render()
    }
    if (config.setfps) {
        config.setfps = false
        clearInterval(int)
        int = setInterval(run, $('unlfps').checked ? undefined : 1e3 / $('maxfps').value);
    }
}
let int = setInterval(run, $('unlfps').checked ? undefined : 1e3 / $('maxfps').value);

let _test,aa // for debugging purposes

let config = {
    loaded: true,
    audio: {
        jump: [],
        orb: new Audio('sfx/orb.wav'),
        low: new Audio('sfx/low.wav'),
        unlock: new Audio('sfx/unlock.wav'),
        glitch: new Audio('sfx/glitchraw.wav'),
        escape: new Audio('sfx/ESCAPE.mp3'),
        item: new Audio('sfx/item.wav'),
        blow: new Audio('sfx/blow.wav')
    },
    audioVol: {
        escape: [.4, 'mus']
    },
    img: {
        cursor: 'cursor',
        orb: 'orb',
        locked: 'lock_off',
        unlock: 'lock_on',
        exit: 'exit',
        static: 'static',
        portal: 'portal',
        airbox: 'airbox',
        airboxIcon: 'airbox_icon',
        wind: 'wind',
        lightcube: 'lightcube_outro'
    },
    nextbots: {},
    levels: [],
    totalLevels: 9,
    renderGUI: true,
    width: .75,
    entWidth: 1,
    height: 136,
    /** Increase for higher framerate, but lower quality */
    lightSpeed: .2,
    renderDist: 256,
    glitching: false,
    pauseAud: [],
    esctime: 0,

    showFPS: true,
    showMap: false,
    mapSize: 3,
    pauseImg: null,
    
    levelData: null,
}
document.addEventListener('keydown', e => keydet(e.key, true))
document.addEventListener('keyup', e => keydet(e.key, false))
document.addEventListener('mousedown', () => game.hold = true)
document.addEventListener('mouseup', () => game.hold = false)
document.addEventListener('mousemove', e => game.isAlive & !game.paused ? game.dir -= e.movementX / 240 * $('mousesens').value : 0)
game.can.addEventListener('click', () => game.paused ? 0 : game.can.requestPointerLock())
game.can.addEventListener('mousemove', e => {
    game.mx = e.offsetX
    game.my = e.offsetY
})
$('resolution').value = 'w480p'
$('resolution').addEventListener('input', () => {
    const v = $('resolution').value
    const p = +v.slice(1, v.length - 1),
          r = v[0] == 'w' ? 16 / 9 : 4 / 3

    game.can.width = Math.round(p * r / 2) * 2
    game.can.height = p
})
$('lightspd').addEventListener('input', () => config.lightSpeed =+ $('lightspd').value)
$('back').addEventListener('click', () => {
    $('settings').style.display = 'none'
    game.can.style.display = ''
})
$('maxfps').addEventListener('input', () => config.setfps = true)
$('unlfps').addEventListener('input', () => config.setfps = true)

async function playSFX(aud, setvol='sfxvol') {
    const a = config.audio[aud]
    a.currentTime = 0
    a.play()
    if (config.audioVol[aud])
        a.volume = config.audioVol[aud][0] * $(config.audioVol[aud][1] + 'vol').value
    else 
        a.volume = $('sfxvol').value

    await new Promise(r => a.onended = r)
}
function setStatus(x, y, i) {
    game.map.tx[conv(x, y)].status = i
}
function getStatus(x, y, i) {
    return game.map.tx[conv(x, y)].status
}

for (let i = 0; i < 8; i++)
    config.audio.jump.push(new Audio(`sfx/jumpscares/lose${i}.wav`))

for (let i = 0; i < config.totalLevels; i++) {
    const img = new Image
    img.src = `maps/${i}.png`
    config.levels.push(img)
}

{
    const l = ['lightcube','obunga','nerd','quandale','selene','speed','blixer','mariops4']
    for (let v of l) {
        const img = new Image
        img.src = `nextbot/img/${v}.png`
        config.nextbots[v] = img
    }
}


Object.keys(config.img).forEach(v => {
    const i = new Image
    i.src = `img/${config.img[v]}.png`
    config.img[v] = i
})

let cl = false

/**
 * Converts x and y to singular tile position.
 * @param {number} x 
 * @param {number} y 
 * @returns number
 */
function conv(x, y) {
    if (x >= game.map.w | x < 0 | y >= game.map.h | y < 0) return NaN
    return Math.floor(x) % game.map.w + Math.floor(y) * game.map.h
}
/*jasync function upload(type='Image') {

    const i = new this[type]
    await new Promise(async r => {
        let f = document.createElement('input')
        f.type = 'file'
        await new Promise(r => {
            f.click()
            f.onchange = () => r()
        })
        const fr = new FileReader
        fr.onload = () => {
            i.src = fr.result
            r()
        }
        fr.readAsDataURL(f.files[0])
    })
    return i

}*/

async function loadMap(level) {

    let m = [], c, ctx, p, s, pd, n, attr,
        tdi = 0, tdi2 = 0 // tile data index
    const data = config.levelData[level]

    game.level = level
    game.orbs = 0
    game.maxOrbs = 0
    game.locks = 0
    game.maxLocks = 0
    game.map.orbs = []
    game.ent = []
    game.nextSpawn = []
    game.map.items = []
    game.isAlive = true
    game.map.attr = []
    game.map.tx = []
    game.map.at = []
    game.map.f = []

    function color(arr) {
        return arr.map(v => 
            '0123456789ABCDEF'.at(v / 17)    
        ).join('')
    }
    
    function isNumber() {
        return typeof data.tile_data[tdi] == "number"
    }
    
    function setattr(prop, def, output) {
        d = data.tile_data[tdi][prop] ?? def
        attr[prop] = output ? output(d) : d
    }
    function attribute(...arr) {
        if (isNumber()) {
            game.map.at[j] = data.tile_data[tdi]
        } else {
            arr.forEach(v => 
                setattr(v[0], v[1], v[2]) 
            )
            game.map.attr.push(attr)
            game.map.at[j] = game.map.attr.length - 1
        }
        tdi++
    }
    const hex = v => [
        v >> 16 & 255,
        v >> 8 & 255,
        v & 255
    ]

    const img = config.levels[level]

    c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    p = ctx.getImageData(0, 0, c.width, c.height)
    s = c.width * c.height

    m = []

    for (var j = 0; j < s; j++) {

        pd = color(Array.from(p.data.slice(j * 4, j * 4 + 3)))
        n = ['000','00F','0F0',,'888'].indexOf(pd) + 1
        attr = {}
        switch (pd) { // Cases are in 3-digit hexadecimal code. (0 = 0, 8 = 136, F = 255)
            case '0F0':
                attribute(
                    ['color', 0xFFFFFF, hex],
                    ['brightness', 1]
                )
                /*const col = +data.tile_data[tdi].color
                if (col != undefined) {
                    game.map.attr.push({color: [
                        col >> 16 & 255,
                        col >> 8 & 255,
                        col & 255
                    ]})
                    game.map.at[j] = game.map.attr.length - 1
                } else
                    game.map.at[j] = -1
                
                tdi++*/
            break
            case '00F':
                attribute(
                    ['color', 0xFFFFFF, hex],
                    ['brightness', 1]
                )
            break
            case 'F0F':
                game.map.orbs.push(new Orb(j % c.width, Math.floor(j / c.width)))
                game.maxOrbs++
            break
            case '80F':
                game.map.items.push(new Airbox(j % c.width, Math.floor(j / c.width)))
            break
            case '8F8':
                game.x = game.sx = j % c.width + .5
                game.y = game.sy = Math.floor(j / c.width) + .5
                game.dir = game.sdir = data.start_angle / (-180 / Math.PI) + Math.PI / 2
            break
            case 'F88':
                game.nextSpawn.push({
                    x: j % c.width + .5,
                    y: Math.floor(j / c.width) + .5
                })
            break
            case 'F08':
                n = 4
                game.map.tx[j] = new Texture(config.img.locked, 0,0,0, 0)
                game.map.f[j] = 0
                game.maxLocks++
            break
            case '08F':
                n = 4
                game.map.tx[j] = new Texture(config.img.exit)
                game.map.f[j] = 1
            break
            case '888':
                attribute(
                    ['color', 0xF0F7F4, hex],
                    ['brightness', 1]
                )
            break
            case '0F8':
                n = 4
                game.map.tx[j] = new Texture(config.img.portal)
                game.map.f[j] = 2
                attr.id = tdi2
                attribute(
                    ['target', 0],
                    ['angle', 0]
                )
                tdi2++
            break
        }
        m.push(n)

    }

    game.map.t = m
    game.map.w = c.width
    game.map.h = c.height
    game.levelName = data.level_name

    data.nextbots.forEach(async v => {

        game.nbNextTick.push(0)
        game.nbTick.push(0)
        const img = config.nextbots[v]

        const a = [0, 3]
        let e = new NextBot(
            game.nextSpawn[0].x,
            game.nextSpawn[0].y,
            game.map.t.map(v => !a.includes(v)),
            game.map.w, img, 0.02
        )
        e.setImageData(1, 1)
        e.setAudio(new Audio(`nextbot/aud/${v}.mp3`))
        e.spawnEntity(game, 'x', 'y', 'isAlive')
        e.onerror = nberror
        e.onTouch = lose
        game.ent.push(e)
        e.aud.play()

    })

    if (level == 8) {

        const img = new Image
        img.src = 'img/lightcube_outro.png'
        const e = new Entity(7.5, 2.5, Math.PI / 2, img)
        e.setImageData(1, 1)
        e.setAudio(new Audio('sfx/lightcube_outro.wav'))
        game.ent.push(e)

    }

}
function getPx(px, py, x=0, y=0, X, Y) {
    X = X ? 'ceil' : 'floor'
    Y = Y ? 'ceil' : 'floor'
    return [1,2,4,5].includes(game.map.t[Math[X](x+px) + Math[Y](y+py) * game.map.w])
}

/* Upload order:
 * Map (img)
 * entity (img)
 * entity (aud)

document.onclick = async() => cl ? 0 : (await genMap([
    {x:2,y:1,w:1,h:1,i:3,at:0},
    {x:2,y:3,w:1,h:1,i:3,at:0},
    {x:1,y:2,w:1,h:1,i:3,at:1},
    {x:3,y:2,w:1,h:1,i:3,at:1}
], '{file}', [
    {filt: [250, 171, 185]},
    {filt: [176, 181, 255]}
], cl = true), setTimeout(()=>spawnEntity(1.5,1.5),100))*/ // {file} to upload files manually cuz cross origin is an ostrich

function simulation() {

    if (game.paused) return
    
    game.ent.forEach((v, i) => {
        if (!(v instanceof NextBot)) {
            v.updateVolume(game.x, game.y)
            return
        }
        game.nbTick[i]++
        if (game.nbTick[i] >= game.nbNextTick[i]) {
            game.nbNextTick[i]++
            v.tick()
        }
    })

    if ((Date.now() - config.esctime) >= 74e3) {
        config.audio.escape.currentTime = 54
        config.esctime += 20e3
    }
    if (game.locks > 0) {
        game.red += .045
    }

    game.map.orbs.forEach(v => v.collect())
    game.map.items.forEach(v => {
        v.collect()
        if (v.collected) {
            v.tick++
            if (v.tick >= 720) {
                v.tick = 0
                v.collected = false
            }
        }
    })
    game.wind.forEach((v,i,a) => {

        const pos = exMath.step(-v.dir + Math.PI / 2, .1, v.x, v.y)
        v.x = pos.x
        v.y = pos.y
        if (v.x < -10 | v.y < -10 | v.x > game.map.w + 10 | v.y > game.map.h + 10)
            a.splice(i, 1)

    })

    if (game.level == 8 & game.y < 8) {
        if (!config.outro) outro()
        const e = game.ent[0].ent
        e.dir = exMath.angle(game.y, e.y, game.x, e.x)
    }

}

function collision(x, y, w = .5, h = .5) {

    // Check for collision at the sides (right, left, bottom, top, br, tl, bl, tr)
    let hit = false
    const bord = [
        getPx(x + w / 2,  y),
        getPx(x + w / -2, y),
        getPx(x, y + h / 2),
        getPx(x, y + h / -2),
        getPx(x + w / 2,  y + w / 2),
        getPx(x + w / -2, y + w / -2),
        getPx(x + h / -2, y + h / 2),
        getPx(x + h / 2,  y + h / -2)
    ]

    // Check if only 1 corner has
    const corner = bord.reduce((a, b) => a + b, 0) == 1

    if (bord.reduce((a, b) => a || b, false)) {
        const X = x % 1,
              Y = y % 1
              bord.forEach((v, i) => {
            if (v) {
                hit = true
                // Decide which direction to push
                if (corner) {
                    if (i == 4) i = (Y > X) * 2
                    if (i == 5) i = (X > Y) * 2 + 1
                    if (i == 6) i = (Y > X)     + 1
                    if (i == 7) i = (X > Y) * 3
                }

                if (!i)     x = Math.ceil(x) - w / 2
                if (i == 1) x = Math.floor(x) + w / 2
                if (i == 2) y = Math.ceil(y) - h / 2
                if (i == 3) y = Math.floor(y) + h / 2
            }
        })
    }

    return {x, y, hit}

}

function controls() {
    
    let k = game.k,
        kh = game.kh

    Object.keys(game.k).forEach(v => 
        game.kh[v] = game.k[v] ? game.kh[v] + 1 : 0
    )

    game.hold ? game.ht++ : game.ht = 0

    if (!game.isAlive || game.paused) {
        if (!game.paused) game.lightMax -= .5
        else if (kh.p == 1) {
            game.paused = false
            resumeAudio()
        }
        return
    }
    const run = k.S & game.stamina > 0
    
    let divspd = (k.U | k.D | k.w | k.s) & (k.D | k.A) ? Math.sqrt(2) : 1,
        m = game.spd / 16 * (run ? 3 : 1.8) / divspd,
        s = Math.sin(game.dir) * m,
        c = Math.cos(game.dir) * m,
        D = game.dir
    let mv = false

    if (kh.p == 1) {
        game.paused = true
        pauseAudio()
        document.exitPointerLock()
        config.pauseImg = game.ctx.getImageData(0, 0, game.can.width, game.can.height)
    return}

    if (k.U | k.w) {mv=true
        game.x += s
        game.y += c
    } if (k.D | k.s) {mv=true
        game.x -= s
        game.y -= c
        D = -D
    } if (k.d) {mv=true
        game.x += Math.sin(game.dir + Math.PI / -2) * m
        game.y += Math.cos(game.dir + Math.PI / -2) * m
    } if (k.a) {mv=true
        game.x += Math.sin(game.dir + Math.PI / 2) * m
        game.y += Math.cos(game.dir + Math.PI / 2) * m
    }
    if (k.L) game.dir += Math.PI / 24
    if (k.R) game.dir -= Math.PI / 24

    if (kh.q == 1 & game.airbox > 0) {
        game.airbox--
        playSFX('blow')
        game.wind.push({
            x: game.x,
            y: game.y,
            dir: game.dir + game.k.SP * Math.PI
        })
    }

    if (k.S & mv)
        game.stamina = Math.max(game.stamina - .01 * (config.levelData[game.level].stamina_drain_vel ?? 1), 0)
    else if (!mv)
        game.stamina = Math.min(game.stamina + .02, 1)

    const col = collision(game.x, game.y, game.hitW, game.hitH)
    game.x = col.x
    game.y = col.y

    // triggers?

    const ind = conv(game.hx, game.hy)

    if (game.hx && game.ht == 1 && game.hs < 1) {

        switch (game.map.f[ind]) {

            case 0:
                if (game.orbs >= game.maxOrbs) {
                    if (getStatus(game.hx, game.hy)) break
                    if (game.locks == 0) {
                        playSFX('escape', .4, 'musvol')
                        config.esctime = Date.now()
                    }
                    setStatus(game.hx, game.hy, 1)
                    playSFX('unlock')
                    game.map.tx[conv(game.hx, game.hy)].setImage(config.img.unlock)
                    game.locks++
                    game.stamina = 1

                } else playSFX('low')

            break; case 1:
                if (game.locks >= game.maxLocks & game.orbs >= game.maxOrbs) {
                    win()

                } else playSFX('low')

            break; case 2:

                // this part took sO LONG LMAO
                // math is a doido sometimes lmao,
                const b = game.map.at[ind] 
                const data = game.map.attr,
                      bp = game.map.attr.findIndex(v => v.id == data[b].target),
                      p = game.map.at.indexOf(bp),
                      px = p % game.map.w,
                      py = Math.floor(p / game.map.w),
                      offs = (data[bp].angle - data[b].angle) / (-180 / Math.PI)

                const d = exMath.distance(Math.floor(game.hx) - game.x, Math.floor(game.hy) - game.y),
                      a = -exMath.angle(game.y, Math.floor(game.hy), game.x, Math.floor(game.hx))+Math.PI/2

                let pos = exMath.step(a, d, px, py)
                pos = exMath.rotate(-offs, pos.x, pos.y, px + .5, py + .5)
                game.x = pos.x
                game.y = pos.y
                game.dir += offs

            break

        }

    }

}

for (let v of ['U','D','R','L','a','d','w','s','q','S','SP','p']) {
    game.kh[v] = false
    game.k[v] = 0
}
function keydet(key, set) {
    switch (key.toLowerCase()) { // fixing a common controls bug in html games
        case 'arrowup': game.k.U = set; break
        case 'arrowdown': game.k.D = set; break
        case 'arrowright': game.k.R = set; break
        case 'arrowleft': game.k.L = set; break
        case 'a': game.k.a = set; break
        case 'd': game.k.d = set; break
        case 'w': game.k.w = set; break
        case 's': game.k.s = set; break
        case 'q': game.k.q = set; break
        case 'p': game.k.p = set; break
        case 'shift': game.k.S = set; break
        case ' ': game.k.SP = set; break
    }
}

function pxid(data=new ImageData, x, y) {
    return (x + y * data.width) * 4
}

function restart(won) {

    game.lightMax = Infinity
    game.isAlive = true
    if (!won) game.ent.forEach((v, i) => {
        v.aud.currentTime = 0
        v.aud.play()
    })
    config.renderGUI = true
    config.audio.escape.currentTime = 0
    game.x = game.sx
    game.y = game.sy
    game.dir = game.sdir
    game.ent.forEach((v, i) => {
        if (!(v instanceof NextBot)) return
        v.teleport(
            game.nextSpawn[i].x,
            game.nextSpawn[i].y
        )
        v.ent.spd = .02
    })
    game.stamina = 1
    game.orbs = 0
    game.locks = 0
    game.airbox = 0
    game.map.orbs.concat(game.map.items).forEach(v => v.collected = false)
    game.screen = 0
    game.red = 0
    game.map.f.forEach((v, i) => {
        if (v == 0) {
            game.map.tx[i].setImage(config.img.locked)
            game.map.tx[i].status = 0
        }
    })

}
async function lose(entity) {

    // Animation
    game.ent.forEach((v, i) => v.aud.pause())
    game.isAlive = false
    game.dir = -entity.ent.dir - Math.PI / 2
    const pos = exMath.step(entity.ent.dir, .65, entity.ent.x, entity.ent.y)
    game.x = pos.x
    game.y = pos.y
    game.lightMax = 8
    config.renderGUI = false

    const aud = config.audio.jump.at(Math.random() * config.audio.jump.length)
    aud.play()
    let int
    await new Promise(r => int = setInterval(() => {
        if (game.lightMax <= 0) r()
    }))
    game.screen = 2
    game.lightMax = 0
    clearInterval(int)
    aud.pause()
    config.audio.escape.pause()
    aud.currentTime = 0
    await new Promise(r => setTimeout(r, 2e3))

    restart(false)

}
async function win() {

    game.ent.forEach((v, i) => v.aud.pause())
    config.audio.escape.pause()
    game.isAlive = false
    game.screen = 1
    await new Promise(r => setTimeout(r, 3.5e3))
    if (game.level == 7) {
        const el = document.querySelector('body').querySelectorAll('*')
        const a = Array.from(el).slice(0, 2).map(v => v.innerHTML)
        config.glitching = true
        await playSFX('glitch')
        a.forEach((v, i) =>
            el[i].innerHTML = v
        )
        game.ctx.globalCompositeOperation = 'source-over'
        document.querySelector('body').style.backgroundColor = ''
    }
    game.isAlive = true

    game.level++
    loadMap(game.level)

    restart(true)

}

async function waitLoad(obj) {

    for (let v in obj) {

        if (!obj[v].complete) 
            await new Promise(r => {
                obj[v].onload = r
            })

    }
}

function died() {
    document.querySelectorAll('h1, h3, p').forEach(v => {
        let a = ''
        for (let j = 0; j < 14; j++)
            a += String.fromCharCode(Math.random()*65536)
        v.innerHTML = a
    })
    document.querySelector('body').style.backgroundColor = `rgb(${[Math.random()*255,Math.random()*255,Math.random()*255]})`
}

function nberror(entity) {
    game.nbNextTick[game.ent.indexOf(entity)] += 20
}

function pauseAudio() {

    game.ent.forEach(v => v.aud.pause())
    Object.keys(config.audio).forEach(v => {
        if (v == 'jump') return
        const a = config.audio[v]
        if (!a.paused) {
            a.pause()
            config.pauseAud.push(v)
        }
    })

}function resumeAudio() {

    game.ent.forEach(v => v.aud.play())
    config.pauseAud.forEach(v => {
        config.audio[v].play()
        if (config.audioVol[v])
            config.audio[v].volume = config.audioVol[v][0] * $(config.audioVol[v][1] + 'vol').value
        else
            config.audio[v].volume * $('sfxvol').value
    })
    config.pauseAud = []

}

async function outro() {

    config.outro = true
    game.ent[0].aud.play()
    await new Promise(r => game.ent[0].aud.onended = r)
    setTimeout(v=>game.ent[0].aud.pause(),60)
    clearInterval(int)
    fetch('https://bonesyt.github.io/404.html').then(v => v.blob()).then(async v => {
        const p = new DOMParser
        document.querySelector('html').innerHTML = p.parseFromString(await v.text(), 'text/html').querySelector('html').innerHTML
    })

}

/*{

    let did = false

    async function init() {

        if (did) return
        did = true
        await loadMap([], `maps/${prompt('Enter map name')}.png`)
        await spawnEntity()
    
    }
    
    document.addEventListener('click', init)

}*/{

    fetch('maps/data.json').then(v => v.blob()).then(async v => {
        config.levelData = JSON.parse(await v.text())
        await waitLoad(config.levels)
        await waitLoad(config.img)
        await waitLoad(config.nextbots)
        config.loaded = true
    })

}

$('play').addEventListener('click', () => {
    $('canvas').style.display = ''
    $('start').style.display = 'none'
    loadMap(0)
})