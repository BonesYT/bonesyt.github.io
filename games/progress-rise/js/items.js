//The game itself
function Game(obj={}) {
    this.version = '0.3'
    this.points = obj.points || EN(0) //points
    this.tpoints = obj.tpoints || EN(0) //total points
    this.next = obj.next || EN(128) //progress bar cost
    this.upgrades = obj.upgrades || [
        new Upgrade(1, 16000, 1.11, 2.03, Infinity, 'return true', 0, 'Increase production of all progress bars', new Upgrade('f', 0).funct),
        new Upgrade(0, 20480904.45235072, 1, 1.8275, 35, 'return true', 1, 'Increase auto increment range', new Upgrade('f', 1).funct),
        new Upgrade(2.4, 20480904.45235072, 1.4, 1.45, 9, 'return true', 2, 'Increase auto increment speed', new Upgrade('f', 0).funct),
        new Upgrade(0, 1e60, 1, Infinity, 1, 'return true', 3, 'Enable maxbuy on progress bars', new Upgrade('f', 2).funct),
        new Upgrade(0, 'ee10', 1, Infinity, 2, 'return game.upgrades[3].value.eq(1)', 4, 'Enable automatic maxbuy on bar lastly clicked', new Upgrade('f', 2).funct),
        new Upgrade(1, 6, 1.890625, 1.4, Infinity, 'return true', 5, 'Decrease all L1 bars\' upgrade cost', new Upgrade('f', 3).funct),
        new Upgrade(1, 7, 1.7, 1.5825, Infinity, 'return true', 6, 'Decrease all L1 bars\' maximum value', new Upgrade('f', 3).funct),
        new Upgrade(0, 70, 1, Infinity, 1, 'return game.prestige.points.gte(35)', 7, 'Keep all Surface Layer upgrades', new Upgrade('f', 4).funct),
        new Upgrade(0, 4.2e5, 1, Infinity, 1, 'return game.prestige.points.gte(1e4)', 8, 'Don\'t reset anything in Surface Layer', new Upgrade('f', 4).funct),
        new Upgrade(0, 7.77e77, 1, Infinity, 1, 'return game.prestige.points.gte(1e12)', 9, 'Create a Max All button', new Upgrade('f', 4).funct)
    ]
    this.achievements = obj.achievements || [
        new Achievement('Startup', 'Complete the very first progress bar.', 0, 'return game.stats.complete >= 1'),
        new Achievement('New progress', 'Buy the second progress bar.', 1, 'return game.bars.length >= 2'),
        new Achievement('A fine boost', 'Buy your first upgrade.', 2, 'return game.stats.upg.bought >= 1'),
        new Achievement('Hue rotate', 'Have 5 progress bars.', 3, 'return game.bars.length >= 5'),
        new Achievement('Too lazy to click', 'Buy the Auto Increment upgrade.', 4, 'return game.upgrades[3].paid.gte(1)'),
        new Achievement('Too many progress bars', 'Have 16 progress bars.', 5, 'return game.bars.length >= 16'),
        new Achievement('Big restart', 'Ascend for the first time.', 6, 'return game.stats.ascended[0] > 0', '#5ee6a6', '#2a5237'),
        new Achievement('The ScaleBar', 'Give Surface Points to ScaleBar.', 7, 'return game.stats.giveScalebar[0] > 0', '#5ee6a6', '#2a5237'),
        new Achievement('Eraser Deleter', 'Stop Surface Layer from reseting.', 8, 'return game.upgrades[8].value.eq(1)', '#5ee6a6', '#2a5237'),
        new Achievement('Too full', 'Reach Surface Layer\' bar limit.', 9, 'return game.bars.length == 35')
    ]
    this.bars = obj.bars || [new Bar] //progress bars
    this.stats = obj.stats || {
        since: '0.3',
        tbars: 0,
        sincedate: Date.now(),
        complete: 0,
        completeid: [],
        ascended: [0],
        giveScalebar: [0],
        ascendedm: [0],
        theme: 'color',
        page: 'progress',
        vol: {
            music: 1,
            sfx: 1
        },
        layer: 0,
        upg: {
            bought: EN(0),
            limit: 0
        },
        bars: {
            clicks: 0,
            buys: EN(0),
            cps: EN(0)
        }
    },
    this.prestige = obj.prestige || {
        cost: EN('e5e10'),
        gain: EN(0),
        scalegain: EN(0),
        points: EN(0),
        tpoints: EN(0),
        gpoints: EN(0),
        tgpoints: EN(0),
        boost: EN(1),
        scaleboost: EN(1),
        bars: [],
        next: EN(6400),
        scalebar: new ScaleBar,
        scaleUnlocked: false
    }
}

//Progress bars
function Bar(max=30, cost=1, multi=1.2, cmulti=1.375) {
    this.points = EN(0) //points
    this.tpoints = EN(0) //total points
    this.max = EN(max) //maximum value
    this.level = EN(0) //level
    this.cost = EN(cost) //multiplier cost (buy)
    this.multi = EN(multi) //speed multiplier (buy)
    this.cmulti = EN(cmulti) //cost multiplier (buy)
    this.speed = EN(1) //speed
    this.nspeed = EN(1) //normal speed
    this.pmulti = EN(1) //previous multiplier
    this.gain = (ammount = 0) => {
        this.points = this.points.add(ammount)
        this.tpoints = this.tpoints.add(ammount)
        this.level = this.level.add(this.points.div(this.max).floor())
        this.points = this.points.mod(this.max)
    }
}

