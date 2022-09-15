/** Create custom maps
  * White/any = air
  * Black = absorb (output pixel)
  * Blue = reflect
  * Green = transmission (goes through, add effects)
  * Red = refract (reflect + diffuse direction)
  * Yellow = scatter (transm. + diffuse direction)
  */

const $ = i => document.getElementById(i)

let cl = false
let game = {

    x: 6,
    y: 9.5,
    dir: 0,
    spd: 1,
    map: {
        t: null,
        at: [], // tile attr target
        a: [],  // attributes
        w: 16,
        h: 16
    },
    can: $('canvas'),
    ctx: $('canvas').getContext('2d'),
    k: {U: 0, D: 0, R: 0, L: 0},
    ent: []

}

function conv(x, y) {
    if (x >= game.map.w | x < 0 | y >= game.map.h | y < 0) return
    return Math.floor(x) % game.map.w + Math.floor(y) * game.map.h
}
async function upload(type='Image') {

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

}
async function genMap(i=[{}], src='', cnf=[{}]) {

    let m = [], im, c, ctx, p, s, pd, n

    if (src) {

        if (src == '{file}') im = await upload()
        else {

            im = new Image, c, ctx, p, s, pd, m = [], n
            im.src = src
            await new Promise(r => {
                im.onload = () => r()
            })

        }
        c = document.createElement('canvas')
        c.width = im.width
        c.height = im.height
        ctx = c.getContext('2d')
        ctx.drawImage(im, 0, 0)
        p = ctx.getImageData(0, 0, c.width, c.height)
        s = c.width * c.height

        m = []
        for (var j = 0; j < s; j++) {

            pd = p.data.slice(j * 4, j * 4 + 4).toString()
            n = 0
            switch (pd) {
                case '0,0,0,255': n = 1; break
                case '0,0,255,255': n = 2; break
                case '0,255,0,255': n = 3; break
                case '255,0,0,255': n = 4; break
                case '255,255,0,255': n = 5; break
            }
            m.push(n)

        }

        game.map.t = m
        game.map.w = c.width
        game.map.h = c.height

    }

    game.map.a = cnf
    i.forEach(v => {

        var x, y, p
        for (x = 0; x < v.w; x++) for (y = 0; y < v.h; y++) {
            p = conv(x + v.x, y + v.y)
            m[p] = v.i
            if (cnf[v.at] != undefined) game.map.at[p] = v.at
        }

    })

}
function getPx(px, py, x=0, y=0, X, Y) {
    X = X ? 'ceil' : 'floor'
    Y = Y ? 'ceil' : 'floor'
    return [1,3,4].includes(game.map.t[Math[X](x+px) + Math[Y](y+py) * game.map.w])
}

document.onclick = async() => cl ? 0 : (await genMap([
    {x:2,y:1,w:1,h:1,i:3,at:0},
    {x:2,y:3,w:1,h:1,i:3,at:0},
    {x:1,y:2,w:1,h:1,i:3,at:1},
    {x:3,y:2,w:1,h:1,i:3,at:1}
], '{file}', [
    {filt: [250, 171, 185]},
    {filt: [176, 181, 255]}
], cl = true), setTimeout(()=>spawnEntity(3,6),100)) // {file} to upload files manually cuz cross origin is an ostrich

function controls() {

    var k = game.k,
          m = game.spd / 16 * (k.S ? 3 : 1),
          s = Math.sin(game.dir) * m,
          c = Math.cos(game.dir) * m,
          b = {x: game.x, y: game.y},
          D = game.dir
    let mv = false
    if (k.U) {mv=true
        game.x += s
        game.y += c
    } if (k.D) {mv=true
        game.x -= s
        game.y -= c
        D = -D
    } if (k.a) {mv=true
        game.x += Math.sin(game.dir + Math.PI / -2) * m
        game.y += Math.cos(game.dir + Math.PI / -2) * m
    } if (k.d) {mv=true
        game.x += Math.sin(game.dir + Math.PI / 2) * m
        game.y += Math.cos(game.dir + Math.PI / 2) * m
    }
    if (k.R) game.dir += Math.PI / 24
    if (k.L) game.dir -= Math.PI / 24




    if (getPx(game.x, game.y) & mv) {
        
        const x = Math.floor(game.x) + (game.x < b.x),
              y = Math.floor(game.y) + (game.y < b.y)
        let a, c
        if (b.x % 1 == 0) c = true
        else if (b.y % 1 == 0) c = false
        else a = [
            (x - b.x) / (game.x - b.x),
            (y - b.y) / (game.y - b.y)
        ], c = a[0] > a[1]

        let d
        if (c) d = +(game.x < b.x)
        else d = (game.y < b.y) + 2

        switch (d) {
            
            case 0: game.x = Math.floor(game.x); break
            case 1: game.x = Math.ceil(game.x); break
            case 2: game.y = Math.floor(game.y); break
            case 3: game.y = Math.ceil(game.y); break

        }

    }

}

async function spawnEntity(x, y) {
    
    const a = [0, 3, 5]
    let e = new NextBot(x, y, game.map.t.map(v => !a.includes(v)), game.map.w, await upload(), 0.125)
    e.getImageData(1, 1)
    await new Promise(r=>setTimeout(()=>r(),400))
    e.setAudio(await upload('Audio'))
    e.spawnEntity(game)
    e.onTouch = e => {
        game.x = 2.5
        game.y = 2.5
    }
    game.ent.push(e)
    e.aud.play()

}

setInterval(() => {
    if (game.map.t) {
        controls()
        render()
        game.ent.forEach(v => v.frame())
    }
}, 1e3/60);

function keydet(key, set) {
    switch (key.toLowerCase()) { // fixing a common controls bug in html games
        case 'arrowup': game.k.U = set; break
        case 'arrowdown': game.k.D = set; break
        case 'arrowright': game.k.R = set; break
        case 'arrowleft': game.k.L = set; break
        case 'a': game.k.a = set; break
        case 'd': game.k.d = set; break
        case 'shift': game.k.S = set; break
    }
}

document.addEventListener('keydown', e => keydet(e.key, 1))
document.addEventListener('keyup', e => keydet(e.key, 0))

function pxid(data=new ImageData, x, y) {
    return p = (x + y * data.width) * 4
}

const trig = {

    distance(x, y, z=0) {
        return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
    },
    angle(x1, x2, y1, y2) {
        return Math.atan2(x1 - x2, y1 - y2)
    },
    step(d, a=1) {
        return {
            x: Math.sin(d) * a,
            y: Math.cos(d) * a
        }
    },
    rotate(dir, x, y, X=0, Y=0) {
        var a = this.step(this.angle(x, X, y, Y) + dir, this.distance(X - x, Y - y))
        a.x += X
        a.y += Y
        return a
    },
    loopdir(dir = 0) {
        return (dir + Math.PI) % (Math.PI * 2) - Math.PI + (dir < -Math.PI ? Math.PI * 2 : 0)
    }

}

let test // testing purposes lol