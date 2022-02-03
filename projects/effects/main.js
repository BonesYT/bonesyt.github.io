function $(e) {
    return document.getElementById(e)
}

var imgl = ['BADOOF','Discord[error]','DISGUISED','Lines','RGB spiral','sadcube','Thumbnail44','Website preview','youtube (v2)','ytpost2','[TEST]'],
    imgf = imgl.map(v => `images/${v}.png`),
    select = 4,
    mouseX, mouseY,
    canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    width, height,
    img, debug = document.location.href[0] == 'f', data, slidershow = false,
    f = ()=>{}, tick = 0, playing = false, int, err = false,
    values = [0,0,0,0,0]

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
    if (i == 4) {
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
}
selectimg(4)

function getPixel(x, y, typ='rgb') {
    var i = (x % canvas.width) + (y % canvas.height) * canvas.width
    return [data.data[i * 4], data.data[i * 4 + 1], data.data[i * 4 + 2], data.data[i * 4 + 3]].conv(typ)
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
        f = new Function('x','y','t','ti','mx','my','v','a','b','c','d','e', $('code').value)
    } catch (e) {
        if (err != e.toString()) console.log(e.toString())
        err = e.toString()
    }

    data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var x, y, c, time = Date.now(), typ = $('color').value.toLowerCase()

    try {
        for (var i = 0; i < canvas.width * canvas.height; i++) {
            c = [data.data[i * 4], data.data[i * 4 + 1], data.data[i * 4 + 2], data.data[i * 4 + 3]]
            if (typ != 'rgb') c = c.conv(typ)
            c = f(i % canvas.width, (i / canvas.width).floor(), tick, time, mouseX, mouseY, c,
                  values[0], values[1], values[2], values[3], values[4])
            if (c.isArray()) {
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
    $('slidertextA').innerHTML = 'Slider A: ' + values[0]
    $('slidertextB').innerHTML = 'Slider B: ' + values[1]
    $('slidertextC').innerHTML = 'Slider C: ' + values[2]
    $('slidertextD').innerHTML = 'Slider D: ' + values[3]
    $('slidertextE').innerHTML = 'Slider E: ' + values[4]
}
setInterval(updatesliders, 33)