var EN = ExpantaNum

//game build
var game = new Game

function update() {
    game.bars.forEach((v,i,a)=>{
        try {
            game.bars[i].speed = v.nspeed.mul(a[i+1].pmulti).mul(game.upgrades[0].value).pow(game.prestige.scaleboost)
        } catch {
            game.bars[i].speed = v.nspeed.mul(game.upgrades[0].value).pow(game.prestige.scaleboost)
        }
        game.bars[i].pmulti = (i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)).mul(game.prestige.boost)
    })
    game.prestige.bars.forEach((v,i,a)=>{
        try {
            game.prestige.bars[i].speed = v.nspeed.mul(a[i+1].pmulti)
        } catch {
            game.prestige.bars[i].speed = v.nspeed
        }
        game.prestige.bars[i].pmulti = i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)
    })
    game.upgrades.forEach((v,i,a)=>{
        $('upg-' + i).innerHTML = upgradeText(v)
    })
    statsCheck.achUnlock()
    game.stats.bars.cps = statsCheck.getTotalCPS()
    statsCheck.upgradeUnlock()
    $('points').innerHTML = 'Points: ' + ts(game.points)
    $('next-bar').innerHTML = 'Buy next progress bar | Cost: ' + ts(game.next)
    for (var i in game.bars) {
        $('prog-bar-0-' + i).style.width = (game.bars[i].points.div(game.bars[i].max) * 100) + '%'
        $('prog-text-0-' + i).innerHTML = ts(EN.floor(game.bars[i].points)) + ' / ' + ts(EN.floor(game.bars[i].max)) + '\nMulti: ' + ts(game.bars[i].speed) + ', Up: x' + ts(game.bars[i].pmulti)
        $('prog-level-0-' + i).innerHTML = 'Level\n' + ts(game.bars[i].level)
        $('prog-buy-0-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(game.bars[i].cost))
    }
    $('stats-tpoints').innerHTML = 'Total points: ' + ts(game.tpoints)
    $('stats-bars').innerHTML = 'Progress bars: ' + game.bars.length
    $('stats-upgbought').innerHTML = 'Upgrades bought: ' + ts(game.stats.upg.bought)
    $('stats-since').innerHTML = 'Played since v' + game.stats.since
    $('stats-allbars').innerHTML = 'You have completed ' + game.stats.complete + ' bars.'
    $('stats-tpoints-2').innerHTML = 'Total Sky Points: ' + ts(game.prestige.tpoints)
    $('stats-bars-2').innerHTML = 'Sky Progress bars: ' + game.prestige.bars.length
    $('stats-waited').innerHTML = 'Sky total Waited Points: ' + ts(game.prestige.tgpoints)
    $('stats-scaletotal').innerHTML = 'Sky Scalebar total EXP: ' + ts(game.prestige.scalebar.total)

    switch (game.stats.layer) {
        case 1:
            for (var i in game.prestige.bars) {
                $('prog-bar-1-' + i).style.width = (game.prestige.bars[i].points.div(game.prestige.bars[i].max) * 100) + '%'
                $('prog-text-1-' + i).innerHTML = ts(EN.floor(game.prestige.bars[i].points)) + ' / ' + ts(EN.floor(game.prestige.bars[i].max)) + '\nMulti: ' + ts(game.prestige.bars[i].speed) + ', Up: x' + ts(game.prestige.bars[i].pmulti)
                $('prog-level-1-' + i).innerHTML = 'Level\n' + ts(game.prestige.bars[i].level)
                $('prog-buy-1-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(game.prestige.bars[i].cost))
            }
            $('sb-bar').style.width = (Number(game.prestige.scalebar.exp.div(game.prestige.scalebar.req)) * 100) + '%'
            $('sb-text').innerHTML = `${ts(game.prestige.scalebar.exp)} / ${ts(game.prestige.scalebar.req)}`
            $('sb-level').innerHTML = `Level\n${ts(game.prestige.scalebar.level)}`
            $('points-2').innerHTML = `Sky Points: ${ts(game.prestige.points)}`
            $('waited-points').innerHTML = 'Waited Points: ' + ts(game.prestige.gpoints)
            $('boost').innerHTML = 'Sky Points gained boosts ALL Layer 1 ups by x' + ts(game.prestige.boost)
            $('boost-sb').innerHTML = 'ScaleBar boosts L1 bars\' speed by ^' + ts(game.prestige.scaleboost, 6, -6, 1000)
            $('next-bar-2').innerHTML = 'Unlock next progress bar | Requirement: ' + ts(game.prestige.next)
    }

    game.prestige.gain = game.points.log10().log10().sub(EN.log10('5e10')).add(1).pow(0.625).mul(300)
    game.prestige.scalegain = game.points.log10().log10().div(10).pow(0.8475).mul(10)
    if (game.prestige.gain.isNaN()) game.prestige.gain = EN(0)
    $('prestige-gain').innerHTML = 'Gain: +' + ts(game.prestige.gain) + (game.prestige.scaleUnlocked ? (' | Give: +' + ts(game.prestige.scalegain)) : '')
    game.prestige.boost = game.prestige.points.pow(0.825).mul(1.1).add(1)
    game.prestige.scaleboost = game.prestige.scalebar.level.pow(0.8).div(87).add(1)

    var dif = game.points.log10().log10().div(EN.log10('e5e10').log10())
    if (dif.isNaN()) dif = EN(0)
    $('normalpb-prog-prestige').style.width = (Number(dif.min(1).max(0)) * 100) + '%'
    $('normalpb-text-prestige').innerHTML = (Number(dif.min(1).max(0).mul(1e4).floor().div(1e4)) * 100) + '%'

    if (game.points.gte(game.prestige.cost)) {
        $('ascend').style.display = ''
        $('prestige-gain').style.display = ''
        if (game.prestige.scaleUnlocked) {$('give-scalebar').style.display = ''}
        else $('give-scalebar').style.display = 'none'
    } else {
        $('ascend').style.display = 'none'
        $('prestige-gain').style.display = 'none'
        $('give-scalebar').style.display = 'none'
    }
    if (game.stats.layer > 0) {
        document.querySelectorAll('.layershow').forEach((v)=>{
            v.style.display = ''
        })
        document.querySelector('.menu-progress').innerHTML = 'SURFACE Layer'
    } else {
        document.querySelectorAll('.layershow').forEach((v)=>{
            v.style.display = 'none'
        })
        document.querySelector('.menu-progress').innerHTML = 'Progress Bars'
    }
    if (game.prestige.scaleUnlocked) {
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

    if (game.points.gte(game.prestige.cost)) addBar('pr-0')
    if (game.prestige.scalebar.level.gte(1)) addBar('sb-0')

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
        return undefined
    }
    game.bars.forEach((v,i,a)=>{
        try {
            game.bars[i].speed = v.nspeed.mul(a[i+1].pmulti).mul(game.upgrades[0].value)
            } catch {
            game.bars[i].speed = v.nspeed.mul(game.upgrades[0].value)
        }
        game.bars[i].pmulti = (i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)).mul(game.prestige.boost)
    })
    game.bars[id].points = game.bars[id].points.add(game.bars[id].speed)
    game.bars[id].tpoints = game.bars[id].tpoints.add(game.bars[id].speed)
    if (id == 0) {
        game.points = game.points.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
        game.tpoints = game.tpoints.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
    }
    game.bars[id].level = game.bars[id].level.add(EN.floor(game.bars[id].points.div(game.bars[id].max)))
    game.bars[id].points = EN.mod(game.bars[id].points, game.bars[id].max)
    game.stats.bars.clicks++
    if (game.bars[id].level.gt(0)) addBar(`pb-0-${id}`)
    update()
    playSFX('audio/click.mp3')
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
    if (game.bars[id].level.gt(0)) addBar(`pb-0-${id}`)
    if (onupdate) update()
}

