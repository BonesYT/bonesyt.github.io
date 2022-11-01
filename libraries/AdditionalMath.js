/* 
    Math library/plug-in by BonesYT
*/

'use strict'
;(function(This){

    class AdditionalMath {

        arit = {
        
            diff(a, b) {
                return Math.abs(a - b)
            },
            lim(a, x, b) {
                return Math.max(Math.min(x, b), a)
            },
            cycle(x, y) {
                return x < 0 ? (x % y + y) % y : x % y
            },
            isInRange(a, x, b, andEqual=1) {
                return andEqual ? x >= a & y <= b : x > a & y < b
            },
            blend(a, x, b) {
                return b * x + a * (1 - x) 
            },
            invBlend(a, x, b) {
                return (x - a) / (b - a) 
            },
            powAbs(x, c=1) {
                return x >= c | x <= -c ? x : c / x
            },
            powDiff(x, y) {
                return this.powAbs(x / y)
            },
            nroot(n, x) {
                return x ** (1 / n)
            },
            fit(a, b, i=[], mode=0) { // mode: 0 = always, 1 = if greater, 2 = if lower
                
                var max = Math.max.apply(0, i)
                var min = Math.min.apply(0, i)
                if ((mode == 1 & max < b) | (mode == 2 & max > b) & !(isNaN(a) & isNaN(b))) return i
                return i.map(v => 
                    isNaN(a)
                    ? v * (b / max)
                    : this.blend(a, this.invBlend(min, v, max), b)
                )

            },
            fitSum(a=1, i=[]) {

                var b = AM.iter.sum.apply(0, i)
                return i.map(v => v / (b / a))

            },
            ampl(...i) { // i = [x, y], [x, y], [x, y], ... ([number, strength])

                var x = i.map(v => v[0])
                var y = this.fitSum(1, y)
                return x.reduce((a,b,i) => a + b * y[i], 0)

            },
            multiOf(n, x, o=0) {
                return this.cycle(x, n) == this.cycle(o, n)
            },
            floor(x, s=1) {
                return Math.floor(x / s) * s
            },
            round(x, s=1) {
                return Math.round(x / s) * s
            },
            ceil(x, s=1) {
                return Math.ceil(x / s) * s
            },
            trunc(x, s=1) {
                return Math.trunc(x / s) * s
            },
            frac(x) {
                return x - Math.floor(x)
            },
            floorOff(x, off=0, step=1, andEq=false, trunc=false) {

                var a = 1
                if (trunc & x < 0) x = -x, a = -1
                var b = andEq
                ? Math.ceil(x / step + off) * step - 1
                : Math.floor(x / step + off) * step
                return trunc ? b * a : b

            },
            resize(f=x=>x, x, width=1, height=1) {
                return f(x / width) * height
            },
            log(x, y=10) {
                return Math.log(x) / Math.log(y)
            }

        }
        iter = {

            sum(...i) {
                return i.reduce((a, b) => a + + b, 0)
            },
            prod(...i) {
                return i.reduce((a, b) => a * b, 0)
            },
            tri(i) { // triangle
                return ((i * 2 + 1) ** 2 - 1) / 8
            },
            invTri(i) { // triangle⁻¹ (formula by deca quitin)
                return (Math.sqrt(8 * i + 1) - 1) / 2
            },
            fact(i) {

                var o = 1
                for (var I = 1; I <= i; I++) {
                    o *= I
                }
                return o

            },
            invFact(i) {

                var o = 0
                while (i > 1) {
                    o++
                    i /= o
                }
                return o

            }
    
        }
        meas = {
    
            mean(...i) {
                return i.reduce((a, b) => a + + b, 0) / i.length
            },
            powMean(...i) {
                return i.reduce((a, b) => a * b, 0) ^ (1 / i.length)
            },
            median(...i) {
                return i.length % 2 == 0
                       ? (i[i.length / 2] + i[i.length / 2 - 1]) / 2
                       : i[Math.floor(i.length / 2)]
            },
            mode(...i) {
                
                var a = [],
                    f = []
    
                i.forEach((v, i) => {
    
                    if (!a.includes(v)) {
                        a.push(v)
                        f.push(0)
                    }
                    f[a.indexOf(v)]++
    
                })
    
                return a[f.indexOf(Math.max.apply(null, f))]
    
            },
            range(...i) {
                return Math.max.apply(0, i) - Math.min.apply(0, i)
            }
            
        }
        trig = {

            TAU: Math.PI * 2,
            semi(i) {
                return Math.cos(Math.asin(i)) || 0
            },
            distance(x, y, z=0) {
                return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
            },
            angle(x1, x2, y1, y2) {
                return Math.atan2(x1 - x2, y1 - y2)
            },
            step(d, a=1) {
                return {
                    x: Math.sin(d) * a,
                    y: Math.cos(d) * a
                }
            },
            angType(i) {

                i %= Math.PI * 2
                if (i == 0) return 'zero'
                else if (i > 0 & i < Math.PI / 2) return 'acute'
                else if (i == Math.PI / 2) return 'right'
                else if (i > Math.PI / 2 & i < Math.PI) return 'obtuse'
                else if (i == Math.PI) return 'straight'
                else return 'reflex'

            },
            invert(x, y, z=1) {

                return this.step(this.angle(x, 0, y, 0), z * 2 / this.distance(x, y))

            },
            rotate(deg, x, y, X=0, Y=0) {

                var a = this.step(this.angle(x, X, y, Y) + deg, this.distance(X - x, Y - y))
                a.x += X
                a.y += Y
                return a

            },
            toDegrees(x) {
                return x * 180 / Math.PI
            },
            toRadians(x) {
                return x / 180 / Math.PI
            },
            csc(x) {
                return 1 / Math.sin(x)
            },
            sec(x) {
                return 1 / Math.cos(x)
            },
            cot(x) {
                return 1 / Math.tan(x)
            },
            acsc(x) {
                return Math.asin(1 / x)
            },
            asec(x) {
                return Math.acos(1 / x)
            },
            acot(x) {
                return Math.atan(1 / x)
            }

        }
        geom = {

            intAng(i) {
                return (i - 2) * Math.PI / i
            },
            extAng(i) {
                return Math.PI * 2 - this.intAng(i)
            },
            rcir(r) {
                return Math.PI * r ** 2
            },
            rtri(r) {
                return Math.sqrt(3) / 4 * (r * Math.sqrt(3)) ** 2
            }

        }
        config = {
            flat() {
            
                Object.keys(this).forEach(v => {
                    if (typeof this[v] == 'object') {
    
                        Object.keys(this[v]).forEach(w => 
                            this[w] = this[v][w]
                        )
                        delete this[v]
    
                    }
                })
    
            },
            toMath() {

                Object.keys(this).forEach(v => {
                    if (typeof this[v] == 'object') {
    
                        Object.keys(this[v]).forEach(w => 
                            Object.defineProperty(Math, w, {
                                value: this[v][w],
                                enumerable: false
                            })
                        )
    
                    }
                })
                return Math

            }
        }
        unit = {
            length(i, from, to) {
                return i * (this.val[from] / this.val[to])
            },
            val: {
                Gm: 1e9,
                Mm: 1e6,
                km: 1e3,
                hm: 100,
                dam: 10,
                m: 1,
                dm: .1,
                cm: .01,
                mm: 1e-3,
                μm: 1e-6,
                nm: 1e-9,
                ly: 9460730472580800,
                mi: 1609.34,
                yd: 1/1.094,
                ft: 1/3.281,
                in: 1/39.37
            }
        }

    }
    
    var AM = new AdditionalMath
    This.AM = AM

})(this)