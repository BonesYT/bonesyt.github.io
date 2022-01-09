function $(e) {
    return document.getElementById(e)
}

EN = ExpantaNum

var exp = EN(0),
    texp = EN(0),
    lvl = EN(0),
    req = EN(10),
    mul = EN(1.1),
    reqd = EN(10)

var buy = {
    add:function(i,r,m) {
        return EN.floor(EN.div(EN.ln(EN.div(EN.add(EN.div(i,EN.div(10,
               EN.sub(EN.mul(m,10),10))),r),r)),EN.ln(m)))
    },
    cost:function(a,r,m) {
        return EN.mul(EN.sub(EN.mul(EN.pow(m,a),r),r),EN.div(20,EN.sub(EN.mul(m,20),20)))
    }
}
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

function setexp() {
    texp = EN(prompt('Set Experience'))
    req = reqd
    exp = texp
    var add = buy.add(texp,req,mul)
    var cost = buy.cost(add,req,mul)
    exp = exp.sub(cost)
    lvl = add
    req = reqd.mul(mul.pow(add))
    update()
}
function setmul() {
    mul = EN(prompt('Set Multiplier Value'))
    update()
}
function setreq() {
    reqd = EN(prompt('Set Requirement Value'))
    update()
}

function update() {
    $('exp').innerHTML = 'Exp: ' + ts(exp)
    $('texp').innerHTML = 'TExp: ' + ts(texp)
    $('lvl').innerHTML = 'Level: ' + ts(lvl)
    $('mul').innerHTML = 'Multi: ' + ts(mul)
    $('req').innerHTML = 'Req.: ' + ts(req)
}

update()