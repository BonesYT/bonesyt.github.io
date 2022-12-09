/** By BonesYT (2022)
  * Version 1.0
  * A* Path Finder algorithm
  */

'use strict'

/**
 * @description Creates an empty Path Finder
 * @returns {ASPathFinder}
 */
class ASPathFinder {

    map
    pos
    width
    height
    //portals
    status = 'pending'
    /**
     * @type ASPFOutput
     */
    output

    /**
     * @description Assigns a map/maze to the object.
     * @param {number[][] | number[]} input 
     * @param {number} width 
     * @returns {number[]}
     */
    createMap(input, width) {

        this.map = input.map(v=>!!v).flat()
        if (typeof input[0] == 'object') this.width = input[0].length
        this.width = Math.floor(width)
        var h = this.map.length / this.width
        if (h % 1 != 0) {
            throw RangeError('[ASPF] Array length is invalid')
        }
        this.height = h
        this.portals = []
        return this.map

    }
    /**
     * @description Sets position for both the starting point and end point.
     * @param {number} startX 
     * @param {number} startY 
     * @param {number} endX 
     * @param {number} endY 
     */
    setPos(startX, startY, endX, endY) {

        startX = Math.floor(startX)
        startY = Math.floor(startY)
        endX = Math.floor(endX)
        endY = Math.floor(endY)
        if (!this.map) throw TypeError('[ASPF] Map has to be generated first')
        if (startX < 0 | startX >= this.width | startY < 0 | startY >= this.height) {
            throw RangeError('[ASPF] Start cell is out of range')
        } if (endX < 0 | endX >= this.width | endY < 0 | endY >= this.height) {
            throw RangeError('[ASPF] End cell is out of range')
        }
        if (this.map[startX + startY * this.width]) throw TypeError('[ASPF] Start cell cannot be in a wall')
        if (this.map[endX + endY * this.width]) throw TypeError('[ASPF] End cell cannot be in a wall')
        this.pos = {
            sx: startX,
            sy: startY,
            ex: endX,
            ey: endY
        }
        this.status = 'ready'

    }
    /*addPortal(portalX, portalY, portalId, targetId) {

        if (!this.map) throw TypeError('[ASPF] Map has to be generated first')
        if (portalX < 0 | portalX >= this.width | portalY < 0 | portalY >= this.height) {
            throw RangeError('[ASPF] Portal position is out of range')
        }
        this.portals.push({
            x: Math.floor(portalX),
            y: Math.floor(portalY),
            i: Math.floor(portalId),
            t: Math.floor(targetId) 
        })

    } coming soon ig*/

    /**
     * @description Runs the A* Path Finder algorithm.
     * @param {boolean} thrCorners Specifies if path can go through corners.
     * @param {boolean} setout Specifies if the output modifies the object.
     * @param {number} max Maximum amount of iterations.
     * @returns {ASPFOutput}
     */
    run(thrCorners = false, setout = true, max = Infinity) {

        if (!['ready','complete'].includes(this.status)) throw TypeError('[ASPF] Status has to be ready')
        var sx = Math.floor(this.pos.sx),
            sy = Math.floor(this.pos.sy),
            ex = Math.floor(this.pos.ex),
            ey = Math.floor(this.pos.ey),
            mp = this.map,
            w = this.width,
            h = this.height
        function dist(x, y, i) {
            var g = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2),
                h = Math.sqrt((x - ex) ** 2 + (y - ey) ** 2)
            return {
                f: g + h,
                g: g, // dist to Start
                h: h, // dist to End
                d: i, // direction
                0: x,
                1: y
            }
        }

        var m = Array(w * h), ms, bef = 0, // marked
            s = Array(w * h), sf, sa, sac, // selected
            n, a

        function set(i, x, y, at) {
            var a = x + y * w
            switch (at) {
                case 'm' : m [a] = i; break
                case 's' : s [a] = i; break
                case 'sa': sa[a] = i; break
            }
        }
        set([false, null], sx, sy, 'm')

        function around(x, y) {
            return [
                dist(x, y-1, 0),   //T
                dist(x+1, y-1, 1), //TR
                dist(x+1, y, 2),   //R
                dist(x+1, y+1, 3), //BR
                dist(x, y+1, 4),   //B
                dist(x-1, y+1, 5), //BL
                dist(x-1, y, 6),   //L
                dist(x-1, y-1, 7), //TL
            ]
        }
        function getMin(i, V, ind=0) {
            i = i.map(v => v[V])
            var a = Math.min.apply(0, i)
            return {v: a, i: i.indexOf(a)}
        }
        function checksur(x, y, ...f) {

            var a = x + y * w,
                b = !mp[x + y * w]
            return {
                a: Boolean(
                    f.reduce((b,v) => b && !v[a], true) && b &&
                    (x >= 0 & x < w & y >= 0 & y < h)
                ), w: !b
            }

        }
        function avoidthr(i) {

            if (thrCorners) return i
            if (i[0].w & i[2].w) i[1].a = false
            if (i[2].w & i[4].w) i[3].a = false
            if (i[4].w & i[6].w) i[5].a = false
            if (i[6].w & i[0].w) i[7].a = false
            return i

        }
        function H(v) {
            return Math.sqrt((v % w - ex) ** 2 + (Math.floor(v / w) - ey) ** 2)
        }
        function length(i) {
            return i.filter(v=>v).length
        }

