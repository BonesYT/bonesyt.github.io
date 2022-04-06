function $(e) {return document.getElementById(e)}

var p = {
    width: 16, //x
    height: 16, //y
    length: 16, //z
    area: 4096,
    map: [],
    order: [],
    order2: [],
    keys: {
        L:0,R:0,U:0,D:0,e:0,c:0,                        // left, right, up, down, e, c
        S:0,x:0,a:0,d:0,s:0,p:0,l:0,H:0,v:0,b:0,f:0,o:0 // space, x, a, d, s, p, l, sHift, v, b, f, o
    },
    keysp: {
        L:0,R:0,U:0,D:0,e:0,c:0, 
        S:0,x:0,a:0,d:0,s:0,p:0,l:0,H:0,v:0,b:0,f:0,o:0
    },
    sel: { // select
        x: 0,
        y: 0,
        z: 0,
        b: 1
    },
    canvas: $('display'),
    bn: ['Air','White','Cyan','Magenta','Blue','Yellow','Green','Red','Black'], // block names
    mode: 0, //0: editor, 1: 3d view
    tl: { // timelapse
        on: false,
        tick: 0
    },
    fill: {
        x1:-1,y1:-1,z1:-1,x2:-1,y2:-1,z2:-1,
        prog: -1,
        msg: 'none'
    }
}
p.ctx = p.canvas.getContext('2d')

for (var i = 0; i < p.area; i++) p.map.push(0)

function exist(x, y, z) {
    return p.order2.indexOf(`${x},${y},${z}`)
}

