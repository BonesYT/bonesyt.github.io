var $ = q => document.querySelector(q)
var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

var pos = 0,
    w = 16, h = 16

function genTable() {

    var e, f, g, j, t = $('table')
    t.innerHTML = ''
    e = document.createElement('tr')
    for (var j = -1; j < w; j++) {

        f = document.createElement('td')
        if (j >= 0) {
            g = document.createElement('span')
            g.style.color = `rgb(${j / (w - 1) * 255},0,255)`
            g.innerHTML = digits[j]
            f.appendChild(g)
        }
        e.appendChild(f)

    }
    t.appendChild(e)

    for (var i = 0; i < h + 1; i++) {

        e = document.createElement('tr')

        f = document.createElement('th')
        f.className = 'hh'
        g = document.createElement('span')
        g.style.color = `rgb(0,${i / (w - 1) * 255},255)`
        g.id = '_' + digits[i]
        f.appendChild(g)
        e.appendChild(f)

        for (j = 0; j < w; j++) {

            f = document.createElement('td')
            g = document.createElement('span')
            g.style.color = `rgb(${j / (w - 1) * 255},${i / (h - 1) * 255},128)`
            g.id = 'c' + digits[i] + digits[j]
            f.appendChild(g)
            e.appendChild(f)

        }

        t.appendChild(e)

    }

}
genTable()

function frameRender() {

    var i, c
    for (i = 0; i < h; i++) {
        $('#_' + digits[i]).innerHTML = `U+${(i + pos / 16).toString(16).padStart(7, 0).toUpperCase()}#`
    }
    var o = ''
    for (i = 0; i < w * h; i++) {
        try {c = String.fromCodePoint(i + pos)}
        catch {c = ''}
        $('#c' + digits.charAt(i / w) + digits[i % w]).innerHTML = c
    }

}

setInterval(() => {

    frameRender()
    pos += w * h * $('#spd').value
    if (pos > 1114112) pos = 0

}, 1e3 / 60)