        var i=0, j
        while (m[ex + ey * w] == undefined & i < max) {

            bef = length(m)

            sa = Array(w * h);
            ms = m.map((v,i) => v.concat(i)).filter(v=>v)
            .sort((a, b) => H(a[2]) - H(b[2]))

            ms.forEach((v,j) => {
                
                if (!v) return
                if (v[0]) return
                m[v[2]][0] = true

                var a = around(v[2] % w, Math.floor(v[2] / w))
                avoidthr(a.map(v => checksur(v[0], v[1], s, sa, m)))
                .forEach((v,i) => {
                    if (v.a) set(a[i], a[i][0], a[i][1], 'sa')
                })

            })
            
            sac = [...new Set(sa)]
            if (sac.length == 1 & !sac[0]) sa = s // check if path gets stuck
            n = Math.min.apply(0, sa.filter(v => v != undefined).map(v => v.f))
            sf = sa.map(v => {
                if (v == null) return
                var a = around(v[0], v[1])
                a = a.reduce((b,v) => (
                    b | !checksur(v[0], v[1], m, s).a
                ), false) 
                return a && v.f <= n ? v : undefined
            })
            sf.forEach(v => {
                if (!v) return
                set([false, v.d], v[0], v[1], 'm')
            })
            for (j = 0; j < s.length; j++) {
                if (sa[j]) s[j] ||= sa[j]
                if (m[j]) s[j] = null
            }
            // using .map doesn't work due to the method ignoring undeclared indexes

            if (length(m) == bef) {
                throw RangeError('[ASPF] Start and end points are disconnected')
            }

        i++}

        var p = [], x = ex, y = ey, d
        p.unshift(d)
        while (x != sx | y != sy) {

            d = m[x + y * w][1],x + y * w
            switch (d) {

                case 0: y++; break
                case 1: x--, y++; break
                case 2: x--; break
                case 3: x--, y--; break
                case 4: y--; break
                case 5: x++, y--; break
                case 6: x++; break
                case 7: x++, y++; break

            }
            p.unshift(d)

        }

        if (setout) this.status = 'complete'
        var o = new ASPFOutput
        o.path = p
        o.marks = m
        o.dirs = s
        o.iter = i
        o.length = p.length
        o.parent = this
        return setout ? this.output = o : o

    }
    get [Symbol.toStringTag]() {
        return 'ASPathFinder';
    }

}

class ASPFOutput {

    /**
     * @description Shortest path result from the algorithm. The numbers in the array are angles from 0 to 7.
     * @type number[]
     */
    path = [0]
    marks = [[false,0]]
    dirs = [{0:0,1:0,d:0,f:0,g:0,h:0}]
    iter = 0
    length = 0
    parent = new ASPathFinder

    /**
     * @description Converts path outputs into XY positions.
     * @returns {{x:number,y:number}[]}
     */
    getPathPos() {

        var x = this.parent.pos.sx,
            y = this.parent.pos.sy,
            i = this.path,
            o = []

        o.push({x: x, y: y})
        i.forEach((v,I) => {

            switch (v) {
                case 0: y--; break
                case 1: x++, y--; break
                case 2: x++; break
                case 3: x++, y++; break
                case 4: y++; break
                case 5: x--, y++; break
                case 6: x--; break
                case 7: y--, y--; break
            }
            if (I < i.length - 1) o.push({x: x, y: y})

        })
        return o

    }
    
    /**
     * @description Removes diagonal motion from the path.
     * @param {boolean} set Specifies if the output modifies the object.
     * @returns {number[]}
     */
    seamless(set=true) {
 
        var m = this.parent.map, w = this.parent.width
        function wall(i, x=0, y=0) {
            return m[i.x + x + (i.y + y) * w]
        }

        var o = [],
            I = this.path, d,
            p = this.getPathPos(), px, a, b, c

        for (var i = 0; i < I.length; i) {

            px = p[i]
            d = I[i]
            a = true, b = false

            // Avoid < or > shaped path
            while (!b) {

                b = true
                        if (((d==7&I[i+1]==1) | (d==1&I[i+1]==7)) & !wall(px, 0, -1)) o = o.concat([0, 0]), i += 2, b = false, a = false
                else if (((d==1&I[i+1]==3) | (d==3&I[i+1]==1)) & !wall(px, 1,   )) o = o.concat([2, 2]), i += 2, b = false, a = false
                else if (((d==3&I[i+1]==5) | (d==5&I[i+1]==3)) & !wall(px, 0,  1)) o = o.concat([4, 4]), i += 2, b = false, a = false
                else if (((d==5&I[i+1]==7) | (d==7&I[i+1]==5)) & !wall(px, -1   )) o = o.concat([6, 6]), i += 2, b = false, a = false
                d = I[i], px = p[i]

            }
            // Avoid / or \ shaped path
                    if (d == 1) o = o.concat(wall(px, 0, -1) ? [2, 0] : [0, 2]), i++, a = false
            else if (d == 3) o = o.concat(wall(px, 1    ) ? [4, 2] : [2, 4]), i++, a = false
            else if (d == 5) o = o.concat(wall(px, 0,  1) ? [6, 4] : [4, 6]), i++, a = false
            else if (d == 7) o = o.concat(wall(px, -1   ) ? [0, 6] : [6, 0]), i++, a = false

            if (a) o.push(d), i++

        }

        if (set) {
            this.path = o
            this.length = o.length
        }
        return o

    }
    get [Symbol.toStringTag]() {
        return 'ASPFOutput';
    }

}

window.ASPathFinder = ASPathFinder
window.ASPFOutput = ASPFOutput