//The game itself
function Game(obj={}) {
    this.version = obj.version || '0.2'
    this.points = obj.points || EN(0) //points
    this.tpoints = obj.tpoints || EN(0) //total points
    this.bars = obj.bars || [new Bar] //progress bars
    this.next = obj.next || EN(128) //progress bar cost
    this.upgrades = obj.upgrades || [new Upgrade(1, 16000, 1.11, 2.03, Infinity, 'return true', 0, 'Increase production of all progress bars', new Upgrade('f', 0).funct),
                     new Upgrade(0, 20480904.45235072, 1, 1.8275, Infinity, 'return true', 1, 'Increase auto increment range', new Upgrade('f', 1).funct),
                     new Upgrade(2.4, 20480904.45235072, 1.4, 1.45, 9, 'return true', 2, 'Increase auto increment speed', new Upgrade('f', 0).funct),
                     new Upgrade(0, 1e60, 1, Infinity, 1, 'return true', 3, 'Enable maxbuy on progress bars', new Upgrade('f', 2).funct),
                     new Upgrade(0, 'ee10', 1, Infinity, 1, 'return game.upgrades[3].value.eq(1)', 4, 'Enable automatic maxbuy on bar lastly clicked', new Upgrade('f', 2).funct)],
    this.stats = obj.stats || {
        since: '0.2',
        tbars: 0,
        sincedate: Date.now(),
        complete: 0,
        theme: 'color',
        page: 'progress',
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
        if (this.paid.eq(this.limit)) {return false} else {
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
        if (this.paid.eq(this.limit)) {return false} else {
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
                        if (t.id == 4) AutoStart(2)
                        return [1, Infinity]
                    } else {return false}
                }
            break
        }
    }
}