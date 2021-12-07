var EN = ExpantaNum

//game build
var game = new Game

function update() {
    game.bars.forEach((v,i,a)=>{
        try {
            game.bars[i].speed = v.nspeed.mul(a[i+1].pmulti).mul(game.upgrades[0].value)
        } catch {
            game.bars[i].speed = v.nspeed.mul(game.upgrades[0].value)
        }
    })
    game.bars.forEach((v,i)=>{game.bars[i].pmulti = i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)})
    game.upgrades.forEach((v,i,a)=>{
        $('upg-' + i).innerHTML = upgradeText(v)
    })
    game.stats.bars.cps = statsCheck.getTotalCPS()
    statsCheck.upgradeUnlock()
    $('points').innerHTML = 'Points: ' + ts(game.points)
    $('next-bar').innerHTML = 'Buy next progress bar | Cost: ' + ts(game.next)
    for (var i in game.bars) {
        $('prog-bar-' + i).style.width = (game.bars[i].points.div(game.bars[i].max) * 100) + '%'
        $('prog-text-' + i).innerHTML = ts(EN.floor(game.bars[i].points)) + ' / ' + ts(EN.floor(game.bars[i].max)) + '\nMulti: ' + ts(game.bars[i].speed) + ', Up: x' + ts(game.bars[i].pmulti)
        $('prog-level-' + i).innerHTML = 'Level\n' + ts(game.bars[i].level)
        $('prog-buy-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(game.bars[i].cost))
    }
    $('stats-tpoints').innerHTML = 'Total points: ' + game.tpoints
    $('stats-bars').innerHTML = 'Progress bars: ' + game.bars.length
    $('stats-upgbought').innerHTML = 'Upgrades bought: ' + game.stats.upg.bought
    $('stats-since').innerHTML = 'Played since v' + game.stats.since
    $('stats-allbars').innerHTML = 'You have completed ' + game.stats.complete + ' bars.'
}

function upgradeText(obj) {
    return obj.desc + '\n\nCost: ' + ts(obj.cost) + '\nValue: ' + ts(obj.value) + '\nPaid: ' + ts(obj.paid) + (obj.limit.isFinite() ? (' / ' + ts(obj.limit)) : '')
}

function barIncrement(id) {
    game.bars.forEach((v,i,a)=>{
        try {
            game.bars[i].speed = v.nspeed.mul(a[i+1].pmulti).mul(game.upgrades[0].value)
        } catch {
            game.bars[i].speed = v.nspeed.mul(game.upgrades[0].value)
        }
    })
    game.bars.forEach((v,i)=>{game.bars[i].pmulti = i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)})
    game.bars[id].points = game.bars[id].points.add(game.bars[id].speed)
    game.bars[id].tpoints = game.bars[id].tpoints.add(game.bars[id].speed)
    if (id == 0) {
        game.points = game.points.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
        game.tpoints = game.tpoints.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
    }
    game.bars[id].level = game.bars[id].level.add(EN.floor(game.bars[id].points.div(game.bars[id].max)))
    game.bars[id].points = EN.mod(game.bars[id].points, game.bars[id].max)
    game.stats.bars.clicks++
    if (game.bars[id].level.gt(0) & game.stats.complete == id) game.stats.complete++
    update()
    new Audio('audio/click.mp3').play()
    config.lastbar = id
}
function barIncrementMini(id, multi, onupdate) {
    game.bars[id].points = game.bars[id].points.add(game.bars[id].speed).mul(multi)
    game.bars[id].tpoints = game.bars[id].tpoints.add(game.bars[id].speed).mul(multi)
    if (id == 0) {
        game.points = game.points.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
        game.tpoints = game.tpoints.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
    }
    game.bars[id].level = game.bars[id].level.add(EN.floor(game.bars[id].points.div(game.bars[id].max)))
    game.bars[id].points = EN.mod(game.bars[id].points, game.bars[id].max)
    if (onupdate) update()
}

