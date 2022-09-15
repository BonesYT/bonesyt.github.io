function render() {

    let w = game.map.w, h = game.map.h,
        ccol = [.447, .5372, .6117], fcol = [.1294, .4392, .2745], // ceiling and floor colors
        ctx = game.ctx, b, cw = game.can.width, p, p2,
        rx, ry, rs,
        smth = $('smooth').checked,
        // light attributes
        lx, ly, ld, ls = 0, set, thr, m,
        abs = false,
        step = 1/160, step2, col, a, refls, I,
        e = game.ent, es, esb = [], ey, ei, ec, ent, entx
    
    ctx.lineWidth = 2
    ctx.fillStyle = '#72899C'
    ctx.fillRect(0, 0, 640, 180)
    ctx.fillStyle = '#217046'
    ctx.fillRect(0, 180, 640, 180)

    const log = (...i) => {if (x==0&game.k.S) console.log.apply(0,i)}

    for (var x = 0; x < cw; x++) {

        set = []
        col = [255, 255, 255] // starting color
        abs = false, lx = game.x, ly = game.y, ls = 0
        ld = (x / (cw - 1) - 0.5) * Math.PI * 2 / 3 + game.dir
        refls = 0, ps = 0, step2 = step * 3
        I = 0, p2 = 0, p = 0
        es = [], ey = [], ec = 0, ei = [], esb=[], ent = false

        if (game.map.t[conv(lx, ly)] == 3) {
            a = game.map.a[game.map.at[conv(lx, ly)]]
            if (a.filt.toString() != '255,255,255') {
                col = col.map((v,i) => v * (a.filt[i] / 255))
                set.push(col.concat(0.01))
            }
            thr = true
        } else thr = false

        while (!abs & I < 2048) {

            m = (smth ? step2 : step) * (p2 == 1 ? -step : 1)

            lx += Math.sin(ld) * m
            ly += Math.cos(ld) * m
            ls += m

            ei = e.findIndex((v,i) => {
                let d = trig.rotate(v.ent.dir, lx - v.ent.x, ly - v.ent.y)
                esb[i] = es[i]
                es[i] = Math.sign(d.x)
                ey[i] = d.y
                return es[i] != esb[i]
            })

            if (smth) step2 = Math.min(step2 * 1.022, 0.1)
            p = ei > -1 & I > 0 & (Math.abs(ey[ei]) < 0.2 | ec == 1) ? (ec++, 6) : p != 6 ? game.map.t[conv(lx, ly)] || 0 : 6
            if (!p & thr) thr = false
            if (p && smth & !(thr & p == 3) & p2 == 0) p2 = 1
            if ((p == 0 | (p == 3 & thr & I > 0) | (ei > -1 & ec == 2)) && p2 == 1) {
                p2 = 2
                m = step2 * step
                lx += Math.sin(ld) * m
                ly += Math.cos(ld) * m
                ls += m
                if (p != 6) p = game.map.t[conv(lx, ly)] || 0
            }

            if (smth & I > 0 ? p2 == 2 : p) {
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
                        }
    
                    break; case 3:
    
                        if (!thr) {
                            a = game.map.a[game.map.at[conv(lx, ly)]]
                            if (a.filt.toString() != '255,255,255') {
                                col = col.map((v,i) => v * (a.filt[i] / 255))
                                set.push(col.concat(ls))
                            }
                            thr = true
                        }
    
                    break
                    //...//
                    case 6:
    
                        abs = true
                        ent = true
                        entx = (ey[ei] + 0.2) * 2.5,
                        enti = e[ei]
    
                    break
                }
                p2 = 0
            }
            if (lx >= w + 10 | lx < -10 | ly >= h + 10 | ly < -10) { // check if light is outside map
                abs = true
                ls = Infinity
            }

            I++
        }

        b = col.map(v => v / 255 * (1 / ls * 180))
        set.forEach((v,i) => {
            ctx.lineWidth = 2
            var w = v
            w = v.map((w,i) => w * (i == 3 ? 1 : fcol[i]))
            ctx.strokeStyle = `rgb(${w[0]},${w[1]},${w[2]})`
            ctx.beginPath()
            ctx.moveTo(x,  1 / w[3] * 60 + 180)
            ctx.lineTo(x, 180)
            ctx.stroke()
            w = v.map((w,i) => w * (i == 3 ? 1 : ccol[i]))
            ctx.strokeStyle = `rgb(${w[0]},${w[1]},${w[2]})`
            ctx.beginPath()
            ctx.moveTo(x, 180)
            ctx.lineTo(x, -1 / w[3] * 60 + 180)
            ctx.stroke()
            ctx.closePath()
        })
        ctx.closePath()
        if (ent) {
            
            const mn = Math.max(-1 / ls * 60 + 180, 0),
                  mx = 1 / ls * 60 + 180,
                  mx2 = Math.min(mx, game.can.height)
                  
            let c, i2

            const a = ctx.getImageData(0, 0, cw, game.can.height)
            let i

            for (let i = Math.floor(mn); i < mx2; i++) {

                i2 = (i - mn) / (mx - mn)
                c = enti.getPixel(entx, i2)
                
                log(x,i,i2)
                i = pxid(a.data, x - 1, i)
                a.data[i    ] = c[0] / 255 * b[0]
                a.data[i + 1] = c[1] / 255 * b[1]
                a.data[i + 2] = c[2] / 255 * b[2]

            }

            ctx.putImageData(a, 0, 0)

        } else {

            ctx.strokeStyle = `rgb(${b[0]},${b[1]},${b[2]})`
            ctx.beginPath()
            ctx.moveTo(x,  1 / ls * 60 + 180)
            ctx.lineTo(x, -1 / ls * 60 + 180)
            ctx.stroke()
            ctx.closePath()

        }

    }

    ctx.font = '32px Nexa-Bold'
    ctx.fillStyle = 'red'

    var x, y
    const mw = game.map.w,
          mh = game.map.h
    for (let i = 0; i < mw * mh; i++) {

        x = i % mw
        y = Math.floor(i / mw)
        switch (game.map.t[i]) {
            case 0: p = '#FFF'; break
            case 1: p = '#000'; break
            case 2: p = '#00F'; break
            case 3: p = '#0F0'; break
            case 4: p = '#F00'; break
            case 5: p = '#FF0'; break
        }
        ctx.fillStyle = p
        ctx.fillRect(x * 7, y * 7, 7, 7)

    }
    ctx.fillStyle = '#0FF'
    ctx.fillRect(Math.floor(game.x) * 7, Math.floor(game.y) * 7, 7, 7)
    ctx.fillStyle = '#F0F'
    const po = new Image
    po.src = 'pointer.png'
    game.ent.forEach(v => {
        ctx.fillRect(Math.floor(v.ent.x) * 7, Math.floor(v.ent.y) * 7, 7, 7)
        ctx.save()
        ctx.translate(Math.floor(v.ent.x) * 7 + 3.5, Math.floor(v.ent.y) * 7 + 3.5)
        ctx.rotate(v.ent.dir)
        ctx.drawImage(po, -6.75, -24, 13.5, 27.5)
        ctx.restore()
    })
    ctx.save()
    ctx.translate(Math.floor(game.x) * 7 + 3.5, Math.floor(game.y) * 7 + 3.5)
    ctx.rotate(-game.dir - Math.PI)
    ctx.drawImage(po, -6.75, -24, 13.5, 27.5)
    ctx.restore()

    ctx.fillText(`A: (${Math.round(game.dir * (180 / Math.PI))}) ${game.dir}`, 144, 40)
    ctx.fillText(`X: (${Math.floor(game.x)}<=${Math.ceil(game.x)}) ${game.x}`, 144, 75)
    ctx.fillText(`Y: (${Math.floor(game.y)}<=${Math.ceil(game.y)}) ${game.y}`, 144, 110)

}