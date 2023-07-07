import { EngineMap, Layers, LevelTileMap, Pattern, PatternTile, Regular, Vector2, renderStepped } from "./CandyCrushEngine.js";
exports = {EngineMap, Layers, LevelTileMap, Pattern, PatternTile, Regular, Vector2, renderStepped}
const $ = i => document.getElementById(i)
const $e = i => document.querySelector(i)

/** @type {{[string]: Pattern}} */
const pat = {
    Normal: new Pattern(null,
        new PatternTile(0, 0),
        new PatternTile(1, 0),
        new PatternTile(-1, 0)    
    ),
    StripedX: new Pattern('StripedY',
        new PatternTile(0, 0),
        new PatternTile(1, 0),
        new PatternTile(2, 0),
        new PatternTile(-1, 0)    
    ),
    StripedY: new Pattern('StripedX',
        new PatternTile(0, 0),
        new PatternTile(0, 1),
        new PatternTile(0, 2),
        new PatternTile(0, -1)    
    ),
    Wrapped1: new Pattern('Wrapped',
        new PatternTile(2, 0),
        new PatternTile(1, 0),
        new PatternTile(0, 0),
        new PatternTile(0, 1),
        new PatternTile(0, 2),   
    ),
    Wrapped2: new Pattern('Wrapped',
        new PatternTile(1, 0),
        new PatternTile(-1, 0),
        new PatternTile(0, 0),
        new PatternTile(0, 1),
        new PatternTile(0, 2),   
    ),
    Wrapped3: new Pattern('Wrapped',
        new PatternTile(1, 0),
        new PatternTile(-1, 0),
        new PatternTile(0, 0),
        new PatternTile(0, 1),
        new PatternTile(0, -1),   
    ),
    ColorBomb: new Pattern('ColorBomb',
        new PatternTile(-2, 0),
        new PatternTile(-1, 0),
        new PatternTile(0, 0),
        new PatternTile(1, 0),
        new PatternTile(2, 0),
    ),
}

const patterns = [
    pat.ColorBomb,
    pat.ColorBomb.rotate(1),
    pat.Wrapped1,
    pat.Wrapped1.rotate(1),
    pat.Wrapped1.rotate(2),
    pat.Wrapped1.rotate(3),
    pat.Wrapped2,
    pat.Wrapped2.rotate(1),
    pat.Wrapped2.rotate(2),
    pat.Wrapped2.rotate(3),
    pat.Wrapped3,
    pat.StripedX,
    pat.StripedY,
    pat.Normal,
    pat.Normal.rotate(1),
]

config = {
    swap: null,
}
const dir = {
    '0,-1': 0,
    '1,0': 1,
    '0,1': 2,
    '-1,0': 3
}

function setswap(v) {//debugger
    if (!config.swap) {
        config.swap = v
        return void v.element.setAttribute('selected', '')
    }
    const a = dir[''+v.pos.sub(config.swap.pos)]
    if (config.swap == v) {
        config.swap = null
        v.element.removeAttribute('selected')
    } else if (a!=undefined) {
        config.swap.element.removeAttribute('selected')
        game.beginCycle(config.swap.pos, a)
        config.swap = null
    }
}

function testlevel() {

    const c = {
        w:prompt('1/3: Enter table width',16)||16,
        h:prompt('2/3: Enter table height',16)||16,
        c:prompt('3/3: How many different colors in the table? 1 to 6.',5)||5,
    }
    c.c = Math.max(Math.min(c.c, 6), 1)
    c.w = Math.max(Math.min(c.w, 64), 2)
    c.h = Math.max(Math.min(c.h, 64), 2)
    const tiles = new LevelTileMap(new Vector2(c.w, c.h))
    const a = []
    /** @type {EngineMap} game */
    game = new EngineMap(tiles, {
        stars: [1e3, 2e3, 3e3, 5e3],
        colors: c.c,
        moveCount: 100,
    })
    game.layers = new Layers([,a], game)
    game.layers.candyAdded.connect(v => {
        v.element.addEventListener('click', () => {
            setswap(v)
        })
    })
    game.patterns = patterns
    const aa = ['None']
    for (let i = 0; i < 256; i++) a.push(new Regular(
        new Vector2(i%16, Math.floor(i/16)), Math.floor(Math.random() * c.c), aa.at(Math.random()*aa.length), game
        ))
    game.assign($e('.game'))
    game.physicsFinished.connect(() => console.log('Iteration finished'))

}

function update() {
    $('score').innerHTML = 'Score: ' + game.score
    $('moves').innerHTML = game.moves
    $('motion').innerHTML = game.motion
}
setInterval(update)

testlevel()