/* Transfinity.js

   For numbers above Infinity (ordinal/cardinal numbers)
   w is ω 
   tetr is tetration, iterated exponent
   strings: add "-" at start to set sign to -1
            add "w" for infinite numbers
            operators: ↑↑ ^ * / + -
            spaces are optional
   by @BonesYT ! credit when use.
*/

'use strict'
class Transfinity {

    static Omega = Number.MAX_VALUE // Number treated as Omega
    static getinf() {return Transfinity.Omega == Number.MAX_VALUE ? Infinity : Transfinity.Omega}

    constructor(input = 0) {
        switch (typeof input) {
            case 'number':
                this.nadd = Math.abs(input)
                this.nmul = 0
                this.npow = 1
                this.ntetr = 1
                this.sign = Math.sign(input)
                if (isNaN(this.nadd)) this.nadd = 0
                if (isNaN(this.sign)) this.sign = 0
                if (this.nadd >= Transfinity.getinf()) {
                    this.nadd = 0
                    this.nmul = 1
                }
            break; case 'string':
                var a = Transfinity.parse(input)
                this.nadd = a.nadd
                this.nmul = a.nmul
                this.npow = a.npow
                this.ntetr = a.ntetr
                this.sign = a.sign
            break; case 'object':
                this.nadd = input.nadd ?? 0
                this.nmul = input.nmul ?? 0
                this.npow = input.npow ?? 1
                this.ntetr = input.ntetr ?? 1
                this.sign = input.sign ?? 0
            break
        }
    }
    fix() {
        var a = Transfinity.getinf()
        if (this.nadd >= Transfinity.getinf()) {
            this.nadd = 0
            this.nmul++
        } if (this.nmul >= Transfinity.getinf()) {
            this.nmul = 1
            this.npow++
        }if (this.npow >= Transfinity.getinf()) {
            this.npow = 1
            this.ntetr++
        } if (this.nmul == 0 & this.nadd == 0) this.sign = 0
        if (this.nmul < 0) {
            this.nmul = Math.abs(this.nmul)
            this.nadd = -this.nadd
            this.sign = -this.sign
        }
        if (this.ntetr == 0 | this.npow == 0) {
            this.nadd += this.nmul
            this.nmul = 0
            this.ntetr = 1, this.npow = 1
        }
        if (this.nadd < 0 & this.sign < 0) {
            this.nadd = -this.nadd
            this.sign = 1
        }
        return this
    }

    add(y) {
        var x = new Transfinity(this),
            X = new Transfinity(this),
            i = Transfinity.getinf()
        y = new Transfinity(y)
        if (x.sign == 1 & y.sign == -1) {
            var a = [...[x, y]]
            x = a[1], y = a[0]
        }

        var a = x.nadd, b
        x.npow = Math.max(x.npow, y.npow)
        x.ntetr = Math.max(x.ntetr, y.ntetr)
        if (!((x.ntetr > y.ntetr || x.npow > y.npow)|
              (y.ntetr > X.ntetr || y.npow > X.npow))) {
            x.nadd += y.nadd * y.sign * x.sign
            x.nmul += y.nmul * y.sign * x.sign
            if (x.nmul < 0 || x.nadd < 0) {
                x.nmul = -x.nmul
                x.nadd = -x.nadd
                x.sign = -x.sign
            }
        } else {
            if (y.ntetr > X.ntetr || y.npow > X.npow) {
                return y.fix()
            }
        }
        return x.fix()
    }
    sub(y) {
        return this.add(new Transfinity(y).negsign())
    }
    neg(y) {
        return new Transfinity(y).add(this.negsign())
    }
    mul(y) {
        var x = new Transfinity(this),
            i = Transfinity.getinf()
        y = new Transfinity(y)

        if (y.nmul) x.npow += y.npow
        if (y.nmul) {
            x.nmul = y.nmul * x.nmul * x.sign * y.sign
            if (x.nmul<0&x.sign<0) x.nmul = -x.nmul
            if (x.sign<0&y.sign<0) x.nmul = -x.nmul
        } else {
            x.nmul *= y.nadd * y.sign
            x.nadd *= y.nadd * y.sign
        }
        if (!(x.nmul | y.nmul)) x.nadd *= y.nadd

        return x.fix()
    }


