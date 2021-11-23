function $(e) {
    return document.getElementById(e);
};

var config = {
    bars: 0,
    playing: false,
}

document.onmousedown = function() { 
    if (!config.playing) {
        config.audio = new Audio('audio/themeSong.mp3')
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
function color(v=-1.1, b=0, id=0) {
    var x = Math.sin(v)*100
    var y = Math.cos(v)*100
    var c = LabToRGB(86+b, x, y)
    var c2 = LabToRGB(75+b, x, y)
    $('prog-cont-'+id).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(38+b, x, y)
    c2 = LabToRGB(29+b, x, y)
    $('prog-bar-'+id).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(65+b, x, y)
    c2 = LabToRGB(52+b, x, y)
    $('prog-button-'+id).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c.r}, ${c.g}, ${c.b}) 50%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 51%)`
    c = LabToRGB(27+b, x, y)
    $('prog-button-'+id).style.borderColor = `rgb(${c.r}, ${c.g}, ${c.b})`
    c = LabToRGB(16+b, x, y)
    $('prog-cont-'+id).style.outline = `4px solid rgb(${c.r}, ${c.g}, ${c.b})`
    c = LabToRGB(86+b, x, y)
    c2 = LabToRGB(75+b, x, y)
    $('prog-level-'+id).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(16+b, x, y)
    $('prog-level-'+id).style.outline = `4px solid rgb(${c.r}, ${c.g}, ${c.b})`
    c = LabToRGB(86+b, x, y)
    c2 = LabToRGB(75+b, x, y)
    $('prog-buy-'+id).style.backgroundImage = `linear-gradient(rgb(${c.r}, ${c.g}, ${c.b}) 0%,rgb(${c2.r}, ${c2.g}, ${c2.b}) 100%)`
    c = LabToRGB(16+b, x, y)
    $('prog-buy-'+id).style.borderColor = `rgb(${c.r}, ${c.g}, ${c.b})`

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
function placeBars() {
    while (config.bars < game.bars.length) {
        var e = $('progressbar-copy').cloneNode(true)
        e.style.display = 'block'
        e.id = 'prog-'+config.bars
        var c = e.querySelectorAll('.select')
        c[0].id = 'prog-button-'+config.bars
        c[1].id = 'prog-cont-'+config.bars
        c[2].id = 'prog-bar-'+config.bars
        c[3].id = 'prog-text-'+config.bars
        c[4].id = 'prog-level-'+config.bars
        c[5].id = 'prog-buy-'+config.bars

        c[0].addEventListener('click', new Function('barIncrement(' + config.bars + ')'))
        c[5].addEventListener('click', new Function('barBuy(' + config.bars + ')'))

        document.placeElement(e, 'progressbar-place')
        color(game.bars.length/3.75-1.4, 0, config.bars)
        config.bars++
    }
}
function ButtonStyle(node, rgb) {
    if (node.tagName == 'BUTTON') {
        node.style.height = '48px'
        node.style.borderRadius = '0'
        node.style.borderWidth = '4px'
        node.style.fontFamily = 'myFirstFont'
        node.style.whiteSpace = 'pre-wrap'
        node.style.borderColor = 'rgb('+(rgb[0]/5)+','+(rgb[1]/5)+','+(rgb[2]/5)+')'
        node.style.backgroundImage = `linear-gradient(rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) 0%, rgb(${rgb[0]/1.1}, ${rgb[1]/1.15}, ${rgb[2]/1.15}) 100%)`
    } else {throw Error('Element is not a button.')}
}

function mute() {
    if (config.audio.paused) {
        config.audio.play()
    } else {
        config.audio.pause()
    }
}

function tab(evt, tab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    document.getElementById(tab).style.display = "block";
}

function save() {
    $('savecode').innerHTML = btoa(JSON.stringify(game))
}
function load() {
    game = JSON.parse(atob($('savecode').innerHTML))
    game.points = EN(game.points)
    game.tpoints = EN(game.tpoints)
    game.next = EN(game.next)
    game.bars.forEach((v,i,a) => {
        v.points = EN(v.points)
        v.tpoints = EN(v.tpoints)
        v.max = EN(v.max)
        v.level = EN(v.level)
        v.cost = EN(v.cost)
        v.multi = EN(v.multi)
        v.cmulti = EN(v.cmulti)
        v.speed = EN(v.speed)
        v.nspeed = EN(v.nspeed)
        v.pmulti = EN(v.pmulti)
        v.gain = new Bar().gain
    })
    update()
    placeBars()
}