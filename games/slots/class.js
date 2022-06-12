/* 0 = empty
   1 = 0
   2 = 1
   3 = 2
   4 = 5
   5 = 10
   6 = 00
*/

class Game {
    cred = 5e3
    won = 0
    playing = false
    bet = 100
    reels = new Reels
    twin = 0
    tloss = 0
    constructor() {
        this.reels.start()
    }
}
class Reels {
    symbols = [
        Array(5).fill(0), Array(3).fill(0), Array(3).fill(0)
    ]
    pos = [1, 1, 1]
    start() {
        this.symbols = this.symbols.map(v=>v.map((v,i)=>{
            var rnd = Math.random()
            var a = 1
            if (rnd >= 0.14) a = 2
            if (rnd >= 0.33) a = 3
            if (rnd >= 0.53) a = 4
            if (rnd >= 0.73) a = 5
            if (rnd >= 0.92) a = 6
            return a
        }))
    }
    spin(r, i) {
        var b, c

        b = this.pos[i]
        this.pos[i] += r
        b = r >= 0
            ? Math.floor(b % 1 + r)
            : ( Math.floor(b)!=Math.floor(b+r%1)
                    ? c = -1 : c = 0,
                c += Math.floor(r+1),
                b = Math.abs(c)
              )

        b = Math.max(Math.min(b, 3),0)

        this.symbols[i] = r >= 0
            ? this.symbols[i].splice(0, 5 - b)
            : this.symbols[i].splice(b, 5 - b)

        var c = Array(Math.max(Math.min(b, 5),0)).fill(0).map((v,j) => {
            var rnd = Math.random(), a

            if (Math.random() > 0.777) return 0

            switch (i) {
                case 0:
                                    a = 2
                    if (rnd >= 0.3) a = 3
                    if (rnd >= 0.6) a = 4
                    if (rnd >= 0.8) a = 5
                break; case 1:
                                     a = 1
                    if (rnd >= 0.60) a = 2
                    if (rnd >= 0.84) a = 4
                break; case 2:
                                     a = 1
                    if (rnd >= 0.54) a = 4
                    if (rnd >= 0.86) a = 6
                break
            }

            return a
        })

        this.symbols[i] = r >= 0
            ? c.concat(this.symbols[i])
            : this.symbols[i].concat(c)

    }
    setspin(reel, to) {
        this.spin(to - this.pos[reel], reel)
    }
}