var $=e=>document.getElementById(e)

function Game() {
    this.wins = 0
    this.moves = 0
    this.tmoves = 0
    this.bmoves = 0
    this.time = 0
    this.since = Date.now()
    this.best = 1e3
    this.skips = 0
    this.map = {
        colors: [],
        colorsw: [],
        tiles: [],
        wtiles: [],
        place: [],
    }
    this.config = {
        elements: [3, 7]
    }
    this.select = {
        a: undefined,
        b: undefined
    }
}

var game = new Game

f = {
    genWait(a) {
        var e
        for (var i = 0; i < a; i++) {
            e = document.createElement('td')
            $('tiles').appendChild(e)
        }
    },
    newTiles(i=0) {
        var b = [i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i],
            a = [[...b],[...b],[...b],[...b],
                 [...b],[...b],[...b],[...b],
                 [...b],[...b],[...b],[...b],
                 [...b],[...b],[...b],[...b]]
        return [...a]
    },
    creTiles() {
        $('grid').querySelectorAll('*').forEach(v=>v.remove())
        var a, b, c
        for (var y = 0; y < 16; y++) {
            a = document.createElement('tr')
            for (var x = 0; x < 16; x++) {
                b = document.createElement('td')
                b.id = f.toid(x, y)
                b.addEventListener('click', e => {
                    var a = e.srcElement.id,
                        x =1* (a[1]+a[2]),
                        y =1* (a[3]+a[4])
                    try {
                        if (game.select.a[1] == x & game.select.a[2] == y) return
                    } catch {}
                    if (game.map.place[x][y] == 0 | game.map.place[x][y] == 2) return
                    if (!game.select.a) {
                        game.select.a = [0, x, y]
                        e.srcElement.className = 'select'
                    } else if (!game.select.b) {
                        game.select.b = [0, x, y]
                        e.srcElement.className = 'select'
                        f.switch()
                    }
                })
                a.appendChild(b)
            }
            $('grid').appendChild(a)
        }
    },
    genTiles() {
        game.map.colors = []
        var L, // line length
            D = f.rngf(2), // line direction (0=vert,1=hori)
            A = [], B = [], R, // from, to, random
            C, P, // choose, position
            C1, C2, DI, CO, I, // colorfrom, colorto, distance, color, isbetween?
            M = f.rngf(game.config.elements[0], game.config.elements[1]+1) // ammount of lines

        for (var i = 0; i < M; i++) {
            L = f.rngf(4,7)
            R = Math.random()
            if (R < 1 & A.length > 0) {
                C = f.rngf(A.length)                                                               // selecting a random existing line
                P = [f.rngf(A[C][1],B[C][1]), f.rngf(A[C][2],B[C][2])]                             // random position in the selected line
                I = true
                L = f.rngf(4,7)                                                                    // random new line length
                A.forEach((v,i) => {                                                               // checking if a line is going through another
                    if (i == C) return
                    if (f.btw(P[0], v[1], B[i][1]) & P[1] + L >= v[2] & !A[C][3]) I = false
                    if (f.btw(P[1], v[2], B[i][2]) & P[0] + L >= v[1] & A[C][3]) I = false
                    if (P[0] == v[1] & P[1] == v[2]) I = false
                    if (P[0] == B[i][1] & P[1] == B[i][2]) I = false
                })
                if (I) {
                    C1 = f.ctrgb(A[C][0])                                                          // first color in selected line
                    C2 = f.ctrgb(B[C][0])                                                          // second color
                    DI = A[C][3] ? f.prog(P[1], A[C][2], B[C][2]) : f.prog(P[0], A[C][1], B[C][1]) // random progress in line between 0 & 1
                    CO = f.rgbtc(C1.map((v,i) => v * (1 - DI) + C2[i] * DI))  
                    A.push([CO,P[0],P[1],!A[C][3],1,C])                                              // creating new line
                    B.push([f.rngc(), A[C][3]
                        ? Math.min(Math.max(P[0]+L,0),15)
                        : P[0],
                        ! A[C][3]
                        ? Math.min(Math.max(P[1]+L,0),15)
                        : P[1],,1
                    ])
                }
            } else {
                var a = f.rngp(), b = f.rngf(16-L)
                if (D) {
                    A.push([f.rngc(),a,   b,  1]) // color, x, y
                    B.push([f.rngc(),a,   b+L  ])
                } else {
                    A.push([f.rngc(),b,   a,  0]) // color, x, y
                    B.push([f.rngc(),b+L, a])
                }
            }
        }

        q = {a: A, b: B}
        game.map.wtiles = f.newTiles(-1)
        game.map.tiles = f.newTiles(-1)
        game.map.place = f.newTiles()

        A.forEach((v,i) => {
            var a = v[3] ? v[2]    : v[1],
                b = v[3] ? B[i][2] : B[i][1],
                d = Math.abs(a - b) + 1,
                p, c1, c2, c // progress, colorfrom, colorto, color
            c1 = f.ctrgb(v[0])
            c2 = f.ctrgb(B[i][0])
            for (var x = a; x < d+a; x++) {
                p = f.prog(x, a, b)
                c = f.rgbtc(c1.map((v,i) => v * (1 - p) + c2[i] * p))
                if (!game.map.colors.includes(c)) {
                    game.map.colors.push(c)
                }
                if (v[3]) {
                    game.map.wtiles[v[1]][x] = game.map.colors.indexOf(c)
                    game.map.place[v[1]][x] = 1
                } else {
                    game.map.wtiles[x][v[2]] = game.map.colors.indexOf(c)
                    game.map.place[x][v[2]] = 1
                }
                if (x == a | x == b) if(v[3]) {
                    game.map.tiles[v[1]][x] = game.map.colors.indexOf(c)
                    game.map.place[v[1]][x] = 2
                } else {
                    game.map.tiles[x][v[2]] = game.map.colors.indexOf(c)
                    game.map.place[x][v[2]] = 2
                }
            }
        })
        var y, a
        for(var x=0;x<16;x++)for(y=0;y<16;y++){
            //a = game.map.colors[game.map.tiles[x][y]]
            //if (game.map.colorsw.includes(a)) game.map.colorsw.splice(game.map.colorsw.indexOf(a),1)
            if (game.map.place[x][y] == 1) game.map.colorsw.push(game.map.colors[game.map.wtiles[x][y]])
        }
    },
    rngc() {return Math.floor(Math.random()*2**24)},        // color
    rngp() {return Math.floor(Math.random()*16)},           // pos
    rngf(i,x=0) {return Math.floor(Math.random()*(i-x)+x)}, // from to
    btw(x,a,b) {
        if (a > b) return x>=b&x<=a
        return x>=a&x<=b
    },                          // is between
    ctrgb(i) {
        return [
            Math.floor(i / 65536) % 256,
            Math.floor(i / 256) % 256,
            Math.floor(i) % 256
        ]  
    },
    rgbtc(i) {
        return Math.floor(i[2]) + Math.floor(i[1]) * 256 + Math.floor(i[0]) * 65536
    },
    prog(x, a, b) {
        if (a == b) return 1
        return (x-a)/(b-a)
    },
    render() {
        var x, y, e, a
        for (var i = 0; i < 256; i++) {
            x = i % 16
            y = Math.floor(i / 16)
            e = $(f.toid(x, y))
            if (game.map.place[x][y] == 1 & game.map.tiles[x][y] == -1) {
                e.className = 'place'
                e.style.backgroundColor = '#000'
            } else {
                a = f.ctrgb(game.map.colors[game.map.tiles[x][y]] ?? 0)
                e.style.backgroundColor = `rgb(${a[0]},${a[1]},${a[2]})`
            }
        }
    },
    genWait() {
        $('tiles').querySelectorAll('*').forEach(v=>v.remove())
        var a, b, c
        game.map.colorsw.forEach((v,i) => {
            if (i % 16 == 0) {
                a = document.createElement('tr')
                $('tiles').appendChild(a)
            }
            b = document.createElement('td')
            b.id = 'w' + i
            c = f.ctrgb(v)
            b.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`
            b.addEventListener('click', e => {
                var a = e.srcElement.id,
                    x =1* a.substr(1)
                try {
                    if (game.select.a[1] == x) return
                } catch {}
                if (game.map.colorsw[x] == -1) return
                if (!game.select.a) {
                    game.select.a = [1, x]
                    e.srcElement.className = 'select'
                } else if (!game.select.b) {
                    game.select.b = [1, x]
                    e.srcElement.className = 'select'
                    f.switch()
                }
            })
            $('tiles').lastChild.appendChild(b)
        })
    },
    waitScramble() {
        var a, b
        for (var i = 0; i < game.map.colorsw.length; i++) {
            b = f.rngf(game.map.colorsw.length)
            a = game.map.colorsw[i]
            game.map.colorsw[i] = game.map.colorsw[b]
            game.map.colorsw[b] = a
        }
    },
    toid(x, y) {
        return 't' + (''+x).padStart(2,0) + (''+y).padStart(2,0)
    },
    getColor(i) {
        return i[0] ? game.map.colorsw[i[1]] : game.map.colors[game.map.tiles[i[1]][i[2]]]
    },
    setColor(i=[0], c=0) { // test
        i[0] ? game.map.colorsw[i[1]] = c : game.map.tiles[i[1]][i[2]] = game.map.colors.indexOf(c)
    },
    switch() {
        var a = [...game.select.a],
            b = [...game.select.b]
        game.select = {a: undefined, b: undefined}

        if (a[0]) {
            $('w' + a[1]).className = ''
        } else {
            $(f.toid(a[1],a[2])).className = 'place'
        }
        if (b[0]) {
            $('w' + b[1]).className = ''
        } else {
            $(f.toid(b[1],b[2])).className = 'place'
        }

        var ca = f.getColor(a),
            cb = f.getColor(b)
        f.setColor(b, ca)
        f.setColor(a, cb)

        f.genWait()
        f.render()
        game.moves++
        f.next()
    },
    next(s=false) {
        var l = true
        for(var x=0;x<16;x++)for(y=0;y<16;y++){
            if (game.map.tiles[x][y] != game.map.wtiles[x][y]) l = false
        }

        if (l | s) {
            if (!s) {
                game.wins++
                game.best = Math.min(game.best, game.time)
                game.bmoves = Math.max(game.bmoves, game.moves)
            } else game.skips++

            game.map = {
                colors: [],
                colorsw: [],
                tiles: [],
                wtiles: [],
                place: [],
            }
            game.since = Date.now()
            game.moves = 0
            f.creTiles()
            f.genTiles()
            f.render()
            f.waitScramble()
            f.genWait()
        }
    },
    update() {
        $('wins').innerHTML = 'Wins: ' + game.wins
        $('moves').innerHTML = 'Moves: ' + game.moves
        $('time').innerHTML = Math.floor(game.time / 100) / 10 + 's'
        $('best').innerHTML = 'Best time: ' + Math.floor(game.best / 100) / 10 + 's'
        $('bmoves').innerHTML = 'Least moves: ' + game.bmoves
    },
    save() {
        localStorage.setItem('Blendoku', btoa(JSON.stringify(game)))
    },
    load() {
        var a = localStorage.getItem('Blendoku')
        if (a) game = JSON.parse(atob(a))
        game.map = {
            colors: [],
            colorsw: [],
            tiles: [],
            wtiles: [],
            place: [],
        }
        game.since = Date.now()
    }
}

f.load()         // Loads game
f.creTiles()     // creates tiles
f.genTiles()     // generates random map
f.render()       // shows the map on the screen
f.waitScramble() // scrambles the waited tiles
f.genWait()      // shows the waited tiles on the screen

f.int = setInterval(() => {
    game.time = Date.now() - game.since
    f.update()
},1e3/30)
f.intsave = setInterval(() => {
    f.save()
},1e3)