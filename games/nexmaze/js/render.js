function render() {
    
    const befTime = Date.now()
    
    const empty = ()=>Array(game.can.width)

    let w = game.map.w, h = game.map.h,
        ctx = game.ctx, b = empty(), cw = game.can.width, ch = game.can.height,
        chh = game.can.height / 360 * config.height

    const widesc = $('resolution').value[0] == 'w'

    if (game.paused) {

        ctx.putImageData(config.pauseImg, 0, 0)
        ctx.fillStyle = '#000a'
        ctx.fillRect(0, 0, cw, ch)
        ctx.fillStyle = 'white'
        ctx.font = `${ch / 15}px Nexa-Bold`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('PAUSED', cw / 2, ch / 6)

        const a = cw / 8

        const mx = game.mx, my = game.my
        const button = [
            mx >= cw / 2 - a & my >= ch * .4 &
            mx < cw / 2 + a & my < ch * .4 + a / 2,
            
            mx >= cw / 2 - a & my >= ch * .7 &
            mx < cw / 2 + a & my < ch * .7 + a / 2,
        ]

        ctx.fillStyle = button[0] ? '#123' : 'black'
        ctx.fillRect(cw / 2 - a, ch * .4, a * 2, a / 2)
        ctx.fillStyle = 'white'
        ctx.fillText('Settings', cw / 2, ch * .45)

        ctx.fillStyle = button[1] ? '#123' : 'black'
        ctx.fillRect(cw / 2 - a, ch * .7, a * 2, a / 2)
        ctx.fillStyle = 'white'
        ctx.fillText('Resume', cw / 2, ch * .75)

        if (game.ht) {
            switch (button.indexOf(1)) {
                case 0:
                    game.can.style.display = 'none'
                    $('settings').style.display = ''

                break; case 1:
                    game.paused = false
                    resumeAudio()
            }
        }

        return

    }


    if (game.screen > 0) {

        if (game.screen == 1) {
            function comp() {
                ctx.globalCompositeOperation = ['multiply','add','difference','color','color-burn','hard-light,','exclusion','screen','saturation','overlay']
                    .at(r() * 10)
            }
            const r = Math.random

            if (config.glitching) {
                // sorry it's a little messy it's :disguised_face: :face_holding_back_tears:
                ctx.fillStyle = `rgb(${[r()*255,r()*255,r()*255]})`
                ctx.fillRect(0, 0, cw, ch)
                for (let i = 0; i < 2; i++) {
                    comp()
                    ctx.font = `${r()*360}px monospace`
                    ctx.textAlign = ['center','start','end'].at(r()*3)
                    ctx.textBaseline = ['top','middle','ideographic','hanging','bottom','alphabetic'].at(r()*6)
                    ctx.fillStyle = `rgb(${[r()*255,r()*255,r()*255]})`
                    let a = ''
                    for (let j = 0; j < 5; j++)
                        a += String.fromCharCode(r()*65536)
                    ctx.fillText(a, cw / 2 + r() * 64 - 32, ch / 2 + r() * 64 - 32)
                    died()
                }

                for (let i = 0; i < 3; i++) {
                    comp()
                    ctx.drawImage(config.img.static, r() * 256, r() * 256, r() * 256, r() * 256, 0, 0, cw, ch)
                }
                
            } else {
                ctx.fillStyle = '#345'
                ctx.fillRect(0, 0, cw, ch)
                ctx.fillStyle = 'white'
                ctx.font = '48px monospace'
                ctx.textAlign = 'center'
                ctx.fillText(game.level == 7
                    ? 'You win!'
                    : `Level ${game.level + 1} Completed...`
                , cw / 2, ch / 2)
            }

        } else if (game.screen == 2) {

            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, cw, ch)

        }
        
    return}

    game.hx = null
    game.hy = null
    game.hs = null

    let ccol = [.447, .5372, .6117], fcol = [.1294, .4392, .2745], // ceiling and floor colors
        p, rx, ry, rs,
        // light attributes
        lx, ly, ld, ls = 0, set, thr, m,
        abs = false,
        step = 1/160, col, wallcol, a, refls, I,
        e = game.ent, es, esb = [], ey, ec, ei, ent, er = empty().fill().map(v => []), edid = Array(e.length), tr = empty(),
        lpbx, lpby, lpbs, bl, hx, hy, hs, blx, bly, //previous light position, hover tile
        red = []

    if (game.level == 8) {
        ccol = [0.6224, 0.6794, 0.7308]
        fcol = [0.4059, 0.5186, 0.5618]
    }
    
    ctx.willReadFrequently = true
    ctx.lineWidth = 2
    ctx.fillStyle = `rgb(${ccol[0] * 255}, ${ccol[1] * 255 * Math.min(1 / game.red, 1)}, ${ccol[2] * 255 * Math.min(1 / game.red, 1)})`
    ctx.fillRect(0, 0, cw, ch / 2)
    ctx.fillStyle = `rgb(${fcol[0] * 255}, ${fcol[1] * 255 * Math.min(1 / game.red, 1)}, ${fcol[2] * 255 * Math.min(1 / game.red, 1)})`
    ctx.fillRect(0, ch / 2, cw, ch / 2)

    /**
     * Detect which axis light has hit.
     * @returns number
     */
    function detectSide() {

        let x = blx % 1,
            y = bly % 1,
            s = x + y >= 1,
            b = x > y ^ 1 - x > y

        return b + s * 2

        // true  return s ? 1 : 3
        // false return s ? 0 : 2

    }
    function setHover(bef) {

        if (hx != undefined || refls) return
        hx = bef ? blx : lx
        hy = bef ? bly : ly
        hs = ls
        
    }
    function filter() {

        try {
            let c = game.map.attr[game.map.at[conv(blx, bly)]]
            c = c.color.map(v => v * c.brightness)
            if (''+c != '255,255,255') {
                col = col.map((v,i) => v * (c[i] / 255))
                set.push(col.concat(ls))
            }
        } catch {}

    }
    const f = Math.floor
    
    /**
     * Lock the light position at any tile border (tile selection is auto)
     * @param {number} lpbx Previous X
     * @param {number} lpby Previous Y
     * @param {number} lx Current X
     * @param {number} ly Current Y
     * @returns {{x:number,y:number}}
     */

    for (let x = 0; x < cw; x++) {
        //if (x%5==0 & aa==true) debugger

        set = []
        col = [255, 255, 255] // starting color
        wallcol = [255, 267, 278]
        abs = false, lx = game.x, ly = game.y, ls = 0
        ld = -(x / (cw - 1) - .5) * Math.PI * config.width / (widesc ? 1 : 4/3) + game.dir // Starting light direction
        if (game.k.SP) ld += Math.PI
        refls = 0, ps = 0
        I = 0, p2 = 0, p = 0
        es = [], ey = Array(e.length), ec = 0, ei = [], esb=[], ent = false, eii = [], edid = []
        lpbs = ls, lpbx = lx, lpby = ly

        if (game.map.t[conv(lx, ly)] == 3) {
            c = game.map.attr[game.map.at[conv(lx, ly)]].color
            if (''+c != '255,255,255') {
                col = col.map((v,i) => v * (c[i] / 255))
                set.push(col.concat(0.01))
            }
            thr = true
        } else thr = false

        while (!abs & I < config.renderDist & ls < game.lightMax) {

            m = config.lightSpeed

            lx += Math.sin(ld) * m
            ly += Math.cos(ld) * m
            ls += m

            /*ei = e.findIndex((v,i) => {
                let d = exMath.rotate(v.ent.dir, lx - v.ent.x, ly - v.ent.y)
                esb[i] = es[i]
                es[i] = Math.sign(d.x)
                ey[i] = d.y
                return es[i] != esb[i]
            })
            _test2 = ei;

            if (smth) step2 = Math.min(step2 * 1.022, 0.1)
            p = ei > -1 & I > 0 & (Math.abs(ey[ei]) < 0.2 | ec == 1) ? (ec++, -1) : p != -1 ? game.map.t[conv(lx, ly)] || 0 : -1
            if (edid) {
                if (p == -1) p = 0
                else edid = false
            }
            if (!p & thr) thr = false
            if (p && smth & !(thr & collide.includes(p)) & p2 == 0) p2 = 1
            if ((p == 0 | (collide.includes(p) & thr & I > 0) | (ei > -1 & ec == 2)) && p2 == 1) {
                p2 = 2
                m = step2 * step
                lx += Math.sin(ld) * m
                ly += Math.cos(ld) * m
                ls += m
                if (p != -1) p = game.map.t[conv(lx, ly)] || 0
            }*/

            e.forEach((v,i) => {

                if (edid[i]) return
                const a = exMath.lineBorderLock(lpbx, lpby, lx, ly, v.ent.x, v.ent.y, -v.ent.dir, true, lpbs)
                if (Math.abs(a.pos) < config.entWidth / 2 & a.cross) {
                    lx = a.x
                    ly = a.y
                    ls = a.s

                    er[x][e.length - i - 1] = {
                        dist: ls,   // Distance
                        pos:  (a.pos + config.entWidth / 2), // X position for draw
                        ent:  v,  // Entity object
                        x,
                        type: 'entity'
                    }
                    thr = true
                    edid[i] = true

                }

            })

            p = game.map.t[conv(lx, ly)]
            if (p == 0) thr = false

            if (config.debugger) {
                debugLight(lx, ly, lpbx, lpby)
                debugger
            }

            if (aa & x == Math.floor(cw / 2)) debugger
            if (game.map.items.find(v => 
                conv(lx, ly) == conv(v.x, v.y) & !v.collected
            ) && x == Math.floor(cw / 2)) setHover()

            if (p) {
                if ([3, 5].includes(p) ? !thr : true) {
                    bl = exMath.borderLock(lpbx, lpby, lx, ly, lpbs, ls)
                    lx = bl.x
                    ly = bl.y
                    ls = bl.s
                    blx = lx + Math.sin(ld) * .01
                    bly = ly + Math.cos(ld) * .01
                }

                switch (p) { // collision
                    case 1: abs = true; break
                    case 2:
    
                        if (refls >= 64) abs = true
                        else {

                            rx = lx % 1
                            ry = ly % 1
                            rs = rx + ry >= 1 ? 1 : -1
                            if (rx > ry ^ 1 - rx > ry) { // horizontal reflect

                               ld = game.map.t[conv(lx + rs, ly)] == 1 // detect neighbor mirror to avoid light going through
                               ? Math.PI - (ld % (Math.PI * 2))
                               : Math.PI - (ld % (Math.PI * 2)) + Math.PI

                            } else { // vertical reflect

                                ld = game.map.t[conv(lx, ly + rs)] == 1
                                ? Math.PI - (ld % (Math.PI * 2)) + Math.PI
                                : Math.PI - (ld % (Math.PI * 2))

                            }
                            refls++

                            filter()
                        }
    
                    break; case 3:
    
                        if (!thr) {
                            filter()
                            thr = true
                        }

                    break; case 4:

                        abs = true
                        if (!I) break // Detect if hit in first iteration

                        let a, t = conv(
                            blx,
                            bly
                        ), b = detectSide()  //(a-2)/(a-b)
                        /*switch (b) {

                            case 0:
                                a = (lpby - Math.floor(lpby)) / (lpby - ly) // Get x from A to B
                                ly = Math.floor(lpby)
                                lx = lx * a + lpbx * (1 - a)
                                ls = ls * a + lpbs * (1 - a)

                            break; case 1:
                                a = (lpbx - Math.floor(lpbx)) / (lpbx - lx) // Get x from A to B
                                lx = Math.floor(lpbx)
                                ly = ly * a + lpby * (1 - a)
                                ls = ls * a + lpbs * (1 - a)
                                
                        }*/
                        if (!game.map.tx[t]) break
                        tr[x] = {
                            dist: ls,
                            pos:  b % 2 == 0 ? lx % 1 : ly % 1,
                            txtr: game.map.tx[t],
                            face: ['north','east','south','west'][b],
                            x,
                            type: 'texture'
                        }
                        _test2 = b
                        if (b == 1 | b == 2) tr[x].pos = 1 - tr[x].pos

                        if (x == Math.floor(cw / 2)) setHover(true)

                    break; case 5:
    
                        if (!thr) {
                            filter()
                            thr = true
                        }

                    break
                }
                p2 = 0
            }
            if (lx >= w + 10 | lx < -10 | ly >= h + 10 | ly < -10) { // check if light is outside map
                abs = true
                ls = Infinity
            }

            I++
            [lpbx, lpby, lpbs] = [lx, ly, ls]
        }
        
        if (ls >= game.lightMax) {
            abs = 1
            wallcol = [0, 0, 0]
        }

        red[x] = Math.min(ls / 16 * game.red, 1)
        b[x] = col.map((v,i) => v / 255 * (1 / ls ** .7 * 200) / 255 * wallcol[i])
        set.forEach((v,i) => {
            ctx.lineWidth = 2
            var w = v
            w = v.map((w,i) => w * (i == 3 ? 1 : fcol[i]))
            ctx.strokeStyle = `rgb(${w[0]},${w[1]*(1-red[i])},${w[2]*(1-red[i])})`
            ctx.beginPath()
            ctx.moveTo(x,  1 / w[3] * chh + ch / 2)
            ctx.lineTo(x, ch / 2)
            ctx.stroke()
            w = v.map((w,i) => w * (i == 3 ? 1 : ccol[i]))
            ctx.strokeStyle = `rgb(${w[0]},${w[1]*(1-red[i])},${w[2]*(1-red[i])})`
            ctx.beginPath()
            ctx.moveTo(x, ch / 2)
            ctx.lineTo(x, -1 / w[3] * chh + ch / 2)
            ctx.stroke()
            ctx.closePath()
        })
        ctx.closePath()

        ctx.strokeStyle = `rgb(${b[x][0]},${b[x][1]*(1-red[x])},${b[x][2]*(1-red[x])})`
        ctx.beginPath()
        ctx.moveTo(x,  1 / ls * chh + ch / 2)
        ctx.lineTo(x, -1 / ls * chh + ch / 2)
        ctx.stroke()
        ctx.closePath()

    }
    
    const id = ctx.getImageData(0, 0, cw, game.can.height)

    // Entity rendering

    function textures(v) {
        if (aa) debugger

        const mn = -1 / v.dist * chh + ch / 2,
                mx = 1 / v.dist * chh + ch / 2,
                mnL = Math.max(mn, 0)
                mxL = Math.min(mx, game.can.height)
                
        let c, i2, alp, br

        let j

        for (let i = Math.floor(mnL); i < mxL; i++) {

            i2 = (i - mn) / (mx - mn)
            c = v.type == 'entity' ? v.ent.getPixel(1 - v.pos, i2) : v.txtr.getPixel(v.face ?? 'south', 1 - v.pos, i2)
            br = i => v.type == 'entity' ? Math.min(1 / v.dist * 480, 256) : b[v.x][i]
            
            j = pxid(id, v.x, i)
            alp = c[3] / 256
            id.data[j    ] = (c[0] / 256  * br(0)) * alp + id.data[j    ] * (1 - alp)
            id.data[j + 1] = ((c[1] / 256 * br(1)) * alp + id.data[j + 1] * (1 - alp)) * (1-red[v.x])
            id.data[j + 2] = ((c[2] / 256 * br(2)) * alp + id.data[j + 2] * (1 - alp)) * (1-red[v.x])

        }
    }
    tr.concat(er).forEach(v => {
        if (Array.isArray(v)) v.forEach(textures)
        else textures(v)
    })
    
    ctx.putImageData(id, 0, 0)
    
    imageRender(ctx,cw)

    if (!config.renderGUI) return

    ctx.textAlign = 'start'
    ctx.textBaseline = 'middle'
    ctx.font = '32px Nexa-Bold'
    ctx.fillStyle = 'red'

    if (config.showMap) {
        
        const mapsize = config.mapSize
        var x, y
        const mw = game.map.w,
              mh = game.map.h
        for (let i = 0; i < mw * mh; i++) {
    
            x = i % mw
            y = Math.floor(i / mw)
            p = '#' + ['FFF','000','00F','0F0','F00','FF0','F08'][game.map.t[i]]
            ctx.fillStyle = p
            ctx.fillRect(x * mapsize, y * mapsize, mapsize, mapsize)
    
        }
        ctx.fillStyle = '#0FF7'
        ctx.fillRect(
            game.x * mapsize + (game.hitW * -mapsize/2),
            game.y * mapsize + (game.hitH * -mapsize/2),
            mapsize * game.hitW,
            mapsize * game.hitH
        )
        ctx.fillStyle = '#F0F7'
        /*
        const po = new Image
        po.src = 'pointer.png'
        */
        game.ent.forEach(v => {
            ctx.fillRect(
                v.ent.x * mapsize - mapsize/4,
                v.ent.y * mapsize - mapsize/4,
                mapsize/2,
                mapsize/2
            )
        })

    } 
    /*ctx.save()
    ctx.translate(Math.floor(game.x) * mapsize/2 + 2, Math.floor(game.y) * mapsize/2 + 2)
    ctx.rotate(-game.dir - Math.PI)
    ctx.drawImage(po, -6.75, -24, 13.5, 27.5)
    ctx.restore()
    
    ctx.fillText(`A: (${Math.round(game.dir * (180 / Math.PI))}) ${game.dir}`, 144, 40)
    ctx.fillText(`X: (${Math.floor(game.x)}<=${Math.ceil(game.x)}) ${game.x}`, 144, 75)
    ctx.fillText(`Y: (${Math.floor(game.y)}<=${Math.ceil(game.y)}) ${game.y}`, 144, 110)*/

    ctx.fillStyle = '#000'
    ctx.fillRect(4, ch - 48, 248, 44)
    ctx.fillStyle = '#e0162e'
    ctx.fillRect(8, ch - 44, 240, 36)
    ctx.fillStyle = '#32e358'
    ctx.fillRect(8, ch - 44, 240 * Math.min(game.stamina, 1), 36)

    ctx.fillStyle = '#000'
    ctx.font = '24px Nexa-Bold'
    ctx.fillText(`${game.orbs}/${game.maxOrbs} Orbs`, 8, ch - 55)

    ctx.fillStyle = '#0F0'
    ctx.textBaseline = 'top'
    ctx.fillText(`Level ${game.level + 1}: ${game.levelName}`, 8, 8)

    if (game.airbox) {
        ctx.drawImage(config.img.airboxIcon, cw - 96, 8, 32, 32)
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'left'
        ctx.fillStyle = 'black'
        ctx.font = '32px Nexa-Bold'
        ctx.fillText('x' + game.airbox, cw - 60, 28)
    }
    
    let near = Math.min.apply(null, game.ent.map(v => exMath.distance(
        game.x - v.ent.x,
        game.y - v.ent.y
    )))
    
    if (game.level != 8) {

        ctx.fillStyle = '#0008'
        ctx.fillRect(256, ch - 26, 256, 24)
        ctx.fillStyle = '#00f'
        ctx.fillRect(256, ch - 26, Math.min(262 - near * 5, 256), 24)
        ctx.fillStyle = '#0005'
        ctx.font = 'bold 24px monospace'
        ctx.textBaseline = 'middle'
        ctx.fillText('NEAREST NEXTBOT', 264, ch - 12)

    }

    if (game.orbs >= game.maxOrbs && game.maxLocks) {

        near = Math.min.apply(null, game.map.f.map((v, i) => 
            game.map.tx[i].status ? Infinity :
            !v ^ game.locks >= game.maxLocks ? exMath.distance(
                game.x - (i % game.map.w + .5),
                game.y - (Math.floor(i / game.map.w) + .5)
            ) : undefined
        ).filter(v => isFinite(v)))

        ctx.fillStyle = '#0008'
        ctx.fillRect(256, ch - 50, 256, 24)
        ctx.fillStyle = '#f00'
        ctx.fillRect(256, ch - 50, Math.min(262 - near * 5, 256), 24)
        ctx.fillStyle = '#0005'
        ctx.font = 'bold 24px monospace'
        ctx.textBaseline = 'middle'
        ctx.fillText('NEAREST LOCK', 264, ch - 36)

    }

    game.hx = hx
    game.hy = hy
    game.hs = hs

    if (hx && hs < 1) ctx.drawImage(config.img.cursor, cw / 2 - 16, ch / 2 - 16)

    if (config.showFPS) {
        const max = $('unlfps').checked ? Infinity : $('maxfps').value
        ctx.fillStyle = '#00ff00'
        ctx.font = 'bold 32px monospace'
        ctx.textAlign = 'end'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(Math.min(1e3 / (Date.now() - befTime), max).toFixed(2), cw - 4, ch - 4)
    }

}