function tick() {

    Object.keys(p.keysp).forEach(v => {
        if (p.keysp[v]) p.keys[v]++
        else p.keys[v] = 0
    })

    if (p.mode) {

        p.ctx.fillStyle = '#ffffff'
        p.ctx.fillRect(0, 0, 512, 512)

        if (p.keys.v == 1) p.mode = 0

        if (p.keys.b == 1) p.tl.on = !p.tl.on
        if (p.tl.on) p.tl.tick++
            else p.tl.tick = 0
        if (p.tl.on & p.tl.tick == p.order.length) {
            p.tl.tick = 0,p.tl.on = 0
        }

        var w=p.width,h=p.height,l=p.length
        var W = 512 / Math.max(p.width, p.height, p.length) / 2
        var x, y, z, img = new Image, i, i2, X, Y
        img.src = 'textures.png'

        for(z=0;z<l;z++)for(y=h-1;y>=0;y--)for(x=0;x<w;x++) {

            i = z + (p.height - y - 1) * p.length + x * p.length * p.height
            i2 = i = z + y * p.length + x * p.length * p.height
            X = (x - z/2) * W + 196
            Y = (y + z/2) * W + 64

            if (p.tl.on ? exist(x,y,z) != -1 & exist(x,y,z) < p.tl.tick : p.map[i2] > 0) {
                p.ctx.drawImage(img, (p.map[i] - 1) * 384, 0,   256, 256, X,     Y,         W,       W)
                p.ctx.drawImage(img, (p.map[i] - 1) * 384, 256, 384, 128, X,     Y - W / 2, W * 1.5, W / 2)
                p.ctx.drawImage(img, (p.map[i] - 1) * 384, 384, 128, 384, X + W, Y - W / 2, W / 2,   W * 1.5)
            }

        }

    } else {

        if (p.keys.s == 1 & !p.keys.H) {
            var W = Math.floor(prompt('Enter new width value (Leave blank to not change)') || p.width)
            var H = Math.floor(prompt('Enter new height value (Leave blank to not change)') || p.height)
            var L = Math.floor(prompt('Enter new length value (Leave blank to not change)') || p.length)
            var A = W * H * L
            if (A > 2 ** 20 | A < 8) {
                alert('Error: Area is too large or small, volume range is from 8 to 1,048,576.')
            } else if (confirm(`New area is ${A} blocks in total. Would you like to confirm? (All unsaved changes will be discarded.)`)) {
                p.width = W
                p.height = H
                p.length = L
                p.area = A
    
                for (var i = 0; i < A; i++) map.push(0)
                p.order = [],p.order2 = []
            }
    
            p.keys.s=0,p.keysp.s=0
        }
    
        if (p.keys.o == 1) { // save
            var save = {
                width: p.width,
                height: p.height,
                length: p.length,
                map: p.map,
                x: p.sel.x,
                y: p.sel.y,
                z: p.sel.z,
                block: p.sel.b,
                version: '1',
                order: p.order,
                since: Date.now()
            }
            $('saveOutput').value = btoa(JSON.stringify(save))
        } if (p.keys.l == 1) { // load
            try {
                var load = prompt('Enter the save code in the box and press OK.')
                if (load) {
                    load = JSON.parse(atob(load))
                    p.width = load.width
                    p.height = load.height
                    p.length = load.length
                    p.map = load.map
                    p.sel.x = load.x
                    p.sel.y = load.y
                    p.sel.z = load.z
                    p.sel.b = load.block || 1
                    p.order = load.order || []
                    p.since = load.since || Date.now()
                    p.order2 = load.order.map(v=>v.toString())
                } else {}
            } catch (e) {
    
            }
        }
    
        var i = p.sel.z + p.sel.y * p.length + p.sel.x * p.length * p.height
    
        if (p.keys.L == 1 | p.keys.L & p.keys.p) {   // go left
            if (p.sel.x > 0) p.sel.x--
        } if (p.keys.R == 1 | p.keys.R & p.keys.p) { // go right
            if (p.sel.x < p.width - 1) p.sel.x++
        } if (p.keys.U == 1 | p.keys.U & p.keys.p) { // go front
            if (p.sel.z > 0) p.sel.z--
        } if (p.keys.D == 1 | p.keys.D & p.keys.p) { // go back
            if (p.sel.z < p.height - 1) p.sel.z++
        } if (p.keys.c == 1 | p.keys.c & p.keys.p) { // go down
            if (p.sel.y > 0) p.sel.y--
        } if (p.keys.e == 1 | p.keys.e & p.keys.p) { // go up
            if (p.sel.y < p.length - 1) p.sel.y++
        }
        if (p.keys.a == 1 & p.sel.b > 1) p.sel.b--
        if (p.keys.d == 1 & p.sel.b < p.bn.length - 1) p.sel.b++
    
        if (p.keys.S) {
            if (p.fill.prog == -1) {
                if (exist(p.sel.x, p.sel.y, p.sel.z) == -1) {
                    p.order.push([p.sel.x, p.sel.y, p.sel.z])
                    p.order2.push(`${p.sel.x},${p.sel.y},${p.sel.z}`)
                }
                p.map[i] = p.sel.b
            } else if (p.keys.S == 1) {
                switch (p.fill.prog) {
                    case 0:
                        p.fill.x1 = p.sel.x
                        p.fill.y1 = p.sel.y
                        p.fill.z1 = p.sel.z
                        p.fill.msg = 'Place point 2 (to)'
                        p.fill.prog++
                    break; case 1:
                        p.fill.x2 = p.sel.x
                        p.fill.y2 = p.sel.y
                        p.fill.z2 = p.sel.z
                        p.fill.msg = 'none'
                        p.fill.prog = -1

                        // switch vars if pos1 > pos2
                        if (p.fill.x1 > p.fill.x2) [p.fill.x1,p.fill.x2]=[p.fill.x2,p.fill.x1]
                        if (p.fill.y1 > p.fill.y2) [p.fill.y1,p.fill.y2]=[p.fill.y2,p.fill.y1]
                        if (p.fill.z1 > p.fill.z2) [p.fill.z1,p.fill.z2]=[p.fill.z2,p.fill.z1]

                        for(var x = p.fill.x1; x <= p.fill.x2; x++){
                        for(var y = p.fill.y1; y <= p.fill.y2; y++){
                        for(var z = p.fill.z1; z <= p.fill.z2; z++){
                            if (exist(x,y,z) == -1) {
                                p.order.push([x,y,z])
                                p.order2.push(`${x},${y},${z}`)
                            }
                            p.map[z + y * p.length + x * p.length * p.height] = p.sel.b
                        }}}
                    break
                }
            }
        } if (p.keys.x) {
            p.map[i] = 0
            var A = p.order2.indexOf(`${p.sel.x},${p.sel.y},${p.sel.z}`)
            if (A != -1) {
                p.order.splice(A, 1)
                p.order2.splice(A, 1)
            }
        }

        if (p.keys.v == 1) p.mode = 1

        if (p.keys.f == 1) {
            if (p.fill.prog == -1) {
                p.fill.prog = 0;p.fill.msg = 'Place point 1 (from)'
                p.fill.x1=-1,p.fill.y1=-1,p.fill.z1=-1,p.fill.x2=-1,p.fill.y1=-2,p.fill.z2=-1
            } else {
                p.fill.prog = -1
                p.fill.msg = 'none'
            }
        }
    
        var w = 512 / p.width / 1.4
        var h = 512 / p.length / 1.4
        var a = 73.14285714
    
        p.ctx.fillStyle = '#ffffff'
        p.ctx.fillRect(0, 0, 512, 512)
    
        var img
    
        for (var x = 0; x < p.width; x++) {for (var y = 0; y < p.length; y++) {
            i = y + p.sel.y * p.length + x * p.length * p.height
            if (p.map[i] == 0) {
                p.ctx.beginPath();
                p.ctx.lineWidth = p.width>=32|p.height>=32 ? '1' : '2';
                p.ctx.strokeStyle = "#000";
                p.ctx.rect(w * x + a, h * y + a, w, h);  
                p.ctx.stroke();
            } else {
                img = new Image
                img.src = 'textures.png'
                p.ctx.drawImage(img, (p.map[i] - 1) * 384, 0, 256, 256, w * x + a, h * y + a, w, h)
            }
        }}
    
        p.ctx.font = "30px Arial"
        p.ctx.fillStyle = '#000'
        p.ctx.fillText(`X: ${p.sel.x}, Y: ${p.sel.y}, Z: ${p.sel.z}`, 8, 28)
        p.ctx.fillText(`Block: ${p.bn[p.sel.b]} (${p.sel.b}),   Fill: ${p.fill.msg}`, 8, 56)
    
        img = new Image
        img.src = 'select.png'
        if (p.sel.b > 0) p.ctx.drawImage(img, w * p.sel.x + a, h * p.sel.z + a, w, h)
    }
}

function keypress(key, down=1) {
    var a = p.keysp
    switch (key) {
        case 'ArrowLeft': a.L=down; break
        case 'ArrowRight': a.R=down; break
        case 'ArrowUp': a.U=down; break
        case 'ArrowDown': a.D=down; break
        case ' ': a.S=down; break
        case 'x': a.x=down; break
        case 'a': a.a=down; break
        case 'd': a.d=down; break
        case 's': a.s=down; break
        case 'p': a.p=down; break
        case 'e': a.e=down; break
        case 'c': a.c=down; break
        case 'l': a.l=down; break
        case 'v': a.v=down; break
        case 'b': a.b=down; break
        case 'f': a.f=down; break
        case 'o': a.o=down; break
        case 'Shift': a.H=down; break
    }
}

document.addEventListener('keydown', e => {
    keypress(e.key)
    if (e.key.includes('Arrow')|e.key=='Space') e.preventDefault()
})
document.addEventListener('keyup', e => {
    keypress(e.key, 0)
})

p.int = setInterval(() => {
    tick()
}, 1e3 / 30)