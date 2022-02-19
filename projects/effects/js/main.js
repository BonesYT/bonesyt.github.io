function $(e) {
    return document.getElementById(e)
}

var imgl = ['BADOOF','Discord[error]','DISGUISED','Lines','RGB spiral','sadcube','Thumbnail44','Website preview','youtube (v2)','ytpost2','mrIncredible','oof','[TEST]'],
    imgf = imgl.map(v => `images/${v}.png`),
    select = 11,
    mouseX, mouseY,
    canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    width, height,
    img, debug = document.location.href[0] == 'f', data, slidershow = false,
    f = [()=>{}], fs = ['return v'], tick = 0, playing = false, int, err = false,
    values = [[0,0,0,0,0,0]], before, change = true, size = 3,
    exs = {
    'Brightness': `v[0] += (a + d) * (e / 127.5 - 1);
v[1] += (b + d) * (e / 127.5 - 1);
v[2] += (c + d) * (e / 127.5 - 1);
return v`,
    'Shadow Cursor': `function z(v) {
    return v - Math.sqrt((x - mx) ** 2 + (y - my) ** 2)
}
v[0]=z(v[0]);
v[1]=z(v[1]);
v[2]=z(v[2]);
return v`,
    'Waves': `return getPixel(
    x+(y*a/255+c/(255/(Math.PI*2))).sin()*b/8,
    y+(x*d/255+f/(255/(Math.PI*2))).sin()*e/8
)`,
    'Multi Effects': `var effects = [
  ()=>{
    v[0] *= (a / 150)
  },()=>{
    v[3] = 255 * (b / 256) + v[3] * (1 - b / 256)
  }
]
effects.forEach(v => {v()})
return v`,
    'Pixelation': `v = getPixel(x.sfloor(a), y.sfloor(a))
X = x%a
Y = y%a
if (X < b | Y < b) v = [v[0]/2,v[1]/2,v[2]/2,v[3]]
if (X >= a - b | Y >= a - b) v = [v[0]*2,v[1]*2,v[2]*2,v[3]]
return v`,
    'Edge Detect': `w = getPixel(x-a, y-b).map((u,i) => {
   return Math.abs(u - v[i])
})
w[3] = v[3]
return w`,
    'Invert': `function reverse(x, a, b) {
  return b - (x - a)
}
v[0] = reverse(v[0], a, d)
v[1] = reverse(v[1], b, e)
v[2] = reverse(v[2], c, f)
return v`,
    'Threshold': `
function z(v) {
    return v>a?255:0
}
v[0]=z(v[0]);
v[1]=z(v[1]);
v[2]=z(v[2]);
return v
`
    }, exsdef = {
'Brightness': [],
'Shadow Cursor': [],
'Waves': [0,0,0,40,64],
'Multi Effects': [150],
'Pixelation': [5],
'Edge Detect': [1,1],
'Invert': [0,0,0,255,255,255],
'Threshold': [128]
    }, isanim = [[false].repeat(6)], speed = [48], gif, gifst = false,
    editing = 0, fn = ['Untitled'], color = ['RGB'], allow = [true]

;(()=>{
var a
for (var i = 0; i < imgl.length + debug - 1; i++) {
    a = document.createElement('button')
    a.id = 'ib' + i
    a.innerHTML = imgl[i]
    a.addEventListener('click', (e)=>{
        select = e.srcElement.id.cutFirst(2).toNumber()
        selectimg(select)
    })
    $('imglist').appendChild(a)
    if (i % 5 == 4) {
        $('imglist').appendChild(document.createElement('br'))
    }
}
})()

function selectimg(id) {
    for (var i = 0; i < imgl.length + debug - 1; i++) {
        if (i == id) {
            $('ib' + i).setAttribute('selected', '')
        } else {
            $('ib' + i).removeAttribute('selected')
        }
    }
    if (imgl[id] != '[TEST]') {
        img = new Image
        img.src = imgf[select]
    }
    change = true
}
selectimg(select)

