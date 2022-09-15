'use strict'
;(function(This){

    class NextBot{

        spawn
        ent
        target
        img
        aud
        aspf
        onTouch

        constructor(sx, sy, map, mapWidth, img=new Image, entSpeed=0.15) {
            
            if (!window.ASPathFinder) throw TypeError('[NextBot] ASPathFinder library is required to run NextBot')
            if (img.constructor != HTMLImageElement) throw TypeError("[NextBot] 'img' parameter should be type of Image")
            this.spawn = {x: +sx, y: +sy}
            var a = new ASPathFinder
            a.createMap(map, mapWidth)
            this.aspf = a
            this.ent = {spd: +entSpeed, alive: false}
            this.img = img

        }
        setAudio(audio) {

            if (typeof audio == 'string') {
                this.aud = new Audio(audio)
            } else this.aud = audio
            this.aud.loop = true
            return this.aud

        }
        spawnEntity(targObj, xName='x', yName='y', aName='') {

            var t = ['string','function']
            if (!(t.includes(typeof xName) &
                  t.includes(typeof yName) &
                  t.includes(typeof aName))) throw TypeError('Property names should be of type string or function')
            this.target = {

                x: targObj[xName],
                y: targObj[yName],
                a: targObj[aName],
                m: true,
                p: {
                    obj: targObj,
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
                reached: false,
                dir: 0
            })
            this.aspf.setPos(this.ent.x, this.ent.y, this.target.x, this.target.y)

        }
        
        updateTgt() {

            if (!this.ent.alive) return
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
            if (f(a.x) != f(b[0]) | f(a.y) != f(b[1])) {
                a.m = true
                e.reached = false
                e.order = 0
                console.log('player moved')
            }
            this.aspf.pos = {
                sx: e.x,
                sy: e.y,
                ex: a.x,
                ey: a.y
            }
        
        }
        getImageData(sqrRatio=true, set=false) {

            const c = document.createElement('canvas'),
                  i = this.img,
                  s = Math.max(i.width, i.height)
            
            if (sqrRatio) {
                c.width = s
                c.height = s
            } else {
                c.width = i.width
                c.height = i.height
            }
            
            const ctx = c.getContext('2d')
            ctx.drawImage(i, 0, 0, s, s)
            const o = ctx.getImageData(0, 0, s, s)
            if (set) this.img = o
            return o

        }
        getPixel(x, y, decRange=true) {

            let i = this.img
            if (decRange) x *= i.width, y *= i.height
            let p = (Math.floor(x) + Math.floor(y) * i.width) * 4

            return i.data.slice(p, p + 4)

        }

        frame() {
                
            if (!this.ent.alive) return
            if (this.ent.x == undefined) throw TypeError('[NextBot] Entity needs to be spawned first')
        
            this.updateTgt()
            const o = this.target
            const x = o.x,
                  y = o.y
            let e = this.ent,
                b = {x:e.x,y:e.y}
        
            let m
            if (o.m) {
                m = this.aspf.run()
                m = m.seamless()
                o.m = false
            } else m = this.aspf.output.path
        
            let a, r = e.spd, u, I
        
            function dir(d) {
        
                var s = e.spd
                switch (d) {
                    case 0: return Math.PI / 2 * 3; break
                    case 2: return 0; break
                    case 4: return Math.PI / 2; break
                    case 6: return Math.PI; break
                }
        
            }
        
            let d, lx, ly, t = this.aspf.map, w = this.aspf.width, f = Math.floor
            function plc() {return (f(lx) == f(o.x) & f(ly) == f(o.y))}
            for (let i = 0; r > 0; i++) {
                
                a = m.at(e.order)
                u = Math.min(e.spd, 1 - e.order % 1, r)
                d = Math.atan2((o.y - e.y), (o.x - e.x))
        
                if (e.reached) {
        
                    e.x += Math.cos(d) * e.spd
                    e.y += Math.sin(d) * e.spd
        
                } else {
        
                    lx = e.x
                    ly = e.y
                    I=0
                    while (!t[f(lx) + f(ly) * w] & !plc() & I < 1024) {
                        lx += Math.cos(d) * e.spd
                        ly += Math.sin(d) * e.spd
                    I++}
                    if (plc()) e.reached = true
        
                    d = dir(a)
        
                }
        
                e.x += Math.cos(d) * u
                e.y += Math.sin(d) * u
                r -= u
                e.order += u
        
            }
            if (f(e.x) == f(o.x) & f(e.y) == f(o.y)) {
                if (this.onTouch) this.onTouch(this)
            }

            if (isNaN(e.x)) {
                e.x = b.x
                e.y = b.y
                if (this.onTouch) this.onTouch(this)
            }
        
            d = Math.sqrt((e.x - o.x) ** 2 + (e.y - o.y) ** 2)
            this.aud.volume = Math.max(Math.min(1 / d / 2, 1), 0)

            e.tick++
            e.dir = d
            return e
        
        }


    }

    This.NextBot = NextBot

})(this)