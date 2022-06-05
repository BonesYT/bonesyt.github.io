$ = e => document.getElementById(e)

var width = 256, height = 256, size = 256,
    mouseX, mouseY, mouseR, mouseI, mouseX2, mouseY2,
    zoom = 0.25, px = -2, py = -2,
    canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    it, cs, ca, ju = false, bail,
    f, fm, fc, fci, t = 0, play = false,
    press = {}, ins = false, max = 0, audio, dif,
    motion = true, sr, si,
    
    memory = {}, mupd = false,
    optab = [0,0,0], wave, int, isin = 0,

    r = {
        start:void 0,
        end:void 0,
        step:0,
        v:void 0,
        is:false
    },
    churn = {
        on: false,
        maxiter: 0,
        iter: 0,
        anim: false,
        data: [], // [[real, imag], ...]
        tuto: true,
        stab: false,
        qual: 1
    },
    saved = true

;(()=>{

    var a = []
    Object.keys(Complex.prototype).forEach(v => {
        if (typeof Complex.prototype[v] == 'function')
            a.push(v)
    })
    $('oper').innerHTML = 'Methods/Opers: x.oper(y): ' + a.join(', ')

})()

;[
    'code', 'mcode', 'cocode', 'cicode',
    'memory',
    'isjulia', 'jureal', 'juimag',
    'iter', 'bail', 'ex',
    'sr', 'si', 'width', 'height'
].forEach(v => {
    $(v).addEventListener('input', () => (memory = {}, churngen(), motion = true, saved = false))
})


function setcursor(event) {
    mouseX = event.offsetX
    mouseY = event.offsetY
}

function huetorgb(i, a=255) {
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
    return [r, g, b, a]
}
function grad(pos, ...colors) {
    colors.push(colors[0])
    colors = colors.map((v,i) => {
        var a=typeof v=='number'?[Math.floor(v/65536)%256,Math.floor(v/256)%256,Math.floor(v)%256,255]:v
        if (a.length < 4) a.push(255)
        return a.length < 5 ? a.concat(i) : a
    })
    pos %= colors[colors.length-1][4]
    var i = colors.findIndex(v => v[4] > pos) - 1,
        p = (pos - colors[i][4]) / ( colors[i + 1][4] - colors[i][4])
    return colors[i].slice(0, 4).map((v,j) => {
        return v * (1 - p) + colors[i + 1][j] * p
    })
}
function gradv(pos, ...values) {
    values.push(values[0])
    values = values.map((v,i) => typeof v == 'number' ? [v, i] : v)
    pos %= values[values.length-1][1]
    var i = values.findIndex(v => v[1] > pos) - 1,
        p = (pos - values[i][1]) / ( values[i + 1][1] - values[i][1])
    return values[i][0] * (1 - p) + values[i + 1][0] * p
}

function sti(x, y) { // screen pos to image pos
    return [
        x / (zoom * size) + px,
        y / (zoom * size) + py
    ]
}
function its(x, y) { // the opposite of above
    return [
        (x - px) * zoom * size,
        (y - py) * zoom * size
    ]
}

function sti2(x, y) { // sti but center is 0
    return [
        x / (zoom * size),
        y / (zoom * size)
    ]
}