function barBuy(id, onupdate=true, sound=true) {
    if (game.upgrades[3].value.eq(1)) {
        var req = game.bars[id].cost.log10()
        var val = game.bars[id].level.log10()
        var mul = game.bars[id].cmulti.log10()
        var buy = val.sub(req).div(mul).floor().add(1).max(0)
        game.bars[id].nspeed = game.bars[id].nspeed.mul(game.bars[id].multi.pow(buy))
        game.bars[id].cost = game.bars[id].cost.mul(game.bars[id].cmulti.pow(buy))
        game.stats.bars.buys = game.stats.bars.buys.add(buy)
        if (buy.gt(0)) {
            if (sound) new Audio('audio/buy.mp3').play()
            if (onupdate) update()
        } else {
            if (sound) new Audio('audio/low.mp3').play()
        }
    } else {
        if (game.bars[id].level.gte(game.bars[id].cost)) {
            game.bars[id].cost = game.bars[id].cost.mul(game.bars[id].cmulti)
            game.bars[id].nspeed = game.bars[id].nspeed.mul(game.bars[id].multi)
            game.stats.bars.buys = game.stats.bars.buys.add(1)
            new Audio('audio/buy.mp3').play()
            update()
        } else {
            new Audio('audio/low.mp3').play()
        }
    }
}

function NextBar() {
    if (game.points.gte(game.next)) {
        game.points = game.points.sub(game.next)
        game.next = game.next.pow(EN.add(1.8575, EN.div(game.bars.length-2, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(game.bars.length-13, 1).pow(2))))
        game.bars.push(new Bar(EN.pow(1.18, game.bars.length).mul(30).floor(), EN.pow(1.2, game.bars.length),
                               EN.pow(1.05, game.bars.length).mul(1.2), EN.pow(1.05, game.bars.length).mul(1.375)))
        game.stats.tbars++
        placeBars()
        new Audio('audio/buy.mp3').play()
        update()
        var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 100)
        ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    } else {
        new Audio('audio/low.mp3').play()
    }
}

function fb(i,f) {
    return EN.div(EN.floor(EN.mul(i,f)),f)
}
function ts(i,ep=6,en=-6,f=100,a=0) {
    var neg = EN.isneg(i)
    if (neg) i=EN.mul(i,-1)
    var log = EN.log10(i)
    if (EN(i).isInfinite()) return EN(Infinity)
    if (EN.gte(EN.log10(EN.log10(EN.log10(EN.log10(log)))),0)) {
        var r = '10^^' + (r2=EN.slog(i),EN.gte(EN.log(r2),ep)?ts(r2,ep,en,f,a+1):fb(r2,f))
        return neg?'-'+r:r
    } else {
        if ((log>=ep | log<=en) & a<10 & !(i==0)) {
            var r = fb(EN.div(i, EN.pow(10, EN.floor(log))),f)+'e'+ts(EN.floor(log),ep,en,f,a+1)
            return (neg?EN.mul(r,-1):r).toString()
        } else {
            return fb(neg?i*-1:i,f).toString()
        }
    }
}

function upgrade(id) {
    var result = game.upgrades[id].buy()
    if (result) {new Audio('audio/buy.mp3').play()} else new Audio('audio/low.mp3').play()
    update()
}

function AutoStart(i) {
    switch (i) {
        case 0:
        if (!config.int.bars) {
            config.int.bars = setInterval(() => {
                for (i=0; i<Number(game.upgrades[1].value); i++) {
                    barIncrementMini(i, game.upgrades[2].value.div(30))
                }
                update()
            }, 1000/30)
        }
        break
        case 1:
            if (!config.int.time) {
                config.int.time = setInterval(() => {
                    $('stats-time').innerHTML = 'Played for ' + time(Date.now() - game.stats.sincedate) + '.'
                }, 1000/30)
            }
        break
        case 2:
            if (!config.int.autobuy) {
                config.int.autobuy = setInterval(() => {
                    barBuy(config.lastbar, false, false)
                })
            }
        break
        case 3:
            config.int.autosave = setInterval(() => {
                save(true)
            }, 10000);
        break
    }
}

var statsCheck = {
    getTotalCPS: ()=>{
        return game.upgrades[2].value.mul(game.upgrades[1].value)
    },
    barsCompleted: ()=>{
        var amm = 0
        game.bars.forEach((v,i,a)=>{
            if (v.level.gt(0)) amm++
        })
        return amm
    },
    upgradeUnlock: ()=>{
        game.upgrades.forEach((v,i,a)=>{
            if (new Function(v.unlock)()) {
                $('upg-' + i).style.display = ''
            } else {
                $('upg-' + i).style.display = 'none'
            }
        })
    }
}

//bootup update
placeBars()
update()

var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 100)
ButtonStyle($('next-bar'), [a.r, a.g, a.b])
ButtonStyle($('pause'), [255, 255, 255])
ButtonStyle($('export'), [0, 255, 255])
ButtonStyle($('import'), [0, 255, 255])
ButtonStyle($('save'), [255, 255, 0])
ButtonStyle($('wipe'), [255, 0, 0])

AutoStart(1)
AutoStart(3)
statsCheck.upgradeUnlock()