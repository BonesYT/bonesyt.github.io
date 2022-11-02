//Main

function $(e) {
    return document.getElementById(e);
};

var config = {
    bars: [0,0],
    playing: false,
    lasttab: 'progress',
    lastbar: 0,
    layerup: false,
    int: {bars: []},
    ach: 0,
    upgradelayer: [0,0,0,0,0,1,1],
    news: {
        text: '',
        pos: -820
    },
    min: false
}

console.log('Only use console for testing. Please don\'t cheat.')
if (document.location.href[0] == 'f') {
    $('title').innerHTML = 'PR Testing'
}

document.onmousedown = () => { 
    if (!config.playing) {
        config.audio.volume = 0.4
        config.audio.loop = 'loop'
        config.audio.play()
        config.playing = true;
    }
}

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
function color(v=-1.1, b=0, d=100, id=0, layer=0) {
    var x = Math.sin(v)*d
    var y = Math.cos(v)*d
    var c = LabToRGB(86+b, x, y)
    var c2 = LabToRGB(75+b, x, y)
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
    var node = document.createElement(tag);
    var textnode = document.createTextNode(innerHTML);
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
    if (tab != config.lasttab) {
        game.stats.page = tab
        playSFX('audio/tab.mp3')
    }
    config.lasttab = tab
    var i, tabcontent;
    tabcontent = document.getElementsByClassName(Class);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    document.getElementById(tab).style.display = 'block';
}

function achDesc(id) {
    document.querySelector('#ach-desc>h1').innerHTML = 'Achievement ' + (id + 1) + ': ' + game.achievements[id].desc
}

var buy = {
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
    var a = document.querySelector('.main')
    var b = document.querySelector('.gamescreen')
    var c = document.querySelectorAll('.menu-button'),
        d = [game.stats.layer==0?'Progress Bars':'SURFACE Layer','SKY Layer','Upgrades','Statistics','Achivements','Guide','Options'],
        e = [game.stats.layer==0?'PB':'L1','L2','Upg','Sta','Ach','Gui','Opt']
    if (config.min) {
        a.className = a.className.substr(0, a.className.length - 4)
        b.className = b.className.substr(0, b.className.length - 4)
        $('minbutton').innerHTML = '⇦'
        c.forEach((v,i) => v.innerHTML = d[i])
        $('logo').src = 'images/logo.png'
    } else {
        a.className += ' min'
        b.className += ' min'
        $('minbutton').innerHTML = '⇨'
        c.forEach((v,i) => v.innerHTML = e[i])
        $('logo').src = 'images/logomin.png'
    }
    config.min = !config.min
}

//ExpantaNum JSON fix (Infinity turns into null if you use JSON.stringify)
function nullfix(i, o) {
    try {
        if (i.array[0][1] == null) i.array[0][1] = o || Infinity
    } catch {}
    return i
}

function addBar(id) {
    var hasAdded = !game.stats.completeid.includes(id)
    if (hasAdded) game.stats.completeid.push(id)
    return hasAdded
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
        for (var i = 0; i < 5; i++) {
            if (!confirm('Are you ' + 'really '.repeat(i) + 'sure you want to wipe ALL of your progress? There is no prize. Click ' + (5 - i) + ' more times to confirm.')) {
                return false
            }
        }
        game = new Game
        for (var i=0; i<game.stats.layer+1; i++) {
            removeBars(i)
            placeBars(i)
        }
        document.querySelectorAll('*[unlocked]').forEach(v=>{
            v.removeAttribute('unlocked')
        })
        config.audio.pause()
        config.audio.src = `audio/songs/back${game.stats.layer}.mp3`
        $('vol-music').value = '1'
        new Audio('audio/wipe.mp3').play()
        clearInterval(config.int.autosave)
        setTimeout(() => {
            alert('...And all the bars dissapear into the abyss.')
            alert('Now you only have ONE MINUTE before your save is gone forever. If you changed your mind, please quickly restart the page.')
        }, 300);
        setTheme('color')
        setTimeout(()=>{config.audio.play()}, 7000)
        setTimeout(()=>{
            save(true)
            AutoStart(3)
        }, 60000)
        update()
    }
}

function playSFX(src) {
    var a = new Audio(src)
    a.volume = game.stats.vol.sfx
    a.play()
}