function ontick() {
    try {

        function tomem(x,y,add=0) {
            //max = Math.max(max, Math.ceil(Math.log10(size/(1/zoom))))
            return x.toFixed(max)+','+y.toFixed(max)
        }
        width =1* Math.floor($('width').value)
        height =1* Math.floor($('height').value)
        if (!r.is) {
            it =1* $('iter').value
            zoom =1* $('zo').value
            px =1* $('px').value - (1/zoom)/2
            py =1* $('py').value - (1/zoom)/2
            cs =1* $('colsp').value
            ca =1* $('colsh').value
            bail =1* $('bail').value
        }
        f  = Function('z','c','t','ti','re','im','id','m','mr','mi','x','y','mx','my','i','it','jr','ji', 'return ' + $('code').value)
        fm = Function('c','t','ti','re','im','m','mr','mi','x','y','i','mx','my','it', $('mcode').value)
        fc = Function('z','c','t','ti','re','im','m','mr','mi','x','y','id','mx','my','i','it','speed','off', $('cocode').value)
        fci = Function('z','c','t','ti','re','im','m','mr','mi','x','y','id','mx','my','i','it','speed','off', $('cicode').value)
    
        canvas.width = width
        canvas.height = height
    
        var a = width * height, sx, sy, x, y, c, z, i, I, II, rgb, d, b
            ti = Date.now()
    
        size = Math.min(width, height)
    
        mouseR = mouseX / (zoom * size) + px
        mouseI = mouseY / (zoom * size) + py
        ju = $('isjulia').checked
        var m = new Complex(mouseR, mouseI),
            jr =1* $('jureal').value, ji =1* $('juimag').value

        sr =1* $('sr').value, si =1* $('si').value
    
        var img = ctx.getImageData(0, 0, width, height)
    
        var A = Math.ceil(
                     Math.log(size/(1/zoom))
                    /Math.log($('quald').value)
                    -$('qual').value
                )
        if (!mupd & A > max) {
            max = A
            mupd = true
        }

        c = new Complex
        z = new Complex

        function dist(z) {
            return Math.sqrt(z.re ** 2 + z.im ** 2)
        }
        function cbail(z) { // check bailout
            return cb ? f(z,c,t,ti,x,y,i,m,mouseR,mouseI,sx,sy,mouseX,mouseY,I,it,jr,ji,b).bailout : dist(z) < bail / 2
        }

        var M = $('memory').checked,
            C = Number($('itcomp').value),
            FM = $('enabm').checked,
            oo = press.o ? 2000 : 50,
            OB = f(z,c,t,ti,x,y,i,m,mouseR,mouseI,sx,sy,mouseX,mouseY,I,it,jr,ji,b),
            ob, on = OB.__proto__ == Object.prototype, cb = OB.bailout != undefined

        if (churn.on) {
            churn.iter = churn.maxiter
            churngen()
        }
    
        if (motion) {

            for (i = 0; i < a; i++) {
                sx = i % width
                sy = Math.floor(i / width)
        
                x = sx / (zoom * size) + px
                y = sy / (zoom * size) + py

                if (ju) {
                    z.re = x, z.im = y
                    c.re = jr, c.im = ji
                    if (FM) z = fm(c, t, ti, x, y, m, mouseR, mouseI, sx, sy, i, mouseX, mouseY, it)
                } else {
                    c.re = x, c.im = y
                    if (FM) c = fm(c, t, ti, x, y, m, mouseR, mouseI, sx, sy, i, mouseX, mouseY, it)
                    z = new Complex(sr, si)
                }

                if (on) {
                    ob = f(z,c,t,ti,x,y,i,m,mouseR,mouseI,sx,sy,mouseX,mouseY,I,it,jr,ji).onpixel
                    if (ob) {
                        z = ob.z ?? z
                        c = ob.c ?? c
                    }
                }

                dist(z)
        
                if (M) I = memory[tomem(x,y)]
                if (I == undefined | !M) {

                    for (I = 0; I < it & cbail(z); I++) {
                        b = f(z, c, t, ti, x, y, i, m, mouseR, mouseI, sx, sy, mouseX, mouseY, I, it, jr, ji, b)
                        z = C == '1' ? b.def || b : b.multi
                        d = dist(z)
                    }

                    if (C != '1') {
                        while (!cbail(z)) {
                            z = f(z, c, t, ti, x, y, i, m, mouseR, mouseI, sx, sy, mouseX, mouseY, I, it, jr, ji, b).undo
                            d = dist(z)
                        }
                    }

                    if (churn.on) {
                        var cx=0,cy=0, cc,zz, cq=churn.qual
                        function ite() {
                            zz=new Complex(sr, si)
                            for (II = 0; II < churn.iter; II++) {
                                b = f(zz, cc, t, ti, x, y, i, m, mouseR, mouseI, sx, sy, mouseX, mouseY, II, it, jr, ji, b)
                                zz = on ? b.def : b
                            }
                            churn.data[
                                Math.floor(sx * cq + cx) % Math.floor(width * cq) + Math.floor(sy * cq + cy) * Math.floor(width * cq)
                            ] = [zz.re, zz.im]
                        }

                        if (cq > 1) {
                            for (var ci=0; ci<cq**2; ci++) {
                                cx = ci%3, cy = Math.floor(ci/3)
                                cc = c.add(sti2(cx/cq, cy/cql))
                                ite()
                            }
                        } else if (sx % 1/cq == 0 & sy % 1/cq == 0) {
                            cc = new Complex(c)
                            ite()
                        }
                    }

                }
        
                rgb = I == it
                ? rgb = fci(z, c, t, ti, x, y, m, mouseR, mouseI, sx, sy, i, mouseX, mouseY, I, it, cs, ca)
                : rgb = fc(z, c, t, ti, x, y, m, mouseR, mouseI, sx, sy, i, mouseX, mouseY, I, it, cs, ca)
    
                if (typeof rgb == "number") rgb = [Math.floor(rgb/65536)%256,Math.floor(rgb/256)%256,Math.floor(rgb)%256,255]
        
                if (M & mupd) memory[tomem(x,y)] = I
        
                img.data[i * 4    ] = rgb[0]
                img.data[i * 4 + 1] = rgb[1]
                img.data[i * 4 + 2] = rgb[2]
                img.data[i * 4 + 3] = rgb[3]
            }
        
            mupd = false
            ctx.putImageData(img, 0, 0)
            t++

            copy = ctx.getImageData(0, 0, width, height)

            motion = false

        } else {
            ctx.putImageData(copy, 0, 0)
        }

        // iteration path
        if (press.i | press.o & !r.is) {
            var o = press.o
            ctx.lineCap = 'round'
            ctx.lineWidth = 2
            ctx.strokeStyle = '#F55'
            ctx.beginPath()

            if (ju) {
                z.re = mouseR, z.im = mouseI
                c.re = jr, c.im = ji
            } else {
                z = new Complex(sr, si)
                c.re = mouseR, c.im = mouseI
                if (FM) c = fm(c, t, ti, x, y, m, mouseR, mouseI, sx, sy, i, mouseX, mouseY, it)
            }

            wave = []
            min = Infinity, max = -Infinity
            var p

            for (I = 0; I < oo; I++) {
                X = its(z.re, z.im)
                Y = X[1], X = X[0]
                I == 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y)

                p = Math.max(Math.min((z.re + z.im) / 2, 10), -10)
                if (o) wave.push(p)
                min = Math.min(min, p)
                max = Math.max(max, p)
                
                b = f(z, c, t, ti, x, y, i, m, mouseR, mouseI, sx, sy, mouseX, mouseY, I, it)
                z = C == '1' ? b : b.def
            }

            dif = mouseX != mouseX2 | mouseY != mouseY2
            mouseX2 = mouseX, mouseY2 = mouseY

            if (o & dif) {
                for (var i = 0; i < 4; i++) wave = wave.concat(wave)
                wave = wave.map((v,i) => 
                    Array(2).fill(((v - min) / (max - min)) * 0.999 ** i)
                )

                try {if (audio) audio.stop()} catch {}
                audio = wave.toAudio(8e3).start()
            }

            ctx.stroke()
            ctx.closePath()
        } else mouseX2 = mouseX+1, mouseY2 = mouseY+1
        try {if (audio) audio.stop()} catch {}

        if (r.is) {
            ctx.fillStyle = '#173'
            ctx.font = `${height / 16}px Arial`
            ctx.fillText(`Zoom: ${(zoom * 4).toStringFix()}`, 5, 20)
            ctx.strokeStyle = '#000'
            ctx.strokeText(`Zoom: ${(zoom * 4).toStringFix()}`, 5, 20, 2)
        }

        if (churn.on) {
            churn.data.forEach((v,i) => {
                x = i % (width * churn.qual)
                y = Math.floor(i / (width * churn.qual))

                a = its(v[0], v[1])

                ctx.fillStyle = `rgb(0,${
                    (v[0] / bail + 0.5) * 256
                },${
                    (v[1] / bail + 0.5) * 256
                })`

                ctx.beginPath()
                ctx.arc(a[0], a[1], 4, 0, 2 * Math.PI)
                ctx.fill()
            })
        }

    } catch (e) {

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#fff'
        ctx.font = '16px Arial'
        ctx.fillText(e.stack.match(/.{1,10}/g).join('\n'), 5, 20)
        if (press.e) console.log(e)

    }
}

