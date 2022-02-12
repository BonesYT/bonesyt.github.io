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
return v`
    }

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
selectimg(4)

function getPixel(x, y, typ='rgb') {
    var i = (Math.floor(x) % width) + (Math.floor(y) % height) * canvas.width
    return [before[i * 4], before[i * 4 + 1], before[i * 4 + 2], before[i * 4 + 3]].conv(typ)
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
            if (c.isArray()) {
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
    $('slidertextA').innerHTML = 'Slider A: ' + values[0]
    $('slidertextB').innerHTML = 'Slider B: ' + values[1]
    $('slidertextC').innerHTML = 'Slider C: ' + values[2]
    $('slidertextD').innerHTML = 'Slider D: ' + values[3]
    $('slidertextE').innerHTML = 'Slider E: ' + values[4]
    $('slidertextF').innerHTML = 'Slider F: ' + values[5]
}
setInterval(updatesliders, 33)

function loadex() {
    $('code').value = exs[$('exopt').value]
}