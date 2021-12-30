function $(e) {
    return document.getElementById(e)
}

var sys = {
    start: ()=>{
        if (!sys.isPlay)
        int = setInterval(() => {
            sys.exec()
            sys.tick++
        }, 1000 / sys.fps);
        sys.isPlay = true
    },
    stop: ()=>{
        clearInterval(int)
        sys.isPlay = false
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
    getHash: ()=>{
        ecode.value = new URL(document.location.href).hashToString()
    },
    setHash: i=>{
        var e = new URL(document.location.href)
        e.stringToHash(String(i))
        document.location.href = e
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

canvas.addEventListener('mousemove', e=>{
    sys.cursor.x = e.offsetX
    sys.cursor.y = e.offsetY
})

URL.prototype.hashToString=function(){var e=this.hash.substring(1);e=e.replace(/%5B/g,"[");e=e.replace(/%5D/g,"]");e=e.replace(/%7B/g,"{");e=e.replace(/%7D/g,"}");e=e.replace(/%5E/g,"^");e=e.replace(/%60/g,"`");e=e.replace(/%40/g,"@");e=e.replace(/%23/g,"#");e=e.replace(/%24/g,"$");e=e.replace(/%25/g,"%");e=e.replace(/%26/g,"&");e=e.replace(/%2C/g,",");e=e.replace(/%2B/g,"+");e=e.replace(/%3A/g,":");e=e.replace(/%3B/g,";");e=e.replace(/%2F/g,"/");e=e.replace(/%3F/g,"?");e=e.replace(/%5C/g,"\\");e=e.replace(/%7C/g,"|");e=e.replace(/%20/g," ");e=e.replace(/\+/g," ");return e};URL.prototype.stringToHash=function(e,r){var a=e;a=a.replace(/\[/g,"%5B");a=a.replace(/]/g,"%5D");a=a.replace(/{/g,"%7B");a=a.replace(/}/g,"%7D");a=a.replace(/\^/g,"%5E");a=a.replace(/`/g,"%60");a=a.replace(/@/g,"%40");a=a.replace(/#/g,"%23");a=a.replace(/\$/g,"%24");a=a.replace(/%/g,"%25");a=a.replace(/&/g,"%26");a=a.replace(/,/g,"%2C");e=e.replace(/\+/g,"%2B");a=a.replace(/:/g,"%3A");a=a.replace(/;/g,"%3B");a=a.replace(/\//g,"%2F");a=a.replace(/\?/g,"%3F");a=a.replace(/\\/g,"%5C");a=a.replace(/\|/g,"%7C");a=a.replace(/ /g,r?"+":"%20");this.hash="#"+a};

sys.getHash()