function control() {
    if (press.arrowleft) {motion=true
        px -= 1 / zoom / 16 * $('movesp').value
        $('px').value = px + (1/zoom)/2
    } if (press.arrowright) {motion=true
        px += 1 / zoom / 16 * $('movesp').value
        $('px').value = px + (1/zoom)/2
    } if (press.arrowup) {motion=true
        py -= 1 / zoom / 16 * $('movesp').value
        $('py').value = py + (1/zoom)/2
    } if (press.arrowdown) {motion=true
        py += 1 / zoom / 16 * $('movesp').value
        $('py').value = py + (1/zoom)/2
    }

    if (press.q) {motion=true
        var z = 1/zoom
        zoom *= 1.07 ** $('movesp').value
        px += (z - 1/zoom) / 2
        py += (z - 1/zoom) / 2
        $('zo').value = zoom
    } if (press.z) {motion=true
        var z = 1/zoom
        zoom /= 1.07 ** $('movesp').value
        px += (z - 1/zoom) / 2
        py += (z - 1/zoom) / 2
        $('zo').value = zoom
    }

    if (press.j) {motion=true
        $('isjulia').checked = true
        $('jureal').value = mouseR
        $('juimag').value = mouseI
    }
}

function start() {play = true}
function stop() {play = false}
function reset() {t = 0}

