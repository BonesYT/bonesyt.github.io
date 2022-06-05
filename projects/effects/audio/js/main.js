var $$ = $
function $(e) {
    return document.getElementById(e)
}

var audl = ['Oof','1KHz test','Baby Laughing','Omegaspeed 2','psytrance test','rhymetilated','shepard tone','Squord','Thesuren','ubuntu seven','[TEST]'],
    audf = audl.map(v => `examples/${v}.mp3`), audc,
    select = 0,
    aud, audSR, audDU, audOut, before, before2, j,
    debug = document.location.href[0] == 'f', data, slidershow = false,
    f = [()=>{}], fs = ['return v'], tick = 0, playing = false, int, err = false,
    values = [[0,0,0,0,0,0]],
    slidnames = [], min=[[],[],[],[],[],[]], max=[[],[],[],[],[],[]], slidenum = [],
    change = true, size = 3,
    exs = {
  'Amplitude':`{\n\teffect: () => allCh(v, v => v * 2 ** (a / 10)),\n\tsliders: [\n\t\t{name: "Amplitude (dB)", min: -100, max: 100, step: 0.01},\n\t\t{restHidden: true}\n\t]\n}`,
  'Pitch Shift':`{\n\teffect: () => getSample(i * 2 ** ((a + b / 100) / 12)),\n\tsliders: [\n\t\t{name: "Pitch", min: -60, max: 60, step: 1},\n\t\t{name: "Cents", min: -100, max: 100, step: 0.01},\n\t\t{restHidden: true}\n\t]}`,
  'Delay':`{\n\teffect: ()=>{\n\t\tvar D = sr * (a / 1000)\n\t\tvar A = receiveSample(i)\n\t\tif (A[0] != undefined) v = A\n\t\tvar w = getSample(i + D)
\t\tsendSample(i + D, -1, allCh(v, (v, i) => v / (b + 1) ** (D / sr) + w[i]))\n\t\treturn v\n\t}, sliders: [\n\t\t{name: "Delay (ms)", min: 0.1, max: 1e4, step: 0.1},\n\t\t{name: "Decay speed", min: 1, max: 10, step: 0.01},\n\t\t{restHidden: true}\n\t]\n}`,
  'Reverse':`{\n\teffect: () =>\n\t\tgetSample(sr * dur * a - i + sr * dur),\n\tsliders: [\n\t\t{name: "Position", min: 0, max: 1, step: 0.00001},\n\t\t{restHidden: true}\n\t]\n}`,
  'Amplitude Modulation':`{\n\teffect: () => {\n\t\tvar exp = d > 0 ? 1 - d : 1 / (d + 1),\n\t\t\tA = blend(b, c, ((a / sr * i) % 1) ** exp),\n\t\t\tvol = 2 ** (A / 10)\n\t\treturn allCh(v, v => v * vol)\n\t},\n\tsliders: [
\t\t{name: "Speed (Hz)", min: 0.05, max: 1e4, step: 0.01},\n\t\t{name: "Minimum volume", min: -100, max: 100, step: 0.01},\n\t\t{name: "Maximum volume", min: -100, max: 100, step: 0.01},\n\t\t{name: "Exponential curve", min: -1, max: 1, step: 0.01},\n\t\t{restHidden: true}\n\t]\n}`,
  'Distortion':`{\n\teffect: () => {\n\t\tvar A, B = b + (i / sr) * d\n\t\tswitch (a) {\n\t\t\tcase 0:\n\t\t\t\tA = v => (v * c | B) / c\n\t\t\tbreak;case 1:\n\t\t\t\tA = v => (v * c & B) / c\n\t\t\tbreak;case 2:\n\t\t\t\tA = v => (v * c ^ B) / c
\t\t\tbreak;case 3:\n\t\t\t\tA = v => (v * c % B) / c\n\t\t}\n\t\treturn allCh(v, A)\n\t}, sliders: [\n\t\t{name: "Distortion mode", min: 0, max: 3, enum: ["or", "and", "xor", "mod"]},\n\t\t{name: "Number", min: 0, max: 16384, step: 0.01},\n\t\t{name: "Precision", min: 1, max: 1024},
\t\t{name: "Number velocity", min: -8192, max: 8192, step: 0.005},\n\t\t{restHidden: true}\n\t]\n}`,
  'Quality':`{\n\teffect: ()=>{\n\t\tvar A = getSample(Math.floor(i * b) / b)\n\t\treturn allCh(A, v => {\n\t\t\tif (a==1) return v\n\t\t\treturn (Math.floor((v/2+0.5)/(1-a))*(1-a)-0.5)*2\n\t\t})\n\t}, sliders:[\n\t\t{name: "Amp quality", min: 0, max: 1, step: 0.001},
\t\t{name: "Rate quality", min: 0, max: 1, step: 0.0002},\n\t\t{restHidden: 1}\n\t]\n}`
    }, exsdef = {
        Amplitude: [],
        'Pitch Shift': [],
        Delay: [500, 1.5],
        Reverse: [],
        'Amplitude Modulation': [1, -100],
        Distortion: [0, 1573, 1024],
        Quality: [1, 1]
    }, isanim = [[false].repeat(6)], speed = [48], gif, gifst = false,
    editing = 0, fn = ['Untitled'], color = ['RGB'], allow = [true],
    send = [], B,C,D,E,F, set = [], media = 'audio', filesel,
    saved = true

