$ = e => document.getElementById(e)
var EN = ExpantaNum

var game = {
    v: EN(0),
    vs: EN(1),
    boost: {
        cost: [10,'ee38.44972096','eeee10'],
        multi: [],
        cmulti: [],
        lvl: [],
        speed: [],
        length: 0
    },
    upgs: {
        desc: [
            'Increase all boosters\' multiplier by ^e100',
            'Increase all exponent base in boosters by ^^*2'
        ],
        cost: [EN('ee1.6e4'),EN('eee12')],
        lvl: [EN(0),EN(0)],
        val: [EN(1),EN(1)],
        length: 2
    }
}

game.boost.cost = game.boost.cost.map(v => EN(v))

function update() {
    $('points').innerHTML = `Value: ${ts(game.v)}v`
    $('speed').innerHTML = `VPS: ${ts(game.vs)}vs`

    for (var i = 0; i < game.boost.length; i++) {
        $('bstbt' + i).innerHTML = `Booster ${i + 1}\n\nRequired: ${ts(game.boost.cost[i])}v\nLevel: ${ts(game.boost.lvl[i])} (x${ts(game.boost.speed[i])})`
    }
    for (var i = 0; i < game.upgs.length; i++) {
        $('upgbt' + i).innerHTML = `Upgrade ${i + 1}:\n${game.upgs.desc[i]}\n\nRequired: ${ts(game.upgs.cost[i])}v\nLevel: ${ts(game.upgs.lvl[i])}\nValue: ${ts(game.upgs.val[i])}`
    }
}

function lvla(value, cost, cmulti) {
    return value.div(cost).logBase(cmulti).floor().add(1).max(0)
}

(()=>{
var a, b = EN(1.4), c = EN(1.34) // multi, cost multi, start cost
var z = game.boost
for (var i = 0; i < 2; i++) { // booster buttons generator
    a = document.createElement('button')
    a.id = 'bstbt' + i

    z.multi.push(b)
    z.cmulti.push(c)
    z.lvl.push(EN(0))
    z.speed.push(EN(1))

    a.addEventListener('click', e => {
        bst(e.srcElement.id.substr(5)*1)
    })

    $('boosters').appendChild(a)
    game.boost.length++
    b = b.pow(1e100)
}
for (var i = 0; i < game.upgs.length; i++) { // upgrade buttons generator
    a = document.createElement('button')
    a.id = 'upgbt' + i

    a.addEventListener('click', e => {
        upg(e.srcElement.id.substr(5)*1)
    })

    $('upgrades').appendChild(a)
}
})()

function bst(i) {
    var a = game.boost.speed, b = game.boost.cost, c = game.boost.lvl, d = game.boost.cmulti[i]
    var add = lvla(game.v, b[i], d)
    var A = a[i].mul(game.boost.multi[i].pow(game.upgs.val[0]).pow(add))
    a[i] = EN.pow(game.upgs.val[1], A).mul(A)
    b[i] = b[i].mul(d.pow(add))
    c[i] = c[i].add(add)
}
function upg(i) {
    var a = game.upgs.cost, b = game.upgs.val, c = game.upgs.lvl
    if (game.v.gte(a[i])) {
        switch (i) {
            case 0:
                var add = game.v.log10().log10().sub(game.upgs.cost[0].log10().log10()).div(1e3).floor().add(1).max(0)
                a[i] = a[i].pow(EN.pow('ee3', add))
                b[i] = b[i].mul(EN.pow(1e100, add))
                c[i] = c[i].add(add)
            break; case 1:
                var add = game.v.log10().log10().sub(game.upgs.cost[1].log10().log10()).div(1e200).floor().add(1).max(0)
                a[i] = a[i].pow(EN.pow('ee200', add))
                b[i] = b[i].tetr(b[i].slog().mul(2).mul(EN.pow(2, add)))
                if (b[i].eq(1) & b[i].lt(10)) b[i] = EN(10)
                c[i] = c[i].add(add)
            break
        }
    }
}

game.int = setInterval(() => {
    game.time = Date.now()
    game.vs = game.boost.speed.reduce((p,c) => {
        return p.mul(c)
    }, EN(1))

    var delay = (game.time - (game.time2 || Date.now()))
    game.v = game.v.add(game.vs.div(1e3 / delay))

    update()
    game.time2 = Date.now()
}, 1e3/30)