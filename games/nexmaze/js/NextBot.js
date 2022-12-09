'use strict'

class NextBot extends Entity {

    spawn
    target
    aspf
    onTouch
    onerror = null

    /**
     * @description Creates a new NextBot entity.
     * @param {number} sx 
     * @param {number} sy 
     * @param {Array} map 
     * @param {number} mapWidth 
     * @param {HTMLImageElement} img 
     * @param {number} entSpeed 
     * @returns {NextBot}
     */
    constructor(sx, sy, map, mapWidth, img=new Image, entSpeed=0.15) {
        
        if (!window.ASPathFinder) throw TypeError('[NextBot] ASPathFinder library is required to run NextBot')
        super(sx, sy, 0, img)
 
        var a = new ASPathFinder
        a.createMap(map, mapWidth)

        this.aspf = a
        this.ent = {spd: +entSpeed, alive: false}
        this.spawn = {x: sx, y: sy}

    }
    setAudio(audio) {
        Entity.prototype.setAudio.call(this, audio)
        this.aud.loop = true
    }
    /**
     * @description Spawns the NextBot in the map.
     * @param {object} targObj 
     * @param {string | undefined} xName 
     * @param {string | undefined} yName 
     * @param {string | undefined} aName 
     */
    spawnEntity(targObj, xName='x', yName='y', aName='') {

        var t = ['string','function']
        if (!(t.includes(typeof xName) &
              t.includes(typeof yName) &
              t.includes(typeof aName))) throw TypeError('Property names should be of type string or function')
        this.target = {

            x: targObj[xName],
            y: targObj[yName],
            a: targObj[aName],
            m: true, // Player has moved / Path needs to update
            p: {
                obj: targObj, // Player x and y
                xn: xName,
                yn: yName,
                an: aName
            }

        }
        this.ent.alive = true
        Object.assign(this.ent, {
            x: this.spawn.x,
            y: this.spawn.y,
            tick: 0,
            order: 0,
            sight: false,
            dir: 0,
            offset: .5,
            nordmul: 1,
            pathPOS: [],
            pathDIR: [],
            caught: false
        })
        this.aspf.setPos(this.ent.x, this.ent.y, this.target.x, this.target.y)

    }
    