function start() {
    var a
    for (var i = 0; i < audl.length + debug - 1; i++) {
        a = document.createElement('button')
        a.id = 'ib' + i
        a.innerHTML = audl[i]
        a.addEventListener('click', (e)=>{
            select = e.srcElement.id.cutFirst(2).toNumber()
            selectaud(select)
        })
        $('audlist').appendChild(a)
        if (i % 5 == 4) {
            $('audlist').appendChild(document.createElement('br'))
        }
    }
}

function selectaud(id) {
    for (var i = 0; i < audl.length + debug - 1; i++) {
        if (i == id) {
            $('ib' + i).setAttribute('selected', '')
        } else {
            $('ib' + i).removeAttribute('selected')
        }
    }
    if (audl[id] != '[TEST]' & !$('iscustom').checked) {
        audf[select].audioToArray(1).then(e => {
            aud = e
            audSR = aud.buffer.sampleRate
            audDU = aud.buffer.duration
        })
    } else if (audl[id] == '[TEST]') {
        // Because of CORS, this [TEST] audio is auto-generated for testing porpuses.
        aud = {samples: [0,0].map(() => Array(32e3).fill(0).map((v,i) => 
            (i % 18 / 9 - 1) * (1 - (i / 4e3 % 1))
        ))}
        audSR = 8e3
        audDU = 4
    }
    change = true
}

function getSample(id, channel=-1) {
    var a = j == 0 ? aud.samples : before // before isn't defined at the first effect
    if (id < 0) return channel == -1 ? Array(a.length).fill(0) : 0
    id=Math.floor(id)%a[0].length,channel=Math.floor(channel)%a.length
    if (channel == -1) return a.map(v=>v[id])
    else return a[channel][id%aud.samples[0].length]
}
function sendSample(id, channel=-1, info) {
    id=Math.floor(id)%aud.samples[0].length,channel=Math.floor(channel)%aud.samples.length
    var x = id + channel * aud.samples[0].length
    if (channel == -1) {
        x = id
        for (var i = 0; i < aud.samples.length; i++, x += aud.samples[0].length) {
            send[x] = info.isArray ? info[i] : info
        }
    } else send[x] = info
}
function receiveSample(id, channel=-1) {
    id=Math.floor(id)%aud.samples[0].length,channel=Math.floor(channel)%aud.samples.length
    var x = id + channel * aud.samples[0].length, o
    if (channel == -1) {
        o = []
        x = id
        for (var i = 0; i < aud.samples.length; i++, x += aud.samples[0].length) {
            o.push(send[x])
        }
        return o
    } else return send[x]
}
function setSample(value, id, channel=-1) {
    if (id < 0) return
    id=Math.floor(id)%aud.samples[0].length,channel=Math.floor(channel)%aud.samples.length
    if (channel == -1) {

        if (value.isArray) audOut.forEach((v,i)=>v[id]=value[i])
        else audOut.forEach((v,i)=>v[id]=value)

    } else audOut[channel][id] =1* value
}
function allCh(input, f=(v,i,a)=>{}) {
    return input.map(f)
}

