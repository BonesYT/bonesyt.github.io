function $(e) {
    return document.getElementById(e);
};

$('code').value = 'sys.on.start = ()=>{\n    canvas.setDim(1080, 720);\n    sys.buttons = {};\n};\nsys.on.tick = ()=>{\n\n}';
var ec = $('canvas');
var ctx = ec.getContext('2d')
var code = new Function($('code').value)

var canvas = {
    setDim: (w, h)=>{
        ec.width = w;
        ec.height = h;
    },
    rect: (x=0, y=0, w=256, h=256, c='#FFF')=>{
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h)
    },
    circle: (x=0, y=0, r=256, c='#FFF')=>{
        ctx.fillStyle = c;
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.clearPath()
    },
    clearRect: (x=0, y=0, w=256, h=256)=>{
        ctx.clearRect(x, y, w, h)
    },
    clearAll: ()=>{
        ctx.clearRect(0, 0, ec.width, ec.height)
    },
    fill: (c)=>{
        ctx.fillStyle = c;
        ctx.fillRect(x, y, ec.width, ec.height)
    },
    bt: {
        create: (x=0, y=0, w=256, h=256, c="#FFF", id="button", f=()=>{})=>{
            if (sys.buttons[id]==undefined) sys.buttons[id] = [x,y,w,h,c,f]
        },
        remove: (id)=>{
            delete sys.buttons[id]
        },
        get: (id)=>{
            return id==undefined?sys.buttons:sys.buttons[id]
        },
        func: (id)=>{
            var click = (id)=>{
                var bt = sys.buttons[id]
                if (sys.mouseHold==0 & sys.m.x >= bt[0] & sys.m.y >= bt[1] & sys.m.x < (bt[0] + bt[2]) & sys.m.y < (bt[1] + bt[3])) {
                    bt[5](bt,id)
                }
            }
            if (id != undefined) {
                click(id)
            } else {
                Object.keys(sys.buttons).forEach((v,i) => {
                    click(v)
                });
            }
        },
        exec: (id)=>{
            if (id != undefined) {
                var bt = sys.buttons[id]
                bt[5](bt,id)
            } else {
                Object.keys(sys.buttons).forEach((v,i) => {
                    var bt = sys.buttons[v]
                    bt[5](bt,id)
                });
            }
        },
        stamp: (id)=>{
            if (id != undefined) {
                var bt = sys.buttons[id]
                canvas.rect(bt[0],bt[1],bt[2],bt[3],bt[4])
            } else {
                Object.keys(sys.buttons).forEach((v,i) => {
                    var bt = sys.buttons[v]
                    canvas.rect(bt[0],bt[1],bt[2],bt[3],bt[4])
                });
            }
        }
    }
};
var sys = {
    on: {
        start: ()=>{},
        tick: ()=>{},
        keyup: ()=>{},
        keydown: ()=>{},
        mousemove: ()=>{}
    },
    isRun: false,
    isPause: false,
    mouseDown: false,
    mouseHold: -1,
    tick: 0,
    buttons: {},
    since: 0,
    m: {
        x: 0,
        y: 0
    },
    isPress: (key)=>{
        return Boolean(sys.press[key])
    },
    press: {}
}

Start = ()=>{
    if (!sys.isRun) {
        try {
            code = new Function($('code').value)
            code()
            sys.tick = 0
            sys.on.start()
            sys.isRun = true
            sys.since = Date.now()
            int = setInterval(()=>{
                try {
                    sys.on.tick()
                } catch (e) {
                    $('errors').value += e + '\n'
                }
                if (sys.mouseDown) {
                    sys.mouseHold++
                } else {
                    sys.mouseHold = -1
                }
                sys.time = Date.now() - sys.since
                sys.tick++
            }, 1000/30)
        } catch (e) {
            $('errors').value += '\n' + e
        } 
    }
}
Pause = ()=>{
    if (sys.isRun) {
        if (sys.isPause) {
            int = setInterval(()=>{
                try {
                    sys.onTick()
                } catch (e) {
                    $('errors').value += '\n' + e
                }
                if (sys.mouseDown) {
                    sys.mouseHold++
                } else {
                    sys.mouseHold = -1
                }
                sys.tick++
            }, 1000/30)
        } else {
            clearInterval(int)
        }
        sys.isPause = !sys.isPause
    }
}
Stop = ()=>{
    if (sys.isRun) {
        clearInterval(int)
        sys.isRun = false
    }
}
function getPos(event) {
    sys.m.x = event.offsetX;
	sys.m.y = event.offsetY;
    if (sys.isRun & !sys.isPause) sys.on.mousemove()
}
document.addEventListener('keydown', e=>{
    sys.press[e.code] = true
    if (sys.isRun & !sys.isPause) sys.on.keydown()
})
document.addEventListener('keyup', e=>{
    sys.press[e.code] = false
    if (sys.isRun & !sys.isPause) sys.on.keyup()
})

$('exp').innerHTML =
`Vars/functions:

canvas.
    setDim(x,y)
    rect(x,y,w,h,c)
    circle(x,y,r,c)
    clearRect(x,y,w,h)
    clearAll()
    fill(c)
    bt.
        create(x,y,w,h,c,id,f)
        remove(id)
        get(id)
        func(id)
        exec(id)
        stamp(id)
sys.
    on.
        start()
        tick()
        keyup()
        keydown()
        mousemove()
    isRun
    isPause
    mouseDown
    tick
    time
    buttons
    since
    m.
        x
        y
    isPress(key)
    press`