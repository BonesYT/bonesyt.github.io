function $(e) {
    return document.getElementById(e)
}

Number.prototype.step = function () {
    var a = (this.log10().modabs(1)).bas(10), b = 1
    if (a >= 2) b = 2
    if (a >= 5) b = 5
    return this.lfloor()  * b
}

var playing = false,
    int = 0,
    tick = 0,
    canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    width, height,
    px,
    f,
    sx, sy, sw, sh,
    mouseX, mouseY,
    error, fail, fail2,
    ins,
    stw, sth

function start() {
    if (!playing) int = setInterval(ontick, 1000 / 20)
    playing = true
}
function stop() {
    playing = false
    clearInterval(int)
}
function reset() {
    tick = 0
}
function change() {
    canvas.width = width = $('width').value
    canvas.height = height = $('height').value
    sx = Number($('sx').value)
    sy = Number($('sy').value)
    sw = Number($('sw').value)
    sh = Number($('sh').value)
}
function setpos() {
    var x = prompt('Set X position between -1 and 1 (0 for center)'),
        y = prompt('Set Y position between -1 and 1 (0 for center)')
    sx = sw * -(x/2+0.5)
    sy = sh * -(y/2+0.5)
}
function functionfy() {
    var a = $('code').value.split('\n')
    a = a.map(v => {return '\t' + v})
    $('code').value = `(function(){\n${a.join('\n')}\n})()`
}