function render() {
    var z = Date.now()

    checkerr(() => {
        if (audOut) if (!audOut.paused) audOut.pause()

        audOut = aud.samples.map(v=>[...v]), before2 = Array(aud.samples.length).fill([])

        var i, q, a, A = slidval()
        before = undefined, before2 = Array(aud.samples.length).fill([])

        for (j = 0; j < f.length; j++) {
            if (allow[j]) {
                a = A[j]
                q = f[j]
                send = []; set = []
                for (i = 0; i < aud.samples[0].length; i++) {
                    v = audOut.map(v=>v[i])
                    v = q(v, i, z, audDU, audSR, a[0], a[1], a[2], a[3], a[4], a[5]).effect()
                    if (typeof v == 'number') v = Array(aud.samples.length).fill(v)
                    audOut.forEach((w,j)=>w[i]=v[j])
                    before2.forEach((w,j)=>w[i]=v[j])
                }
                before = before2
                before2 = Array(aud.samples.length).fill([])
            }
        }

    }, 1)
    audOut = audOut.toAudio(audSR)

    var fps = 1000 / (Date.now() - z)
    $('fps').innerHTML = `${fps.sround(0.01)} FPS <small>${Math.floor(fps * f.length * aud.samples.length * aud.samples[0].length)} pixels/sec</small>`
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
    checkerr(() => {
        var a = f[editing]().sliders,
            l = 'ABCDEF',
            h = false, i

        min = Array(f.length).fill(0).map(v=>Array(6).fill(0))
        max = Array(f.length).fill(0).map(v=>Array(6).fill(256))
    
        if (a) {
            slidenum = []
            names = []
            for (i = 0; i < 6; i++) {
                if (a[i]) {
                    slidnames[i] = a[i].name || 'Slider ' + l[i]
                    $('slider'+l[i]).min = a[i].min ?? 0
                    $('slider'+l[i]).max = a[i].max ?? 256
                    $('slider'+l[i]).step = a[i].step ?? 1
                    if (a[i].restHidden) h = true
                    min[editing][i] = a[i].min ?? 0
                    max[editing][i] = a[i].max ?? 256
                    if (a[i].enum) slidenum[i] = a[i].enum
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
    })
}
setInterval(updatesliders, 33)
addEventListener('load',()=>setInterval(updslidmod, 33))

function loadex() {
    $('code').value = exs[$('exopt').value]
    fs[editing] = exs[$('exopt').value]
    var a = exsdef[$('exopt').value]
    $('sliderA').value = a[0] || 0
    $('sliderB').value = a[1] || 0
    $('sliderC').value = a[2] || 0
    $('sliderD').value = a[3] || 0
    $('sliderE').value = a[4] || 0
    $('sliderF').value = a[5] || 0
    fn[editing] = $('exopt').value
    list.updbt()
    updatef()
    updslidmod()
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

function slidval() { 
    var i, o = [], l
    for (var a = 0; a < f.length; a++) {
        l = []
        for (i = 0; i < 6; i++) {
            if (isanim[a][i]) l.push(blend(min[a][i], max[a][i], Math.sin(tick / 64 * (speed[editing] / 14) + i * (Math.PI * 2 / 6) + a) / 2 + 0.5))
            else l.push(values[a][i])
        }
        o.push(l)
    }
    return o
}
function setslid(i) {
    i == 6
    ? $('sliderS').value = prompt('What would you like to set this slider to?') || 48
    : $('slider' + 'ABCDEF'[i]).value = prompt('What would you like to set this slider to?') || 0
}

function updatef() {
    checkerr(() => {
        f = fs.map(v => {
            var a = v
            if (a[0] != '{') a = `return{effect:()=>{\n${a}\n}}`
            else a = 'return ' + a
            return new Function('v','i','t','dur','sr','a','b','c','d','e','f', a)
        })
    })
}

function checkerr(func, a=0) {
    try {
        func()
        if (a) err = false
    } catch (e) {
        if (err != e.stack) console.log(e.stack)
        err = e.stack
    }
}

function filedecode() {
    audf[select].audioToArray(1).then(e => {
        aud = e
        audSR = aud.buffer.sampleRate
        audDU = aud.buffer.duration
    })
}
function file(e, t) {
    if (!$('iscustom').checked & !t) filedecode()
    else {
	    if (t) {
            filesel = e.target.files[0]
            if ($('iscustom').checked) filedecode()
        } else {
            if (!filesel) {
                alert('Please select an audio before enabling custom audios.')
                $('iscustom').checked=0
                return
            } else {
                URL.createObjectURL(filesel).audioToArray(1).then(e => {
                    aud = e
                    audSR = aud.buffer.sampleRate
                    audDU = aud.buffer.duration
                })
            }
        }
    }
}

var controls = {
    alert() {
        if (!audOut) {alert('You need to render the audio first!'); return true}
        return false
    },
    play() {
        if (controls.alert()) return
        if (audOut.paused) {
            audOut.play()
            $('play').src = '../txtr/pauseaud.png'
        } else {
            audOut.pause()
            $('play').src = '../txtr/playaud.png'
        }
    },
    stop() {
        if (controls.alert()) return
        $('play').src = '../txtr/playaud.png'
        audOut.pause()
        audOut.currentTime = 0
    },
    for() {if (controls.alert()) return; audOut.currentTime += 5},
    rew() {if (controls.alert()) return; audOut.currentTime -= 5}
}

function makewav() {
    controls.alert()
    var a = document.createElement('a')
    a.href = audOut.src
    a.setAttribute('download', (prompt('Enter file name (.wav)') || 'Custom Audio Effects') + '.wav')
    a.click()
}

var focused = 0
document.onclick = () => !focused ? (focused = 1, start(), selectaud(select)) : 0

window.onbeforeunload = () => !saved || undefined