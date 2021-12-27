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
        game2.stats[v] = game2.stats[v] || (game2.stats[v]==0?game2.stats[v]:game.stats[v])
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
    for (var i=0; i<14; i++) {
        game2.upgrades[i] = game2.upgrades[i] || game.upgrades[i]
    }
    game2.upgrades[0].formula = new Upgrade('f', 0).funct
    game2.upgrades[1].formula = new Upgrade('f', 1).funct
    game2.upgrades[2].formula = new Upgrade('f', 0).funct
    game2.upgrades[3].formula = new Upgrade('f', 2).funct
    game2.upgrades[4].formula = new Upgrade('f', 2).funct
    game2.upgrades[5].formula = new Upgrade('f', 3).funct
    game2.upgrades[6].formula = new Upgrade('f', 3).funct
    game2.upgrades[7].formula = new Upgrade('f', 4).funct
    game2.upgrades[8].formula = new Upgrade('f', 4).funct
    game2.upgrades[9].formula = new Upgrade('f', 4).funct
    game2.upgrades[10].formula = new Upgrade('f', 5).funct
    game2.upgrades[11].formula = new Upgrade('f', 5).funct
    game2.upgrades[12].formula = new Upgrade('f', 4).funct
    game2.upgrades[13].formula = new Upgrade('f', 6).funct

    game2.prestige = game2.prestige || new Game().prestige
    game2.prestige.cost = EN(game2.prestige.cost)
    game2.prestige.gain = EN(game2.prestige.gain)
    game2.prestige.points = EN(game2.prestige.points)
    game2.prestige.tpoints = EN(game2.prestige.tpoints)
    game2.prestige.gpoints = EN(game2.prestige.gpoints)
    game2.prestige.tgpoints = EN(game2.prestige.tgpoints)
    game2.prestige.boost = EN(game2.prestige.boost)
    game2.prestige.scaleboost = EN(game2.prestige.scaleboost)
    game2.prestige.next = EN(game2.prestige.next)
    game2.prestige.bars.forEach((v,i,a) => {
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
    game2.prestige.scalebar = new ScaleBar(game2.prestige.scalebar)
    game2.achievements = game2.achievements || game.achievements
    game.achievements.forEach((v,i)=>{
        game2.achievements[i] = game2.achievements[i] || game.achievements[i]
    })
    game2.stats.vol = game2.stats.vol || game.stats.vol
    config.audio.volume = game2.stats.vol.music * 0.4
    $('vol-music').value = game2.stats.vol.music.toString()
    $('vol-sfx').value = game2.stats.vol.sfx.toString()
    game2.upgrades[1].limit = EN(35)

    game = game2

    var a = EN(128)
    for (var i=0; i<(game.bars.length-1); i++) {
        a = a.pow(EN.add(1.8575, EN.div(i-1, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(i-12, 1).pow(2))))
    }
    game.next = a

    a = EN(128)
    for (var i=0; i<Number(game.upgrades[1].paid)+2; i++) {
        a = a.pow(EN.add(1.8575, EN.div(i-1, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(i-12, 1).pow(2))))
    }
    game.upgrades[1].cost = a

    a = EN(6400)
    for (var i=0; i<game.prestige.bars.length-1; i++) {
        a = a.pow(EN.add(1.8575, EN(i).pow(3).sub(2).max(1).pow(0.58).sub(1)))
    }
    game.prestige.next = a

    game.upgrades[2].paid = game.upgrades[2].paid.min(9)
    game.upgrades[2].value = EN.mul(2.4, EN.pow(1.4, game.upgrades[2].paid))

    if (game.upgrades[1].value.gte(1)) {
        AutoStart(0)
    } if (game.upgrades[4].value.gte(1)) {
        AutoStart(2)
    }

    for (var i=0; i<game.stats.layer+1; i++) {
        removeBars(i)
        placeBars(i)
    }
    update()
    setTheme(game.stats.theme)
    tab(game.stats.page)
    statsCheck.upgradeUnlock()
    game.stats.complete = statsCheck.barsCompleted()

    game = new Game(game)

    var a = LdrToRGB(85, 1 / 3.75 - 1.4, 100)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    var a = LdrToRGB(90.5, 1 / 3.75 * 1.2666666667 - 1.9, 92.5)
    ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])

    statsCheck.achUnlock()

    config.audio.src = `audio/songs/back${game.stats.layer}.mp3`
    config.audio.play()
}

load(true)