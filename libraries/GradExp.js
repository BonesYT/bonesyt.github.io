
'use strict'
var GradExp
(function(){

    function addProto(target, config=0) {
        if (!config) Object.assign(P, C)
        for (var i in P) { // Add all methods to prototype object
            Object.defineProperty(target, i, {
                value: P[i],
                enumerable: false,
                writable: false
            })
        }
        P = {}
    }

    GradExp = function (large=false) {
        this.large =!! large
        this.input = undefined
        this.expansion = undefined
        this.output = undefined
        this.width = undefined
        this.height = undefined
        this.finish = false
    }

    var P = {} // Prototype object
    GradExp.rgbtc = (i = [0,0,0]) => {
        i = i.map(v => Math.floor(v) % 256)
        return i[2] + i[1] * 256 + i[0] * 65536
    }
    GradExp.ctrgb = (i = 0) => {
        i = Math.floor(i)
        return [Math.floor(i / 65536) % 256, Math.floor(i / 256) % 256, i % 256]
    }
    GradExp.next = (x, y) => y - x + y
    GradExp.next3 = (x, y, z) => z * 3 - y * 3 + x
    GradExp.getid = (w, h, x, y) => x % w + y * h

    P.setColors = function (array=[]) {
        if (array.length < (this.large ? 9 : 4)) throw RangeError(`[GradExp.js] Colors array length should be ${this.large ? 9 : 4} or higher`)
        array.splice(this.large ? 9 : 4, Infinity)
        return this.input = array.map(v => {
            return typeof v == 'number' ? GradExp.ctrgb(v) : v
        })
    }
    P.setExpansion = function (left=3, right=3, top=3, bottom=3) {
        this.expansion = [1*left, 1*right, 1*top, 1*bottom]
    }
    P.expand = function (horiFirst = true) {
        if (!this.input) throw TypeError('[GradExp.js] Color input are still undefined')
        if (!this.expansion) throw TypeError('[GradExp.js] Expansion lengths are still undefined')

        var a = (x,y) => GradExp.getid(width, height, x, y) 
        
        var size = this.large ? 3 : 2,
            left = this.expansion[0], right = this.expansion[1],
            top = this.expansion[2], bottom = this.expansion[3]
        var width = size + left + right, height = size + top + bottom
        var output = Array(width * height), input = [...this.input]

        if (!horiFirst) input = input.map((v,i,a) => { // switch hori to vert if in vertical mode
            var x=i%size,y=Math.floor(i/size),a=x
            x=y,y=a
            return a[GradExp.getid(size,size,x,y)]
        })

        if (size == 3) {
            output[a(left, top)]     = input[0]; output[a(left+1, top)]   = input[1]
            output[a(left+2, top)]   = input[2]; output[a(left, top+1)]   = input[3]
            output[a(left+1, top+1)] = input[4]; output[a(left+2, top+1)] = input[5]
            output[a(left, top+2)]   = input[6]; output[a(left+1, top+2)] = input[7]
            output[a(left+2, top+2)] = input[8]
        } else {
            output[a(left, top)]   = input[0]; output[a(left+1, top)]   = input[1]
            output[a(left, top+1)] = input[2]; output[a(left+1, top+1)] = input[3]
        }

        var i,i2,x,y

        if (!this.large) {
            for (y = 0; y < 2; y++) { // Make sure to expand the top and bottom lines too
                // Expand to right side
                for (x = 0; x < right; x++) {
                    i = a(left + x, top + y)
                    output[i + 2] = [
                        GradExp.next(output[i][0], output[i + 1][0]),
                        GradExp.next(output[i][1], output[i + 1][1]),
                        GradExp.next(output[i][2], output[i + 1][2])
                    ]
                }
                // Expand to left side
                for (x = 0; x < left; x++) {
                    i = a(left - x + 1, top + y)
                    output[i - 2] = [
                        GradExp.next(output[i][0], output[i - 1][0]),
                        GradExp.next(output[i][1], output[i - 1][1]),
                        GradExp.next(output[i][2], output[i - 1][2])
                    ]
                }
            }
            for (x = 0; x < width; x++) { // Expand every x position vertically
                // Expand to bottom
                for (y = 0; y < bottom; y++) {
                    i = a(x, top + y)
                    output[i + width * 2] = [
                        GradExp.next(output[i][0], output[i + width][0]),
                        GradExp.next(output[i][1], output[i + width][1]),
                        GradExp.next(output[i][2], output[i + width][2])
                    ]
                }
                // Expand to top
                for (y = 0; y < top; y++) {
                    i = a(x, top - y + 1)
                    output[i - width * 2] = [
                        GradExp.next(output[i][0], output[i - width][0]),
                        GradExp.next(output[i][1], output[i - width][1]),
                        GradExp.next(output[i][2], output[i - width][2])
                    ]
                }
            }
        } else {
            for (y = 0; y < 3; y++) { // Make sure to expand the top and bottom lines too
                // Expand to right side
                for (x = 0; x < right; x++) {
                    i = a(left + x, top + y)
                    output[i + 3] = [
                        GradExp.next3(output[i][0], output[i + 1][0], output[i + 2][0]),
                        GradExp.next3(output[i][1], output[i + 1][1], output[i + 2][1]),
                        GradExp.next3(output[i][2], output[i + 1][2], output[i + 2][2])
                    ]
                }
                // Expand to left side
                for (x = 0; x < left; x++) {
                    i = a(left - x + 2, top + y)
                    console.log(i,i-2,x,y,output)
                    output[i - 3] = [
                        GradExp.next(output[i][0], output[i - 1][0], output[i - 2][0]),
                        GradExp.next(output[i][1], output[i - 1][1], output[i - 2][1]),
                        GradExp.next(output[i][2], output[i - 1][2], output[i - 2][2])
                    ]
                }
            }
            for (x = 0; x < width; x++) { // Expand every x position vertically
                // Expand to bottom
                for (y = 0; y < bottom; y++) {
                    i = a(x, top + y)
                    output[i + width * 3] = [
                        GradExp.next3(output[i][0], output[i + width][0], output[i + width * 2][0]),
                        GradExp.next3(output[i][1], output[i + width][1], output[i + width * 2][0]),
                        GradExp.next3(output[i][2], output[i + width][2], output[i + width * 2][0])
                    ]
                }
                // Expand to top
                for (y = 0; y < top; y++) {
                    i = a(x, top - y + 2)
                    output[i - width * 3] = [
                        GradExp.next(output[i][0], output[i - width][0], output[i - width * 2][0]),
                        GradExp.next(output[i][1], output[i - width][1], output[i - width * 2][1]),
                        GradExp.next(output[i][2], output[i - width][2], output[i - width * 2][2])
                    ]
                }
            }
        }

        if (!horiFirst) output = output.map((v,i,a) => { // switch vert back to hori if in vertical mode
            var x=i%width,y=Math.floor(i/width),b=x
            x=y,y=b
            return a[GradExp.getid(width,height,x,y)]
        })

        this.output = output
        this.width = width
        this.height = height
        this.finish = true
    }
    P.toImageBlur = function (pw = 2, ph = 2, size = 1) {
        if (!this.output) throw TypeError('[GradExp.js] Gradient has not been expanded')
        var a = document.createElement('canvas'), x, y
            b = a.getContext('2d'),
            c = b.getImageData()
        a.width = this.width
        a.height = this.height

        for (i = 0; i < this.width * this.height; i++) {
            c.data[i * 4    ] = this.output[i][0]
            c.data[i * 4 + 1] = this.output[i][1]
            c.data[i * 4 + 2] = this.output[i][2]
            c.data[i * 4 + 3] = 255
        }
        b.putImageData(c)

        return new GradExp.ImageBlur(b, pw, ph, size)
    }

    var C = {
        limiter(set=false) {
            if (!this.output) throw TypeError('[GradExp.js] Gradient has not been expanded')
            var a = this.output.map(v => v.map(v => Math.floor(Math.max(Math.min(v,255),0))))
            if (set) this.output = a
            return a
        },
        stampCanvas(node=document.createElement('canvas'), sx=0, sy=0, pw=1, ph=1, alpha=255) {
            if (!this.output) throw TypeError('[GradExp.js] Gradient has not been expanded')
            var ctx = node.getContext('2d')
            var x, y, i, o = this.output, w = this.width, h = this.height
            
            for (x = 0; x < w; x++) for (y = 0; y < h; y++) {
                i = GradExp.getid(w, h, x, y)
                ctx.fillStyle = `rgba(${o[i][0]},${o[i][1]},${o[i][2]},${alpha})`
                ctx.fillRect(sx + pw * x, sy + ph * y, pw, ph)
            }
    
            return node
        },
        map(funct=(value,id,x,y,array)=>{}, set=false) {
            if (!this.output) throw TypeError('[GradExp.js] Gradient has not been expanded')
            var x, y, r
            var a = this.output.map((v,i,a) => {
                x = i % this.width
                y = Math.floor(i / this.height)
                r = funct(v, i, x, y, a)
                if (typeof r == 'number') r = GradExp.ctrgb(r)
                return r 
            })
            if (set) this.output = a
            return a
        },
        clone(output, width, height) {
            var a = {...this}
            if (width) a.width =1* width
            if (height) a.height =1* height
            if (output) a.output = (typeof output=='array'?output:[output]).map(v=>
                typeof v=='number' ? GradExp.ctrgb(v) : v
            )
            return a
        }
    }

    addProto(GradExp.prototype)

    var GEBlur = function () {
        this.input = undefined
        this.output = undefined
        this.width = undefined
        this.height = undefined
        this.finish = false
    }

    P.setColors = function (array=[]) {
        if (array.length < 4) throw RangeError('[GradExp.js] Colors array length should be 4 or higher')
        return this.input = array.map(v => {
            return typeof v == 'number' ? GradExp.ctrgb(v) : v
        })
    }
    P.expand = function (width=8, height=8) {
        this.output = []
        var o = [], x, y, gx, gy, a, b, c

        for(y=0;y<1*height;y++)for(x=0;x<1*width;x++) {
            gx = x / (width - 1)
            gy = y / (height - 1)

            a = this.input[0].map((v,i) => v * (1 - gx) + this.input[1][i] * gx)
            b = this.input[2].map((v,i) => v * (1 - gx) + this.input[3][i] * gx)
            c = a.map((v,i) => v * (1 - gy) + b[i] * gy)

            this.output.push(c)
        }

        this.width = 1*width
        this.height = 1*height
        this.finish = true
    }

    addProto(GEBlur.prototype)

    var GEImageBlur = function (img, pw = 2, ph = 2, size = 1) {
        var a = img.constructor.name
        if (a != 'HTMLImageElement' & a != 'CanvasRenderingContext2D') throw TypeError('Image is not type HTMLImageElement or CanvasRenderingContext2D')

        if (a == 'HTMLImageElement') {
            var b = document.createElement('canvas')
            b.width = img.width * size
            b.height = img.height * size
            var c = b.getContext('2d')
            c.drawImage(a, 0, 0)
            img = c
        }

        this.input = img
        this.swidth = pw
        this.sheight = ph
        this.iwidth = img.width
        this.iheight = img.height
        this.output = undefined
        this.width = undefined
        this.height = undefined
        this.finish = false
    }
    P.expand = function () {
        var w = this.iwidth * this.swidth + 1,
            h = this.iheight * this.sheight + 1,
            a = Array(w * h), b, x, y, X, Y, xx, yy, i, sx, sy
        i = this.input.getImageData().data

        var f = I => {
            var A = [...i].splice(I * 4, 4)
            A.pop()
            return A
        }

        for(y=0;y<this.iheight-1;y++)for(x=0;x<this.iwidth-1;x++) {
            b = new GradExp.Blur
            b.setColors([
                f(x + y * this.iwidth),
                f(x + 1 + y * this.iwidth),
                f(x + (y + 1) * this.iwidth),
                f(x + 1 + (y + 1) * this.iwidth)
            ])
            b.expand(this.swidth + 1, this.sheight + 1)

            sx = x == this.swidth - 1
            sy = y == this.sheight - 1

            for(Y=0;Y<b.height-(sy?0:1);Y++)for(X=0;X<b.width-(sx?0:1);X++) {
                xx = X + x * (b.width-1)
                yy = Y + y * (b.height-1)
                a[xx + yy * w] = b.output[X + Y * b.width]
            }
        }

        this.output = a
        this.width = w
        this.height = h
        this.finish = true
    }

    addProto(GEImageBlur.prototype)

    var GELine = function (large=false) {
        this.large =!! large
        this.input = undefined
        this.expansion = undefined
        this.output = undefined
        this.width = undefined
        this.finish = false
    }

    P.setColors = function (array=[]) {
        if (array.length < (this.large ? 3 : 2)) throw RangeError(`[GradExp.js] Colors array length should be ${this.large ? 3 : 2} or higher`)
        array.splice(this.large ? 3 : 2, Infinity)
        return this.input = array.map(v => {
            return typeof v == 'number' ? GradExp.ctrgb(v) : v
        })
    }
    P.setExpansion = function (left=3, right=3) {
        this.expansion = [1*left, 1*right]
    }
    P.expand = function () {
        if (!this.input) throw TypeError('[GradExp.js] Color input are still undefined')
        if (!this.expansion) throw TypeError('[GradExp.js] Expansion lengths are still undefined')

        var size = this.large ? 3 : 2,
            left = this.expansion[0], right = this.expansion[1],
            width = size + left + right,
            output = Array(width), input = [...this.input], x
        
        output[left]   = input[0]
        output[left+1] = input[1]
        if (size == 3) output[left+2] = input[2]

        var i

        // right side
        for (x = 0; x < right; x++) {
            i = left + x
            output[i + size] = [
                GradExp[size==3?'next3':'next'](output[i][0], output[i + 1][0], (output[i + 2]??[])[0]),
                GradExp[size==3?'next3':'next'](output[i][1], output[i + 1][1], (output[i + 2]??[])[0]),
                GradExp[size==3?'next3':'next'](output[i][2], output[i + 1][2], (output[i + 2]??[])[0])
            ]
        }
        // left side
        for (x = 0; x < left; x++) {
            i = left - x + 1
            output[i - size] = [
                GradExp[size==3?'next3':'next'](output[i][0], output[i - 1][0], output[i + 2][0]),
                GradExp[size==3?'next3':'next'](output[i][1], output[i - 1][1], output[i + 2][0]),
                GradExp[size==3?'next3':'next'](output[i][2], output[i - 1][2], output[i + 2][0])
            ]
        }

        this.output = output
        this.width = width
        this.finish = true
    }
    P.limiter = C.limiter
    P.stampCanvas = function (node=document.createElement('canvas'), sx=0, sy=0, pw=1, ph=1, alpha=255) {
        if (!this.output) throw TypeError('[GradExp.js] Gradient has not been expanded')
        var ctx = node.getContext('2d')
        var x, o = this.output, w = this.width, h = this.height
        
        for (x = 0; x < w; x++) {
            ctx.fillStyle = `rgba(${o[x][0]},${o[x][1]},${o[x][2]},${alpha})`
            ctx.fillRect(sx + pw * x, sy, pw, ph)
        }

        return node
    }
    P.map = function (funct=(value,id,x,y,array)=>{}, set=false) {
        if (!this.output) throw TypeError('[GradExp.js] Gradient has not been expanded')
        var r
        var a = this.output.map((v,i,a) => {
            r = funct(v, i, a)
            if (typeof r == 'number') r = GradExp.ctrgb(r)
            return r 
        })
        if (set) this.output = a
        return a
    }
    P.clone = function (output, width, height) {
        var a = {...this}
        if (width) a.width =1* width
        if (output) a.output = (typeof output=='array'?output:[output]).map(v=>
            typeof v=='number' ? GradExp.ctrgb(v) : v
        )
        return a
    }
    P.toILB = function (pw = 4) {
        var a = new GradExp.ImageLineBlur(pw),
            b = this.output
        a.setInput(b)
        a.expand()
        return a
    }

    addProto(GELine.prototype, 1)

    var GELineBlur = function () {
        this.input = undefined
        this.output = undefined
        this.width = undefined
        this.finish = false
    }

    P.setColors = function (array=[]) {
        if (array.length < 2) throw RangeError('[GradExp.js] Colors array length should be 2 or higher')
        return this.input = array.map(v => {
            return typeof v == 'number' ? GradExp.ctrgb(v) : v
        })
    }
    P.expand = function (width=8, height=8) {
        this.output = []
        var o = [], x, gx, a, b, c

        for(x=0;x<1*width;x++) {
            gx = x / (width - 1)
            a = this.input[0].map((v,i) => v * (1 - gx) + this.input[1][i] * gx)
            this.output.push(a)
        }

        this.width = 1*width
        this.finish = true
    }

    addProto(GELineBlur.prototype, 1)

    var GEImageLineBlur = function (pw = 4) {
        this.input = undefined
        this.swidth = pw
        this.iwidth = undefined
        this.output = undefined
        this.width = undefined
        this.finish = false
    }

    P.setInput = function (array) {
        array = array.map(v => Array.isArray(array) ? v : [v])
        this.input = array
        this.iwidth = array.length
    }
    P.expand = function () {
        var w = this.iwidth * this.swidth + 1,
            a = Array(w), b, x, X, xx, i, sx
        i = this.input

        var f = I => {
            var A = [...i].splice(I * 4, 4)
            A.pop()
            return A
        }

        for(x=0;x<this.iwidth-1;x++) {
            b = new GradExp.LineBlur
            b.setColors([i[x],i[x+1]])
            b.expand(this.swidth + 1, this.sheight + 1)

            sx = x == this.swidth - 1

            for(X=0;X<b.width-(sx?0:1);X++) {
                xx = X + x * (b.width-1)
                a[xx] = b.output[X]
            }
        }

        this.output = a
        this.width = w
        this.finish = true
    }

    addProto(GEImageLineBlur.prototype, 1)

    GradExp.Blur = GEBlur
    GradExp.ImageBlur = GEImageBlur
    GradExp.Line = GELine
    GradExp.LineBlur = GELineBlur
    GradExp.ImageLineBlur = GEImageLineBlur
})()