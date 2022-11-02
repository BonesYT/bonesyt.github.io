'use strict'
const RGBDecoder = {

    async decode(data, download = true) {

        const O = this
        let mode = $('mode').value,
            val =+ $('value').value
        let mulx = 1,    muly = 1

        const sort = [
            (a, b) => a - b,
            (a, b) => b - a
        ][$('E-value').value]

        if (mode.endsWith('rgb')) mulx = 3
        if (mode.endsWith('rgba')) mulx = 4
        if (mode.endsWith('rg-ba')) mulx = 2
        if (mode == '8') mulx = 4, muly = 2
        if (mode.startsWith(24)) mulx = 8, muly = 3
        if (mode.startsWith(32)) mulx = 8, muly = 4

        const out = new ImageData(data.width * mulx, data.height * muly)
        const w = data.width,
              ow = out.width,
              p = data.height * w,
              h = data.height,
              oh = out.height
        data = data.data

        function getPixel(x, y) {
            const pos = y == undefined ? x : (x + y * w) * 4
            return data.slice(pos, pos + 4)
        }
        function byteShift(x, s, m) {
            if (m == 0) return x >> s                   // shift to right
            if (m == 1) return x << s & 255             // shift to left
            if (m == 2) return x & ((1 << (8 - s)) - 1) // erase to right
            if (m == 3) return x >> s << s              // erase to left
        }
        function joinBytes(x, y, s) {
            const a = [
                byteShift(x, s, 2),
                byteShift(y, (8 - s), 0)
            ]
            return a[1] + (a[0] << s)
        }
        function getBitsAfter(b) {
            
            b = b % (data.length * 8)
            const pos = b >> 3
            const d = Array.from(data.slice(pos, pos + 5))
            if (d.length < 5) {
                for (let i = 0; i < 4; i++) d.push(data[i])
                d.splice(0, 5)
            }
            const m = b & 7
            if (!m) {
                d.pop()
                return d
            }
            return [
                joinBytes(d[0], d[1], m),
                joinBytes(d[1], d[2], m),
                joinBytes(d[2], d[3], m),
                joinBytes(d[3], d[4], m),
            ]

        }
        function setPixel(x, y, color) {

            if (typeof color == 'number') color = [color,color,color,255]
            const pos = (x + y * ow) * 4
            out.data[pos    ] = color[0]
            out.data[pos + 1] = color[1
            ]
            out.data[pos + 2] = color[2]
            out.data[pos + 3] = color[3]

        }
        function bin(x) {
            return [
                (c[0] & x) * 255,
                (c[1] & x) * 255,
                (c[2] & x) * 255,
                (c[3] & x) * 255
            ]
        }
        function getBit(b) {

            b = b % (data.length * 8)
            return Math.sign(data[b >> 3] & 1 << (b & 7 ^ 7))

        }
        function velBits(index, velocity) {

            let p, pos
            const o = []
            for (let i = 0; i < 4; i++) {

                p = index + velocity * i * 8

                o.push(
                    getBit(p               ) * 128 +
                    getBit(p + velocity    ) *  64 +
                    getBit(p + velocity * 2) *  32 +
                    getBit(p + velocity * 3) *  16 +
                    getBit(p + velocity * 4) *   8 +
                    getBit(p + velocity * 5) *   4 +
                    getBit(p + velocity * 6) *   2 +
                    getBit(p + velocity * 7)
                )

            }
            return o

        }
        function rgb(m) {

            let sorted = []
            if (m == 18) {
                let v, l = w * 4
                for (j = 0; j < h; j++) {
                    
                    v = data.slice(l * j, l * (j + 1))
                    v.sort(sort)
                    sorted.push(v)

                }
            } if (m == 19) {
                let v, u, l = w * 4, i
                for (j = 0; j < h; j++) { // each y
                    
                    v = data.slice(l * j, l * (j + 1)) // get all bytes in row
                    u = Array.from(v).map((v,i,a) => // compress 8bit to 32bit
                        i * 4 >= a.length ? undefined :
                        ((a[i * 4    ] & 255) << 24) +
                        ((a[i * 4 + 1] & 255) << 16) +
                        ((a[i * 4 + 2] & 255) << 8) +
                        (a[i * 4 + 3] & 255)
                    )
                    console.log(u)
                    u.sort(sort) // sort pixels
                    sorted.push(u.map((v,i,a) => // decompress, then add to sorted
                        a[i >> 2] >> ((i & 3 ^ 3) << 3) & 255
                    ))
                    console.log(v,u,u.map((v,i,a) => // decompress, then add to sorted
                    a[i >> 2] >> ((i & 3 ^ 3) << 3) & 255
                    ))

                }
            } if (m == 20) {

                if (!val) data.sort(sort) // sort bytes (haha this one is easy)
                else { // sort pixels

                    let u
                    u = Array.from(data).map((v,i,a) =>
                        i * 4 >= a.length ? undefined :
                        ((a[i * 4    ] & 255) << 24) +
                        ((a[i * 4 + 1] & 255) << 16) +
                        ((a[i * 4 + 2] & 255) << 8) +
                        (a[i * 4 + 3] & 255)
                    )
                    u.sort(sort)
                    data = u.map((v,i,a) =>
                        a[i >> 2] >> ((i & 3 ^ 3) << 3) & 255
                    )

                } // idk about sorting rows

            }

            let a
            for (i = 0; i < p; i++) {

                const v = [3, 4, 2, 4, 3, 4][m]

                x = i % w
                y = Math.floor(i / w)

                c = getPixel(x, y)

                if (m == 21) {
                    setPixel(x, y, velBits(i * 32 * val, val))
                }

                else if (m == 17) { // sort byt/pix
                    for (j = 0; j < 4; j++)
                        setPixel(x, y, c.sort(sort))
                } else if (m == 18 | m == 19) { // sort byt/row or pix/row
                    a = sorted[y]
                    setPixel(x, y, a.slice(x * 4, x * 4 + 4))
                } else if (m == 20) setPixel(x, y, getPixel(x, y)) // sort whole image.


                  else if (m == 15) {
                    setPixel(x, y, getPixel(x ^ val, y ^ val))
                } else if (m == 16) {
                    setPixel(x, y, getPixel(i ^ val))


                } else if (m == 14) {
                    setPixel(x    , y, [0, c[0], c[1], 255])
                    setPixel(x + w, y, [0, c[2], c[3], 255])

                } else if (m == 12 | m == 13) {
                    setPixel(x        , y, c[0])
                    setPixel(x + w    , y, c[1])
                    setPixel(x + w * 2, y, c[2])
                    if (m == 13) setPixel(x + w * 3, y, c[3])

                } else if (m == 11) {
                    setPixel(x, y, getBitsAfter(Math.floor(i * val)))


                } else if (m == 10) {
                    j = O.shuffle[val]
                    ;[c[0], c[1], c[2], c[3]] = [c[j[0]], c[j[1]], c[j[2]], c[j[3]]]
                    setPixel(x, y, c)

                } else if (m == 8)
                    setPixel(x, y, c.map(v => v ^ val))

                  else if (m == 9) {
                    c = (c[3] + (c[2] << 8) + (c[1] << 16) + (c[0] << 24)) ^ val
                    setPixel(x, y, [
                        c >> 24,
                        c >> 16 & 255,
                        c >> 8  & 255,
                        c       & 255
                    ])


                } else if (m == 4 | m == 5) {
                    for (k = 0; k < m - 1; k++) {
                        for (j = 0; j < 8; j++) {
                            setPixel(x * 8 + j, y * (m - 1) + k, (c[k] & 2 ** j) * 255)
                        }
                    }

                } else if (m == 6 | m == 7) {
                    for (I = 0; I < 8 * (m - 3); I++) {
                        j = [I&7,  Math.floor(I/(m - 3))]
                        k = [I>>3, I%(m - 3)]
                        setPixel(x * 8 + j[0], y * 3 + k[0], (c[k[1]] & 2 ** j[1]) * 255)
                    }

                } else if (m == 3) {
                    setPixel(x * v    , y * 2    , bin(1))
                    setPixel(x * v + 1, y * 2    , bin(2))
                    setPixel(x * v + 2, y * 2    , bin(4))
                    setPixel(x * v + 3, y * 2    , bin(8))
                    setPixel(x * v    , y * 2 + 1, bin(16))
                    setPixel(x * v + 1, y * 2 + 1, bin(32))
                    setPixel(x * v + 2, y * 2 + 1, bin(64))
                    setPixel(x * v + 3, y * 2 + 1, bin(128))

                } else if (m == 2) {
                    setPixel(x * v    , y, [0, c[0], c[1], 255])
                    setPixel(x * v + 1, y, [0, c[2], c[3], 255])

                } else {
                    setPixel(x * v    , y, c[0])
                    setPixel(x * v + 1, y, c[1])
                    setPixel(x * v + 2, y, c[2])
                    if (m == 1) setPixel(x * 4 + 3, y, c[3])
                }

            }

        }

        let x, y, i, c
        let j, k, I

        rgb([
            'rgb','rgba','rg-ba','8','24','32','24r',
            '32r','xorb','xorf','chord','step','lrgb', // 7
            'lrgba','lrg-ba','xorp','xorm','sortbp', // 13
            'sortbr','sortpr','sorta','vel' // 18
        ].indexOf(mode))

        if (download) {

            const canvas = document.createElement('canvas')
            canvas.width = out.width
            canvas.height = out.height
            const ctx = canvas.getContext('2d')
            ctx.putImageData(out, 0, 0)
    
            this.download(canvas, prompt('Enter file name to download (blank for default)') || f.name.replace(/\..+/,'') + ' (RGB-separated).png')
    
            canvas.toBlob(b => {
                $('output-size').innerHTML = 'Output file size: ' + bitMeas(b.size)
            })

        }

        return out

    },
    encode(f) {

    },
    async imageData(f) {

        const img = new Image
        img.src = URL.createObjectURL(f)
        await new Promise(r => {
            img.onload = r
        })
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        return ctx.getImageData(0, 0, img.width, img.height)

    },
    download(c, n) {

        const fn = n.split('.')[0],      fe = n.split('.')[1] ?? 'png'

        const a = document.createElement('a')
        a.href = c.toDataURL('image/' + fe)
        a.download = `${fn}.${fe}`
        a.click()

    },
    shuffle: [ // remove the leading zeroes or it just becomes octal literals for some reason?
         123, 132, 213, 231, 312, 321,
        1023,1032,1203,1230,1302,1320,
        2013,2031,2103,2130,2301,2310,
        3012,3021,3102,3120,3201,3210
    ]

}
RGBDecoder.shuffle = RGBDecoder.shuffle.map(v => v.toString().padStart(4, 0))