function comp() {
    $('itcomp').value = 4
    $('code').value =
`{
    multi: z.pow(2).add(c).pow(2).add(c).pow(2).add(c).pow(2).add(c),
    undo: z.sub(c).pow(0.5),
    def: ${$('code').value}
}`
}

function example() {

    switch (1* $('ex').value) {
        case 0:
            comp()
        break; case 1:
            var a = Array(8).fill(0).map(v => 
                Array(3).fill(0).map(v => Math.floor(Math.random()*256)).join(',')
            )
            $('cocode').value = `return grad(i / 100 * speed + off, [${a[0]}],[${a[1]}],[${a[2]}],[${a[3]}],[${a[4]}],[${a[5]}],[${a[6]}],[${a[7]}])`
        break; case 2:
            $('mcode').value = 
`var p = gradv(t,
[0,   0], // first = keyframe value, second = keyframe position in ticks
[1,   40],
[2,   70],
[-1,  110],
[200, 180]
)
return c.pow(p)`
            $('enabm').checked = true
        break; case 3:
            $('cicode').value = 'return [re*256+128, im*256+128, 128, 255]'
        break; case 4:
            $('isjulia').checked = true
            $('code').value =
`{
    def: ${$('code').value},
    onpixel: {c: new Complex(mouseR, mouseI)} // changes julia position inputs
}`
    }
    $('ex').value = 'n'
    saved = false

}

function fade(x,y,a) {
    return x * (1 - a) + y * a
}

