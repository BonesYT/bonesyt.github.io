var Imaginal

(function(){

    Imaginal = function(real=0, imag=0) {
        if (typeof real == 'object') {
            this.r = real.r
            this.i = real.i
            return
        } else if (typeof real == 'string') {
            var a = real.replaceAll(' ', '').split('+')
            if (a.length == 1 & a[0].includes('i')) a.unshift(0)
            this.r = Number(a[0])
            this.i = Number((a[1] ?? '0i').substr(0, (a[1] ?? '0i').length - 1))
            if (a[1] == 'i') this.i = 1
            return
        }
        this.r = Number(real)
        this.i = Number(imag)
    }
    
    var P = {}

    P.toString = function () {
        if (this.r == 0 & this.i == 0) return '0'
        var a = this.r + '', b = '', c = ''
        if (this.i != 0 & this.r != 0) b = ' + '
        if (this.i != 0) {
            if (this.i == 1) c = 'i'
            else c = this.i + 'i'
        }
        if (this.r == 0) a = ''
        return a + b + c
    }
    P.add = function (r=0, i=0) {
        r=new Imaginal(r,i).r;i = new Imaginal(r,i).i
        return new Imaginal(this.r + r, this.i + i)
    }
    P.sub = function (r=0, i=0) {
        r=new Imaginal(r,i).r;i = new Imaginal(r,i).i
        return new Imaginal(this.r - r, this.i - i)
    }
    P.mul = function (r=0, i=1) {
        r=new Imaginal(r,i).r;i = new Imaginal(r,i).i
        return new Imaginal(this.r * r - this.i * i, this.r * i + this.i * r)
    }
    P.div = function (r=0, i=1) {
        r=new Imaginal(r,i).r;i = new Imaginal(r,i).i
        return new Imaginal((this.r * r + this.i * i) / (r ** 2 + i ** 2), (this.i * r + this.r * i) / (r ** 2 + i ** 2))
    }

    Imaginal.prototype = P

})()