function barBuy(id, layer, onupdate=true, sound=true) {
    switch (layer) {
        case 0:
            if (game.upgrades[3].value.eq(1)) {
                var req = game.bars[id].cost.log10()
                var val = game.bars[id].level.log10()
                var mul = game.bars[id].cmulti.log10()
                var buy = val.sub(req).div(mul).floor().add(1).max(0)
                game.bars[id].nspeed = game.bars[id].nspeed.mul(game.bars[id].multi.pow(buy))
                game.bars[id].cost = game.bars[id].cost.mul(game.bars[id].cmulti.pow(buy))
                game.stats.bars.buys = game.stats.bars.buys.add(buy)
                if (buy.gt(0)) {
                    if (sound) playSFX('audio/buy.mp3')
                    if (onupdate) update()
                } else {
                    if (sound) playSFX('audio/low.mp3')
                }
            } else {
                if (game.bars[id].level.gte(game.bars[id].cost)) {
                    game.bars[id].cost = game.bars[id].cost.mul(game.bars[id].cmulti)
                    game.bars[id].nspeed = game.bars[id].nspeed.mul(game.bars[id].multi)
                    game.stats.bars.buys = game.stats.bars.buys.add(1)
                    playSFX('audio/buy.mp3')
                    update()
                } else {
                    playSFX('audio/low.mp3')
                }
            }
        break
        case 1:
            if (game.prestige.bars[id].level.gte(game.prestige.bars[id].cost)) {
                game.prestige.bars[id].cost = game.prestige.bars[id].cost.mul(game.prestige.bars[id].cmulti)
                game.prestige.bars[id].nspeed = game.prestige.bars[id].nspeed.mul(game.prestige.bars[id].multi)
                game.stats.bars.buys = game.stats.bars.buys.add(1)
                playSFX('audio/buy.mp3')
                update()
            } else {
                playSFX('audio/low.mp3')
            }
        break
    }
}

