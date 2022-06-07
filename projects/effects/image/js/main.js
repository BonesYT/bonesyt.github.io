function $(e) {
    return document.getElementById(e)
}

var imgl = ['BADOOF','Discord[error]','DISGUISED','Lines','RGB spiral','sadcube','Thumbnail44','Website preview','youtube (v2)','ytpost2','mrIncredible','oof','[TEST]'],
    imgf = imgl.map(v => `examples/${v}.png`), imgc,
    select = 11,
    mouseX, mouseY,
    canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    width, height,
    slidnames = [], min=[[],[],[],[],[],[]], max=[[],[],[],[],[],[]], slidenum = [],
    img, debug = document.location.href[0] == 'f', data, data2, before, before2, slidershow = false,
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
    editing = 0, fn = ['Untitled'], color = ['RGB'], allow = [true],
    send = [], B,C,D,E,F, set = [], media = 'image', saved = true, j

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
    if (imgl[id] != '[TEST]' & !$('iscustom').checked) {
        img = new Image
        img.src = imgf[select]
    }
    change = true
}
selectimg(select)

function getPixel(x, y, typ='rgb') {
    var a = j == 0 ? data2.data : before
    B = (Math.floor(x) % width) + (Math.floor(y) % height) * canvas.width
    C = [a[B * 4], a[B * 4 + 1], a[B * 4 + 2], a[B * 4 + 3]]
    return typ=='rgb'?C:conv(C,typ)
}
function sendPixel(x, y, info) {
    B = (Math.floor(x) % width) + (Math.floor(y) % height) * canvas.width
    send[B] = info
}
function receivePixel(x=0, y=0) {
    B = (Math.floor(x) % width) + (Math.floor(y) % height) * canvas.width
    return send[B]
}
function setPixel(x, y, v, typ='rgb') {
    B = (Math.floor(x) % width) + (Math.floor(y) % height) * canvas.width
    if (typ != 'rgb') v = conv(v, typ, 1)
    set.push([B, v])
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

    data = ctx.getImageData(0, 0, width, height), data2 = ctx.getImageData(0, 0, width, height)
    before2 = [], before = undefined

    size = typ.length

    var i, q
    try {
        for (j = 0; j < f.length; j++) {
            if (allow[j]) {
                q = f[j]
                send = []; set = []
                for (i = 0; i < canvas.width * canvas.height; i++) {
                    c = [data.data[i * 4], data.data[i * 4 + 1], data.data[i * 4 + 2], data.data[i * 4 + 3]]
                    c = q(i % canvas.width, Math.floor(i / canvas.width), i, tick, time, mouseX, mouseY, typ[j]=='rgb'?c:conv(c,typ[j]),
                          values[j][0], values[j][1], values[j][2], values[j][3], values[j][4], values[j][5]).effect()
                    if (typ[j] != 'rgb') c = conv(c, typ[j], 1)
                    if (typeof c == 'number') {
                        c = [(c >> 16) & 0xff,
                             (c >> 8 ) & 0xff,
                             (c      ) & 0xff, 255]
                    }
                    data.data[i * 4 + 0] = c[0]
                    data.data[i * 4 + 1] = c[1]
                    data.data[i * 4 + 2] = c[2]
                    data.data[i * 4 + 3] = c[3]
                    before2.push(c[0])
                    before2.push(c[1])
                    before2.push(c[2])
                    before2.push(c[3])
                }
                set.forEach(v => {
                    data.data[v[0] * 4 + 0] = v[1][0]
                    data.data[v[0] * 4 + 1] = v[1][1]
                    data.data[v[0] * 4 + 2] = v[1][2]
                    data.data[v[0] * 4 + 3] = v[1][3]
                    before2[v[0] * 4 + 0] = v[1][0]
                    before2[v[0] * 4 + 1] = v[1][1]
                    before2[v[0] * 4 + 2] = v[1][2]
                    before2[v[0] * 4 + 3] = v[1][3]
                })
                before = before2
                before2 = []
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
function getslid(i) {
    return slidenum[i] ? slidenum[i][Math.floor(values[editing][i])]
                       : values[editing][i]
}
function updatesliders() {
    values[editing][0] = $('sliderA').value.toNumber()
    values[editing][1] = $('sliderB').value.toNumber()
    values[editing][2] = $('sliderC').value.toNumber()
    values[editing][3] = $('sliderD').value.toNumber()
    values[editing][4] = $('sliderE').value.toNumber()
    values[editing][5] = $('sliderF').value.toNumber()
    speed[editing] = $('sliderS').value.toNumber()
    $('slidertextA').innerHTML = slidnames[0] + ': ' + getslid(0)
    $('slidertextB').innerHTML = slidnames[1] + ': ' + getslid(1)
    $('slidertextC').innerHTML = slidnames[2] + ': ' + getslid(2)
    $('slidertextD').innerHTML = slidnames[3] + ': ' + getslid(3)
    $('slidertextE').innerHTML = slidnames[4] + ': ' + getslid(4)
    $('slidertextF').innerHTML = slidnames[5] + ': ' + getslid(5)
    $('slidertextS').innerHTML = 'Slider Animation Velocity: ' + speed
}
function updslidmod() {
    var a = f[editing]().sliders,
        l = 'ABCDEF',
        h = false, i

    min = Array(f.length).fill(0).map(v=>Array(6).fill(0))
    max = Array(f.length).fill(0).map(v=>Array(6).fill(256))

    if (a) {
        for (i = 0; i < 6; i++) {
            if (a[i]) {
                slidnames[i] = a[i].name || 'Slider ' + l[i]
                $('slider'+l[i]).min = a[i].min ?? 0
                $('slider'+l[i]).max = a[i].max ?? 256
                $('slider'+l[i]).step = a[i].step ?? 1
                if (a[i].restHidden) h = true
                min[editing][i] = a[i].min ?? 0
                max[editing][i] = a[i].max ?? 256
            } else {
                slidnames[i] = 'Slider ' + l[i]
                $('slider'+l[i]).min = 0
                $('slider'+l[i]).max = 256
                $('slider'+l[i]).step = 1
            }
            if (h) {
                $('slider'+l[i]).style.display = 'none'
                $('slidertext'+l[i]).style.display = 'none'
                $('animbt'+l[i]).style.display = 'none'
            } else {
                $('slider'+l[i]).style.display = ''
                $('slidertext'+l[i]).style.display = ''
                $('animbt'+l[i]).style.display = ''
            }
        }
    } else {
        for (var i = 0; i < 6; i++) {
            slidnames[i] = 'Slider ' + l[i]
            $('slider'+l[i]).style.display = ''
            $('slidertext'+l[i]).style.display = ''
            $('animbt'+l[i]).style.display = ''
        }
    }
    for (let s = 0; s < f.length; s++, s == editing ? s++ : 0) {
        a = f[s]().sliders
        if (!a) continue
        for (var i = 0; i < 6; i++) {
            if (a[i]) {
                min[s][i] = a[i].min ?? 0
                max[s][i] = a[i].max ?? 256
            }
        }
    }
}
setInterval(updatesliders, 33)
addEventListener('load',()=>setInterval(updslidmod, 33))

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
        $('anim' + id).src = '../txtr/pause.png'
    } else {
        $('anim' + id).src = '../txtr/play.png'
    }
    saved=false
}
function blend(x, y, z) {
    return x * (1 - z) + y * z
}
function allCh(input, f=(v,i,a)=>{}) {
    return input.map(f)
}

setInterval(() => {
    var b, i
    for (var a = 0; a < f.length; a++) {
        for (i = 0; i < 6; i++) {
            b = blend(min[a][i], max[a][i], Math.sin(tick / 64 * (speed[editing] / 14) + i * (Math.PI * 2 / 6) + a) / 2 + 0.5)
            if (a == editing) {
                if (isanim[a][i]) $('slider' + (i + 65).fromCharCode()).value = Math.sin(tick / 64 * (speed[editing] / 14) + i * (Math.PI * 2 / 6) + a) * 0.5 + 0.5
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
        gif.download(prompt('4/4: Enter file name') || 'Custom Image Effects')
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

function setslid(i) {
    i == 6
    ? $('sliderS').value = prompt('What would you like to set this slider to?') || 48
    : $('slider' + 'ABCDEF'[i]).value = prompt('What would you like to set this slider to?') || 0
}

function updatef() {
    try {
        f = fs.map(v => {
            var a = v
            if (a[0] != '{') a = `return{effect:()=>{\n${a}\n}}`
            else a = 'return ' + a
            return new Function('x','y','i','t','ti','mx','my','v','a','b','c','d','e','f', a)
        })
    } catch (e) {
        if (err != e.toString()) console.log(e.toString())
        err = e.toString()
    }
}

function file(e, t) {
    if (!$('iscustom').checked & !t) {
        img = new Image
        img.src = imgf[select]
    } else {
	    if (t) {
            imgc = new Image;
	        imgc.src = URL.createObjectURL(e.target.files[0]);
        } else {
            if (!imgc) {
                alert('Please select an image before enabling custom images.')
                $('iscustom').checked=0
                return
            }
            img = imgc
        }
    }
}

window.onbeforeunload = () => !saved || undefined