    negsign() {
        var a = {...this}
        a.sign = -a.sign
        return a
    }
    gt(y) {
        var x = new Transfinity(this)
        y = new Transfinity(y)

        if (x.sign > y.sign) return true
        if (x.sign < y.sign) return false
        if (x.ntetr > y.ntetr) return true
        if (x.ntetr < y.ntetr) return false
        if (x.npow > y.npow) return true
        if (x.npow < y.npow) return false
        if (x.nmul > y.nmul) return true
        if (x.nmul < y.nmul) return false
        if (x.nadd > y.nadd) return true
        return false
    }
    lt(y) {
        var x = new Transfinity(this)
        y = new Transfinity(y)
        
        if (x.sign > y.sign) return false
        if (x.sign < y.sign) return true
        if (x.ntetr > y.ntetr) return false
        if (x.ntetr < y.ntetr) return true
        if (x.npow > y.npow) return false
        if (x.npow < y.npow) return true
        if (x.nmul > y.nmul) return false
        if (x.nmul < y.nmul) return true
        if (x.nadd > y.nadd) return false
        return false
    }
    eq(y) {
        var x = new Transfinity(this)
        y = new Transfinity(y)

        return x.ntetr==y.ntetr&
               x.npow==y.npow&
               x.nmul==y.nmul&
               x.nadd==y.nadd&
               x.sign==y.sign
    }
    gte(y) {
        return this.gt(y) | this.eq(y)
    }
    lte(y) {
        return this.lt(y) | this.eq(y)
    }

    toString(space=false) {
        var o = ''
        if (this.nmul) {
            o = 'ω '
            if (this.ntetr != 1) o += '↑↑ ' + this.ntetr + ' '
            if (this.npow != 1) o += '^ ' + this.npow + ' '
            if (this.nmul > 1) o += '* ' + this.nmul + ' '
            if (this.nmul < 1) o += '/ ' + 1 / this.nmul + ' '
            if (this.nadd > 0) o += '+ ' + this.nadd + ' '
            if (this.nadd < 0) o += '- ' + 1 / this.nadd + ' '
        } else {
            o = this.nadd.toString()
        }
        if (this.sign == -1) o = '-' + o
        if (!space) o = o.replaceAll(' ', '')
        return o.trim()
    }
    toNumber() {
        return this.nadd * (this.nmul ? Infinity : 1) * this.sign
    }

    static parse(i) {
        var o = new Transfinity(),
            I = i,
            e = false
        o.nmul = 1
        function b(b,c=1,d=v=>v) {
            var f = false
            a = i.substr(c, Infinity)
            if (a[0]=='-') {a = a.substr(1, Infinity); f = true}
            a = a.replace(/[\^*+\/-](.*)/, '')
            if (f) a = '-' + a

            if ((b=='nmul'&o[b]!=1)|
                (b=='nADD'&o[b]!=0)) o[b] *= Number(d(1*a) ?? a)
            else o[b] = Number(d(1*a) ?? a)

            if (isNaN(o[b])) e = true
            i = i.substr(a.length + c, Infinity)
        }
        if (i[0]=='-') {
            i = i.substr(1, Infinity)
            o.sign = -1
        } else o.sign = 1
        i = i.replaceAll(' ','')
        if (i[0]=='ω'|i[0]=='w') {
            var a 
            o.nmul = 1
            i = i.substr(1, Infinity).replaceAll('w','Infinity')

            if (i.substr(0,2)=='↑↑'|i.substr(0,2)=='^^') b('ntetr',2)
            if (i[0]=='^') b('npow')
            if (i[0]=='*') b('nmul')
            if (i[0]=='/') b('nmul',1,v=>1/v)
            if (i[0]=='+') b('nadd')
            if (i[0]=='-') b('nadd',1,v=>-v)
        } else {
            o.nadd = Number(i)
            o.nmul = 0
            if (isNaN(o.nadd)) e = true
        }
        o.fix()
        if (e) console.warn(`[Transfinity.js] Malformed input "${I}"`)
        return o
    }

    static add(x,y) {
        x = new Transfinity(x), y = new Transfinity(y)
        return x.add(y)
    }
    static sub(x,y) {
        x = new Transfinity(x), y = new Transfinity(y)
        return x.sub(y)
    }
    static mul(x,y) { 
        x = new Transfinity(x), y = new Transfinity(y)
        return x.mul(y)
    }
}