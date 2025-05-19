function fromCharCode(i) { 
    return charsets[$('charset').value].charAt(i)
}
async function corrupt(I, m) {

    const ob = $('output'),
          s = I.length

    let set
    switch (m ?? mode) {
        case 0: set = {
            rnd: $('rnd').value / 100,
            min: +$('min').value,
            max: +$('max').value
        }; break
        case 1: set = {
            rnd: $('shfrnd').value / 100,
            min: +$('shfmin').value,
            max: +$('shfmax').value
        }; break
        case 2: set = {
            rnd: $('selrnd').value / 100,
            min: +$('selmin').value,
            max: +$('selmax').value
        }; break
        case 3: set = {
            rnd: $('adrnd').value / 100,
            adrnd: $('ad2rnd').value / 100,
            amin: +$('amin').value,
            amax: +$('amax').value,
            dmin: +$('dmin').value,
            dmax: +$('dmax').value,
        }; break
        case 4: set = {
            rnd: $('cprnd').value / 100,
            rarnd: $('rarnd').value / 100,
            smin: +$('smin').value,
            smax: +$('smax').value,
            cmin: +$('cmin').value,
            cmax: +$('cmax').value
        }; break
        case 5: set = {
            rnd: $('cprnd').value / 100,
            fnc: Function('char', 'index', 'input', 'length', 'charset', 'charSel', $('code').value)
        }; break
    }

    async function progupd(i) {

        if (i % 8192 == 0) {
            ob.innerHTML = `Setting byte ${i} of ${s}...`
            await new Promise(r => setTimeout(r(), 150))
        }

    }
    function rnd(x, y) {
        return Math.random() * (y - x) + x
    }
    function cycle(x, y) {
        return x < 0 ? (x % y + y) % y : x % y
    }

    let o = '', i, C = 0
    switch (mode) {

        case 0: // Replace
            for (i in I) {

                await progupd(i)

                if (Math.random() < set.rnd) {
                    C++
                    rnd(set.max, set.min)
                    o += fromCharCode(rnd(set.min, set.max + 1))
                } else o += I[i]

            }
        break; case 1: // Shift
            for (i in I) {

                await progupd(i)

                if (Math.random() < set.rnd) {
                    C++
                    o += fromCharCode(I.charCodeAt(i) + rnd(set.min, set.max + 1) & 255)
                } else o += I[i]

            }
        break; case 2: // Shuffle

            let t
            o = I.split('')
            for (i in I) {

                await progupd(i)

                if (Math.random() < set.rnd) {
                    
                    C += 2
                    t = Math.floor(i + rnd(Math.max(set.min, -i), Math.min(set.max, s - i)))
                    ;[o[i], o[t]] = [o[t], o[i]] // swap 2 items, i literally never knew thats possible

                }

            }
            o = o.join('')

        break; case 3: // Add/Del
            let sk
            for (i = 0; i < I.length; i++) {

                await progupd(i)

                if (Math.random() < set.rnd) {

                    if (Math.random() >= set.adrnd) { // +
                        o += I[i] + fromCharCode(rnd(set.amin, set.amax + 1))
                        C++
                    } else { // -
                        i += sk = Math.floor(rnd(set.dmin, set.dmax)) - 1
                        C += sk
                    }

                } else o += I[i]

            }
        break; case 4: // Copy & Paste
            let c, j
            for (i = 0; i < I.length; i++) {

                await progupd(i)

                if (Math.random() < set.rnd) {

                    j = i + rnd(Math.max(set.smin, -i), set.smax)
                    c = I.slice(j, j + rnd(Math.max(set.cmin, -i), set.cmax))

                    if (Math.random() >= set.adrnd) { // =
                        o += c
                        i += c.length - 1
                        C += c.length
                    } else { // +
                        o += I[i] + c
                        C += (I[i] + c).length
                    }

                } else o += I[i]

            }
        break; case 5: // Function

            function CodePoint(i = 0) {
                return fromCharCode(cycle(Math.floor(i), csch.length))
            }function Skip(j = 1) {
                return i += Math.min(Math.max(Math.floor(j), 0), s)
            }function SubStr(i) {
                return I.substring(i)
            }async function NativeCorrupt(s, m) {
                return (await corrupt(s, m)).out
            }

            let ch, cs = $('charset').value, csch = charsets[cs]
            for (i = 0; i < I.length; i++) {

                ch = set.fnc(I[i], i, I, I.length, cs, Math.random() < set.rnd)
                     .split('').map(v => !csch.includes(v) ? '?' : v)
                if (ch) o += ch

            }

        break

    }

    return {
        out: o,
        count: C
    }

}
let name
async function start() {

    const ob = $('output')
    try {

        if (loading) {alert('A file is still being changed.'); return}
        if (!ready) {alert('Please select a file first!'); return}
        loading = true
        let I
    
        ob.innerHTML = 'Uploading...'
    
        const cs = $('charset').value
        if (!content) {
            I = await upload()
            const s = I[1]
            name = I[2]
            content = I = new TextDecoder(cs).decode(
                await I[0].arrayBuffer()
            )
        } else I = content
    
        o = await corrupt(I)
        $('byte-modif').innerHTML = 'Modifications: ' + bitMeas(o.count)
        o = o.out
    
        let n = name.split('.')
        if (n[n.length - 2]) n[n.length - 2] += ' (Corrupted)'
        else n.unshift('Corrupted')
        n = n.join('.')
    
        ob.innerHTML = 'Downloading...'
    
        const b = await blob(o, cs)
        download(n, b)
        $('output-size').innerHTML = 'Output file size: ' + bitMeas(b.size)

    } catch (e) {

        loading = false
        alert(`Uh oh... Seems like there's an error (See in DevTools)\n\n${e}`)
        throw e

    }

    ob.innerHTML = 'Start!'
    loading = false

}
async function blob(data, cs='iso-8859-1') { // (ANSI as default charset)
  
    const d = (
        new TextEncoder(cs, {
            NONSTANDARD_allowLegacyEncoding: true,
            stream: true
        })
    ).encode(data)

    return new Blob([d]);

}