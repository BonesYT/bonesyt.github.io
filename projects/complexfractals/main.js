$ = e => document.getElementById(e)

var width, height,
    mouseX, mouseY,
    canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    zoom = 0.25, px = -2, py = -2, it, cs,
    f, t = 0, play = false,
    press = {}, int = false, max = 0
    
    memory = {}, mupd = false

;(()=>{
    var a = []
    Object.keys(Complex.prototype).forEach(v => {
        if (typeof Complex.prototype[v] == 'function')
            a.push(v)
    })
    $('oper').innerHTML = 'Methods/Opers: x.oper(y): ' + a.join(', ')
})()

$('code').addEventListener('onchange', () => memory = {})
$('memory').addEventListener('onchange', () => memory = {})

function setcursor(event) {
    mouseX = event.offsetX
    mouseY = event.offsetY
}

function huetorgb(i) {
    i = i / 60 % 6
    var r, g, b, j = i % 1
    switch (Math.floor(i)) {
        case 0: r = 255, g = j * 255, b = 0; break
        case 1: r = (1 - j) * 255, g = 255, b = 0; break
        case 2: g = 255, b = j * 255, r = 0; break
        case 3: g = (1 - j) * 255, b = 255, r = 0; break
        case 4: b = 255, r = j * 255, g = 0; break
        case 5: b = (1 - j) * 255, r = 255, g = 0; break
    }
    return [r, g, b]
}

function ontick() {
    function tomem(x,y,add=0) {
        //max = Math.max(max, Math.ceil(Math.log10(size/(1/zoom))))
        return x.toFixed(max)+','+y.toFixed(max)
    }
    width =1* $('width').value
    height =1* $('height').value
    it =1* $('iter').value
    cs =1* $('colsp').value
    f = Function('z','c','t','ti','x','y','i','m','mx','my','X','Y','MX','MY','I','it', 'return ' + $('code').value)

    canvas.width = width
    canvas.height = height

    var a = width * height, sx, sy, x, y, c, z, i, I, rgb, d,
        ti = Date.now()

    size = Math.min(width, height)

    var mx = mouseX / (zoom * size) + px,
        my = mouseY / (zoom * size) + px,
        m = new Complex(mx, my)

    var img = ctx.getImageData(0, 0, width, height)

    c = new Complex
    z = new Complex

    var A = Math.ceil(
                 Math.log(size/(1/zoom))
                /Math.log($('quald').value)
                -$('qual').value
            )
    if (!mupd & A > max) {
        max = A
        mupd = true
    }

    for (i = 0; i < a; i++) {
        sx = i % width
        sy = Math.floor(i / width)

        x = sx / (zoom * size) + px
        y = sy / (zoom * size) + py
        c.re = x, c.im = y
        z.re = x, z.im = y
        d = Math.sqrt(x ** 2 + y ** 2)

        if ($('memory').checked) I = memory[tomem(x,y)]
        if (I == undefined | !$('memory').checked) for (I = 0; I < it & d < 2; I++) {
            z = f(z, c, t, ti, x, y, i, m, mx, my, sx, sy, mouseX, mouseY, I, it)
            d = Math.sqrt(z.re ** 2 + z.im ** 2)
        }

        rgb = huetorgb(I * cs)
        if (I >= it - 1) rgb = [0,0,0]

        if ($('memory').checked & mupd) memory[tomem(x,y)] = I

        img.data[i * 4    ] = rgb[0]
        img.data[i * 4 + 1] = rgb[1]
        img.data[i * 4 + 2] = rgb[2]
        img.data[i * 4 + 3] = 255
    }

    mupd = false
    ctx.putImageData(img, 0, 0)
    t++
}

function control() {
    if (press.arrowleft) {
        px -= 1 / zoom / 16 * $('movesp').value
    } if (press.arrowright) {
        px += 1 / zoom / 16 * $('movesp').value
    } if (press.arrowup) {
        py -= 1 / zoom / 16 * $('movesp').value
    } if (press.arrowdown) {
        py += 1 / zoom / 16 * $('movesp').value
    }

    if (press.q) {
        var z = 1/zoom
        zoom *= 1.07 ** $('movesp').value
        px += (z - 1/zoom) / 2
        py += (z - 1/zoom) / 2
    } if (press.z) {
        var z = 1/zoom
        zoom /= 1.07 ** $('movesp').value
        px += (z - 1/zoom) / 2
        py += (z - 1/zoom) / 2
    }
}

function start() {play = true}
function stop() {play = false}
function reset() {t = 0}

var int = setInterval(() => {
    if (play) {
        control()
        ontick()
    }
}, 1e3/30)

document.addEventListener('keydown', e => {
    if ([37,38,39,40,81,90,82].includes(e.keyCode)) {
        press[e.key.toLowerCase()] = 1
    }
    if (int & [32,37,38,39,40].includes(e.keyCode)) e.preventDefault()
})
document.addEventListener('keyup', e => {
    if ([37,38,39,40,81,90,82].includes(e.keyCode)) {
        press[e.key.toLowerCase()] = 0
    }
})