    updateTgt(force) {

        if (!this.ent.alive | !this.target.p.obj[this.target.p.an]) return
        const a = this.target,
              e = this.ent,
              b = [a.x, a.y],
              f = Math.floor
    
        if (typeof a.p.xn == 'string') a.x = a.p.obj[a.p.xn]
        else a.x = a.p.xn(a.p.obj)
        if (typeof a.p.yn == 'string') a.y = a.p.obj[a.p.yn]
        else a.y = a.p.yn(a.p.obj)
        if (typeof a.p.an == 'string') a.a = a.p.obj[a.p.an]
        else a.a = a.p.an(a.p.obj)
        if (f(a.x) != f(b[0]) | f(a.y) != f(b[1]) || force) {
            a.m = true
            e.sight = false
            try {
                this.aspf.pos.sx = e.pathPOS.at(e.order).x
                this.aspf.pos.sy = e.pathPOS.at(e.order).y
            } catch {}
            e.pathPOS.splice(e.order)
            e.pathDIR.splice(e.order)
        }
        this.aspf.pos.ex = a.x
        this.aspf.pos.ey = a.y
    
    }
    /**
     * @description Processes NextBot motion towards the target.
     * @returns {Object}
     */
    tick() {

        try {
                
            if (!this.ent.alive | !this.target.p.obj[this.target.p.an]) return
            if (this.ent.x == undefined) throw TypeError('[NextBot] Entity needs to be spawned first')
            
            const o = this.target
            let e = this.ent,
                b = {x:e.x,y:e.y}
            const wind = game.wind.find(v => 
                exMath.distance(v.x - e.x, v.y - e.y) < (e.caught ? .1 : 1.2)    
            )
            if (wind) {
                e.caught = true

                const pos = exMath.step(-wind.dir + Math.PI / 2, .1, wind.x, wind.y)
                e.x = pos.x
                e.y = pos.y

                const col = collision(e.x, e.y)
                e.x = col.x
                e.y = col.y

                if (!col.hit) return
                else
                    game.wind.splice(game.wind.indexOf(wind), 1)
            }
                
            if (e.caught) {
                e.caught = false

                e.x = Math.floor(e.x) + e.offset
                e.y = Math.floor(e.y) + e.offset
                this.reset()
                this.updateTgt(true)
                this.aspf.pos.sx = Math.floor(e.x)
                this.aspf.pos.sy = Math.floor(e.y)

            } else this.updateTgt(false)
        
            if (o.m) {
                o.m = false
                let m, n
                m = this.aspf.run()
                m.seamless()
                m = m.getPathPos()
                n = this.aspf.output.path

                e.pathPOS = e.pathPOS.concat(m)
                e.pathDIR = e.pathDIR.concat(n)
            }
        
            let a, r = e.spd, u, I
        
            /*function dir(d) {
        
                var s = e.spd
                switch (d) {
                    case 0: return Math.PI / 2 * 3; break
                    case 2: return 0; break
                    case 4: return Math.PI / 2; break
                    case 6: return Math.PI; break
                }
        
            }*/
        
            let d, lx, ly, t = this.aspf.map, w = this.aspf.width, f = Math.floor, pos, posdir, frac
            function plc() {return (f(lx) == f(o.x) & f(ly) == f(o.y))}
            
            {

                e.order += e.spd * e.nordmul
                if (e.order >= e.pathPOS.length && this.onTouch && f(e.x) == f(o.x) & f(e.y) == f(o.y)) this.onTouch(this)
                frac = e.order % 1
                pos = e.pathPOS.slice(e.order, e.order + 2)
                if (pos.length > 1) {
                    e.dir = (e.pathDIR.at(e.order) - 2) / 4 * Math.PI

                    // Progress from 2 positions
                    lx = e.x = pos[0].x * (1 - frac) + pos[1].x * frac + e.offset
                    ly = e.y = pos[0].y * (1 - frac) + pos[1].y * frac + e.offset
                }

                // Check if NextBot can see the player
                d = Math.atan2((o.y - e.y), (o.x - e.x))
                I=0
                while (!t[f(lx) + f(ly) * w] & !plc() & I < 1024) {
                    lx += Math.cos(d) * e.spd
                    ly += Math.sin(d) * e.spd
                I++}
                if (plc()) e.sight = true

            }


            /*for (let i = 0; r > 0; i++) {
                
                a = m.at(e.order)
                u = Math.min(e.spd, 1 - e.order % 1, r)
                d = Math.atan2((o.y - e.y), (o.x - e.x))
        
                e.x += Math.cos(d) * u
                e.y += Math.sin(d) * u
                r -= u
                e.order += u
        
            }*/
            if (f(e.x) == f(o.x) & f(e.y) == f(o.y)) {
                if (this.onTouch) this.onTouch(this)
            }

            if (isNaN(e.x)) {
                e.x = b.x
                e.y = b.y
            }

            this.updateVolume(o.x, o.y)

            e.tick++
            return e

        } catch (e) {
            if (this.onerror) this.onerror(this, e)
            else {throw e}
        }
    
    }

    /**
     * @description Resets the NextBot's path.
     */
    reset() {
        const e = this.ent
        e.pathPOS = []
        e.pathDIR = []
        e.order = 0
        e.x = Math.floor(e.x) + e.offset
        e.y = Math.floor(e.y) + e.offset
        e.tick = 0
        e.sight = false
        this.target.m = true
    }

    /**
     * @description Teleports the NextBot, while also reseting its path.
     * @param {number} x
     * @param {number} y
     */
    teleport(x, y) {

        this.reset()
        this.ent.x = Math.floor(x) + this.ent.offset
        this.ent.y = Math.floor(y) + this.ent.offset
        this.aspf.pos.sx = Math.floor(x)
        this.aspf.pos.sy = Math.floor(y)

    }


}