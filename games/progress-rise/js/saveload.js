function save(isCookie=false) {
    if (isCookie) {
        localStorage.setItem('ProgressRise', btoa(JSON.stringify(game)))
    } else {
        $('savecode').value = btoa(JSON.stringify(game))
    }
}

function load(isCookie=false) {
    if (isCookie) {
        if (localStorage.getItem('ProgressRise') == null) return false
        var game2 = JSON.parse(atob(localStorage.getItem('ProgressRise')))
    }
    else {
        var game2 = JSON.parse(atob($('savecode').value))
    }
    game2.points = EN(game2.points)
    game2.tpoints = EN(game2.tpoints)
    game2.next = EN(game2.next)
    game2.bars.forEach((v,i,a) => {
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

    game2.stats = game2.stats || game.stats
    Object.keys(game.stats).forEach((v,i,a)=>{
        game2.stats[v] = game2.stats[v] || game.stats[v]
    })
    game2.stats.upg.limit = game2.stats.upg.limit || game.stats.upg.limit
    game2.stats.bars.buys = EN(game2.stats.bars.buys)

    game2.stats.upg.bought = EN(game2.stats.upg.bought)
    if (game2.upgrades == undefined) game2.upgrades = game.upgrades
    game2.upgrades.forEach((v,i,a) => {
        v.value = EN(nullfix(v.value))
        v.cost = EN(nullfix(v.cost))
        v.paid = EN(nullfix(v.paid))
        v.multi = EN(nullfix(v.multi))
        v.cmulti = EN(nullfix(v.cmulti))
        v.formula = new Upgrade().formula
        v.mformula = new Upgrade().mformula
        v.buy = new Upgrade().buy
        v.buyMax = new Upgrade().buyMax
        v.id = i
        v.limit = EN(nullfix(v.limit) || game.upgrades[i].limit)
        v.unlock = game.upgrades[i].unlock
        game2.upgrades[i] = new Upgrade(v)
    })
    for (var i=0; i<5; i++) {
        game2.upgrades[i] = game2.upgrades[i] || game.upgrades[i]
    }
    game2.upgrades[0].formula = new Upgrade('f', 0).funct
    game2.upgrades[1].formula = new Upgrade('f', 1).funct
    game2.upgrades[2].formula = new Upgrade('f', 0).funct
    game2.upgrades[3].formula = new Upgrade('f', 2).funct
    game2.upgrades[4].formula = new Upgrade('f', 2).funct
    game = game2

    var a = EN(128)
    for (i=0; i<(game.bars.length-1); i++) {
        a = a.pow(EN.add(1.8575, EN.div(i-1, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(i-12, 1).pow(2))))
    }
    game.next = a

    a = EN(128)
    for (i=0; i<Number(game.upgrades[1].paid)+2; i++) {
        a = a.pow(EN.add(1.8575, EN.div(i-1, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(i-12, 1).pow(2))))
    }
    game.upgrades[1].cost = a

    game.upgrades[2].paid = game.upgrades[2].paid.min(9)
    game.upgrades[2].value = EN.mul(2.4, EN.pow(1.4, game.upgrades[2].paid))

    if (game.upgrades[1].value.gte(1)) {
        AutoStart(0)
    } if (game.upgrades[4].value.gt(1)) {
        AutoStart(2)
    }

    removeBars()
    placeBars()
    update()
    setTheme(game.stats.theme)
    tab(game.stats.page)
    statsCheck.upgradeUnlock()
    game.stats.complete = statsCheck.barsCompleted()

    game = new Game(game)

    var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 100)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
}

load(true)