// RGB/RGBA and image library.
var ImageRGBAllow = true; //Allow image library

function RGB(r, g, b, a) {
    this.define = (a,b)=>{
        return a==undefined?b:a
    }
    if (Array.isArray(r)) {
        if (r[0]==undefined) {this.r=0,this.g=0,this.b=0,this.a=255}
        else if (r[1]==undefined) {this.r=r[0],this.g=r[0],this.b=r[0],this.a=255}
        else if (r[2]==undefined) {this.r=r[0],this.g=r[0],this.b=r[0],this.a=r[1]}
        else if (r[3]==undefined) {this.r=r[0],this.g=r[1],this.b=r[2],this.a=255}
        else {this.r=r[0],this.g=r[1],this.b=r[2],this.a=r[3]}
    } else if (typeof r == 'object') {
        this.r = r.r
        this.g = r.g
        this.b = r.b
        this.a = r.a
    } else {
        if (r==undefined) {this.r=0,this.g=0,this.b=0,this.a=255}
        else if (g==undefined) {this.r=r,this.g=r,this.b=r,this.a=255}
        else if (b==undefined) {this.r=r,this.g=r,this.b=r,this.a=g}
        else if (a==undefined) {this.r=r,this.g=g,this.b=b,this.a=255}
        else {this.r=r,this.g=g,this.b=b,this.a=a}
    }
    this.r = Number(this.r)
    this.g = Number(this.g)
    this.b = Number(this.b)
    this.a = Number(this.a)
}

var P = {constructor: RGB.prototype.constructor}

P.fix = function () {
    return new RGB(
        Math.floor(Math.min(Math.max(isNaN(this.r)?0:this.r, 0), 255)),
        Math.floor(Math.min(Math.max(isNaN(this.g)?0:this.g, 0), 255)),
        Math.floor(Math.min(Math.max(isNaN(this.b)?0:this.b, 0), 255)),
        Math.floor(Math.min(Math.max(isNaN(this.a)?0:this.a, 0), 255))
    )
}
P.array = function (a) {
    var b = [this.r, this.g, this.b]
    if (a) b.push(this.a)
    return b
}
P.number = function (a) {
    var f = this.fix()
    var b = f.b+f.g*256+f.r*65536
    if (a) b += f.a*16777216
    return b
}
P.paste = function (a,b) {
    if (a!='r'&a!='g'&a!='b'&a!='a') throw Error('[RGB Error] Values needs to be a color channel')
    if (b!='r'&b!='g'&b!='b'&b!='a') throw Error('[RGB Error] Values needs to be a color channel')
    this[b] = this[a]
}
P.switch = function (a,b) {
    if (a!='r'&a!='g'&a!='b'&a!='a') throw Error('[RGB Error] Values needs to be a color channel')
    if (b!='r'&b!='g'&b!='b'&b!='a') throw Error('[RGB Error] Values needs to be a color channel')
    var c = this[a]
    this[a] = this[b]
    this[b] = c
}
P.reset = function (i) {
    this.r = 0
    this.g = 0
    this.b = 0
    this.a = i?0:255
}
P.eq = function (c) {
    var a = this.fix()
    c = new RGB(c).fix()
    return Boolean(a.r==c.r&a.g==c.g&a.b==c.b&a.a==c.a)
}
P.ex = function (c) {
    var a = {r:this.r,g:this.g,b:this.b,a:this.a}
    c = new RGB(c)
    return Boolean(a.r==c.r&a.g==c.g&a.b==c.b&a.a==c.a)
}
P.isDef = function (i=0) {
    switch (Number(i)) {
        case 0:
            return Boolean(this.r==0&this.g==0&this.b==0&this.a==255)
        break
        case 1:
            return Boolean(this.r==0&this.g==0&this.b==0&this.a==0)
        break
        case 2:
            return Boolean(this.r==0&this.g==0&this.b==0)
        break
    }
}
P.isNaN = function (ab,ia=true) {
    if (ab) {
        return Boolean(isNaN(this.r)&isNaN(this.g)&isNaN(this.b)&(ia?isNaN(this.a):true))
    } else {
        return Boolean(isNaN(this.r)|isNaN(this.g)|isNaN(this.b)|(ia?isNaN(this.a):false))
    }
}
P.add = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||0)
    return new RGB(
        this.r + c.r,
        this.g + c.g,
        this.b + c.b,
        this.b + c.a
    )
},
P.sub = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||0)
    return new RGB(
        this.r - c.r,
        this.g - c.g,
        this.b - c.b,
        this.a - c.a
    )
},
P.mul = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||255)
    return new RGB(
        this.r * c.r / 255,
        this.g * c.g / 255,
        this.b * c.b / 255,
        this.a * c.a / 255
    )
},
P.gray = function () {
    return new RGB((this.r+this.g+this.b)/3,this.a)
},
P.mix = function (v,r,g,b,a) {
    var c = new RGB(r,g,b,a||255)
    v = new RGB(v).array
    return new RGB(
        this.r*(1-v)+c.r*v[0],
        this.g*(1-v)+c.r*v[1],
        this.b*(1-v)+c.r*v[2],
        this.b*(1-v)+c.r*v[3]
    )
},
P.thres = function (v,a) {
    v = new RGB(v).array
    return new RGB(
        this.r>=v[0]?255:0,
        this.g>=v[1]?255:0,
        this.b>=v[2]?255:0,
        a?(this.a>=v[3]?255:0):this.a,
    )
},
P.and = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||255)
    return new RGB(
        this.r&c.r,
        this.g&c.g,
        this.b&c.b,
        this.a&c.a
    )
},
P.or = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||255)
    return new RGB(
        this.r|c.r,
        this.g|c.g,
        this.b|c.b,
        this.a|c.a
    )
},
P.xor = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||255)
    return new RGB(
        this.r^c.r,
        this.g^c.g,
        this.b^c.b,
        this.a^c.a
    )
},
P.abs = function () {
    return new RGB(
        Math.abs(this.r),
        Math.abs(this.g),
        Math.abs(this.b),
        Math.abs(this.a)
    )
},
P.dif = function (r,g,b,a) {
    var c = new RGB(r,g,b,a||0)
    return new RGB(
        Math.abs(this.r-c.r),
        Math.abs(this.g-c.g),
        Math.abs(this.b-c.b),
        Math.abs(this.a-c.a)
    )
},
P.custom = function (f, v, r, g, b, a) {
    if (!Array.isArray(v)) throw Error("[RGB Error] 'v' variable needs to be an array")
    if (!typeof f == 'function') throw Error("[RGB Error] 'f' variable needs to be a function")
    var c = new RGB(r,g,b,a||255)
    v.forEach(a=>{a = new RGB(a).array})
    var red0 = this.r,
        green0 = this.g,
        blue0 = this.b,
        alpha0 = this.a,
        red1 = c.r,
        green1 = c.g,
        blue1 = c.b,
        alpha1 = c.a,
        val = v,
        re = f()
    r = re[0]
    g = re[1]
    b = re[2]
    a = re[3]
    return new RGB(r,g,b,a)
}