function inter(fps=30) {
    if (r.is) {
        function tick() {
            var A, B

            var a = r.frame / (r.frames - 1)

            zoom = 10 ** fade(Math.log10(r.start.z), Math.log10(r.end.z), a)
            px = r.end.x + ((r.start.x - r.end.x) * (1 - a)) / zoom * r.start.z - (1/zoom)/2
            py = r.end.y + ((r.start.y - r.end.y) * (1 - a)) / zoom * r.start.z - (1/zoom)/2
            it = fade(r.start.i, r.end.i, a)

            bail = fade(r.start.b, r.end.b, a)
            cs = fade(r.start.cs, r.end.cs, a)
            ca = fade(r.start.ca, r.end.ca, a)

            r.frame == r.frames - 1 ? (r.v.stopRecording(), r.step = 3, r.is = false,
                setTimeout(render,100)
            ) : r.v.pauseRecording()

            A = Date.now()
            ontick()
            B = Math.floor((Date.now() - A) / 1e3 * width * height)

            r.frame == 0 ? r.v.startRecording() : r.v.resumeRecording()
            if (!document.hidden) new Audio('frame.mp3').play()
            r.frame++

            if (!r.is) return
            setTimeout(tick, 1e3/fps)

            $('render').innerHTML = `Rendering... ${r.frame} / ${r.frames} (${Math.floor(r.frame / r.frames * 100)}%), ${B} pixels / sec`
        }
        tick()
    } else {
        int = setInterval(() => {
            if (play) {
                    control()
                    ontick()
            }
        }, 1e3/fps)
    }
}

document.addEventListener('keydown', e => {
    if ([37,38,39,40,81,90,82,74,73,79,69].includes(e.keyCode) & ins) {
        press[e.key.toLowerCase()] = 1
    }
    if (ins & [32,37,38,39,40].includes(e.keyCode)) e.preventDefault()
})
document.addEventListener('keyup', e => {
    if ([37,38,39,40,81,90,82,74,73,79,69].includes(e.keyCode)) {
        press[e.key.toLowerCase()] = 0
    }
})

function tab(id) {
    optab[id] =! optab[id]
    $('t' + id).className = optab[id] ? '' : 'hidden'
}

function render() {
    switch (r.step) {
        case 0:
            $('render').innerHTML = '1: Enter start position (real, imag, zoom)'
        break; case 1:
            r.start = {
                x: px + (1/zoom)/2,
                y: py + (1/zoom)/2,
                z: zoom,
                i: 1* $('iter').value,
                b: 1* $('bail').value,
                cs: 1* $('colsp').value,
                ca: 1* $('colsh').value
            }
            $('render').innerHTML = '2: Enter end position (real, imag, zoom)'
        break; case 2:
            r.end = {
                x: px + (1/zoom)/2,
                y: py + (1/zoom)/2,
                z: zoom,
                i: 1* $('iter').value,
                b: 1* $('bail').value,
                cs: 1* $('colsp').value,
                ca: 1* $('colsh').value
            }
            $('render').innerHTML = 'Waiting...'
            r.fps = 1*prompt('3: Enter FPS (Frame per second)') || 30
            r.frames = 1*prompt(`4: Enter frame amount (Every ${r.fps} frames = 1 second)`) || 100
            r.v = new RecordRTC(canvas, {
                type: 'canvas'
            })

            $('opts').className = 'hidden'
            r.is = true
            r.frame = 0

            $('memory').checked = false
            clearInterval(int)
            inter(r.fps)
            $('render').disabled = true
        break; case 3:
            r.v.save(prompt('5: Enter file name') || 'compfractRender')
            $('render').innerHTML = 'Render animation'
            $('opts').className = ''

            clearInterval(int)
            inter(30)
            $('render').disabled = false
    }
    r.step = (r.step + 1) % 4
}

