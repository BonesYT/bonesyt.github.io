const charsets = {
    'utf-8': [[0, 256]],
    'utf-16be': [[0, 65536]],
    'windows-1252': [
        [32,128],8364,129,8218,402,8222,8230,8224,8225,710,8240,352,8294,338,
        141,381,143,144,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,
        339,157,382,376,[160,256]
    ],
    'us-ascii': [[0, 128]]
}

Object.keys(charsets).forEach(v => {

    let o = []
    charsets[v].forEach(v => {

        if (typeof v == 'object') {

            for (let i = v[0]; i < v[1]; i++) {
                o.push(String.fromCharCode(i))
            }

        } else o.push(String.fromCharCode(v))

    })
    charsets[v] = o.join('')

})
charsets['utf-16le'] = charsets['utf-16be']