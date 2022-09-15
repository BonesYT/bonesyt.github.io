function controls() {

    var k = game.k,
          m = game.spd / 16 * (k.S ? 3 : 1),
          s = Math.sin(game.dir) * m,
          c = Math.cos(game.dir) * m,
          b = {x: game.x, y: game.y},
          D = game.dir
    let mv = false
    if (k.U) {mv=true
        game.x += s
        game.y += c
    } if (k.D) {mv=true
        game.x -= s
        game.y -= c
        D = -D
    } if (k.a) {mv=true
        game.x += Math.sin(game.dir + Math.PI / -2) * m
        game.y += Math.cos(game.dir + Math.PI / -2) * m
    } if (k.d) {mv=true
        game.x += Math.sin(game.dir + Math.PI / 2) * m
        game.y += Math.cos(game.dir + Math.PI / 2) * m
    }
    if (k.R) game.dir += Math.PI / 24
    if (k.L) game.dir -= Math.PI / 24

    game.dir = trig.loopdir(game.dir)
    const px = game.x, py = game.y

    if (getPx(game.x, game.y) & mv) {
        
        const x = Math.floor(game.x) + (game.x < b.x),
              y = Math.floor(game.y) + (game.y < b.y)
        let a, c
        if (b.x % 1 == 0) c = true
        else if (b.y % 1 == 0) c = false
        else a = [
            (x - b.x) / (game.x - b.x),
            (y - b.y) / (game.y - b.y)
        ], c = a[0] > a[1]

        let d
        if (c) d = +(game.x < b.x)
        else d = (game.y < b.y) + 2

        switch (d) {
            
            case 0: game.x = Math.floor(game.x) - .06; break
            case 1: game.x = Math.ceil(game.x) + .06; break
            case 2: game.y = Math.floor(game.y) - .06; break
            case 3: game.y = Math.ceil(game.y) + .06; break

        }

    }

    if (
        ((getPx(px,py,1) & getPx(px,py,0,1)) | getPx(px,py))
        & getPx(b.x,b.y,-1) & getPx(b.x,b.y,0,-1)
    ) {
        console.log(getPx(b.x,b.y,-1), b.x, b.y)
        game.x = Math.ceil(game.x)
        game.y = Math.ceil(game.y)
    }

}
function getPx(px, py, x=0, y=0, X, Y) {
    X = X ? 'ceil' : 'floor'
    Y = Y ? 'ceil' : 'floor'
    return [1,3,4].includes(game.map.t[Math[X](x+px) + Math[Y](y+py) * game.map.w])
}