function onchurn() {
    if (churn.on) {
        churn.on = false
        $('churn').innerHTML = 'Churn graph'
        motion = true
    } else {
        if (churn.tuto) var A = confirm('Churn graph: Places dots at pixels on the fractal, and make them move depending on the formula and '
                                      + 'their Z position. Each dot will have different colors.\nPress OK to not show this again.')
        churn.tuto = false
        var a = prompt('Make this an animation? 0 for false, 1 for true.', 0)
        if (!a) return
        a = a == '1' ? true : false
        var i = prompt(a ? 'Set maximum churn iteration for the animation. Blank for 10'
                         : 'Set churn iteration count. Blank for 100', a ? 10 : 100)
        if (!i) return
        i *= 1 // convert to number
        var c = prompt('Enter dot quality/frequency. x = x² per pixel. Enter blank for default (1).', 1)
        if (!c) return
        c *= 1
        var s = prompt('Make stable part of the fractal highlighted? 0 for false, 1 for true.', 0)
        if (!s) return
        s = s == '1' ? true : false
        
        if (c >= 1) c = Math.floor(c)
        else c = 1 / Math.floor(1 / c)

        churn.on = true
        churn.anim = a
        churn.maxiter = i
        churn.qual = c
        churn.stab = s
        motion = true
        
        churngen()
        $('churn').innerHTML = 'Disable churn graph'
    }
}
function churngen() {
    churn.data = []
    var x
    for (var y = 0; y < height * churn.qual; y++)
    for (x = 0; x < width * churn.qual; x++) {
        churn.data.push(sti(x / churn.qual, y / churn.qual))
    }
}

floatFix = function (x, i=12) { // fixes precision
    return Math.round(x * 10 ** i) / 10 ** i
}
Number.prototype.toStringFix = function (step=0.01, emax=6, emin=-6) {
    if (this==-Infinity) return '-Infinity'
    if (this==Infinity) return 'Infinity'
    if (isNaN(this)) return 'NaN'
    if (this==0) return '0'
    var a = Math.abs(this),
        b = Math.min(Math.abs(this),1), c
    b = 10**Math.floor(Math.log10(b))
    if (a >= 10 ** emax | a <= 10 ** emin) {
        c = (step * Math.floor(a / (
            10**Math.floor(Math.log10(a))
        ) / step))
        c = floatFix(c) + 'e' + Math.floor(Math.log10(a))
    } else {
        c = floatFix(step*b*Math.floor(a/(step*b)))
    }
    return (this < 0 ? '-' : '') + c
}

function colorsw() {
    isin = !isin

    $('cocode').className = isin ? 'hidden' : ''
    $('cicode').className = isin ? '' : 'hidden'
    $('color').innerHTML = isin ? 'Coloring (inner)' : 'Coloring (outer)'
}
function colorco() {
    if (isin) {
        $('cocode').value = $('cicode').value
    } else {
        $('cicode').value = $('cocode').value
    }
}

inter()

function save() {
    var o = {
        data: {},
        version: '1.0',
        since: Date.now()
    }

    if ($('savef').checked) o.data.fract = $('code').value
    if ($('savem').checked) o.data.map = $('mcode').value
    if ($('saveo').checked) o.data.colorout = $('cocode').value
    if ($('savei').checked) o.data.colorin = $('cicode').value
    if ($('savec').checked) o.data.config = {
        real: $('px').value,
        imag: $('py').value,
        magn: $('zo').value,
        iter: $('iter').value,
        bail: $('bail').value,
        cspd: $('colsp').value,
        coff: $('colsh').value,
        julia: $('isjulia').checked,
        jreal: $('jureal').checked,
        jimag: $('juimag').checked
    }

    $('scode').value = btoa(JSON.stringify(o))
    saved = true
}

function load() {
    try {
        try {
            var o = JSON.parse(atob($('scode').value))
        } catch (e) {
            alert(`The code is empty or not properly encoded.\n\n${e.stack}`)
            return
        }
        d = o.data

        if (d.fract) $('code').value = d.fract
        if (d.map) $('mcode').value = d.map
        if (d.colorout) $('cocode').value = d.colorout
        if (d.colorin) $('cicode').value = d.colorin
        $('px').value = d.config.real
        $('py').value = d.config.imag
        $('zo').value = d.config.magn
        $('iter').value = d.config.iter
        $('bail').value = d.config.bail
        $('colsp').value = d.config.cspd
        $('colsh').value = d.config.coff
        $('isjulia').checked = d.config.julia
        $('jureal').checked = d.config.jreal
        $('juimag').checked = d.config.jimag
    } catch (e) {
        alert(`There was an error importing save code.\n\n${e.stack}`)
    }
}

window.onbeforeunload = () => !saved || undefined