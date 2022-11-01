/* deprecated */

function Value(input) {
    this.value = input
    this.typeof = typeof this.value
    this.setValue = (i, v)=>{
        return v ? new Value(i) : i
    }
    this.set = i=>{i = this.out(i)
        return new Value(i)
    }
    switch (typeof this.value) {
        case 'number':
            this.out = i=>{
                if (typeof i == 'object') {
                    return i.value
                } else {
                    return Number(i)
                }
            }
            this.add = i=>{i = this.out(i)
                return new Value(this.value + i)
            }
            this.subtract = i=>{i = this.out(i)
                return new Value(this.value - i)
            }
            this.multiply = i=>{i = this.out(i)
                return new Value(this.value * i)
            }
            this.divide = i=>{i = this.out(i)
                return new Value(this.value / i)
            }
            this.exponentiate = i=>{i = this.out(i)
                return new Value(this.value ** i)
            }
            this.negate = (i=0)=>{i = this.out(i)
                return new Value(i - this.value)
            }
            this.invert = (i=1)=>{i = this.out(i)
                return new Value(i / this.value)
            }
            this.base = i=>{i = this.out(i)
                return new Value(i ** this.value)
            }
            this.double = ()=>{
                return new Value(this.value * 2)
            }
            this.triple = ()=>{
                return new Value(this.value * 3)
            }
            this.half = ()=>{
                return new Value(this.value / 2)
            }
            this.square = ()=>{
                return new Value(this.value ** 2)
            }
            this.cube = ()=>{
                return new Value(this.value ** 3)
            }
            this.ten = ()=>{
                return new Value(this.value * 10)
            }
            this.divten = ()=>{
                return new Value(this.value / 10)
            }
            this.and = i=>{i = this.out(i)
                return new Value(this.value & i)
            }
            this.or = i=>{i = this.out(i)
                return new Value(this.value | i)
            }
            this.xor = i=>{i = this.out(i)
                return new Value(this.value ^ i)
            }
            this.and2 = i=>{i = this.out(i)
                return new Value(this.value && i)
            }
            this.or2 = i=>{i = this.out(i)
                return new Value(this.value || i)
            }
            this.equals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value == i, v)
            }
            this.exact = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value === i, v)
            }
            this.greaterThan = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value > i, v)
            }
            this.lessThan = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value < i, v)
            }
            this.greaterOrEquals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value >= i, v)
            }
            this.lessOrEquals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value <= i, v)
            }
            this.isNaN = v=>{
                return this.setValue(isNaN(this.value), v)
            }
            this.isInfinite = v=>{
                return this.setValue(this.value == Infinity, v)
            }
            this.isFinite = v=>{
                return this.setValue(!this.isInfinite(), v)
            }
            this.isNegative = (inc=false,v=false)=>{
                if (inc) {return this.setValue(this.value <= 0, v)}
                else {return this.setValue(this.value < 0, v)}
            }
            this.isPositive = (inc=false,v=false)=>{
                if (inc) {return this.setValue(this.value >= 0, v)}
                else {return this.setValue(this.value > 0, v)}
            }
            this.isZero = v=>{
                return this.setValue(this.value == 0, v)
            }
            this.boolean = (v=false)=>{
                return this.setValue(Boolean(this.value), v)
            }
            this.floor = ()=>{
                return new Value(Math.floor(this.value))
            }
            this.round = ()=>{
                return new Value(Math.round(this.value))
            }
            this.ceiling = ()=>{
                return new Value(Math.ceil(this.value))
            }
            this.sin = ()=>{
                return new Value(Math.sin(this.value))
            }
            this.asin = ()=>{
                return new Value(Math.asin(this.value))
            }
            this.sinh = ()=>{
                return new Value(Math.sinh(this.value))
            }
            this.asinh = ()=>{
                return new Value(Math.asinh(this.value))
            }
            this.cos = ()=>{
                return new Value(Math.cos(this.value))
            }
            this.acos = ()=>{
                return new Value(Math.acos(this.value))
            }
            this.cosh = ()=>{
                return new Value(Math.cosh(this.value))
            }
            this.acosh = ()=>{
                return new Value(Math.acosh(this.value))
            }
            this.tan = ()=>{
                return new Value(Math.tan(this.value))
            }
            this.atan = ()=>{
                return new Value(Math.atan(this.value))
            }
            this.tanh = ()=>{
                return new Value(Math.tanh(this.value))
            }
            this.atanh = ()=>{
                return new Value(Math.atanh(this.value))
            }
            this.absolute = ()=>{
                return new Value(Math.abs(this.value))
            }
            this.sign = ()=>{
                return new Value(Math.sign(this.value))
            }
            this.compare = (i,t,v)=>{i = this.out(i)
                if (t) {
                    return this.setValue(Math.sign(i-this.value),v)
                } else {
                    var a = Math.sign(i-this.value)
                    switch (a) {
                        case -1: return '<'; break
                        case 0: return '='; break
                        case 1: return '>'; break
                    }
                }
            }
            this.sqrt = ()=>{
                return new Value(Math.sqrt(this.value))
            }
            this.cbrt = ()=>{
                return new Value(Math.cbrt(this.value))
            }
            this.nroot = (i=2)=>{i = this.out(i)
                return new Value(this.value ** (1 / i))
            }
            this.log = ()=>{
                return new Value(Math.log(this.value))
            }
            this.log10 = ()=>{
                return new Value(Math.log10(this.value))
            }
            this.log2 = ()=>{
                return new Value(Math.log2(this.value))
            }
            this.logbase = i=>{i = this.out(i)
                return new Value(Math.log(this.value) / Math.log(i))
            }
            this.clz32 = ()=>{
                return new Value(Math.clz32(this.value))
            }
            this.clz32 = ()=>{
                return new Value(Math.clz32(this.value))
            }
            this.fround = ()=>{
                return new Value(Math.fround(this.value))
            }
            this.hypot = (at, ...a)=>{a.forEach(v=>{v = this.out(v)})
                a.splice(at, 0, this.value)
                return new Value(Math.hypot.apply(null, a))
            }
            this.exp = ()=>{
                return new Value(Math.exp(this.value))
            }
            this.expm1 = ()=>{
                return new Value(Math.expm1(this.value))
            }
            this.imul = i=>{i = this.out(i)
                return new Value(Math.imul(this.value, i))
            }
            this.trunc = ()=>{
                return new Value(Math.trunc(this.value))
            }
            this.log1p = ()=>{
                return new Value(Math.log1p(this.value))
            }
            this.maximum = (...i)=>{i.forEach(v=>{v = this.out(v)})
                i.push(this.value)
                return new Value(Math.max.apply(null, i))
            }
            this.minimum = (...i)=>{i.forEach(v=>{v = this.out(v)})
                i.push(this.value)
                return new Value(Math.min.apply(null, i))
            }
            this.arrayRepeat = (i,v)=>{i = this.out(i)
                var o = []
                for (var i2 = 0; i2 < i; i2++) {
                    o.push(this.value)
                }
                return this.setValue(o)
            }
            this.toFixed = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.toFixed(i), v)
            }
            this.toExponential = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.toExponential(i), v)
            }
            this.toString = v=>{
                return this.setValue(this.value.toString(), v)
            }
            this.bigint = v=>{
                return this.setValue(BigInt(this.value), v)
            }
            this.sub = this.subtract
            this.mul = this.multiply
            this.div = this.divide
            this.division = this.div
            this.power = this.exponentiate
            this.pow = this.power
            this.neg = this.negate
            this.inv = this.invert
            this.doub = this.double
            this.trip = this.triple
            this.sqr = this.square
            this.cb = this.cube
            this.dt = this.divten
            this.eq = this.equals
            this.ex = this.exact
            this.gt = this.greaterThan
            this.lt = this.lessThan
            this.gte = this.greaterOrEquals
            this.lte = this.lessOrEquals
            this.comp = this.compare
            this.max = this.maximum
            this.min = this.minimum
            this.abs = this.absolute
            this.ceil = this.ceiling
            this.isinf = this.isInfinite
            this.isfin = this.isFinite
            this.toexp = this.toExponential
            this.tofix = this.toFixed
            this.isneg = this.isNegative
            this.ispos = this.isPositive
        break
        case 'string':
            this.out = i=>{
                if (typeof i == 'object') {
                    return i.value
                } else {
                    return String(i)
                }
            }
            this.push = i=>{i = this.out(i)
                return new Value(this.value.toString() + i.toString())
            }
            this.behind = i=>{i = this.out(i)
                return new Value(i + this.value)
            }
            this.boolean = v=>{
                return this.setValue(Boolean(this.value), v)
            }
            this.number = v=>{
                return this.setValue(Number(this.value), v)
            }
            this.none = v=>{
                return new Value('')
            }
            this.html = i=>{i = this.out(i)
                return new Value(`<${i}>${this.value}</${i}>`)
            }
            this.split = (i, v)=>{i = this.out(i)
                return this.setValue(this.value.split(i), v)
            }
            this.toUpperCase = ()=>{
                return new Value(this.value.toUpperCase())
            }
            this.toLowerCase = ()=>{
                return new Value(this.value.toLowerCase())
            }
            this.replace = (i, x)=>{i = this.out(i)
                return new Value(this.value.replace(i, x))
            }
            this.concat = (...i)=>{i.forEach(v=>{v = this.out(v)})
                return new Value(this.value.concat.apply(this.value, i))
            }
            this.unconcat = (...i)=>{i.forEach(v=>{v = this.out(v)})
                return new Value(i.join('') + this.value)
            }
            this.inconcat = (at, ...i)=>{i.forEach(v=>{v = this.out(v)})
                i = i.join('')
                var j = this.value.split('')
                j.splice(at, 0, i)
                j = j.join('')
                return new Value(j)
            }
            this.reverse = ()=>{
                var a = this.value.split(''), b = ''
                a.forEach((v,i)=>{
                    b += a[a.length - i - 1]
                })
                return b
            }
            this.forEach = f=>{
                for (var i = 0; i < this.value.length; i++) {
                    f(this.value[i], i, this.value)
                }
            }
            this.at = i=>{i = this.out(i)
                return new Value(this.value[i])
            }
            this.startsWith = (i,v)=>{i = this.out(i)
                return this.setValue(this.value[0]==i,v)
            }
            this.endsWith = (i,v)=>{i = this.out(i)
                return this.setValue(this.value[this.value.length-1]==i,v)
            }
            this.charCodeAt = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.charCodeAt(i),v)
            }
            this.trim = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.trim(i),v)
            }
            this.trimEnd = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.trimRight(i),v)
            }
            this.trimStart = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.trimLeft(i),v)
            }
            this.padEnd = (i,x,v)=>{i = this.out(i); x = this.out(x)
                return this.setValue(this.value.padEnd(i,x),v)
            }
            this.padStart = (i,x,v)=>{i = this.out(i); x = this.out(x)
                return this.setValue(this.value.padStart(i,x),v)
            }
            this.includes = (i,v)=>{i = this.out(i)
                return this.setValue(this.value.includes(i),v)
            }
            this.toString = v=>{
                return this.setValue(this.value,v)
            }
            this.equals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value == i, v)
            }
            this.exact = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value === i, v)
            }
            this.parse = i=>{
                return this.setValue(JSON.parse(this.value),v)
            }
            this.call = v=>{
                return this.setValue(new Function(this.value)(), v)
            }
            this.toFunction = v=>{
                return this.setValue(new Function(this.value), v)
            }
            this.bh = this.behind
            this.bool = this.boolean
            this.tuc = this.toUpperCase
            this.tlc = this.toLowerCase
            this.cc = this.concat
            this.ucc = this.unconcat
            this.icc = this.inconcat
            this.rev = this.reverse
            this.fe = this.forEach
            this.sw = this.startsWith
            this.ew = this.endsWith
            this.cca = this.charCodeAt
            this.te = this.trimEnd
            this.ts = this.trimStart
            this.pe = this.padEnd
            this.ps = this.padStart
            this.inc = this.includes
            this.eq = this.equals
            this.ex = this.exact
            this.tofunc = this.toFunction
            this.length = this.value.length
        break
        case 'boolean':
            this.out = i=>{
                if (typeof i == 'object') {
                    return i.value
                } else {
                    return Boolean(i)
                }
            }
            this.not = ()=>{
                return new Value(!this.value)
            }
            this.and = i=>{i = this.out(i)
                return new Value(Boolean(this.value & i))
            }
            this.or = i=>{i = this.out(i)
                return new Value(Boolean(this.value | i))
            }
            this.xor = i=>{i = this.out(i)
                return new Value(Boolean(this.value ^ i))
            }
            this.and2 = i=>{i = this.out(i)
                return new Value(Boolean(this.value && i))
            }
            this.or2 = i=>{i = this.out(i)
                return new Value(Boolean(this.value || i))
            }
            this.number = v=>{
                return this.setValue(this.value?1:0,v)
            }
            this.bigint = v=>{
                return this.setValue(this.value?1n:0n,v)
            }
            this.toString = v=>{
                return this.setValue(this.value.toString(),v)
            }
            this.nand = i=>{i = this.out(i)
                return new Value(!Boolean(this.value & i))
            }
            this.nor = i=>{i = this.out(i)
                return new Value(!Boolean(this.value | i))
            }
            this.nxor = i=>{i = this.out(i)
                return new Value(!Boolean(this.value ^ i))
            }
            this.nand2 = i=>{i = this.out(i)
                return new Value(!Boolean(this.value && i))
            }
            this.nor2 = i=>{i = this.out(i)
                return new Value(!Boolean(this.value || i))
            }
            this.Infinity = v=>{
                return this.setValue(this.value?Infinity:-Infinity,v)
            }
            this.inf = this.Infinity
            this.num = this.number
            this.big = this.bigint
        break
        case 'object':
            if (Array.isArray(this.value)) {
                this.out = i=>{
                    if (typeof i == 'object') {
                        return i.value
                    } else {
                        if (Array.isArray(i)) {
                            return i
                        } else {
                            return Array(i)
                        }
                    }
                }
                this.push = (...i)=>{i.forEach(v=>{v = this.out(v)})
                    var a = this.value
                    a.push.apply(a, i)
                    return new Value(a)
                }
                this.behind = (...i)=>{i.forEach(v=>{v = this.out(v)})
                    i.push.apply(i, this.value)
                    return new Value(i)
                }
                this.remove = (...i)=>{i.forEach(v=>{v = this.out(v)})
                    var a = this.value
                    i.forEach(v=>{
                        a.splice(v, 1)
                    })
                }
                this.at = (ia, v, ...i)=>{i.forEach(v=>{v = this.out(v)})
                    if (ia) {
                        var a = []
                        i.forEach(v=>{
                            a.push(this.value[v])
                        })
                        return this.setValue(a,v)
                    } else {
                        return this.setValue(this.value[i[0]],v)
                    }
                }
                this.indexOf = (ia, v, ...i)=>{i.forEach(v=>{v = this.out(v)})
                    if (ia) {
                        var a = []
                        i.forEach(v=>{
                            a.push(this.value.indexOf(v))
                        })
                        return this.setValue(a,v)
                    } else {
                        return this.setValue(this.value.indexOf(i[0]),v)
                    }
                }
                this.inconcat = (at, ...i)=>{i.forEach(v=>{v = this.out(v)})
                    var a = this.value
                    var b = [at, 0]
                    b.push.apply(b, i)
                    a.splice.apply(a, b)
                    return new Value(a)
                }
                this.toString = v=>{
                    return this.setValue(this.value.toString(),v)
                }
                this.toObject = v=>{
                    return this.setValue(Object.assign({}, this.value),v)
                }
                this.stringify = v=>{
                    return this.setValue(JSON.stringify(this.value),v)
                }
                this.reverse = ()=>{
                    var b = []
                    this.value.forEach((v,i)=>{
                        b.push(this.value[this.value.length - i - 1])
                    })
                    return b
                }
                this.sort = ()=>{
                    return new Value(this.value.sort())
                }
                this.includes = (i,v)=>{i = this.out(i)
                    return this.setValue(i < this.value.length, v)
                }
                this.includesValue = (i,v)=>{i = this.out(i)
                    return this.setValue(this.value.includes(i), v)
                }
                this.join = (i,v)=>{
                    return this.setValue(this.value.join(i), v)
                }
                this.bh = this.behind
                this.rem = this.remove
                this.index = this.indexOf
                this.inc = this.includes
                this.incv = this.includesValue
                this.string = this.stringify
                this.toobj = this.toObject
                this.rev = this.reverse
                this.icc = this.inconcat
            } else {
                this.out = i=>{
                    if (typeof i == 'object') {
                        return i.value
                    } else {
                        return Object(i)
                    }
                }
                this.keys = v=>{
                    return this.setValue(Object.keys(this.value),v)
                }
                this.includes = (i,v)=>{i = this.out(i)
                    return this.setValue(Object.keys(this.value).includes(i),v)
                }
                this.includesValue = (i,v)=>{i = this.out(i)
                    return this.setValue(Object.values(this.value).includes(i),v)
                }
                this.stringify = v=>{
                    return this.setValue(JSON.stringify(this.value),v)
                }
                this.toArray = v=>{
                    return this.setValue(Object.values(this.value),v)
                }
                this.replaceAll = f=>{
                    var i = this.value
                    var a = i=>{
                        Object.keys(i).forEach(v=>{
                            if (typeof i[v] == 'object') {
                                a(i[v])
                            } else {
                                i[v] = f(i[v])
                            }
                        })
                    }
                    a(i)
                }
                this.at = (i,v)=>{i = this.out(i)
                    return this.setValue(this.value[i],v)
                }
                this.indexOf = (i,v)=>{i = this.out(i)
                    return this.setValue(Object.keys(this.value).indexOf(i),v)
                }
                this.push = (n,i)=>{i = this.out(i)
                    var a = this.value
                    a[n] = i
                    return new Value(a)
                }
                this.remove = i=>{i = this.out(i)
                    var a = {}
                    Object.keys(this.value).forEach(v=>{
                        if (v!=i) {
                            a[v] = this.value[v]
                        }
                    })
                    return new Value(a)
                }
                this.toString = v=>{
                    return this.setValue(this.value.toString(),v)
                }
                this.rem = this.remove
                this.index = this.indexOf
                this.repall = this.replaceAll
                this.inc = this.includes
                this.incv = this.includesValue
                this.string = this.stringify
                this.toarr = this.toArray
            }
        break
        case 'bigint':
            this.out = i=>{
                if (typeof i == 'object') {
                    return i.value
                } else {
                    return BigInt(i)
                }
            }
            this.add = i=>{i = this.out(i)
                return new Value(this.value + BigInt(i))
            }
            this.subtract = i=>{i = this.out(i)
                return new Value(this.value - BigInt(i))
            }
            this.multiply = i=>{i = this.out(i)
                return new Value(this.value * BigInt(i))
            }
            this.divide = i=>{i = this.out(i)
                return new Value(this.value / BigInt(i))
            }
            this.exponentiate = i=>{i = this.out(i)
                return new Value(this.value ** BigInt(i))
            }
            this.negate = (i=0)=>{i = this.out(i)
                return new Value(BigInt(i) - this.value)
            }
            this.invert = (i=1)=>{i = this.out(i)
                return new Value(BigInt(i) / this.value)
            }
            this.base = i=>{i = this.out(i)
                return new Value(BigInt(i) ** this.value)
            }
            this.double = ()=>{
                return new Value(this.value * 2n)
            }
            this.triple = ()=>{
                return new Value(this.value * 3n)
            }
            this.half = ()=>{
                return new Value(this.value / 2n)
            }
            this.square = ()=>{
                return new Value(this.value ** 2n)
            }
            this.cube = ()=>{
                return new Value(this.value ** 3n)
            }
            this.ten = ()=>{
                return new Value(this.value * 10n)
            }
            this.divten = ()=>{
                return new Value(this.value / 10n)
            }
            this.and = i=>{i = this.out(i)
                return new Value(this.value & BigInt(i))
            }
            this.or = i=>{i = this.out(i)
                return new Value(this.value | BigInt(i))
            }
            this.xor = i=>{i = this.out(i)
                return new Value(this.value ^ BigInt(i))
            }
            this.and2 = i=>{i = this.out(i)
                return new Value(this.value && BigInt(i))
            }
            this.or2 = i=>{i = this.out(i)
                return new Value(this.value || BigInt(i))
            }
            this.equals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value == BigInt(i), v)
            }
            this.exact = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value === BigInt(i), v)
            }
            this.greaterThan = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value > BigInt(i), v)
            }
            this.lessThan = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value < BigInt(i), v)
            }
            this.greaterOrEquals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value >= BigInt(i), v)
            }
            this.lessOrEquals = (i,v=false)=>{i = this.out(i)
                return this.setValue(this.value <= BigInt(i), v)
            }
            this.toString = v=>{
                return this.setValue(this.value.toString(), v)
            }
            this.number = v=>{
                return this.setValue(Number(this.value), v)
            }
            this.boolean = v=>{
                return this.setValue(Boolean(this.value), v)
            }
            this.sub = this.subtract
            this.mul = this.multiply
            this.div = this.divide
            this.division = this.div
            this.power = this.exponentiate
            this.pow = this.power
            this.neg = this.negate
            this.inv = this.invert
            this.doub = this.double
            this.trip = this.triple
            this.sqr = this.square
            this.cb = this.cube
            this.dt = this.divten
            this.eq = this.equals
            this.ex = this.exact
            this.gt = this.greaterThan
            this.lt = this.lessThan
            this.gte = this.greaterOrEquals
            this.lte = this.lessOrEquals
            this.num = this.number
            this.bool = this.boolean
        break
        case 'function':
            this.out = i=>{
                if (typeof i == 'object') {
                    return i.value
                } else {
                    if (typeof i == 'function') {
                        return i
                    } else {
                        return Function(i)
                    }
                }
            }
            this.toString = v=>{
                return this.setValue(this.value.toString(),v)
            }
            this.getArguments = v=>{
                var s=this.value.toString(),
                    i=1,
                    a='',
                    p=0
                if (s[0]=='f') {
                    var q = 1
                    while (!(s[0]=='('|(s[0]==' '&q==0))) {
                        s=s.slice(1)
                        if (s[0]==' '&q==1) {
                            q=0
                            s=s.slice(1)
                        }
                    }
                }
                if (s[0]!='(') {
                    i=0
                    while (s[i]!='='|p!=0){
                        a += s[i]
                        if (s[i]=='(') p++
                        if (s[i]==')') p--
                        if (s[i]=='{') p++
                        if (s[i]=='}') p--
                        i++
                    }
                } else {
                    while (s[i]!=')'|p!=0){
                        a += s[i]
                        if (s[i]=='(') p++
                        if (s[i]==')') p--
                        i++
                    }
                }
                a=a.split(',')
                a=a.map(v=>{
                    var a = v.trimStart()
                    a = a.replace(/(?<==).*/gm, '')
                    if (a.includes('=')) a = a.slice(0, -1)
                    return a
                })
                if (a.length==1&a[0]=='') {return this.setValue([],v)}
                return this.setValue(a,v)
            }
            this.getArgsAll = v=>{
                var s=this.value.toString(),
                    i=1,
                    a='',
                    p=0
                if (s[0]=='f') {
                    var q = 1
                    while (!(s[0]=='('|(s[0]==' '&q==0))) {
                        s=s.slice(1)
                        if (s[0]==' '&q==1) {
                            q=0
                            s=s.slice(1)
                        }
                    }
                }
                if (s[0]!='(') {
                    i=0
                    while (s[i]!='='|p!=0){
                        a += s[i]
                        if (s[i]=='(') p++
                        if (s[i]==')') p--
                        if (s[i]=='{') p++
                        if (s[i]=='}') p--
                        i++
                    }
                } else {
                    while (s[i]!=')'|p!=0){
                        a += s[i]
                        if (s[i]=='(') p++
                        if (s[i]==')') p--
                        i++
                    }
                }
                a=a.split(',')
                a=a.map(v=>{
                    return v.trimStart()
                })
                if (a.length==1&a[0]=='') {return this.setValue([],v)}
                return this.setValue(a,v)
            }
            this.getCommand = v=>{
                var s=this.value.toString(),
                    i=1,
                    p=0
                if (s[0]=='f') {
                    var q = 1
                    while (!(s[0]=='('|(s[0]==' '&q==0))) {
                        s=s.slice(1)
                        if (s[0]==' '&q==1) {
                            q=0
                            s=s.slice(1)
                        }
                    }
                }
                if (s[0]!='(') {
                    i=0
                    while (s[i]!='='|p!=0){
                        if (s[i]=='(') p++
                        if (s[i]==')') p--
                        if (s[i]=='{') p++
                        if (s[i]=='}') p--
                        i++
                    }
                } else {
                    while (s[i]!=')'|p!=0){
                        if (s[i]=='(') p++
                        if (s[i]==')') p--
                        i++
                    }
                }
                i+=s[0]=='('?(s[i+1]==' '?3:(s[i+1]=='{'?2:4)):3
                p=0
                var a=''
                while (s[i]!='}'|p!=0) {
                    a += s[i]
                    if (s[i]=='{') p++
                    if (s[i]=='}') p--
                    i++
                }
                return this.setValue(a,v)
            }
            this.getLines = v=>{
                var a = this.getCommand()
                a = a.split('\n')
                if (a.length==1&a[0]=='') {return this.setValue([],v)}
                a = a.map(v=>{return v.trimStart()})
                if (a[0]=='') a.shift()
                if (a[a.length-1]=='') a.pop()
                return this.setValue(a,v)
            }
            this.apply = i=>{i = this.out(i)
                this.value.apply(null, i)
            }
            this.call = (...i)=>{i.forEach(v=>{v = this.out(v)})
                this.apply(i)
            }
            this.getargs = this.getArguments
            this.gaa = this.getArgsAll
            this.getcmd = this.getCommand
            this.getl = this.getLines
        break
        case 'undefined':
            this.out = i=>{
                if (typeof i == 'object') {
                    return i.value
                } else {
                    return i
                }
            }
            this.toString = v=>{
                return this.setValue('undefined',v)
            }
            this.boolean = v=>{
                return this.setValue(false,v)
            }
            this.number = v=>{
                return this.setValue(0,v)
            }
            this.bigint = v=>{
                return this.setValue(0n,v)
            }
            this.num = this.number
            this.bool = this.boolean
        break
    }
}