function imageRender(ctx,cw) {

    const widesc = $('resolution').value[0] == 'w'
    const a = []
    game.map.orbs.concat(game.map.items, game.wind).forEach(v => {

        if (v.collected) return
        
        let img, siz, offs = .5
        switch (v.constructor) {
            case Orb:
                img = config.img.orb
                siz = 1
            break; case Airbox:
                img = config.img.airbox
                siz = .4
            break; case Object:
                img = config.img.wind
                siz = 1
                offs = 0
            break
        }

        const a = exMath.angle(v.x + offs, game.x, v.y + offs, game.y) + game.k.SP * Math.PI,
              s = game.can.height / 1.5 / exMath.distance(game.x - v.x - offs, game.y - v.y - offs),

              x = (exMath.degmod(a - game.dir) / (config.width / (widesc ? 1 : 4/3)) / -Math.PI + .5) * (cw - 1),
              y = game.can.height / 2 - s / 2 * siz

        ctx.drawImage(img, x - s / 2 * siz, y, s * siz, s * siz)

    })
}

function debugLight(lx,ly,lxb,lyb) { // USE ONLY IN DEBUGGER MODE

    const ctx = game.ctx

    const mapsize = 16
    var x, y
    const mw = game.map.w,
        mh = game.map.h
    let p
    for (let i = 0; i < mw * mh; i++) {

        x = i % mw
        y = Math.floor(i / mw)
        p = '#' + ['FFF','000','00F','0F0','F00','FF0','F08'][game.map.t[i]]
        ctx.fillStyle = p
        ctx.fillRect(x * mapsize, y * mapsize, mapsize, mapsize)

    }
    ctx.fillStyle = '#0FF7'
    ctx.fillRect(
        game.x * mapsize + (game.hitW * -mapsize/2),
        game.y * mapsize + (game.hitH * -mapsize/2),
        mapsize * game.hitW,
        mapsize * game.hitH
    )
    ctx.fillStyle = '#F0F7'
    /*
    const po = new Image
    po.src = 'pointer.png'
    */
    game.ent.forEach(v => {
        ctx.fillRect(
            v.ent.x * mapsize - mapsize/4,
            v.ent.y * mapsize - mapsize/4,
            mapsize/2,
            mapsize/2
        )
    })

    ctx.fillStyle = '#00F'
    ctx.fillRect(
        lx * mapsize - mapsize/10,
        ly * mapsize - mapsize/10,
        mapsize/5,
        mapsize/5
    )
    ctx.fillStyle = '#04F'
    ctx.fillRect(
        lxb * mapsize - mapsize/10,
        lyb * mapsize - mapsize/10,
        mapsize/5,
        mapsize/5
    )

}