function $(e) {
    return document.getElementById(e)
}

var sys = {
    start: ()=>{
        int = setInterval(() => {
            sys.exec()
            sys.tick++
        }, 1000 / sys.fps);
    },
    stop: ()=>{
        clearInterval(int)
    },
    reset: ()=>{
        sys.tick = 0
    },
    createCanvas: ()=>{
        ctx.fillStyle = '#FFF'
        ctx.lineWidth = 2
        ctx.strokeStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        var xm = canvas.width / sys.grid.w,
            ym = canvas.height / sys.grid.h
        for (var y = 0; y < sys.grid.h; y++) {
            for (var x = 0; x < sys.grid.w; x++) {
                ctx.strokeRect(x*xm+1, y*ym+1, xm-2, ym-2)
            }       
        }
    },
    exec: ()=>{
        try {
            code = new Function('x', 'y', 'i', 't', 'ti', 'mx', 'my', `return(${ecode.value})`)
            var xm = canvas.width / sys.grid.w,
                ym = canvas.height / sys.grid.h,
                color, time = Date.now()
            for (var y = 0; y < sys.grid.h; y++) {
                for (var x = 0; x < sys.grid.w; x++) {
                    color = Math.floor(Number(code(x, y, x+y*sys.grid.w, sys.tick, time, sys.cursor.x/xm, sys.cursor.y/ym)) % 2)
                    switch (color) {
                        case 0: ctx.fillStyle = '#000'; break
                        case 1: ctx.fillStyle = '#FFF'; break
                    }
                    ctx.fillRect(x*xm+1, y*ym+1, xm-2, ym-2)
                }       
            }
        } catch (e) {
            console.log(e)
            sys.stop()
        }
    },
    showOpts: ()=>{
        if (sys.optsOn) {
            $('options').style.display = 'none'
        } else {
            $('options').style.display = 'block'
        }
        sys.optsOn = !sys.optsOn
    },
    update: ()=>{
        canvas.width = Math.max(Math.min($('cw').value, 1024), 4)
        canvas.height = Math.max(Math.min($('ch').value, 1024), 4)
        sys.grid.w = Math.max(Math.min($('w').value, 256), 1)
        sys.grid.h = Math.max(Math.min($('h').value, 256), 1)
        sys.createCanvas()
    },
    optsOn: false,
    isPlay: false,
    tick: 0,
    fps: 30,
    grid: {
        w: 16,
        h: 16
    },
    cursor: {
        x: 0,
        y: 0
    }
}
var canvas = $('canvas'),
    ctx = canvas.getContext('2d'),
    ecode = $('code'),
    code = ()=>{},
    xm, ym

sys.createCanvas()

$('canvas').addEventListener('mousemove', e=>{
    sys.cursor.x = e.offsetX
    sys.cursor.y = e.offsetY
})