function NextBar(layer) {
    switch (layer) {
        case 0:
            if (game.points.gte(game.next)) {
                game.points = game.points.sub(game.next)
                game.next = game.next.pow(EN.add(1.8575, EN.div(game.bars.length-2, 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(game.bars.length-13, 1).pow(2))))
                game.bars.push(new Bar(EN.pow(1.18, game.bars.length).mul(30).div(game.upgrades[6].value).floor(), EN.pow(1.2, game.bars.length).div(game.upgrades[5].value),
                                       EN.pow(1.05, game.bars.length).mul(1.2), EN.pow(1.05, game.bars.length).mul(1.375)))
                game.stats.tbars++
                placeBars(0)
                playSFX('audio/buy.mp3')
                update()
                var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
                ButtonStyle($('next-bar'), [a.r, a.g, a.b])
            } else {
                playSFX('audio/low.mp3')
            }
        break
        case 1:
            if (game.prestige.points.gte(game.prestige.next)) {
                game.prestige.next = game.prestige.next.pow(EN.add(1.8575, EN(game.prestige.bars.length-1).pow(3).sub(2).max(1).pow(0.58).sub(1)))
                game.prestige.bars.push(new Bar(EN.pow(1.225, game.prestige.bars.length).mul(100).floor(), EN.pow(1.25, game.prestige.bars.length).mul(10),
                                                EN.pow(1.075, game.prestige.bars.length).mul(1.4), EN.pow(1.075, game.prestige.bars.length).mul(1.48)))
                game.stats.tbars++
                placeBars(1)
                playSFX('audio/buy.mp3')
                update()
                var a = LdrToRGB(90.5, game.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
                ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
            } else {
                playSFX('audio/low.mp3')
            }
        break
    }
}

function maxAll(layer) {
    switch (layer) {
        case 1:
            var paidAtLeast = false
            game.prestige.bars.forEach(v=>{
                var req = v.cost.log10()
                var val = v.level.log10()
                var mul = v.cmulti.log10()
                var buy = val.sub(req).div(mul).floor().add(1).max(0)
                if (buy.gte(1)) paidAtLeast = true
                v.nspeed = v.nspeed.mul(v.multi.pow(buy))
                v.cost = v.cost.mul(v.cmulti.pow(buy))
                game.stats.bars.buys = game.stats.bars.buys.add(buy)
            })
            if (paidAtLeast) {
                playSFX('audio/buy.mp3')
            } else {
                playSFX('audio/low.mp3')
            }
        break
    }
}

function restart(fromLayer) {
    switch (fromLayer) {
        case 0:
            var upgrades = game.upgrades
            if (!(fromLayer == 0 & upgrades[7].value.eq(1))) game.upgrades = undefined
            if (upgrades[8].value.eq(0)) {
                game.bars = undefined
                game.points = undefined
                game.next = undefined
            }
            game.stats.ascended[fromLayer]++
            game.stats.ascendedm[fromLayer]++
            game = new Game(game)
            config.upgradelayer.forEach((v,i) => {
                if (v != fromLayer) {
                    game.upgrades[i] = upgrades[i]
                }
            })
            if (game.upgrades[8].value.eq(0)) {
                game.bars[0].max = EN.div(30, game.upgrades[6].value)
                game.bars[0].cost = EN.div(1, game.upgrades[5].value)
            }
            if (!(fromLayer == 0 & game.upgrades[7].value.eq(1))) {
                clearInterval(config.int.bars[0])
                clearInterval(config.int.autobuy)
            }
            if (game.upgrades[8].value.eq(0)) removeBars(0)
        break
    }
}
function ascend(fromLayer) {
    restart(0)
    game.prestige.gpoints = game.prestige.gpoints.add(game.prestige.gain)
    game.prestige.tgpoints = game.prestige.tgpoints.add(game.prestige.gain)
    if (config.layerup) {
        config.layerup = false
        switch (fromLayer) {
            case 0: game.prestige.bars.push(new Bar(100, 10, 1.4, 1.48))
        }
    }
    var a = LdrToRGB(90.5, game.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
    ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
    var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    placeBars(1)
    update()
}
function ascendAnim(fromLayer) {
    if (game.stats.layer == fromLayer) {
        config.layerup = true
        var tick = 0, screen = document.querySelector('.gamescreen'), white = $('whitescreen'), text = $('whitescreentext'), paused = config.audio.paused
        config.audio.pause()
        text.style.transform = 'translateY(65vh)'
        white.style.display = ''
        white.style.filter = 'opacity(0)'
        screen.style.overflow = 'hidden'
        config.int.animate = setInterval(() => {
            tick++
            screen.style.filter = 'brightness(' + (tick ** 1.4 + 1) + ')'
        }, 1000/30);
        setTimeout(() => {
            screen.style.filter = 'brightness(1)'
            clearInterval(config.int.animate)
            tick = 0
            white.style.filter = 'opacity(1)'
            clearInterval(config.int.animate)
            playSFX('audio/layerup.mp3')
            tick = 0
            var a, b, c, d
            config.int.animate = setInterval(() => {
                tick++
                a = Math.min(tick, 10)*-6.5+65
                b = a + (Math.max(tick-110, 0)*-6.5)
                text.style.transform = `translateY(${b}vh)`
                c = (tick*-1)%15*(4/3)+100
                text.style.fontSize = c + 'px'
                d = [tick%15*17, 255-(tick%15*17), 255]
                text.style.textShadow = `0 0 20px rgb(${d[0]/2}, ${d[1]/2}, ${d[2]/2})`
            }, 1000/30);
            setTimeout(() => {
                game.stats.layer++
                clearInterval(config.int.animate)
                screen.style.filter = 'brightness(1)'
                white.style.filter = 'opacity(0)'
                config.audio.src = `audio/songs/back${game.stats.layer}.mp3`
                if (!paused) config.audio.play()
                white.style.display = 'none'
                screen.style.overflow = ''
                ascend(fromLayer)
                update()
                clearInterval(config.int.bars[0])
            }, 6000);
        }, 2000);
    } else {
        ascend(fromLayer)
    }
}

function SelectBars(layer, selecting = true) {
    switch (layer) {
        case 1:
            game.prestige.bars.forEach((v,i) => {
                if (selecting) {
                    $('prog-button-1-' + i).setAttribute('selected', '')
                } else {
                    $('prog-button-1-' + i).removeAttribute('selected')
                }
            });
    }
}
function ConfirmSelect(layer) {
    var amm = 0
    var which = []
    switch (layer) {
        case 1:
            game.prestige.bars.forEach((v, i) => {
                if ($(`prog-button-1-${i}`).hasAttribute('selected')) {
                    amm++
                    which.push(i)
                }
            });
    }
    var add = game.prestige.gpoints.div(amm)
    which = which.reverse()
    which.forEach(v => {
        switch (layer) {
            case 1:
                game.prestige.bars[v].points = game.prestige.bars[v].points.add(add.mul(game.prestige.bars[v].speed))
                game.prestige.bars[v].tpoints = game.prestige.bars[v].tpoints.add(add)
                game.prestige.bars[v].level = game.prestige.bars[v].level.add(game.prestige.bars[v].points.div(game.prestige.bars[v].max).floor())
                if (v == 0) {
                    game.prestige.points = game.prestige.points.add(game.prestige.bars[v].points.div(game.prestige.bars[v].max).floor())
                    game.prestige.tpoints = game.prestige.tpoints.add(game.prestige.bars[v].points.div(game.prestige.bars[v].max).floor())
                }
                game.prestige.bars[v].points = game.prestige.bars[v].points.mod(game.prestige.bars[v].max)
                if (game.prestige.bars[v].level.gte(1)) addBar(`pb-${layer}-${v}`)
        }
    });
    if (which.length != 0) game.prestige.gpoints = EN(0)
    update()
}

function UnlockMore(id) {
    switch (id) {
        case 0:
            if (game.prestige.points.gte(3200)) {
                game.prestige.scaleUnlocked = true
                playSFX('audio/buy.mp3')
                update()
            } else {
                playSFX('audio/low.mp3')
            }
        break
    }
}

function giveScaleBar() {
    game.stats.giveScalebar[0]++
    game.prestige.scalebar.gain(game.prestige.scalegain)
    restart(0)
    var a = LdrToRGB(90.5, game.bars.length / 3.75 * 1.2666666667 - 1.9, 92.5)
    ButtonStyle($('next-bar-2'), [a.r, a.g, a.b])
    var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 85)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    update()
}

function fb(i,f) {
    return EN.div(EN.floor(EN.mul(i,f)),f)
}
function ts(i,ep=6,en=-6,f=100,a=0) {
    i = EN(i)
    var neg = EN.isneg(i)
    if (neg) i=EN.mul(i,-1)
    var log = EN.log10(i)
    if (EN(i).isInfinite()) return EN(Infinity)
    if (EN.gte(EN.log10(EN.log10(EN.log10(EN.log10(log)))),0)) {
        var r = '10^^' + (r2=EN.slog(i),EN.gte(EN.log(r2),ep)?ts(r2,ep,en,f,a+1):fb(r2,f))
        return neg?'-'+r:r
    } else {
        if ((log>=ep | log<=en) & a<10 & !(i==0)) {
            if (log.lt('e'+ep)) {
                var r = i.div(EN.pow(10, log.floor())).mul(f).floor().div(f) + 'e' + log.floor()
            } else {
                var e = ''
                var amm = Number(EN(i).slog(10).sub(EN.slog(ep)))-0.9999999
                var r = i
                for (i=0; i<amm; i++) {
                    e += 'e'
                    r = r.log10()
                }
                r = e + r.mul(f).floor().div(f)
            }
            return (neg?EN.mul(r,-1):r).toString()
        } else {
            return fb(neg?i*-1:i,f).toString()
        }
    }
}

function upgrade(id) {
    var result = game.upgrades[id].buy()
    if (result) {playSFX('audio/buy.mp3')} else playSFX('audio/low.mp3')
    update()
}

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
        game.upgrades.forEach((v,i)=>{
            if (new Function(v.unlock)()) {
                $('upg-' + i).style.display = ''
            } else {
                $('upg-' + i).style.display = 'none'
            }
        })
    },
    achUnlock: ()=>{
        game.achievements.forEach((v,i)=>{
            if (new Function(v.unlock)() | v.unlocked) {
                $('ach-' + i).setAttribute('unlocked', '')
                v.unlocked = true
            }
        })
    }
}