function ontick() {
    try {
        f = new Function('x', 'y', 't', 'ti', 'mx', 'my', 'return ' + $('code').value)
        fail = false
    } catch (e) {
        if (error != e.toString()) {
            error = e.toString()
            console.log(e)
        }
        fail = true
    }
    px = ctx.createImageData(width, height)
    var r, x, y, ti = Date.now(),
    mx = mouseX / width * sw + sx,
    my = (height - mouseY) / height * sh + sy

    if ($('type').value != 'XY') {
        ctx.fillStyle = fail | fail2 ? '#FFAAAA' : '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        ctx.lineCap = 'round'
        ctx.lineWidth = 3
        ctx.strokeStyle = '#00000080'
        ctx.beginPath()
        ctx.moveTo(-sx / sw * width, 0)
        ctx.lineTo(-sx / sw * width, height)
        ctx.moveTo(0, (sy / sh + 1) * height)
        ctx.lineTo(width, (sy / sh + 1) * height)
        ctx.stroke()
        ctx.closePath()
        stw = (sw / 3).step()
        sth = (sh / 3).step()
        ctx.strokeStyle = '#00000040'
        ctx.beginPath()
        for (var i = -7; i < 2; i++) {
            ctx.moveTo(-(sx + i * stw - sx.sround(stw)) / sw * width, 0)
            ctx.lineTo(-(sx + i * stw - sx.sround(stw)) / sw * width, height)
        }
        for (var i = -7; i < 2; i++) {
            ctx.moveTo(0, ((sy + i * sth - sy.sround(sth)) / sh + 1) * height)
            ctx.lineTo(width, ((sy + i * sth - sy.sround(sth)) / sh + 1) * height)
        }
        ctx.stroke()
        ctx.closePath()
    }

    ctx.closePath()
    ctx.strokeStyle = '#00000090'
    ctx.beginPath()

    try {
        for (var i = 0; i < ($('type').value == 'XY' ? width * height : width); i++) {
            x = i / width % 1 * sw + sx
            y = i.div(width).floor().neg(height).div(height).mul(sh).add(sy)
            r = f(x, y, tick, ti, mx, my)
            var cr, cg, cb,
            a = r.mul(Number($('speed').value).div(100)), b
            if ($('type').value != 'X') {
                switch ($('color').value) {
                    case 'red':
                        cr = a.min(1).max(0).mul(255)*1+30
                        cg = a.min(1).max(0).mul(255)*0.001**0.05+10
                        cb = a.min(1).max(0).mul(255)**3*0.00001
                    break
                    case 'blue':
                        cb = a.min(1).max(0).mul(255)*1+30
                        cg = a.min(1).max(0).mul(255)*0.001**0.05+10
                        cr = a.min(1).max(0).mul(255)**3*0.00001
                    break
                    case 'Lab':
                        b = LdrToRGB(68, Math.PI * 2 * a, 100)
                        cr = b.r
                        cg = b.g
                        cb = b.b
                    break
                    case 'gray':
                        cr = cg = cb = a.min(1).max(0).mul(255)
                    break
                }
            }
            switch ($('type').value) {
                case 'X':
                    if (i == 0) {
                        ctx.moveTo(-(sx - x) / sw * width, ((sy - r) / sh + 1) * height)
                    } else {
                        ctx.lineTo(-(sx - x) / sw * width, ((sy - r) / sh + 1) * height)
                    }
                break
                case 'lX':
                    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.6)`
                    ctx.closePath()
                    ctx.beginPath()
                    ctx.moveTo(-(sx - x) / sw * width, height)
                    ctx.lineTo(-(sx - x) / sw * width, ((sy - r) / sh + 1) * height)
                    ctx.stroke()
                break
                case 'XY':
                    px.data[  i * 4  ] = cr
                    px.data[i * 4 + 1] = cg
                    px.data[i * 4 + 2] = cb
                    px.data[i * 4 + 3] = 255
                break
            }
        }
        fail2 = false
    } catch (e) {
        if (error != e.toString()) {
            error = e.toString()
            console.log(e)
        }
        fail2 = true
    }

    if ($('type').value == 'X') {ctx.closePath();ctx.stroke()}
    if ($('type').value == 'XY') {
        ctx.putImageData(px, 0, 0)
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(-sx / sw * width, 0)
        ctx.lineTo(-sx / sw * width, height)
        ctx.moveTo(0, (sy / sh + 1) * height)
        ctx.lineTo(width, (sy / sh + 1) * height)
        ctx.stroke()
        ctx.closePath()
        stw = (sw / 3).step()
        sth = (sh / 3).step()
        ctx.strokeStyle = '#00000040'
        ctx.beginPath()
        for (var i = -7; i < 2; i++) {
            ctx.moveTo(-(sx + i * stw - sx.sround(stw)) / sw * width, 0)
            ctx.lineTo(-(sx + i * stw - sx.sround(stw)) / sw * width, height)
        }
        for (var i = -7; i < 2; i++) {
            ctx.moveTo(0, ((sy + i * sth - sy.sround(sth)) / sh + 1) * height)
            ctx.lineTo(width, ((sy + i * sth - sy.sround(sth)) / sh + 1) * height)
        }
        ctx.stroke()
        ctx.closePath()
    }

    ctx.fillStyle = '#00000070'
    ctx.textAlign = 'center'
    for (var i = -7; i < 2; i++) {
        ctx.fillText((-i * stw + sx.sround(stw)).toStringFix(), -(sx + i * stw - sx.sround(stw)) / sw * width, ((sy / sh + 1) * height).min(height - 10).max(15))
    }
    ctx.textAlign = 'left'
    for (var i = -7; i < 2; i++) {
        ctx.fillText((-i * sth + sy.sround(sth)).toStringFix(), (-sx / sw * width).max(4).min(width - 25), ((sy + i * sth - sy.sround(sth)) / sh + 1) * height)
    }

    tick++

    if (EasyObj.key.press('ArrowUp')) {
        sy += sh/20
    }
    if (EasyObj.key.press('ArrowDown')) {
        sy -= sh/20
    }
    if (EasyObj.key.press('ArrowRight')) {
        sx += sw/20
    }
    if (EasyObj.key.press('ArrowLeft')) {
        sx -= sw/20
    }
    if (EasyObj.key.press('q')) {
        var w = sw, h = sh
        sw /= 1.07
        sh /= 1.07
        sx += (w - sw) / 2
        sy += (h - sh) / 2
    }
    if (EasyObj.key.press('a')) {
        var w = sw, h = sh
        sw *= 1.07
        sh *= 1.07
        sx += (w - sw) / 2
        sy += (h - sh) / 2
    }
    if (ins) {
        if ($('type').value == 'XY') {
            var yy = f(mouseX / width * sw + sx, mouseY / height * sh + sy, tick, ti, mx, my)
            ctx.fillStyle = '#000000A0'
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2)
            ctx.fill()

            ctx.textAlign = 'center'
            ctx.font = '18px Arial'
            ctx.fillText(`(${mx.mul(100).round().div(100)}, ${my.mul(100).round().div(100)}) = ${yy.mul(100).round().div(100)}`, mouseX, mouseY - 12)
        } else {
            var yy = f(mouseX / width * sw + sx, 0, tick, ti, mx, my),
                yy2 = ((sy - yy) / sh + 1) * height
            ctx.fillStyle = '#000000A0'
            ctx.beginPath();
            ctx.arc(mouseX, yy2, 5, 0, Math.PI * 2)
            ctx.fill()

            ctx.textAlign = 'center'
            ctx.font = '18px Arial'
            ctx.fillText(`(${mx.mul(100).round().div(100)}, ${yy.mul(100).round().div(100)})`, mouseX, yy2 - 12)
        }
    }
}
function ongraphchange() {
    if ($('type').value == 'X') {
        $('colordiv').style.display = 'none'
    } else {
        $('colordiv').style.display = 'block'
    }
}
function setcursor() {
    mouseX = event.offsetX
    mouseY = event.offsetY
}

change()

EasyObj.key.compressed = true

window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1 & ins) {
        e.preventDefault();
    }
}, false);

function LdrToRGB(l, d, r) {
    var a = Math.sin(d)*r
    var b = Math.cos(d)*r
    return LabToRGB(l, a, b)
}
function LabToRGB(l, a, b) {
    var y = (l + 16) / 116,
    x = a / 500 + y,
    z = y - b / 200,
    r, g, b;
    x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
    y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
    z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);
    r = x *  3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y *  1.8758 + z *  0.0415;
    b = x *  0.0557 + y * -0.2040 + z *  1.0570;
    r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
    g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
    b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;
    return {r: Math.max(0, Math.min(1, r)) * 255, 
            g: Math.max(0, Math.min(1, g)) * 255, 
            b: Math.max(0, Math.min(1, b)) * 255}
}