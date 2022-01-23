function $(e) {
    return document.getElementById(e)
}

var id = 0,
    number = 0,
    sa = [],
    max = 4 ** 32,
    bonus = 0

function makerow(cr,cg,cb) {
    var a = document.createElement('button'),
        b = document.createElement('button'),
        c = document.createElement('button'),
        d = document.createElement('button'),
        e = document.createElement('tr'),
        f = document.createElement('td'),
        g = document.createElement('td'),
        h = document.createElement('td'),
        i = document.createElement('td')
    a.id = `button-${id}-0`
    b.id = `button-${id}-1`
    c.id = `button-${id}-2`
    d.id = `button-${id}-3`
    a.innerHTML = `Row ${id+1},\nColumn 1`
    b.innerHTML = `Row ${id+1},\nColumn 2`
    c.innerHTML = `Row ${id+1},\nColumn 3`
    d.innerHTML = `Row ${id+1},\nColumn 4`
    a.style.backgroundColor = `rgb(${cr-75},${cg-75},${cb-75})`
    b.style.backgroundColor = `rgb(${cr-50},${cg-50},${cb-50})`
    c.style.backgroundColor = `rgb(${cr-25},${cg-25},${cb-25})`
    d.style.backgroundColor = `rgb(${cr},${cg},${cb})`
    if (id == 0) {
        a.addEventListener('click', (e)=>{btclick(e.srcElement.id, 1.1 ** $('speed').value)})
        b.addEventListener('click', (e)=>{btclick(e.srcElement.id, 1.1 ** $('speed').value)})
        c.addEventListener('click', (e)=>{btclick(e.srcElement.id, 1.1 ** $('speed').value)})
        d.addEventListener('click', (e)=>{btclick(e.srcElement.id, 1.1 ** $('speed').value)})
    }
    f.appendChild(a)
    g.appendChild(b)
    h.appendChild(c)
    i.appendChild(d)
    e.appendChild(f)
    e.appendChild(g)
    e.appendChild(h)
    e.appendChild(i)
    $('table').appendChild(e)

    id++
}

function btclick(i, amm = 1) {
    var x = Number(i[9])
    if (number % 4 == x) {
        number = Math.floor(number + amm)
        update()
    }
    if (number >= max) {
        bonus += Math.floor(number / max)
        number %= max
    }
}

function rgb(hue, add) {
    var r=0, g=0, b=0, a = hue % 1
    switch (Math.floor(hue % 3)) {
        case 0:
            r = (1 - a) * 255
            g = a * 255
        break; case 1:
            g = (1 - a) * 255
            b = a * 255
        break; case 2:
            b = (1 - a) * 255
            r = a * 255
        break
    }
    return {r:r+add,g:g+add,b:b+add}
}

function update() {
    show()
    for (var x=0;x<32;x++) {
        for (var y=0;y<4;y++) {
            $(`button-${x}-${y}`).style.display = sa[x][y] ? 'block' : 'none' 
        }
    }
    $('speedtext').innerHTML = 'Speed = ' + 1.1 ** $('speed').value
    $('speed').max = (Math.min(Math.max(1,Math.log(number)/Math.log(4))*12.75, 465.44261742986964)).toString()
    $('score').innerHTML = `Score: [${number}, ${bonus}]`
}

(()=>{
    var a
    for (var i=0;i<32;i++) {
        a = rgb(i / 6.5495, i * 9 - 80)
        makerow(a.r, a.g, a.b)
    }
})()
update()

function fast(delay = 1000 / 30) {
    int = setInterval(()=>{
        btclick(`button-0-${Math.floor(number % 4)}`, 1.1 ** $('speed').value)
    }, delay)
}
function stopfast() {
    clearInterval(int)
}

function show() {
    sa = []
    var a, b, c, d, e
    for (var i = 0; i < 32; i++) {
        e = 4 ** i
        e = Math.floor(number / e) % 4
        sa.push([1, e>0?1:0, e>1?1:0, e>2?1:0])
    }
}