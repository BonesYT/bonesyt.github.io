function $(e) {
    return document.getElementById(e)
}

adder = 23
colors = [0]
colors12 = [0]
hasclicked = [false]
buttons = 0
power = 0.5
iter = 0
r = {}

function bitcnv(i) {
    if (i <  8) return i - 4
    if (i < 16) return i - 8
    if (i < 24) return i - 12
    return NaN
}
function cmd(e) {
    let id = Number(e.srcElement.id.slice(7))
    if (id < hasclicked.length & !hasclicked[id]) {
        let color = colors[id] + (1 << adder)
        let color12 = colors12[id] + (1 << bitcnv(adder))
        colors.push(color)
        colors12.push(color12)
        hasclicked[id] = true
        create(color, color12)
        if (buttons >= 1 << iter + 1) {
            adder--
            if (!(adder & 4)) adder = (adder | 7) - 8
            power *= 2
            iter++
            set(iter)
        }
        e.srcElement.className += ' clicked'
        r.min = Math.min(color12, r.min ?? 4095)
        r.max = Math.max(color12, r.max ?? 0)
        upd()
    }
}

function set(i) {
    hasclicked = Array(1 << i).fill(false)
    setTimeout(() => document.querySelectorAll('.clicked, .blocked').forEach(v => {
        v.className = 'color'
    }), 50)
}

function clickAll() {
    colors.forEach((v,i) => {
        $('button-'+i).click()
    });
}
async function startAnimation(delay=100, random=false) {
    let i, l, a, s
    while (true) {
        l = hasclicked.length
        if (random) {
            a = hasclicked.map((v,i) => i)
            for (i = 0; i < l; i++) {
                s = Math.random() * a.length
                $('button-' + a.at(s)).click()
                a.splice(s, 1)
                await new Promise(r => setTimeout(r, delay))
            }
        } else {
            for (i = 0; i < l; i++) {
                $('button-' + i).click()
                await new Promise(r => setTimeout(r, delay))
            }
        }
    }
}

function create(color, color12, blocked=true) {
    
    const div = document.createElement('div')
    const span = document.createElement('span')
    div.id = 'button-' + buttons
    div.className = blocked ? 'color blocked' : 'color'
    span.innerHTML = color12
    div.style.backgroundColor = `rgb(${Math.floor(color/65536)},${Math.floor(color/256)%256},${color%256})`
    div.addEventListener('click',cmd)
    div.appendChild(span)
    $('buttons').appendChild(div)
    buttons++
    
}

function a(a=0) {
    console.clear()
    console.log(a, hasclicked)
}

function upd() {
    $('stats').innerHTML = `\
Clicks: ${buttons}
Range: ${r.min == undefined ? null : r.min + ' - ' + r.max}
Iteration: ${iter}`
}

create(0, 0, false)
upd()