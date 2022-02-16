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
    f = ()=>{}, tick = 0, playing = false, int, err = false,
    values = [0,0,0,0,0], before, change = true, size = 3,
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
return v`
    }, exsdef = {
'Brightness': [],
'Shadow Cursor': [],
'Waves': [0,0,0,40,64],
'Multi Effects': [150],
'Pixelation': [5],
'Edge Detect': [1,1],
'Invert': [0,0,0,255,255,255]
    }, isanim = [false].repeat(6), speed = 48, gif, gifst = false

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

    try {
        f = new Function('x','y','t','ti','mx','my','v','a','b','c','d','e','f', $('code').value)
    } catch (e) {
        if (err != e.toString()) console.log(e.toString())
        err = e.toString()
    }

    data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var x, y, c, time = Date.now(), typ = $('color').value.toLowerCase()
    if (change | canvas.width != width | canvas.height != height) {
        width = canvas.width
        height = canvas.height
        before = data.data.clone()
        change = false
    }

    size = typ.length

    try {
        for (var i = 0; i < canvas.width * canvas.height; i++) {
            c = [data.data[i * 4], data.data[i * 4 + 1], data.data[i * 4 + 2], data.data[i * 4 + 3]]
            if (typ != 'rgb') c = c.conv(typ)
            c = f(i % canvas.width, (i / canvas.width).floor(), tick, time, mouseX, mouseY, c,
                  values[0], values[1], values[2], values[3], values[4], values[5])
            if (c.isArray) {
                if (c.length != size + 1) c.push(255)
                if (typ != 'rgb') c = c.conv(typ, 1)
                data.data[i * 4 + 0] = c[0]
                data.data[i * 4 + 1] = c[1]
                data.data[i * 4 + 2] = c[2]
                data.data[i * 4 + 3] = c[3]
            } else {
                data.data[i * 4 + 0] = ((c >> 16) & 0xff)
                data.data[i * 4 + 1] = ((c >> 8 ) & 0xff)
                data.data[i * 4 + 2] = ((c      ) & 0xff)
                data.data[i * 4 + 3] = 255
            }
        }
        err = false
    } catch (e) {
        if (err != e.toString()) console.log(e.toString())
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
    values[0] = $('sliderA').value.toNumber()
    values[1] = $('sliderB').value.toNumber()
    values[2] = $('sliderC').value.toNumber()
    values[3] = $('sliderD').value.toNumber()
    values[4] = $('sliderE').value.toNumber()
    values[5] = $('sliderF').value.toNumber()
    speed = $('sliderS').value.toNumber()
    $('slidertextA').innerHTML = 'Slider A: ' + values[0]
    $('slidertextB').innerHTML = 'Slider B: ' + values[1]
    $('slidertextC').innerHTML = 'Slider C: ' + values[2]
    $('slidertextD').innerHTML = 'Slider D: ' + values[3]
    $('slidertextE').innerHTML = 'Slider E: ' + values[4]
    $('slidertextF').innerHTML = 'Slider F: ' + values[5]
    $('slidertextS').innerHTML = 'Slider Animation Velocity: ' + speed
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
}

function anim(id) {
    isanim[id] = !isanim[id]
    if (isanim[id]) {
        $('anim' + id).src = 'textures/pause.png'
    } else {
        $('anim' + id).src = 'textures/play.png'
    }
}
setInterval(() => {
    for (var i = 0; i < 6; i++) {
        if (isanim[i]) $('slider' + (i + 65).fromCharCode()).value = Math.sin(tick / 64 * (speed / 14) + i * (Math.PI * 2 / 6)) * 128 + 128
    }
}, 33)

function save() {
    ({
        sliders: values,
        animated: isanim,
        slidvel: speed,
        width: width,
        height: height,
        color: $('color').value,
        effect: $('code').value
    }).stringify().btoa().toClipboard()
}
function load() {
    EasyObj.clipb.get()
    setTimeout(()=>{
        try {
            var a = EasyObj.clipb.info.atob().parse()
        } catch {
            alert('This save code is invalid. (Decoding/Syntax Error) (try doing it again, might be because of the clipboard pop-up)')
            return false
        }
        if (confirm('Are you sure you want to load this code? Any unsaved changes will be discarded.')) {
            try {
                $('sliderA').value = a.sliders[0]
                $('sliderB').value = a.sliders[1]
                $('sliderC').value = a.sliders[2]
                $('sliderD').value = a.sliders[3]
                $('sliderE').value = a.sliders[4]
                $('sliderF').value = a.sliders[5]
                isanim = a.animated
                speed = a.slidvel
                width = a.width
                height = a.height
                $('color').value = a.color
                $('code').value = a.effect
        
                tick = 0
                updatesliders()
                ctx.clearRect(0, 0, width, height)
            } catch {
                alert('This save code is invalid. (Reference Error)')
            }
        }
    }, 33)
}

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