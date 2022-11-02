//The game itself
function Game(obj={}) {
    const P1 = obj.EXO || {}
    console.log(P1, P1.points || EN(0))
    this.version = '0.3.1'
    this.points = obj.points || EN(0) //points
    this.tpoints = obj.tpoints || EN(0) //total points
    this.next = obj.next || EN(128) //progress bar cost
    this.upgrades = obj.upgrades || [
        new Upgrade(1, 16000, 0, 0, 1.11, 2.03, Infinity, () => 1, 0, 'Increase production of all progress bars', new Upgrade('f', 0).funct),
        new Upgrade(0, 20480904.45235072, 0, 1, 1, 1.8275, 35, () => 1, 1, 'Increase auto increment range', new Upgrade('f', 1).funct),
        new Upgrade(2.4, 20480904.45235072, 0, 1, 1.4, 1.45, 9, () => 1, 2, 'Increase auto increment speed', new Upgrade('f', 0).funct),
        new Upgrade(0, 1e60, 0, 2, 1, Infinity, 1, () => 1, 3, 'Enable maxbuy on progress bars', new Upgrade('f', 2).funct),
        new Upgrade(0, 'ee10', 0, 2, 1, Infinity, 2, () => game.upgrades[3].value.eq(1), 4, 'Enable automatic maxbuy on bar lastly clicked', new Upgrade('f', 2).funct),
        new Upgrade(1, 6, 1, 3, 1.890625, 1.4, Infinity, () => 1, 5, 'Decrease all L1 bars\' upgrade cost', new Upgrade('f', 3).funct),
        new Upgrade(1, 7, 1, 3, 1.7, 1.5825, Infinity, () => 1, 6, 'Decrease all L1 bars\' maximum value', new Upgrade('f', 3).funct),
        new Upgrade(0, 70, 1, 4, 1, Infinity, 1, () => game.EXO.points.gte(35), 7, 'Keep all Surface Layer upgrades', new Upgrade('f', 4).funct),
        new Upgrade(0, 4.2e5, 1, 4, 1, Infinity, 1, () => game.EXO.points.gte(1e4), 8, 'Don\'t reset anything in Surface Layer', new Upgrade('f', 4).funct),
        new Upgrade(0, 7.77e77, 1, 2, 1, Infinity, 1, () => game.EXO.points.gte(1e12), 9, 'Create a Max All button', new Upgrade('f', 4).funct),
        new Upgrade(0, 'e800', 1, 1, 5, 1.4, 20, () => 1, 10, 'Increase ascends/sec', new Upgrade('f', 5).funct),
        new Upgrade(0, 'e820', 1, 1, 4, 1.35, 20, () => game.upgrades[10].paid.gte(1), 11, 'Increase scalebar gives/sec', new Upgrade('f', 5).funct),
        new Upgrade(0, 'ee8', 1, 1, 1, Infinity, 1, () => game.upgrades[10].paid.gte(1), 12, 'Automate increase/maxall bars without spending WP', new Upgrade('f', 4).funct),
        new Upgrade(0, 'ee12', 1, 0, 0.07, 1.7, Infinity, () => game.upgrades[12].paid.gte(1), 13, 'Add a power boost to all Exosphere Bars', new Upgrade('f', 6).funct)
    ]
    this.achievements = obj.achievements || [
        new Achievement('Startup', 'Complete the very first progress bar.', 0, () => game.stats.complete >= 1),
        new Achievement('New progress', 'Buy the second progress bar.', 1, () => game.bars.length >= 2),
        new Achievement('A fine boost', 'Buy your first upgrade.', 2, () => game.stats.upg.bought >= 1),
        new Achievement('Hue rotate', 'Have 5 progress bars.', 3, () => game.bars.length >= 5),
        new Achievement('Too lazy to click', 'Buy the Auto Increment upgrade.', 4, () => game.upgrades[3].paid.gte(1)),
        new Achievement('Too many progress bars', 'Have 16 progress bars.', 5, () => game.bars.length >= 16),
        new Achievement('Big restart', 'Ascend for the first time.', 6, () => game.stats.ascended[0] > 0, 0, '#5ee6a6', '#2a5237'),
        new Achievement('The ScaleBar', 'Give Surface Points to ScaleBar.', 7, () => game.stats.giveScalebar[0] > 0, 0, '#5ee6a6', '#2a5237'),
        new Achievement('Eraser Deleter', 'Stop Surface Layer from reseting.', 8, () => game.upgrades[8].value.eq(1), 0, '#5ee6a6', '#2a5237'),
        new Achievement('Too full', 'Reach Surface Layer\' bar limit.', 9, () => game.bars.length == 35),
        new Achievement('Overpoint', 'Get to EE35 points', 10, () => game.points.gte("ee35")),
        new Achievement('Increase For You', 'Buy the "automate increase/maxall" upgrade', 11, () => game.upgrades[12].value.eq(1), 0, '#5ee6a6', '#2a5237'),

        new Achievement("You can't tell me what to do!", 'rickroll youtube link', 12, void 0, 1, '#9878eb', '#3c36a8'),
        new Achievement("Oh yeah forgot I'm blind", 'Treat the minimizer button like a progress bar', 13, void 0, 1, '#9878eb', '#3c36a8')
    ]
    this.bars = obj.bars || [new Bar] //progress bars
    this.stats = obj.stats || {
        since: '0.3.1',
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
    this.EXO = obj.EXO==undefined|Object.values(P1).includes(undefined) ? {
        cost: EN('e5e10'),
        gain: EN(0),
        scalegain: EN(0),
        points: P1.points || EN(0),
        tpoints: P1.tpoints || EN(0),
        gpoints: P1.gpoints || EN(0),
        tgpoints: P1.tgpoints || EN(0),
        boost: EN(1),
        scaleboost: EN(1),
        bars: P1.bars || [],
        next: P1.next || EN(6400),
        scalebar: P1.scalebar || new ScaleBar,
        scaleUnlocked: P1.scaleUnlocked || false
    } : obj.EXO,
    this.SPT = obj.SPT || {
        cost: EN('ee28'),
        gain: EN(0),
        points: EN(0),
        tpoints: EN(0),
        gpoints: EN(0),
        tgpoints: EN(0),
        barpower: EN(7),
        bars: [],
        boost: EN(1),
        next: null,
        scalebar: new ScaleBar,
        scaleUnlocked: false
    }
}

//Progress bars
function Bar(max=30, cost=1, multi=1.2, cmulti=1.375, lmulti=1) {
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
    this.base = EN(lmulti)
    this.gain = (multi = 1) => {

        this.points = this.points.add(this.speed.mul(multi))
        this.tpoints = this.tpoints.add(this.speed.mul(multi))

        if (this.base == 1) {
            this.level = this.level.add(this.points.div(this.max).floor())
            const a = this.points.div(this.max).floor()
            this.points = this.points.mod(this.max)
            return a

        } else {
            let add = bulk.add(this.points, this.max, this.base)
            let cost = bulk.cost(add, this.max, this.base)
            this.points = this.points.sub(cost)
            this.level = this.level.add(add)
            this.max = this.max.mul(this.base.pow(add))
            console.log(add)
            return add

        }

    }
}

function ScaleBar(require=10, multi=1.245) {
    const isObj = typeof require == 'object'
    this.exp = isObj ? EN(require.exp) : EN(0)
    this.level = isObj ? EN(require.level) : EN(0)
    this.multi = isObj ? EN(require.multi) : EN(multi)
    this.req = isObj ? EN(require.req) : EN(require)
    this.total = isObj ? EN(require.total || 0) : EN(0)
    this.gain = (ammount = 0)=>{
        this.exp = this.exp.add(ammount)
        this.total = this.total.add(ammount)
        const add = bulk.add(this.exp, this.req, this.multi)
        const cost = bulk.cost(add, this.req, this.multi)
        this.exp = this.exp.sub(cost)
        this.level = this.level.add(add)
        this.req = this.req.mul(this.multi.pow(add))
    }
}

//Upgrade items
function Upgrade(value=1, cost=1000, layer, type, multi=1.2, cmulti=1.3, limit=Infinity, unlock='return true', id=0, desc, f, mf) {
    let paid = 0
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
        layer = value.layer
        type = value.type
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
    this.layer = layer
    this.type = type
    this.formula = f || ((v, c, m, cm, t)=>{
        if (game.points.gte(t.cost)) {
            game.points = game.points.sub(c)
            return [v.mul(m), c.mul(cm)]
        } else {return false}
    })
    this.mformula = mf || ((v, c, m, cm, t)=>{
        if (game.points.gte(t.cost)) {
            const add = bulk.add(v, c, cm).min(t.limit.sub(t.paid))
            const cost = bulk.cost(add, c, cm)
            game.points = game.points.sub(cost)
            return [v.mul(m.pow(add)), c.mul(cm.pow(add)), add]
        } else {return false}
    })
    this.buy = ()=>{
        if (this.paid.gte(this.limit)) {return false} else {
            const t = game.upgrades[this.id]
            const result = t.formula(t.value, t.cost, t.multi, t.cmulti, t)
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
            const t = game.upgrades[this.id]
            const result = t.mformula(t.value, t.cost, t.multi, t.cmulti, t)
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
                    if (game.EXO.points.gte(t.cost)) {
                        if (t.id == 5) {game.bars.forEach(v => {
                            v.cost = v.cost.div(m).max(1.3e-154)
                        })}
                        else if (t.id == 6) game.bars.forEach(v => {
                            v.max = v.max.div(m).max(1.3e-154)
                            v.level = v.level.mul(v.max).add(v.points).mul(m).div(v.max).floor()
                        });
                        return [v.mul(m), c.pow(cm)]
                    } else {return false}
                }
            break
            case 4:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.EXO.points.gte(t.cost)) {
                        return [1, Infinity]
                    } else {return false}
                }
            break
            case 5:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.EXO.points.gte(t.cost)) {
                        return [v.add(m), c.pow(cm)]
                    } else {return false}
                }
            break
            case 6:
                this.funct = (v, c, m, cm, t)=>{
                    if (game.EXO.points.gte(t.cost)) {
                        return [v.add(m), c.pow(EN.pow(10, cm))]
                    } else {return false}
                }
            break
        }
    }
}

function Achievement(name = '', desc = '', id = 0, unlock = ()=>0, secret = false, color = '#719bbf', bcolor = '#2b3746') {
    let obj = {}
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
    this.secret = obj.secret || secret
    this.setUnlock = a=>{
        if (this.unlock()) {
            this.unlocked = true
        }
    }
    this.instUnlock = () => this.unlocked = true
}