exMath = {

    /**
     * Returns distance from a point to center.
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    distance(x, y) {
        return Math.sqrt(x ** 2 + y ** 2)
    },
    /**
     * Returns angle between 2 points.
     * @param {number} x1 X of first point
     * @param {number} y1 Y of first point
     * @param {number} x2 X of second point
     * @param {number} y2 Y of second point
     * @returns {number}
     */
    angle(x1, x2, y1, y2) {
        return Math.atan2(x1 - x2, y1 - y2)
    },
    /**
     * Goes forwards a step at an angle.
     * @param {number} d Step length (distance)
     * @param {number} a Angle
     * @param {number} x X of starting point 
     * @param {number} y Y of starting point 
     * @returns {{x:number,y:number}}
     */
    step(a, d=1, x=0, y=0) {
        return {
            x: Math.cos(a) * d + x,
            y: Math.sin(a) * d + y
        }
    },
    /**
     * Rotates a point around origin.
     * @param {number} ang Angle
     * @param {number} x X of point
     * @param {number} y Y of point
     * @param {number} X X of origin
     * @param {number} Y Y of origin
     * @returns {{x:number,y:number}}
     */
    rotate(ang, x, y, X=0, Y=0) {
        const a = this.step(this.angle(x, X, y, Y) + ang, this.distance(X - x, Y - y))
        a.x += X
        a.y += Y
        return a
    },
    loopdir(dir = 0) {
        return (dir + Math.PI) % (Math.PI * 2) - Math.PI + (dir < -Math.PI ? Math.PI * 2 : 0)
    },
    /**
     * Limits angle value between -π and +π.
     * @param {number} ang Angle
     * @returns {number} Limited angle
     */
    degmod(ang) {
        const s = Math.sign(ang)
        ang = Math.abs(ang)
        return ((ang + Math.PI) % (Math.PI * 2) - Math.PI) * s
    },
    /**
     * Returns the progress of y between x and z.
     * @param {number} x Start
     * @param {number} y Point
     * @param {number} z End
     * @returns {number} Progress
     */
    progress(x, y, z) {return (y - x) / (z - x)},
    /**
     * Returns point of collision from a tile between point A and B.
     * @param {number} sx Start X
     * @param {number} sy Start Y
     * @param {number} ex End X
     * @param {number} ey End Y
     * @param {number} ss [Light steps]
     * @param {number} es [Light steps]
     * @returns {{x:number,y:number,s:number}}
     */
    borderLock(sx, sy, ex, ey, ss=0, es=0) { // Lock position at border

        let tx = ex - Math.floor(sx), // Tile offset
            ty = ey - Math.floor(sy),
            cx = tx > 0 ? 'floor' : 'ceil', // Side
            cy = ty > 0 ? 'floor' : 'ceil'
    
        let X = this.progress(ex, Math[cx](ex), sx)
        let Y = this.progress(ey, Math[cy](ey), sy)
        X = X >= 1 | X <= -1 ? 0 : X
        Y = Y >= 1 | Y <= -1 ? 0 : Y
    
        if (X < Y) { // Vertical
            sy = Math[cy](ey)
            sx = sx * Y + ex * (1 - Y)
            ss = ss * Y + es * (1 - Y)
            //ls = ls * Y + lpbs * (1 - Y)
    
        } else { // Horizontal
            sx = Math[cx](ex)
            sy = sy * X + ey * (1 - X)
            ss = ss * X + es * (1 - X)
            //ls = ls * X + lpbs * (1 - X)
    
        }
        return {x:sx,y:sy,s:ss}
    
    },
    /**
     * Returns point of collision from a line between point A and B.
     * @param {number} sx Start X @param {number} sy Start Y
     * @param {number} ex End X   @param {number} ey End Y
     * @param {number} lx Line X  @param {number} ly Line Y
     * @param {number} la Line angle
     * @param {boolean | undefined} includePos Specifies if output also includes the position where the point of collision is in the line.
     * @param {number} ss [Light steps]
     * @param {number} es [Light steps]
     * @returns {{x:number,y:number,pos?:number,cross:boolean}}
     */
    lineBorderLock(sx, sy, ex, ey, lx, ly, la, includePos = false, ss) {

        const d = this.distance
        const rl = this.rotate(-la, sx - lx, sy - ly),
              rlpb = this.rotate(-la, ex - lx, ey - ly)
              
        let oxp = this.progress(rlpb.y, 0, rl.y)
        let ox = rl.x * oxp + rlpb.x * (1 - oxp)
        const ro = this.rotate(-la, ox, 0)
        const out = {
            x: ro.x + lx,
            y: ro.y + ly,
            /**
             * Value is true when lines are intersecting.
             */
            cross: oxp <= 1 & oxp >= 0
        }
        out.s = ss + d(sx - out.x, sy - out.y)
        if (includePos) out.pos = ox
        return out
    
    }

}