function getPixel(x, y, typ='rgb') {
    var i = (Math.floor(x) % width) + (Math.floor(y) % height) * canvas.width,
        a = [before[i * 4], before[i * 4 + 1], before[i * 4 + 2], before[i * 4 + 3]]
    return typ=='rgb'?a:a.conv(typ)
}
function setcursor(event) {
    mouseX = event.offsetX
    mouseY = event.offsetY
}
function ontick() {
    var z = Date.now()

    canvas.width = $('width').value
    canvas.height = $('height').value
    if (imgl[select] == '[TEST]') {
        var i = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        i.addColorStop(0, "red");
        i.addColorStop(1, "blue");
        ctx.fillStyle = i;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    var x, y, c, time = Date.now(), typ = color.map(v => {
        return v.toLowerCase()
    })
    if (change | canvas.width != width | canvas.height != height) {
        width = canvas.width
        height = canvas.height
        change = false
    }

    data = ctx.getImageData(0, 0, width, height)

    size = typ.length

    var i
    try {
        for (var j = 0; j < f.length; j++) {
            if (allow[j]) {
                before = [...data.data]
                for (i = 0; i < canvas.width * canvas.height; i++) {
                    c = [data.data[i * 4], data.data[i * 4 + 1], data.data[i * 4 + 2], data.data[i * 4 + 3]]
                    c = f[j](i % canvas.width, (i / canvas.width).floor(), tick, time, mouseX, mouseY, typ[j]=='rgb'?c:c.conv(typ[j]),
                          values[j][0], values[j][1], values[j][2], values[j][3], values[j][4], values[j][5])
                    if (typ[j] != 'rgb') c = c.conv(typ[j], 1)
                    if (typeof c == 'number') {
                        c = [(c >> 16) & 0xff,
                             (c >> 8 ) & 0xff,
                             (c      ) & 0xff, 255]
                    }
                    data.data[i * 4 + 0] = c[0]
                    data.data[i * 4 + 1] = c[1]
                    data.data[i * 4 + 2] = c[2]
                    data.data[i * 4 + 3] = c[3]
                }
            }
        }
        err = false
    } catch (e) {
        if (err != e.toString()) console.log(e)
        err = e.toString()
    }

    ctx.putImageData(data, 0, 0)

    if (gifst) console.log(gif.addFrame(ctx, false))

    tick++
    $('fps').innerHTML = (1000 / (Date.now() - z)).sround(0.01) + ' FPS'
}

function start() {
    if (!playing) {
        playing = true
        int = setInterval(ontick, 33)
    }
}
function stop() {
    if (playing) {
        playing = false
        clearInterval(int)
    }
}
function reset() {
    tick = 0
}

function sliders() {
    slidershow = !slidershow
    if (slidershow) {
        $('sliders').style.display = 'block'
    } else {
        $('sliders').style.display = 'none'
    }
}
function updatesliders() {
    values[editing][0] = $('sliderA').value.toNumber()
    values[editing][1] = $('sliderB').value.toNumber()
    values[editing][2] = $('sliderC').value.toNumber()
    values[editing][3] = $('sliderD').value.toNumber()
    values[editing][4] = $('sliderE').value.toNumber()
    values[editing][5] = $('sliderF').value.toNumber()
    speed[editing] = $('sliderS').value.toNumber()
    $('slidertextA').innerHTML = 'Slider A: ' + values[editing][0]
    $('slidertextB').innerHTML = 'Slider B: ' + values[editing][1]
    $('slidertextC').innerHTML = 'Slider C: ' + values[editing][2]
    $('slidertextD').innerHTML = 'Slider D: ' + values[editing][3]
    $('slidertextE').innerHTML = 'Slider E: ' + values[editing][4]
    $('slidertextF').innerHTML = 'Slider F: ' + values[editing][5]
    $('slidertextS').innerHTML = 'Slider Animation Velocity: ' + speed
    color[editing] = $('color').value
}
setInterval(updatesliders, 33)

function loadex() {
    $('code').value = exs[$('exopt').value]
    var a = exsdef[$('exopt').value]
    $('sliderA').value = a[0] || 0
    $('sliderB').value = a[1] || 0
    $('sliderC').value = a[2] || 0
    $('sliderD').value = a[3] || 0
    $('sliderE').value = a[4] || 0
    $('sliderF').value = a[5] || 0
    updatef()
    fn[editing] = $('exopt').value
    list.updbt()
}

function anim(id) {
    isanim[editing][id] = !isanim[editing][id]
    if (isanim[editing][id]) {
        $('anim' + id).src = 'textures/pause.png'
    } else {
        $('anim' + id).src = 'textures/play.png'
    }
}
setInterval(() => {
    for (var a = 0; a < f.length; a++) {
        for (var i = 0; i < 6; i++) {
            if (a == editing) {
                if (isanim[a][i]) $('slider' + (i + 65).fromCharCode()).value = Math.sin(tick / 64 * (speed[editing] / 14) + i * (Math.PI * 2 / 6) + a) * 128 + 128
            } else {
                if (isanim[a][i]) values[a][i] = Math.sin(tick / 64 * (speed[editing] / 14) + i * (Math.PI * 2 / 6) + a) * 128 + 128
            }
        }
    }
}, 33)

function makegif() {
    if (gifst) {
        gifst = false
        gif.finish()
        gif.download(prompt('4/4: Enter file name') || 'Custom Effects GIF')
        $('gif').innerHTML = 'Make GIF File'
    } else {
        gif = new GIFEncoder()
        gif.setSize(width, height)
        gif.setDelay(1000 / (prompt('1/4: Set FPS Value (how many frames per second, blank for 10)').toNumber() || 10))
        gif.setRepeat(prompt('2/4: Set Loop Count (how many times the GIF file should loop, blank for 0)').toNumber() || 0)
        gif.setQuality(prompt('3/4: Set Quality (enter blank for 20)').toNumber() || 20)
        $('gif').innerHTML = 'Recording in 3...'
        setTimeout(()=>{
        $('gif').innerHTML = 'Recording in 2...'
        setTimeout(()=>{
        $('gif').innerHTML = 'Recording in 1...'
        setTimeout(()=>{
            gif.start()
            gifst = true
            tick = 0
            $('gif').innerHTML = 'Stop recording GIF'
        },1000)},1000)},1000)
    }
}

function updatef() {
    fs[editing] = $('code').value
    try {
        f = fs.map(v => {
            return new Function('x','y','t','ti','mx','my','v','a','b','c','d','e','f', v)
        })
    } catch (e) {
        if (err != e.toString()) console.log(e.toString())
        err = e.toString()
    }
}