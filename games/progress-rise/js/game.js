var EN = ExpantaNum

//game build
var game = new Game

function update() {

    const L2 = layerloc(1)
          L3 = layerloc(2)

    setBarMulti()
    if (config.elready) game.upgrades.forEach((v,i,a)=>{
        $('upg-' + i).innerHTML = upgradeText(v)
    })

    statsCheck.achUnlock()
    game.stats.bars.cps = statsCheck.getTotalCPS()
    statsCheck.upgradeUnlock()

    // Math equations

    L2.gain = game.points.log10().log10().sub(EN.log10('5e10')).add(1).pow(0.625).mul(300)
    L3.gain = EN.pow(1.06, L2.points.log10().log10().sub(27)).pow(10).mul(1e3)
    L2.boost = L2.points.pow(0.825).add(1)
    L3.boost = EN.pow(1.01, L3.points.mul(4)).cbrt()
    
    L2.scalegain = game.points.log10().log10().div(10).pow(0.8475).mul(10)
    if (L2.scalegain.isNaN()) L2.scalegain = EN(0)
    if (L2.gain.isNaN()) L2.gain = EN(0)
    $('prestige-gain').innerHTML = 'Gain: +' + ts(L2.gain) + (L2.scaleUnlocked ? (' | Give: +' + ts(L2.scalegain)) : '')
    L2.scaleboost = L2.scalebar.level.pow(0.8).div(87).add(1).pow(0.001)

    var dif = [
        game.points.log10().log10().div(EN.log10('e5e10').log10()),
        L2.points.log10().log10().div(EN.log10('ee28').log10())
    ].map(v => v.isNaN() ? EN(0) : v)

    $('normalpb-prog-prestige').style.width = (dif[0].min(1).max(0) * 100) + '%'
    $('normalpb-text-prestige').innerHTML = (dif[0].min(1).max(0) * 100).toFixed(2) + '%'
    if (game.stats.layer) {
        $('normalpb-prog-prestige-2').style.width = (dif[1].min(1).max(0) * 100) + '%'
        $('normalpb-text-prestige-2').innerHTML = (dif[1].min(1).max(0) * 100).toFixed(2) + '%'
    }

    // Tabs
    
    if (config.lasttab == 'statistics') {
        $('stats-tpoints').innerHTML = 'Total points: ' + ts(game.tpoints)
        $('stats-bars').innerHTML = 'Progress bars: ' + game.bars.length
        $('stats-upgbought').innerHTML = 'Upgrades bought: ' + ts(game.stats.upg.bought)
        $('stats-since').innerHTML = 'Played since v' + game.stats.since
        $('stats-allbars').innerHTML = 'You have completed ' + game.stats.complete + ' bars.'
        $('stats-tpoints-2').innerHTML = 'Total Exosphere Points: ' + ts(L2.tpoints)
        $('stats-bars-2').innerHTML = 'Exosphere Progress bars: ' + L2.bars.length
        $('stats-unassigned').innerHTML = 'Exosphere total Unassigned Points: ' + ts(L2.tgpoints)
        $('stats-scaletotal').innerHTML = 'Exosphere Scalebar total EXP: ' + ts(L2.scalebar.total)
    }
    if (config.lasttab == 'progress') {
        $('points').innerHTML = 'Points: ' + ts(game.points)
        $('next-bar').innerHTML = 'Buy next progress bar | Cost: ' + ts(game.next)
        for (var i in game.bars) {
            $('prog-bar-0-' + i).style.width = (game.bars[i].points.div(game.bars[i].max) * 100) + '%'
            $('prog-text-0-' + i).innerHTML = ts(game.bars[i].points,1) + ' / ' + ts(game.bars[i].max,1) + '\nMulti: ' + ts(game.bars[i].speed) + ', Up: x' + ts(game.bars[i].pmulti)
            $('prog-level-0-' + i).innerHTML = 'Level\n' + ts(game.bars[i].level,2,1)
            $('prog-buy-0-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(game.bars[i].cost),2,1)
        }
    }
    if (config.lasttab.startsWith('progress-2')) {
        for (var i in L2.bars) {
            $('prog-bar-1-' + i).style.width = (L2.bars[i].points.div(L2.bars[i].max) * 100) + '%'
            $('prog-text-1-' + i).innerHTML = ts(L2.bars[i].points,1) + ' / ' + ts(L2.bars[i].max,1) + '\nMulti: ' + ts(L2.bars[i].speed) + ', Up: x' + ts(L2.bars[i].pmulti)
            $('prog-level-1-' + i).innerHTML = 'Level\n' + ts(L2.bars[i].level,2,1)
            $('prog-buy-1-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(L2.bars[i].cost),2,1)
        }
        $('sb-bar').style.width = (Number(L2.scalebar.exp.div(L2.scalebar.req)) * 100) + '%'
        $('sb-text').innerHTML = `${ts(L2.scalebar.exp)} / ${ts(L2.scalebar.req)}`
        $('sb-level').innerHTML = `Level\n${ts(L2.scalebar.level)}`
        $('points-2').innerHTML = `Exosphere Points: ${ts(L2.points)}`
        $('unassigned-points').innerHTML = 'Unassigned Points: ' + ts(L2.gpoints)
        $('boost').innerHTML = 'Exosphere Points gained boosts ALL Layer 1 ups by x' + ts(L2.boost)
        $('boost-sb').innerHTML = 'ScaleBar boosts SUR bars\' speed by ee*' + ts(L2.scaleboost, 6, -6, 1000000)
        $('next-bar-2').innerHTML = 'Unlock next progress bar | Requirement: ' + ts(L2.next)
        $('prestige-gain-2').innerHTML = 'Gain: +' + ts(L3.gain)

    }
    if (config.lasttab == 'progress-3') {
        for (var i in L3.bars) {
            $('prog-bar-2-' + i).style.width = (L3.bars[i].points.div(L3.bars[i].max) * 100) + '%'
            $('prog-text-2-' + i).innerHTML = ts(L3.bars[i].points,1) + ' / ' + ts(L3.bars[i].max,1) + '\nMulti: ' + ts(L3.bars[i].speed) + ', Up: x' + ts(L3.bars[i].pmulti)
            $('prog-level-2-' + i).innerHTML = 'Level\n' + ts(L3.bars[i].level,2,1)
            $('prog-buy-2-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(L3.bars[i].cost),2,1)
        }
        $('points-3').innerHTML = `Spatial Points: ${ts(L3.points,2,1)}`
        $('unassigned-points-2').innerHTML = 'Unassigned Space Points: ' + ts(L3.gpoints,2,1)
        $('boost-2').innerHTML = 'Gained points causes every L1 and L2 bars to increase multi power by x' + ts(L3.boost,6) + ' every x1.1 levels!'

    }

    // Conditional displays

    if (game.points.gte(L2.cost)) {
        $('ascend').style.display = ''
        $('prestige-gain').style.display = ''
        if (L2.scaleUnlocked) {$('give-scalebar').style.display = ''}
        else $('give-scalebar').style.display = 'none'
    } else {
        $('ascend').style.display = 'none'
        $('prestige-gain').style.display = 'none'
        $('give-scalebar').style.display = 'none'
    }

    if (L2.points.gte(L3.cost)) {
        $('ascend-2').style.display = ''
        $('prestige-gain-2').style.display = ''
        //if (L2.scaleUnlocked) {$('give-scalebar').style.display = ''}
        //else $('give-scalebar').style.display = 'none'
    } else {
        $('ascend-2').style.display = 'none'
        $('prestige-gain-2').style.display = 'none'
    }

    if (game.stats.layer) {
        document.querySelectorAll('.layershow').forEach((v)=>{
            v.style.display = ''
        })
        $c('menu-progress-3').style.display = game.stats.layer >= 2 ? '' : 'none'
        $c('menu-progress').innerHTML = config.min ? 'SUR' : 'SURFACE Layer'
        $('upgg-2').style.display = game.stats.layer >= 2 ? '' : 'none'
    } else {
        document.querySelectorAll('.layershow').forEach((v)=>{
            v.style.display = 'none'
        })
        $c('menu-progress').innerHTML = config.min ? 'PBs' : 'Progress Bars'
    }
    if (L2.scaleUnlocked) {
        $('scalebar-unlocker').style.display = 'none'
        $('show0').style.display = ''
        $('show1').style.display = ''
        $('next-bar-2').style.display = ''
    } else {
        $('scalebar-unlocker').style.display = ''
        $('show0').style.display = 'none'
        $('show1').style.display = 'none'
        $('next-bar-2').style.display = 'none'
    }
    if (game.upgrades[9].value.eq(1)) {
        $('maxall').style.display = ''
    } else {
        $('maxall').style.display = 'none'
    }
    if (game.bars.length >= 35) {
        $('next-bar').style.display = 'none'
        if (game.bars.length > 35) game.bars.splice(35, 1)
    } else {
        $('next-bar').style.display = ''
    }

    if (game.points.gte(L2.cost)) includeBar('pr-0')
    if (L2.scalebar.level.gte(1)) includeBar('sb-0')
    if (game.EXO.points.gte(L3.cost)) includeBar('pr-1')

    game.stats.complete = game.stats.completeid.length
}

function upgradeText(obj) {
    return obj.desc + '\n\nCost: ' + ts(obj.cost) + '\nValue: ' + ts(obj.value) + '\nPaid: ' + ts(obj.paid) + (obj.limit.isFinite() ? (' / ' + ts(obj.limit)) : '')
}

function barIncrement(id, layer) {
    if (layer > 0) {
        if ($(`prog-button-${layer}-${id}`).hasAttribute('selected')) {
            $(`prog-button-${layer}-${id}`).removeAttribute('selected')
        } else {
            $(`prog-button-${layer}-${id}`).setAttribute('selected', '')
        }
        return
    }
    setBarMulti()
    game.bars[id].points = game.bars[id].points.add(game.bars[id].speed)
    game.bars[id].tpoints = game.bars[id].tpoints.add(game.bars[id].speed)
    if (id == 0) {
        game.points = game.points.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
        game.tpoints = game.tpoints.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
    }
    game.bars[id].level = game.bars[id].level.add(EN.floor(game.bars[id].points.div(game.bars[id].max)))
    game.bars[id].points = EN.mod(game.bars[id].points, game.bars[id].max)
    game.stats.bars.clicks++
    if (game.bars[id].level.gt(0)) includeBar(`pb-0-${id}`)
    update()
    playSFX('click')
    config.lastbar = id
}
function barIncrementMini(id, multi, onupdate) {
    game.bars[id].points = game.bars[id].points.add(game.bars[id].speed.mul(multi))
    game.bars[id].tpoints = game.bars[id].tpoints.add(game.bars[id].speed.mul(multi))
    if (id == 0) {
        game.points = game.points.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
        game.tpoints = game.tpoints.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
    }
    game.bars[id].level = game.bars[id].level.add(EN.floor(game.bars[id].points.div(game.bars[id].max)))
    game.bars[id].points = EN.mod(game.bars[id].points, game.bars[id].max)
    if (game.bars[id].level.gt(0)) includeBar(`pb-0-${id}`)
    if (onupdate) update()
}

function barBuy(id, layer, onupdate=true, sound=true) {

    const L = layerloc(layer)
    if (!layer) {

        if (L.upgrades[3].value.eq(1)) {
            var req = L.bars[id].cost.log10()
            var val = L.bars[id].level.log10()
            var mul = L.bars[id].cmulti.log10()
            var buy = val.sub(req).div(mul).floor().add(1).max(0)
            L.bars[id].nspeed = L.bars[id].nspeed.mul(L.bars[id].multi.pow(buy))
            L.bars[id].cost = L.bars[id].cost.mul(L.bars[id].cmulti.pow(buy))
            L.stats.bars.buys = L.stats.bars.buys.add(buy)
            if (buy.gt(0)) {
                if (sound) playSFX('buy')
                if (onupdate) update()
            } else {
                if (sound) playSFX('low')
            }

        } else {
            if (L.bars[id].level.gte(L.bars[id].cost)) {
                L.bars[id].cost = L.bars[id].cost.mul(L.bars[id].cmulti)
                L.bars[id].nspeed = L.bars[id].nspeed.mul(L.bars[id].multi)
                L.stats.bars.buys = game.stats.bars.buys.add(1)
                playSFX('buy')
                update()
            } else {
                playSFX('low')
            }
        }

    } else {
        if (L.bars[id].level.gte(L.bars[id].cost)) {
            L.bars[id].cost = L.bars[id].cost.mul(L.bars[id].cmulti)
            L.bars[id].nspeed = L.bars[id].nspeed.mul(L.bars[id].multi)
            game.stats.bars.buys = game.stats.bars.buys.add(1)
            playSFX('buy')
            update()
        } else {
            playSFX('low')
        }
    }
}

function NextBar(layer) {
    const L = layerloc(layer),
          i = layerloc(layer).bars.length
    switch (layer) {
        case 0:
            if (game.points.gte(game.next)) {
                game.points = game.points.sub(game.next)
                game.next = game.next.pow(EN.add(1.8575, EN.div(i-2, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(game.bars.length-13, 1).pow(2))))
                game.bars.push(new Bar(EN.pow(1.18, game.bars.length).mul(30).div(game.upgrades[6].value).max(1.3e-154), EN.pow(1.2, game.bars.length).div(game.upgrades[5].value),
                                       EN.pow(1.05, game.bars.length).mul(1.2), EN.pow(1.05, game.bars.length).mul(1.375)))
                game.stats.tbars++
                placeBars(0)
                playSFX('buy')
                update()
                var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
                ButtonStyle($('next-bar'), [a.r, a.g, a.b])
            } else {
                playSFX('low')
            }
        break
        case 1:
            if (L.points.gte(L.next)) {
                
                L.next = L.next.pow(EN.add(1.8575, EN.pow(i, 3).sub(2).max(1).pow(0.58).sub(1)))
                                     .pow(EN.pow(10, EN.pow(1.6, i - 19)))
                L.bars.push(new Bar(EN.pow(1.225, L.bars.length).mul(100).floor(), EN.pow(1.25, L.bars.length).mul(10),
                                                EN.pow(1.075, L.bars.length).mul(1.4), EN.pow(1.075, L.bars.length).mul(1.48)))
                game.stats.tbars++
                placeBars(1)
                playSFX('buy')
                update()
                var a = LdrToRGB(90.5, game.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
                ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
            } else {
                playSFX('low')
            }
        break
    }
}

function maxAll(layer, sound=true) {
    switch (layer) {
        case 1:
            if (sound) var paidAtLeast = false
            game.EXO.bars.forEach(v=>{
                var req = v.cost.log10()
                var val = v.level.log10()
                var mul = v.cmulti.log10()
                var buy = val.sub(req).div(mul).floor().add(1).max(0)
                if (buy.gte(1)) paidAtLeast = true
                v.nspeed = v.nspeed.mul(v.multi.pow(buy))
                v.cost = v.cost.mul(v.cmulti.pow(buy))
                game.stats.bars.buys = game.stats.bars.buys.add(buy)
            })
            if (sound) {
                if (paidAtLeast) {
                    playSFX('buy')
                } else {
                    playSFX('low')
                }
            }
        break
    }
}

function setBarMulti() {
    const L1 = layerloc(0),
          L2 = layerloc(1),
          L3 = layerloc(2)

    L1.bars.forEach((v,i,a)=>{
        try {
            L1.bars[i].speed = v.nspeed.mul(a[i+1].pmulti).mul(L1.upgrades[0].value)
        } catch {
            L1.bars[i].speed = v.nspeed.mul(L1.upgrades[0].value)
        }
        var calc = L1.bars[i].speed.log().pow(L2.scaleboost.sub(1))
        L1.bars[i].speed = L1.bars[i].speed
        .pow(calc.isNaN()?1:calc)
        .mul(L3.boost.pow(v.level.logBase(1.1).max(1)))
        L1.bars[i].pmulti = (i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)).mul(L2.boost)

    })
    if (game.stats.layer) L2.bars.forEach((v,i,a)=>{
        v.pmulti = (i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)).pow(Math.pow(10, game.upgrades[13].value))
        try {
            v.speed = v.nspeed.mul(a[i+1].pmulti)
        } catch {
            v.speed = v.nspeed
        }
        v.speed = v.speed.mul(L3.boost.pow(v.level.logBase(1.1).max(1)))

    });if (game.stats.layer >= 2) L2.bars.forEach((v,i,a)=>{
        v.pmulti = (i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)).pow(Math.pow(10, game.upgrades[13].value))
        try {
            v.speed = v.nspeed.mul(a[i+1].pmulti)
        } catch {
            v.speed = v.nspeed
        }
        v.speed = v.speed.mul(L3.boost.pow(v.level.logBase(1.1).max(1)))
    })
}

// Prestiging

function restart(fromLayer) {

    const L = layerloc(fromLayer)
    const upgrades = game.upgrades
    switch (fromLayer) {
        case 0:

            const seam = upgrades[8].value.eq(0)
            if (!(fromLayer == 0 & upgrades[7].value.eq(1))) game.upgrades = undefined
            if (seam) {
                game.bars = undefined
                game.points = undefined
                game.next = undefined
                config.int.bars[0] = 0
            }
            game.stats.ascended[fromLayer]++
            game.stats.ascendedm[fromLayer]++
            game = new Game(game)
            config.upgradelayer.forEach((v,i) => {
                if (v != fromLayer) {
                    game.upgrades[i] = upgrades[i]
                }
            })
            if (seam) {
                game.bars[0].max = EN.div(30, game.upgrades[6].value).max(1.3e-154)
                game.bars[0].cost = EN.div(1, game.upgrades[5].value).max(1.3e-154)
            }
            if (!(fromLayer == 0 & game.upgrades[7].value.eq(1))) {
                clearInterval(config.int.bars[0])
                clearInterval(config.int.autobuy)
                config.int.autobuy = 0
            }
            if (seam) removeBars(0)

        break; case 1: 

            [game.upgrades,
             game.bars,
             game.points,
             game.next,
             L.bars,
             L.points,
             L.next,
             L.gpoints,
             L.scalebar] = Array(9).fill()
            config.int.bars[0] = 0
    
            game.stats.ascended[fromLayer]++
            game.stats.ascendedm[fromLayer]++
            game = new Game(game)
            L.scaleUnlocked = true
            if (0) config.upgradelayer.forEach((v,i) => {
                if (v <= fromLayer) {
                    game.upgrades[i] = upgrades[i]
                }
            })
    
            clearInterval(config.int.bars[0])
            clearInterval(config.int.bars[1])
            clearInterval(config.int.autobuy)
            removeBars(0),removeBars(1)

        break
    }
}

function ascend(fromLayer) {

    const L = layerloc(fromLayer + 1)
    restart(fromLayer)
    switch (fromLayer) {

        case 0: 
            L.gpoints = L.gpoints.add(L.gain)
            L.tgpoints = L.tgpoints.add(L.gain)

            if (!L.bars.length) {
                config.first[0] = false
                L.bars.push(new Bar(100, 10, 1.4, 1.48))
            }

            var a = LdrToRGB(90.5, L.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
            ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
            a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
            ButtonStyle($('next-bar'), [a.r, a.g, a.b])
            placeBars(1)
            update()

        break; case 1:
            L.gpoints = L.gpoints.add(L.gain)
            L.tgpoints = L.tgpoints.add(L.gain)

            if (config.first[1]) {
                config.first[1] = false
                L.bars.push(new Bar(80, 3, 5, 14, 6.5))
            }
            
            var a = LdrToRGB(90.5, L.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
            ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
            a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
            ButtonStyle($('next-bar'), [a.r, a.g, a.b])
            placeBars(2)
            update()

    }

}

async function ascendAnim(fromLayer) {
    if (game.stats.layer == fromLayer) {

        config.first[0] = true
        const screen = $('tabs'), white = $('whitescreen'), text = $('whitescreentext'), paused = config.audio.paused
        white.style.display = ''
        console.log(paused)
        config.audio.pause()

        animTrig(screen, white)
        await wait(1)

        const a = new Audio('audio/layerup.mp3'),
              s = 1.085 ** fromLayer
        a.playbackRate = s
        a.preservesPitch = false
        a.volume = $('vol-sfx').value
        a.play()

        Object.assign([], document.styleSheets[0].cssRules).filter(v => 
            v.constructor == CSSStyleRule ? v.selectorText.includes('[anim-trig]') : null
        ).forEach((v,i) => (
            v.style.animation = v.style.animation.replace(/(?:[\d\.]+)(?:s)*(?=s)/g, (v, j) => 
                [[6],[2,.5,4],[6]][i][j] / s
            ), v
        ))

        animTrig(text)
        await wait(4)

        game.stats.layer++
        config.audio.src = `audio/songs/back${game.stats.layer}.mp3`
        screen.style.overflow = ''
        ascend(fromLayer)
        update()
        clearInterval(config.int.bars[0])

        await wait(1)
        animUntr()
        white.style.display = 'none'

        if (!paused) config.audio.play()

    } else ascend(fromLayer)
}

function SelectBars(layer, selecting = true) {
    const L = layerloc(layer)
    L.bars.forEach((v,i) => {
        if (selecting) {
            $(`prog-button-${layer}-${i}`).setAttribute('selected', '')
        } else {
            $(`prog-button-${layer}-${i}`).removeAttribute('selected')
        }
    })
}
function ConfirmSelect(layer) {
    const L = layerloc(layer)
    var amm = 0
    var which = [], it = []
    L.bars.forEach((v, i) => {
        if ($(`prog-button-${layer}-${i}`).hasAttribute('selected')) {
            amm++
            which.unshift(i)
            it.unshift(i)
        }
    });

    var add = L.gpoints.div(amm)
    which.forEach((v,i) => {
        i = it[i]
        v = L.bars[v]

        const a = v.gain(add)
        if (i == 0) {
            L.points = L.points.add(a)
            L.tpoints = L.tpoints.add(a)
        }
        console.log(+a)

        /* v.points = v.points.add(add.mul(v.speed))
        v.tpoints = v.tpoints.add(add)
        v.level = v.level.add(v.points.div(v.max).floor())
        if (v == 0) {
            L.points = L.points.add(v.points.div(v.max).floor())
            L.tpoints = L.tpoints.add(v.points.div(v.max).floor())
        }
        v.points = v.points.mod(v.max) */
        if (v.level.gte(1)) includeBar(`pb-${layer}-${v.id}`)
    });
    if (which.length != 0 & game.upgrades[12].value.eq(0)) L.gpoints = EN(0)
    update()
}

// Scalebar

function UnlockMore(id) {
    switch (id) {
        case 0:
            if (game.EXO.points.gte(3200)) {
                game.EXO.scaleUnlocked = true
                playSFX('buy')
                update()
            } else {
                playSFX('low')
            }
        break
    }
}

function giveScaleBar() {
    game.stats.giveScalebar[0]++
    game.EXO.scalebar.gain(game.EXO.scalegain)
    restart(0)
    var a = LdrToRGB(90.5, game.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
    ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
    var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    update()
}

// Notation

function ts(i,f=2,n=1,ep=6,en=-6,a=0) {
    i = EN(i)
    var neg = EN.isneg(i)
    if (neg) i=EN.mul(i,-1)
    var log = EN.log10(i)
    if (EN(i).isInfinite()) return EN(Infinity)
    if (EN.gte(EN.log10(EN.log10(EN.log10(EN.log10(log)))),0)) {
        var r = '10^^' + (r2=EN.slog(i),EN.gte(EN.log(r2),ep)?ts(r2,ep,en,f,a+1):toFixed(r2,f,n))
        return neg?'-'+r:r
    } else {
        if ((log>=ep | log<=en) & a<10 & !(i==0)) {
            if (log.lt('e'+ep)) {
                var r = toFixed(i.div(EN.pow(10, log.floor())), f, n) + 'e' + log.floor()
            } else {
                var e = ''
                var amm = Number(EN(i).slog(10).sub(EN.slog(ep)))-0.99999999999
                var r = i
                for (i=0; i<amm; i++) {
                    e += 'e'
                    r = r.log10()
                }
                r = e + toFixed(r, f, n)
            }
            return''+ (neg?EN.mul(r,-1):r)
        } else {
            return toFixed(neg?i*-1:i,f,n)
        }
    }
}

function upgrade(id) {
    var result = game.upgrades[id].buy()
    if (result) {playSFX('buy')} else playSFX('low')
    update()
}

// Others

function AutoStart(i, l=0) {
    switch (i) {
        case 0:
        switch (l) {
            case 0:
            if (!config.int.bars[0]) {
                config.int.bars[0] = setInterval(() => {
                    for (i=0; i<Number(game.upgrades[1].value.min(game.bars.length)); i++) {
                        barIncrementMini(i, game.upgrades[2].value.div(30))
                    }
                    update()
                }, 1000/30)
            }
        }
        break
        case 1:
            if (!config.int.auto) {
                config.int.auto = setInterval(() => {
                    $('stats-time').innerHTML = 'Played for ' + time(Date.now() - game.stats.sincedate) + '.'
                    game.stats.vol.music = Number($('vol-music').value)
                    game.stats.vol.sfx = Number($('vol-sfx').value)
                    config.audio.volume = game.stats.vol.music * 0.4
                }, 1000/30)
            }
        break
        case 2:
            if (!config.int.autobuy) {
                config.int.autobuy = setInterval(() => {
                    switch (Number(game.upgrades[4].value)) {
                        case 1:
                            barBuy(config.lastbar, 0, false, false)
                        break
                        case 2:
                            game.bars.forEach((v,i)=>{
                                barBuy(i, 0, false, false)
                            })
                        break
                    }
                })
            }
        break
        case 3:
            config.int.autosave = setInterval(() => {
                save(true)
            }, 1e4);
        break
        case 4:
            config.int.others = setInterval(() => {
                const L2 = game.EXO
                L2.gpoints = L2.gpoints.add(L2.gain.div(30).mul(game.upgrades[10].value))
                L2.tgpoints = L2.tgpoints.add(L2.gain.div(30).mul(game.upgrades[10].value))
                var a = L2.scalegain.div(30).mul(game.upgrades[11].value)
                L2.scalebar.gain(a.isNaN()?0:a)
                if (game.upgrades[12].value.eq(1)) {
                    maxAll(1,0)
                    var add = L2.gpoints.div(L2.bars.length)
                    L2.bars.forEach((a,v) => {
                        L2.bars[v].points = L2.bars[v].points.add(add.mul(L2.bars[v].speed))
                        L2.bars[v].tpoints = L2.bars[v].tpoints.add(add)
                        L2.bars[v].level = L2.bars[v].level.add(L2.bars[v].points.div(L2.bars[v].max).floor())
                        if (v == 0) {
                            L2.points = L2.points.add(L2.bars[v].points.div(L2.bars[v].max).floor())
                            L2.tpoints = L2.tpoints.add(L2.bars[v].points.div(L2.bars[v].max).floor())
                        }
                        L2.bars[v].points = L2.bars[v].points.mod(L2.bars[v].max)
                        if (L2.bars[v].level.gte(1)) includeBar(`pb-1-${v}`)
                    });
                }
            }, 33)
        break
        case 5: //others haha
            config.int.news = setInterval(() => {
                newstick()
            }, 33)
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
        if (config.elready) game.upgrades.forEach((v,i)=>{
            if (v.unlock() | game.stats.layer >= v.layer) {
                $('upg-' + i).style.display = ''
            } else {
                $('upg-' + i).style.display = 'none'
            }
        })
    },
    achUnlock: ()=>{
        game.achievements.forEach((v,i)=>{
            if (v.unlock() | v.unlocked) {
                $('ach-' + i).setAttribute('unlocked', '')
                v.unlocked = true
            }
        })
    }
}

AutoStart(4)
AutoStart(5)