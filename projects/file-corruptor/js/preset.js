function exp() {

    const o = {
        ver: 1,
        date: Date.now(),
        mode: mode,
        br: {
            rnd: $('rnd').value / 100,
            min: +$('min').value,
            max: +$('max').value
        },
        bs: {
            rnd: $('shfrnd').value / 100,
            min: +$('shfmin').value,
            max: +$('shfmax').value
        },
        bh: {
            rnd: $('selrnd').value / 100,
            min: +$('selmin').value,
            max: +$('selmax').value
        },
        ba: {
            rnd: $('adrnd').value / 100,
            adrnd: $('ad2rnd').value / 100,
            amin: +$('amin').value,
            amax: +$('amax').value,
            dmin: +$('dmin').value,
            dmax: +$('dmax').value,
        },
        cp: {
            rnd: $('cprnd').value / 100,
            rarnd: $('rarnd').value / 100,
            smin: +$('smin').value,
            smax: +$('smax').value,
            cmin: +$('cmin').value,
            cmax: +$('cmax').value
        }
    }

    $('preset').value = btoa(JSON.stringify(o))

}
function imp() {

    let o
    try {
        o = JSON.parse(atob($('preset').value))
    } catch {
        alert('Your preset code is invalid. (Decode error)')
        return
    }

    try {
        Object.keys(o).forEach(v => 
            Object.keys(o[v]).forEach(w => {
                if (isNaN(+o[v][w]) | o[v][w] == null) throw 0
            })
        )

        $('rnd').value = o.br.rnd * 100
        $('min').value = o.br.min
        $('max').value = o.br.max
        $('shfrnd').value = o.bs.rnd * 100
        $('shfmin').value = o.bs.min
        $('shfmax').value = o.bs.max
        $('selrnd').value = o.bh.rnd * 100
        $('selmin').value = o.bh.min
        $('selmax').value = o.bh.max
        $('adrnd').value = o.ba.rnd * 100
        $('ad2rnd').value = o.ba.adrnd * 100
        $('amin').value = o.ba.amin
        $('amax').value = o.ba.amax
        $('dmin').value = o.ba.dmin
        $('dmax').value = o.ba.dmax
        $('cprnd').value = o.cp.rnd * 100
        $('rarnd').value = o.cp.rarnd * 100
        $('smin').value = o.cp.smin
        $('smax').value = o.cp.smax
        $('cmin').value = o.cp.cmin
        $('cmax').value = o.cp.cmax
    
        $(tabs[mode = o.mode]).click()
        upd()
    } catch {alert('Your preset code is invalid. (Reference/value error)')}

}