//Main

function $(e) {
    return document.getElementById(e);
}function $q(e) {
    return document.querySelector(e);
}function $c(e) {
    return $q('.' + e)
};

let config = {
    audio: null,
    docReady: false,
    bars: [0,0,0],
    playing: false,
    lasttab: 'progress',
    lastbar: 0,
    first: [1, 1],
    int: {bars: []},
    ach: [0,0],
    upgradelayer: [0,0,0,0,0,1,1,1,1,1,1,1,1,1],
    news: {
        text: '',
        pos: -820
    },
    min: false,
    wtf: {
        spam: 0
    }
}

console.log('Only use console for testing. Please don\'t cheat.')
if (document.location.href[0] == 'f') {
    $('title').innerHTML = 'PR Testing'
}

document.onmousedown = () => { 
    if (!config.playing) {
        config.audio.volume = 0.4
        config.audio.loop = 'loop'
        config.docReady = true
        config.audio.play()
        config.playing = true
    }
}

function LdrToRGB(l, d, r) {
    const a = Math.sin(d)*r
    const b = Math.cos(d)*r
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
function color(v=-1.1, b=0, d=100, id=0, layer=0) {
    let x = Math.sin(v)*d,
        y = Math.cos(v)*d,
        c = LabToRGB(86+b, x, y),
        c2 = LabToRGB(75+b, x, y)
    $(`prog-cont-${layer}-${id}`).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(38+b, x, y)
    c2 = LabToRGB(29+b, x, y)
    $(`prog-bar-${layer}-${id}`).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(65+b, x, y)
    c2 = LabToRGB(52+b, x, y)
    $(`prog-button-${layer}-${id}`).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c.r}, ${c.g}, ${c.b}) 50%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 51%)`
    c = LabToRGB(27+b, x, y)
    $(`prog-button-${layer}-${id}`).style.borderColor = `rgb(${c.r}, ${c.g}, ${c.b})`
    c = LabToRGB(16+b, x, y)
    $(`prog-cont-${layer}-${id}`).style.outline = `4px solid rgb(${c.r}, ${c.g}, ${c.b})`
    c = LabToRGB(86+b, x, y)
    c2 = LabToRGB(75+b, x, y)
    $(`prog-level-${layer}-${id}`).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(16+b, x, y)
    $(`prog-level-${layer}-${id}`).style.outline = `4px solid rgb(${c.r}, ${c.g}, ${c.b})`
    c = LabToRGB(86+b, x, y)
    c2 = LabToRGB(75+b, x, y)
    $(`prog-buy-${layer}-${id}`).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(16+b, x, y)
    $(`prog-buy-${layer}-${id}`).style.borderColor = `rgb(${c.r}, ${c.g}, ${c.b})`

}
function rainbow() {
    a=0
    b=0
    int = setInterval(()=>{
        color(a, b, 0)
        a+=0.05
    }, 33)
}

document.makeElement = (tag, innerHTML)=>{
    const node = document.createElement(tag);
    const textnode = document.createTextNode(innerHTML);
    node.appendChild(textnode);
    return node
}
document.placeElement = (node, id)=>{
    document.getElementById(id).appendChild(node);
}

function mute() {
    if (config.audio.paused) {
        config.audio.play()
    } else {
        config.audio.pause()
    }
}

function tab(tab, Class='tabcontent') {
    if (config.wtf.stopworking) return
    if (tab != config.lasttab) {
        game.stats.page = tab
        playSFX('tab')
    }
    config.lasttab = tab
    let i, tabcontent
    tabcontent = document.getElementsByClassName(Class);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    document.getElementById(tab).style.display = 'block';
    update()
}

function achDesc(id, sid) {
    if (sid >= 0 & !game.achievements[id].unlocked) {
        $q('#ach-desc>h1').innerHTML = 'Secret achievement ' + (sid + 1) + ': ???'
        return
    }
    $q('#ach-desc>h1').innerHTML = sid >= 0
    ? 'Secret achievement ' + (sid + 1) + ': ' + game.achievements[id].desc
    : 'Achievement ' + (id + 1) + ': ' + game.achievements[id].desc
}

const bulk = {
    add:function(i,r,m) {
        return EN.floor(EN.div(EN.ln(EN.div(EN.add(EN.div(i,EN.div(10,
               EN.sub(EN.mul(m,10),10))),r),r)),EN.ln(m)))
    },
    cost:function(a,r,m) {
        return EN.mul(EN.sub(EN.mul(EN.pow(m,a),r),r),EN.div(20,EN.sub(EN.mul(m,20),20)))
    }
}

function works(f) {
    try {
        f()
        return true
    } catch {
        return false
    }
}

function setTheme(theme) {
    $('theme').href = 'css/themes/' + theme + '.css'
    game.stats.theme = theme
}

function min() {

    if (config.wtf.stopworking) return
    let a = $c('main'),
        b = $c('gamescreen'),
        c = document.querySelectorAll('.menu-button'),
        d = [!game.stats.layer?'Progress Bars':'SURFACE Layer','EXOSPHERIC Layer','SPATIAL Layer','Upgrades','Statistics','Achivements','Guide','Options'],
        e = [!game.stats.layer?'PBs':'SUR','EXO','SPT','Upg','Sta','Ach','Gui','Opt']
    
    if (config.min) {
        a.className = a.className.substr(0, a.className.length - 4)
        b.className = b.className.substr(0, b.className.length - 4)
        $('minbutton').innerHTML = '⇦'
        c.forEach((v,i) => v.innerHTML = d[i])
        $('logo').src = 'imgs/logo.png'
    } else {
        a.className += ' min'
        b.className += ' min'
        $('minbutton').innerHTML = '⇨'
        c.forEach((v,i) => v.innerHTML = e[i])
        $('logo').src = 'imgs/logomin.png'
    }
    config.min = !config.min

    config.wtf.lastsp = Date.now()
    if (++config.wtf.spam == 1) funcao()

}
async function funcao() {

    if (await new Promise(r => {
        setInterval(() => {
            if (Date.now() > config.wtf.lastsp + 128 | config.wtf.spam >= 100) {
                r(config.wtf.spam)
                config.wtf.spam = 0
            }
        })
    }) >= 100) {
        playSFX('bruh')
        game.achievements[13].instUnlock()
        config.wtf.stopworking = true
        $q('body').style.filter = 'contrast(5)'
        await new Promise(r => {setTimeout(r,5e3)})
        config.wtf.stopworking = false
        $q('body').style.filter = ''
    }

}

//ExpantaNum JSON fix (Infinity turns into null if you use JSON.stringify)
function nullfix(i, o) {
    try {
        if (i.array[0][1] == null) i.array[0][1] = o || Infinity
    } catch {}
    return i
}

function includeBar(id) {
    if (!game.stats.completeid.includes(id)) game.stats.completeid.push(id)
}

function time(i) {
    var output = Math.floor(i / 1e3 % 60) + ' seconds'
    if (i >= 6e4) output = Math.floor(i / 6e4 % 60) + ' minutes, ' + output
    if (i >= 3.6e6) output = Math.floor(i / 3.6e6 % 24) + ' hours, ' + output
    if (i >= 8.64e7) output = Math.floor(i / 8.64e7 % 365) + ' days, ' + output
    if (i >= 3.1536e10)  output = Math.floor(i / 3.1536e10) + ' years, ' + output
    return output
}

function wipe(a) {

    if (a) {
        [
            'Are you sure you want to wipe ALL of your progress? There is no prize.',
            'Are you REALLY sure you want to wipe ALL of your progress? There is NO PRIZE.',
            "No I'm serious. THERE IS NO PRIZE. You will LOSE EVERYTHING!",
            "ARE YOU SURE YOU WANNA DO THAT!! IT IS IRREVERSIBLE ADN YOU WILL HAVE TO DO EVEYRTHING AGAIN FROM SCRATCH THIS IS YOU'RE LAST CHANCE!!!!!!"
        ].forEach(v => {if (!confirm(v)) return})
    
        game = new Game
        for (let i=0; i<game.stats.layer+1; i++) {
            removeBars(i)
            placeBars(i)
        }
        document.querySelectorAll('*[unlocked]').forEach(v=>{
            v.removeAttribute('unlocked')
        })
        config.audio.pause()
        config.audio.src = `audio/songs/back${game.stats.layer}.mp3`
        playSFX('wipe')
        clearInterval(config.int.autosave)
        setTimeout(() => {
            alert('...And all the bars dissapear into the abyss.')
            alert('Now you only have 30 SECONDS before your save is gone forever. If you changed your mind, please immediately restart the page.')
        }, 300);
        setTheme('color')
        setTimeout(()=>{config.audio.play()}, 7000)
        setTimeout(()=>{
            save(true)
            AutoStart(3)
        }, 3e4)
        update()
        $c('beta-recovery').style.display = ''
    }

}

function playSFX(src) {
    const a = new Audio(`audio/${src}.mp3`)
    a.volume = game.stats.vol.sfx
    a.play()
}
function animTrig(...e) {
    e.forEach(v => v.setAttribute('anim-trig', ''))
}
function animUntr() {
    document.querySelectorAll('[anim-trig]').forEach(v =>
        v.removeAttribute('anim-trig')    
    )
}
async function wait(i) {
    await new Promise(r => setTimeout(r, i * 1e3))
}

function skip(opt) {

    if (opt) {
        $c('beta-recovery').style.display = 'none'
        game.EXO.gain = EN(300)
        game.stats.complete = 36
        ascendAnim(0)
    } else {
        $c('beta-recovery').style.display = 'none'
    }

}

function layerloc(i) {
    if (i == 0) return game
    return game[['', 'EXO', 'SPT'][i]]
}

function toFixed(s, f, n) {
    s=''+s
    const a = s.split(/[.e]/)
    if (!s.includes('.')) a.splice(1, 0, '')

    if (n & !s.includes('e')) a[1] = a[1].substring(0, f)
    else a[1] = a[1].substring(0, f).padEnd(f, 0)

    const b = a[1].length == 0 & !n ? a[0] + '.' + '0'.repeat(f) : f == 0 | a[1].length == 0 ? a[0] : a[0] + '.' + a[1]
    return a[2] ? b + 'e' + a[2] : b
}