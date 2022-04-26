function fb(i,f) {
    return EN.div(EN.floor(EN.mul(i,f)),f)
}
function ts(i,ep=6,en=-6,f=100,a=0) {
    i = EN(i)
    var neg = EN.isneg(i)
    if (neg) i=EN.mul(i,-1)
    var log = EN.log10(i)
    if (EN(i).isInfinite()) return EN(Infinity)
    if (EN.gte(EN.log10(EN.log10(EN.log10(EN.log10(log)))),0)) {
        var r = '10^^' + (r2=EN.slog(i),EN.gte(EN.log(r2),ep)?ts(r2,ep,en,f,a+1):fb(r2,f))
        return neg?'-'+r:r
    } else {
        if ((log>=ep | log<=en) & a<10 & !(i==0)) {
            if (log.lt('e'+ep)) {
                var r = i.div(EN.pow(10, log.floor())).mul(f).floor().div(f) + 'e' + log.floor()
            } else {
                var e = ''
                var amm = Number(EN(i).slog(10).sub(EN.slog(ep)))-0.9999999
                var r = i
                for (i=0; i<amm; i++) {
                    e += 'e'
                    r = r.log10()
                }
                r = e + r.mul(f).floor().div(f)
            }
            return (neg?EN.mul(r,-1):r).toString()
        } else {
            return fb(neg?i*-1:i,f).toString()
        }
    }
}