RGB.prototype = P

if (ImageRGBAllow)
function RGBImage(w, h) {
    if (typeof w=='object') {
        this.width = w.width
        this.height = w.height
        this.px = w.px
    } else {
        this.width = w
        this.height = h
        this.px = []
        var a
        for (var x=0;x<w;x++) {
            a = []
            for (var y=0;y<h;y++) {
                a.push(new RGB(0,0))
            }
            this.px.push(a)
        }
    }
}

P = {constructor: RGBImage.prototype.constructor}

P.setdim = function (w, h) {
    var ow = this.width
    var oh = this.height
    var ni = new RGBImage(w, h)
    ni.px.forEach((v,x)=>{
        v.forEach((w,y)=>{
            try {
                ni.px[x][y] == this.px[x][y] || new RGB(0,0)
            } catch {}
        })
    })
    return new RGBImage(ni)
}
P.toArray = function () {
    var r = []
    for (var x=0;x<w;x++) {
        for (var y=0;y<h;y++) {
            r.push(this.px[x][y])
        }
    }
    return r
}
P.short = function (i,b) {
    var a = this.px,
        w = Math.max(a.width, b.width),
        h = Math.max(a.height, b.height), c, d
    a.setdim(w, h)
    b.setdim(w, h)
    for (var x=0;x<w;x++) {
        for (var y=0;y<h;y++) {
            c = a[x][y]
            d = b[x][y]
            i()
        }
    }
    return new RGBImage(a)
},
P.add = function (b) {
    this.e.short(()=>{a[x][y]==c.e.add(d)},b)
},
P.sub = function (b) {
    this.e.short(()=>{a[x][y]=c.e.sub(d)},b)
},
P.mul = function (b) {
    this.e.short(()=>{a[x][y]=c.e.mul(d)},b)
},
P.gray = function (b) {
    this.e.short(()=>{a[x][y]=c.e.gray()},b)
},
P.mix = function (v,b) {
    this.e.short(()=>{a[x][y]=c.e.mix(v,d)},b)
},
P.thres = function (v,a) {
    this.e.short(()=>{a[x][y]=c.e.thres(v,a)},b)
},
P.and = function (b) {
    this.e.short(()=>{a[x][y]=c.e.and(d)},b)
},
P.or = function (b) {
    this.e.short(()=>{a[x][y]=c.e.or(d)},b)
},
P.xor = function (b) {
    this.e.short(()=>{a[x][y]=c.e.xor(d)},b)
},
P.abs = function () {
    this.e.short(()=>{a[x][y]=c.e.xor()},b)
},
P.div = function (b) {
    this.e.short(()=>{a[x][y]=c.e.xor(d)},b)
},
P.custom = function (f,v,b) {
    this.e.short(()=>{a[x][y]=c.e.custom(f,v,d)},b)
}
P.rect = function (x,y,w,h,r,g,b,a=255,s=false) {
    var c = new RGB(r,g,b,a)
    var A = this
    for (var X=x;X<x+w;X++) {
        for (var Y=y;Y<y+h;Y++) {
            A.px[X][Y] = s?c:new RGB(A.px[X][Y]).mix(A.px[X][Y].a,c)
        }
    }
    return new RGBImage(A)
},
P.code = function (f=()=>{return 0}) {
    var i, a=this
    for (var x=0;x<this.width;x++) {
        for (var y=0;y<this.height;y++) {
            i = x+y*this.height
            var r = f()
            a.px[x][y] = new RGB(r%256, (r/256)%65536, (r/65536)%16777216)
        }
    }
    return a
},
P.canvas = {
    intoImage: function (node,x,y,w,h,sx,sy) {
        var ctx = node.getContext('2d')
        var pix = ctx.getImageData(x,y,w,h).data
        for (var i=0;i<pix.length;i+=4) {
            this.px[i/4%w+sx][Math.floor(i/4/w)+sy] = new RGB(pix[i],pix[i+1],pix[i+2],pix[i+3])
        }
    },
    intoCanvas: function (node,x,y,w,h,sx,sy) {
        var ctx = node.getContext('2d'), c = this.px
        for (var X=x;X<x+w;X++) {
            for (var Y=y;Y<y+h;Y++) {
                ctx.fillStyle(`rgba(${c[X][Y].r},${c[X][Y].g},${c[X][Y].b})`)
                ctx.fillRect(X+sx,Y+sy,1,1)
            }
        }
    }
}

RGBImage.prototype = P