function ScaleBar(require=10, multi=1.245) {
    var isObj = typeof require == 'object'
    this.exp = isObj ? EN(require.exp) : EN(0)
    this.level = isObj ? EN(require.level) : EN(0)
    this.multi = isObj ? EN(require.multi) : EN(multi)
    this.req = isObj ? EN(require.req) : EN(require)
    this.total = isObj ? EN(require.total || 0) : EN(0)
    this.gain = (ammount = 0)=>{
        this.exp = this.exp.add(ammount)
        this.total = this.total.add(ammount)
        var add = buy.add(this.exp, this.req, this.multi)
        var cost = buy.cost(add, this.req, this.multi)
        this.exp = this.exp.sub(cost)
        this.level = this.level.add(add)
        this.req = this.req.mul(this.multi.pow(add))
    }
}

//Upgrade items
function Upgrade(value=1, cost=1000, multi=1.2, cmulti=1.3, limit=Infinity, unlock='return true', id=0, desc, f, mf) {
    var paid = 0
    if (typeof value == 'object') {
        cost = value.cost
        multi = value.multi
        cmulti = value.cmulti
        paid = value.paid
        id = value.id
        desc = value.desc
        f = value.formula
        mf = value.mformula
        limit = value.limit
        unlock = value.unlock
        value = value.value
    }
    this.value = EN(value=='f'?1:value)
    this.cost = EN(value=='f'?1000:cost)
    this.paid = EN(paid)
    this.limit = EN(limit)
    this.multi = EN(multi)
    this.cmulti = EN(cmulti)
    this.desc = desc
    this.id = id
    this.unlock = unlock
    this.formula = f || ((v, c, m, cm, t)=>{
        if (game.points.gte(t.cost)) {
            game.points = game.points.sub(c)
            return [v.mul(m), c.mul(cm)]
        } else {return false}
    })
    this.mformula = mf || ((v, c, m, cm, t)=>{
        if (game.points.gte(t.cost)) {
            var add = buy.add(v, c, cm).min(t.limit.sub(t.paid))
            var cost = buy.cost(add, c, cm)
            game.points = game.points.sub(cost)
            return [v.mul(m.pow(add)), c.mul(cm.pow(add)), add]
        } else {return false}
    })
    this.buy = ()=>{
        if (this.paid.gte(this.limit)) {return false} else {
            var t = game.upgrades[this.id]
            var result = t.formula(t.value, t.cost, t.multi, t.cmulti, t)
            if (result) {
                this.value = EN(result[0])
                this.cost = EN(result[1])
                this.paid = t.paid.add(1)
                game.stats.upg.bought = game.stats.upg.bought.add(1)
                if (this.paid.eq(this.limit)) game.stats.upg.limit++
                return true
            } else {return false}
        }
    }
    this.buyMax = ()=>{
        if (this.paid.gte(this.limit)) {return false} else {
            var t = game.upgrades[this.id]
            var result = t.mformula(t.value, t.cost, t.multi, t.cmulti, t)
            if (result) {
                this.value = EN(result[0])
                this.cost = EN(result[1])
                this.paid = t.paid.add(result[2])
                game.stats.upg.bought = game.stats.upg.bought.add(result[2])
                return true
            } else {return false}
        }
    }
    if (value == 'f') {
        switch (cost) {
            case 0:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.points.gte(t.cost)) {
                        game.points = game.points.sub(c)
                        return [v.mul(m), c.pow(cm)]
                    } else {return false}
                }
            break
            case 1:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.points.gte(t.cost)) {
                        game.points = game.points.sub(c)
                        AutoStart(0)
                        return [v.add(m), c.pow(EN.add(1.8575, EN.div(t.paid.add(1), 93).add(1.0108).pow(5.4).sub(1).div(5.75).mul(EN.max(t.paid.sub(10), 1).pow(2))))]
                    } else {return false}
                }
            break
            case 2:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.points.gte(t.cost)) {
                        game.points = game.points.sub(c)
                        if (t.id == 4) {
                            AutoStart(2)
                            switch (Number(t.paid)) {
                                case 0:
                                    t.desc = 'Enable auto maxbuy on every progress bar'
                                    t.cost = 'ee12.34'
                                break
                                case 1:
                                    t.cost = Infinity
                                break
                            }
                        }
                        return [v.add(1), t.cost]
                    } else {return false}
                }
            break
            case 3:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.prestige.points.gte(t.cost)) {
                        if (v.id == 5) {game.bars.forEach(v => {
                            v.cost = v.cost.div(m)
                        })}
                        else if (v.id == 6) game.bars.forEach(v => {
                            v.max = v.max.div(m)
                        });
                        return [v.mul(m), c.pow(cm)]
                    } else {return false}
                }
            break
            case 4:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.prestige.points.gte(t.cost)) {
                        return [1, Infinity]
                    } else {return false}
                }
            break
        }
    }
}

function Achievement(name = '', desc = '', id = 0, unlock = 'return false', color = '#719bbf', bcolor = '#2b3746') {
    var obj = {}
    if (typeof name == 'object') {
        obj = name
    }
    this.name = obj.name || name
    this.desc = obj.desc || desc
    this.id = obj.id || id
    this.unlock = obj.unlock || unlock
    this.color = obj.color || color
    this.bcolor = obj.bcolor || bcolor
    this.unlocked = obj.unlocked || false
    this.setUnlock = a=>{
        if (new Function(this.unlock)()) {
            this.unlocked = true
        }
    }
}