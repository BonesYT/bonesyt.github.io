function data(obj, prop, assign, en) {

    if (!obj) return
    let o = assign ?? {}
    prop ??= Object.keys(obj)
    prop.forEach(v => {
        try{o[v] = en ? EN(obj[v]) : (obj[v].constructor == EN ? obj[v].toString() : obj[v])}catch{}
    })
    return o

}

function save(isCookie=false) {

    let o
    const l = {
        first: ['next','points','tpoints','version'],
        stats: {
            n: ['ascended','ascendedm','complete','completeid','giveScalebar','layer','page','since',
                'sincedate','tbars','theme','vol'],
            bars: ['buys', 'cps']
        },
        
        bar: ['cmulti','cost','level','max','multi','nspeed','pmulti','points','speed','tpoints','base'],
        exo: ['boost','cost','gpoints','next','points','scaleUnlocked','scaleboost','scalegain','tgpoints','tpoints'],
        spt: ['barpower','cost','gpoints','points','scaleUnlocked','tgpoints','tpoints','boost'],
        upg: ['cost','limit','paid','value'],
        scbar: ['exp','level','req','total','multi']
    }
    o = data(game, l.first)
    o.stats = data(game.stats, l.stats.n)
    o.stats.bars = data(game.stats.bars, l.stats.bars)
    o.stats.bars.clicks = game.stats.bars.clicks
    o.stats.upg = {
        bought: ''+game.stats.upg.bought,
        limit: game.stats.upg.limit
    }
    o.bars = game.bars.map(v => data(v, l.bar))
    o.ach = game.achievements.map(v => v.unlocked)
    o.upg = game.upgrades.map(v => data(v, l.upg))
    o.EXO = data(game.EXO, l.exo)
    o.EXO.bars = game.EXO.bars.map(v => data(v, l.bar))
    o.EXO.scbar = data(game.EXO.scalebar, l.scbar)
    o.SPT = data(game.SPT, l.spt)
    o.SPT.bars = game.SPT.bars.map(v => data(v, l.bar))
    o.SPT.scbar = data(game.SPT.scalebar, l.scbar)

    const s = btoa(JSON.stringify(o))

    if (isCookie) {
        localStorage.setItem('ProgressRise', s)
    } else {
        $('savecode').value = s
    }
}

function load(isCookie=false) {
    const oldgame = game
    let i, o = new Game
    try {
        if (isCookie) {
            if (localStorage.getItem('ProgressRise') == null) return false
            i = JSON.parse(atob(localStorage.getItem('ProgressRise')))
        } else i = JSON.parse(atob($('savecode').value))
    } catch (e) {warn(`The save code cannot be decoded:\n${e}`)}
    try {

    const l = ['cost','limit','paid','value'],
          ls = ['exp','level','req','total','multi']

    o = data(i, ['stats','version'], o)
    o.stats.bars = data(i.stats.bars, ['buys', 'cps'], null, true)
    o.stats.bars.clicks = i.stats.bars.clicks
    o.stats.upg.bought = EN(i.stats.upg.bought)
    o.stats.upg.limit = i.stats.upg.limit
    o = data(i, ['next','points','tpoints'], o, true)
    o.bars = i.bars.map(v => {
        return data(v, null, new Bar, true)
    })
    o.achievements = game.achievements.map((v,j) => {
        v.unlocked = i.ach[j]
        return v
    })
    o.upgrades = game.upgrades.map((v,j) => {
        return data(i.upg[j], l, v, true)
    })
    o.EXO = data(i.EXO, ['boost','cost','gain','gpoints','next','points','scaleUnlocked','scaleboost','scalegain','tgpoints','tpoints'], null, true)
    o.EXO.bars = i.EXO.bars.map(v => {
        return data(v, null, new Bar, true)
    })
    o.EXO.scalebar = data(i.EXO.scbar, ls, new ScaleBar, true)
    try {
    o.SPT = data(i.SPT, ['barpower','cost','gpoints','points','scaleUnlocked','tgpoints','tpoints','boost'], null, true)
    o.SPT.bars = i.SPT.bars.map(v => {
        return data(v, null, new Bar, true)
    })
    o.SPT.scalebar = data(i.SPT.scbar, ls, new ScaleBar, true)
    } catch (e) {o.SPT = new Game().SPT} 

    game = o
    loadRefresh()

    } catch (e) {

        if (!confirm(`Save code is invalid. Press cancel to not load it. (OK for experimental purposes)\n${e}`)) 
            game = oldgame, loadRefresh()

    }

}
function loadRefresh() {

    if (game.upgrades[1].value.gte(1)) {
        AutoStart(0)
    } if (game.upgrades[4].value.gte(1)) {
        AutoStart(2)
    }

    for (let j=0; j<game.stats.layer+1; j++) {
        removeBars(j)
        placeBars(j)
    }
    update()
    setTheme(game.stats.theme)
    tab(game.stats.page)
    statsCheck.upgradeUnlock()
    game.stats.complete = statsCheck.barsCompleted()

    var a = LdrToRGB(85, 1 / 3.75 - 1.4, 100)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    var a = LdrToRGB(90.5, 1 / 3.75 * 1.2666666667 - 1.9, 92.5)
    ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])

    statsCheck.achUnlock()

    config.audio.src = `audio/songs/back${game.stats.layer}.mp3`
    if (config.docReady) config.audio.play()
    if (game.points.gte(1e50) | game.stats.layer) $c('beta-recovery').style.display = 'none'
    
    config.first[0] = 1 - Math.sign(layerloc(1).bars.length)
    config.first[1] = 1 - Math.sign(layerloc(2).bars.length)

}

load(true)