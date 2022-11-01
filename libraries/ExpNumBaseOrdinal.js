'use strict'

if (!window.ExpantaNum) throw ReferenceError('ExpantaNum.js is required to run.')
    
(EN => {

    let P = {}
    let S = {}

    P.modlog = function(base=10, shift=0) {
        return EN.div(this, EN.pow(base, this.logBase(base).sub(shift).floor())).mod(base)
    }
    P.tetrMod = function(base=10) {
        if (this.array[1][1] > 2) {
            let a = EN(this)
            a.array[0][1] /= 256
            if (a.array[0][1] < 1) {
                a.array[0][1] *= 1e10
                a.array[1][1] ++
            }
            a.array[1][1] = 2
            return a.logBase(base).logBase(base)
        } else {
            return this.logBase(base).logBase(base)
        }
    }
    P.ordinal = function(base=10, config={
        html:false,
        spaces:true,
        fixed:false,
        epsilon:-1,
        baseOut:null
    }) {
        const bl = (''+base).length
        const f = i => config.fixed ? (''+i).padStart(bl, 0) : i,
        s = () => {
            if (config.epsilon ?? -1 == -1) return 'ω'
            else return config.html ? `ε<sub>${config.epsilon}</sub>` : `ε_${config.epsilon}`
        }
        let o = [this]
        let l = EN.logBase(this, base).floor().add(1)
        let e = -1

        if (this.gte(EN.pent(base, 2))) {

            config.epsilon = 0
            return this.ordinal(EN.pent(base, 2), config)

        }

        if (this.slog(base).gte(8)) {
            return config.html
                ? `<sup>${this.slog(base).floor()}</sup>ω<sup>${this.tetrMod(base).floor().ordinal(base, config)}</sup>`
                : `ω${this.tetrMod(base).ordinal(base, config)}#${this.slog(base).floor()}`
        }

        if (this.gte(EN.tetr(base, 4))) {
            o = [this.modlog(base).floor()]
        } else if (this.gte(EN.tetr(base, 2))) {
            o = [
                this.modlog(base).floor(),
                this.modlog(base, 1).floor()
            ]
        } else {
            while (o[0].gte(base)) {
                o.unshift(o[0].div(base).floor())
                o[1] = o[1].mod(base)
                o.splice(53)
            }
        }

    
        return o.map((v,i) => {
            let p =l.sub(i).sub(1)
            if (EN.gte(p, base)) p = config.html ? p.ordinal(base, config) : `(${p.ordinal(base, config)})`
    
            if (v == 0) return // if zero
            if (v > 1 | config.fixed) { // if multiple
                if (p == 1) return f(v) + s()
                if (p == 0) return f(v)
                else return config.html ? f(v) + s() + (''+p).sup() : f(v) + s() + '^' + p
            } // if single
            if (p == 1) return s()
            if (p == 0) return '1'
            else return config.html ? s() + (''+p).sup() : s() + '^' + p

        }).filter(v=>v).join(config.spaces ? ' + ' : '+')
    }

    Object.assign(EN.prototype, P)

})(ExpantaNum)