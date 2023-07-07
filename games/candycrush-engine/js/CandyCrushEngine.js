import { EventRemote } from "./Event.js";
const imgs = {
    size: 256,
    regular: {
        url: './assets/solid.png',
        None: 0,
        StripedY: 1,
        StripedX: 2,
        Wrapped: 3
    }
};
const special = ['None', 'StripedX', 'StripedY', 'Wrapped', 'Fish', 'Luck'];
function playSfx(a, p) {
    const aud = new Audio('./assets/' + a + '.ogg');
    aud.playbackRate = p ?? 1;
    aud.preservesPitch = false;
    return aud.play();
}
async function wait(time) {
    return new Promise(r => setTimeout(r, time * 1e3));
}
function oper(x, y, f) {
    const Y = typeof y == 'number' ? new Vector2(y, y) : y;
    return new Vector2(f(x.x, Y.x), f(x.y, Y.y));
}
class Vector2 {
    x;
    y;
    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? x ?? 0;
    }
    add(v) { return oper(this, v, (x, y) => x + y); }
    sub(v) { return oper(this, v, (x, y) => x - y); }
    mul(v) { return oper(this, v, (x, y) => x * y); }
    div(v) { return oper(this, v, (x, y) => x / y); }
    mod(v) { return oper(this, v, (x, y) => x % y); }
    eq(v) { return this.x == v.x && this.y == v.y; }
    floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }
    get product() {
        return this.x * this.y;
    }
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    rotate(dir) {
        return [
            new Vector2(this.x, this.y),
            new Vector2(this.y, this.x),
            new Vector2(-this.x, -this.y),
            new Vector2(-this.y, -this.x)
        ][dir];
    }
    toString() {
        return this.x + ',' + this.y;
    }
    static toInt(size, pos) {
        pos = pos.floor();
        const w = typeof (size) == 'number' ? size : size.x;
        return pos.x + pos.y * w;
    }
    static fromInt(size, int) {
        const w = typeof (size) == 'number' ? size : size.x;
        return new Vector2(int % w, Math.floor(int / w));
    }
    static fromDirEnum(dir) {
        return [new Vector2(0, -1), new Vector2(1, 0), new Vector2(0, 1), new Vector2(-1, 0)][dir];
    }
    static get zero() { return new this; }
}
const render = new EventRemote();
const physicsDone = new EventRemote();
const renderStepped = render.event;
let time = Date.now();
setInterval(() => {
    const now = Date.now();
    render.fire((now - time) / 1e3);
    time = now;
});
class LevelTileMap {
    size;
    map;
    spawn = [];
    tileCount;
    constructor(size, map) {
        this.size = size;
        this.map = map ?? Array(size.x * size.y).fill(true);
        for (let x = 0; x < size.x; x++) {
            let y = 0;
            while (!this.getTile(new Vector2(x, y)) && y < size.y)
                y++;
            if (y < size.y)
                this.spawn.push(new Vector2(x, y));
        }
        this.tileCount = this.map.filter(v => v).length;
    }
    getTile(v) {
        return this.map[Vector2.toInt(this.size, v)];
    }
}
function upd(obj) {
    if (obj.element) {
        obj.element.style.left = (obj.pos.add(obj.offset).x) / obj.game.size.x * 100 + '%';
        obj.element.style.top = (obj.pos.add(obj.offset).y) / obj.game.size.y * 100 + '%';
    }
}
class Candy {
    _pos;
    _off = Vector2.zero;
    /** Position in table (integer only) */
    get pos() { return this._pos; }
    set pos(v) {
        this._pos = new Vector2(Math.round(v.x), Math.round(v.y));
        upd(this);
    }
    /** Render offset position */
    get offset() { return this._off; }
    set offset(v) {
        this._off = v;
        upd(this);
    }
    get layers() { return this.game ? this.game.layers : null; }
    class = '';
    game;
    element;
    type;
    triggered = false;
    meta = {};
    constructor(pos, type, game) {
        this.game = game ?? null;
        this.type = type;
        if (game) {
            const e = document.createElement('div');
            this.element = e;
            e.style.width = 100 / game.size.x + '%';
            e.style.height = 100 / game.size.y + '%';
            e.className = 'candy';
            e.style.backgroundImage = 'url("assets/placeholder.png")';
            game.element.appendChild(e);
            if (game.layers) {
                game.layers._s.fire(this);
            }
        }
        this.pos = pos;
    }
    /* Trigger and/or destroy the candy. */
    trigger(auto, secondary) {
        if (this.game) {
            this.game.score += 40;
            this.element.remove();
            const arr = this.layers.findLayer(this);
            arr.layer.splice(arr.index, 1);
            this.game = null;
        }
    }
    remove() {
        this.element.remove();
        const arr = this.layers.findLayer(this);
        arr.layer.splice(arr.index, 1);
        this.game = null;
        this.triggered = true;
    }
}
class Mobile extends Candy {
    class = 'Mobile';
    vel = 0;
    falling = false;
    // true = there's another candy below this one
    floor = null;
    spawned = false;
    constructor(pos, type, game) {
        super(pos, type, game);
        if (this.type != 'Regular') {
            const img = new Image;
            img.src = 'assets/objects.png';
            img.addEventListener('load', () => {
                this.element.style.backgroundImage = `url(${img.src})`;
                const a = getTexture(this.type, img);
                this.element.style.backgroundSize = `${a.sizex}% ${a.sizey}%`;
                this.element.style.backgroundPositionX = a.x + '%';
                this.element.style.backgroundPositionY = a.y + '%';
            });
        }
    }
    // returns true if tile below is ground
    checkbelow() {
        if (this.game) {
            const pos = this.pos.sub(new Vector2(0, -1)).add(this.offset);
            const can = this.layers.getCandy(1, pos);
            return !this.game.tiles.map[Vector2.toInt(this.game.size, pos)] || (!!can && !can?.falling);
        }
        else
            return false;
    }
    checkground() {
        const a = this.checkbelow();
        return void (this.floor = a);
    }
    runGravity(dt) {
        if (this.game) {
            this.checkground();
            if (!this.floor) {
                this.falling = true;
                this.vel += dt * this.game.gravity;
                this.offset = this.offset.add(new Vector2(0, this.vel * dt));
                if (this.checkbelow()) {
                    this.falling = false;
                    this.floor = true;
                    this.pos = this.pos.add(this.offset).floor();
                    this.offset = Vector2.zero;
                    if (this.layers.getCandy(1, this.pos) != this)
                        this.trigger();
                }
            }
            else {
                this.pos = this.pos.add(this.offset).floor();
                this.offset = Vector2.zero;
                this.falling = false;
            }
        }
    }
    getName() {
        if (this instanceof Regular) {
            return this.special;
        }
        else {
            return this.type;
        }
    }
    // 
    /* Trigger and/or destroy the candy. */
    trigger(auto, secondary, inswap) {
        if (this.game && this instanceof Regular) {
            if (secondary && inswap) {
                const a = combo[this.getName() + '_' + secondary.getName()];
                let b;
                if (a)
                    b = a(this, secondary);
                if (!b || b instanceof Promise)
                    this.remove();
                return;
            }
            if (this.special == 'Wrapped' && !this.triggered) {
                const b = this.triggered;
                this.triggered = true;
                if (triggers[this.special])
                    triggers[this.special](this, b);
                this.game.triggering.push(this);
                this.element.setAttribute('triggered', '');
                this.game.score += 60;
            }
            else if (this.triggered ? auto : true) {
                this.game.score += 40;
                if (triggers[this.special])
                    triggers[this.special](this, this.triggered);
                this.remove();
            }
        }
        else if (secondary) {
            const a = combo[this.getName() + '_' + (!inswap && secondary instanceof Regular ? 'None' : secondary.getName())];
            if (a)
                a(this, secondary);
            this.remove();
        }
    }
}
const triggers = {
    StripedX: async (c) => {
        const game = c.game;
        const startpos = c.pos;
        let width = 0;
        const con = renderStepped.connect(dt => {
            width += dt * 24;
            game.layers.getCandy(1, startpos.add(new Vector2(width, 0)))?.trigger(false, c);
            game.layers.getCandy(1, startpos.sub(new Vector2(width, 0)))?.trigger(false, c);
            if (width > game.size.y) {
                con.disconnect();
            }
        });
        playSfx('stripe');
    }, StripedY: async (c) => {
        const game = c.game;
        const startpos = c.pos;
        let height = 0;
        const con = renderStepped.connect(dt => {
            height += dt * 24;
            game.layers.getCandy(1, startpos.add(new Vector2(0, height)))?.trigger(false, c);
            game.layers.getCandy(1, startpos.sub(new Vector2(0, height)))?.trigger(false, c);
            if (height > game.size.y) {
                con.disconnect();
            }
        });
        playSfx('stripe');
    }, Wrapped: async (c, t) => {
        if (!t)
            playSfx('wrapexplosion');
        const game = c.game;
        const pos = c.pos;
        const test = c.meta.big ? [-2, 3] : [-1, 2];
        for (let y = test[0]; y < test[1]; y++)
            for (let x = test[0]; x < test[1]; x++) {
                game.layers.getCandy(1, pos.add(new Vector2(x, y)))?.trigger(false, c);
            }
        game.score += c.meta.big ? 240 : 80;
    }
};
class Regular extends Mobile {
    type = 'Regular';
    _special;
    get special() { return this._special; }
    set special(v) {
        this._special = v;
        const img = new Image;
        img.src = imgs.regular.url;
        img.addEventListener('load', () => {
            this.element.style.backgroundImage = `url(${imgs.regular.url})`;
            this.element.style.backgroundSize = `${100 / (imgs.size / img.width)}% ${100 / (imgs.size / img.height)}%`;
            this.element.style.backgroundPositionX = this.color * imgs.size / (img.width - imgs.size) * 100 + '%';
            this.element.style.backgroundPositionY = imgs.regular[this.special] * imgs.size / (img.height - imgs.size) * 100 + '%';
        });
    }
    color;
    constructor(pos, color, special, game) {
        super(pos, 'Regular', game);
        this.color = color;
        this.special = special;
    }
}
class Blocker extends Candy {
    class = 'Blocker';
    layer;
    constructor(pos, type, layer, game) {
        super(pos, type, game);
        this.layer = layer;
    }
}
class Exit {
    pos;
    game;
    element;
    constructor(pos, game) {
        this.pos = pos;
        this.game = game;
    }
}
class Dispenser {
    pos;
    candies;
    game;
    element;
    constructor(pos, candies, game) {
        this.pos = pos;
        this.candies = candies;
        this.game = game;
    }
}
//type LayerTypesobj = {[K in keyof LayerTypes]: LayerTypes[K] }
class Layers extends Array {
    _s;
    candyAdded;
    constructor(array, engine) {
        super(6);
        this.game = engine;
        for (let i = 0; i < 6; i++)
            this[i] = !array[i] ? [] : array[i];
        this._s = new EventRemote();
        this.candyAdded = this._s.event;
    }
    getCandy(layer, pos) {
        const a = this[layer];
        pos = pos.floor();
        return a.find((v) => {
            return pos.eq(new Vector2(Math.floor(v.pos.x + v.offset.x), Math.floor(v.pos.y + v.offset.y)));
        });
    }
    findLayer(candy) {
        for (let v of this) {
            const a = v;
            const index = a.indexOf(candy);
            if (index >= 0)
                return { layer: v, index: index };
        }
    }
    setSorted() {
        const cloned = [...this[1]];
        return this.sorted = cloned.sort((a, b) => Vector2.toInt(this.game.size, b.pos) - Vector2.toInt(this.game.size, a.pos));
    }
    reset() {
        this[1].forEach(v => {
            v.floor = null;
            v.spawned = false;
            v.pos = v.pos.add(v.offset);
            v.offset = Vector2.zero;
            v.vel = 0;
        });
    }
    sorted = null;
    game;
    0 = [];
    1 = [];
    2 = [];
    3 = [];
    4 = [];
    5 = [];
}
function s(a) { return a.toString(); }
function n(a) { return +a.replace(/[a-zA-Z%]/g, ''); }
class PatternTile extends Vector2 {
    extend;
    constructor(x, y, direction) {
        super(x, y);
        this.extend = direction;
    }
}
class Pattern extends Array {
    creates;
    constructor(creates, ...tiles) {
        super(...tiles);
        this.creates = creates;
    }
    check(layers, size, pos, swap) {
        const tile = layers.getCandy(1, pos);
        if (tile && tile instanceof Regular) {
            const output = [];
            let spawn;
            // checked is true if all relative tiles are same color as the root
            const checked = this.reduce((a, b) => {
                if (!a)
                    return false; // more perfomance, don't calculate anything once false
                // get candy in the relative position
                const c = layers.getCandy(1, b.add(pos));
                if (!c)
                    return false;
                if (c.triggered)
                    return false;
                // check if it's the same color as the root
                const isSameColor = c instanceof Regular && c.color == tile.color;
                if (isSameColor) {
                    if (swap && (c.pos.eq(swap.x) || c.pos.eq(swap.y)))
                        spawn = c.pos;
                    output.push(c);
                }
                return isSameColor;
            }, true);
            if (this.creates && output.length > 0)
                spawn ??= output.at(Math.random() * output.length).pos;
            return checked ? {
                c: output,
                color: tile.color,
                spawnpos: spawn
            } : null;
        }
        return null;
    }
    rotate(dir) {
        return new Pattern(this.creates, ...this.map(v => v.rotate(dir)));
    }
}
function getTexture(s, img) {
    const val = {
        ColorBomb: [0, 0]
    };
    return {
        sizex: 100 / (imgs.size / img.width),
        sizey: 100 / (imgs.size / img.height),
        x: val[s][0] * imgs.size / (img.width - imgs.size) * 100,
        y: val[s][1] * imgs.size / (img.height - imgs.size) * 100
    };
}
const combo = {
    ColorBomb_None: (c0, c1, g) => {
        const game = c0.game ?? g;
        const color = c1.color;
        const array = [];
        game.layers[1].forEach(v => {
            if (v instanceof Regular && v.color == color) {
                array.push(v);
                game.score += 60;
            }
        });
        let dur = 0;
        let i = 0;
        //const was = game.physicsEnabled
        game.motion++;
        const con = renderStepped.connect(dt => {
            dur += dt;
            for (; i < Math.floor(dur * 32) && i < array.length; i++) {
                array[i].trigger();
                if (i % 4 == 0)
                    playSfx('colorBombExplosion');
            }
            if (i >= array.length) {
                con.disconnect();
                game.motion--;
            }
        });
    },
    ColorBomb_Wrapped: async (c0, c1) => {
        const game = c0.game;
        const color = c1.color;
        game.layers[1].forEach(v => {
            if (v instanceof Regular && v.color == color)
                v.special = 'Wrapped';
        });
        game.score += 200;
        playSfx('colorBombExplosion');
        game.motion++;
        await wait(.75);
        combo.ColorBomb_None(c0, c1, game);
        game.motion--;
    },
    ColorBomb_StripedX: async (c0, c1) => {
        const game = c0.game;
        const color = c1.color;
        game.layers[1].forEach(v => {
            if (v instanceof Regular && v.color == color) {
                v.special = ['StripedX', 'StripedY'].at(Math.random() * 2);
                v.element.setAttribute('triggered', '');
            }
        });
        game.score += 200;
        game.motion++;
        playSfx('colorBombExplosion');
        await wait(.75);
        combo.ColorBomb_None(c0, c1, game);
        game.motion--;
    },
    ColorBomb_StripedY: (c0, c1) => combo.ColorBomb_StripedX(c0, c1),
    ColorBomb_ColorBomb: (c0) => {
        const game = c0.game;
        let dur = 0;
        let i = 0;
        game.motion++;
        const array = [...game.layers.sorted].reverse();
        const con = renderStepped.connect(dt => {
            dur += dt;
            for (; i < Math.floor(dur * 64) && i < array.length; i++) {
                array[i].trigger();
                if (i % 8 == 0)
                    playSfx('colorBombExplosion');
            }
            if (i >= array.length)
                con.disconnect();
        });
        game.motion--;
    },
    StripedX_StripedX: (c0, c1) => {
        const game = c0.game;
        const startpos = c0.pos;
        let width = 0;
        game.motion++;
        const con = renderStepped.connect(dt => {
            width += dt * 24;
            game.layers.getCandy(1, startpos.add(new Vector2(width, 0)))?.trigger(false, [c0, c1].at(Math.random() * 2));
            game.layers.getCandy(1, startpos.sub(new Vector2(width, 0)))?.trigger(false, [c0, c1].at(Math.random() * 2));
            game.layers.getCandy(1, startpos.add(new Vector2(0, width)))?.trigger(false, [c0, c1].at(Math.random() * 2));
            game.layers.getCandy(1, startpos.sub(new Vector2(0, width)))?.trigger(false, [c0, c1].at(Math.random() * 2));
            if (width > game.size.x && width > game.size.y)
                con.disconnect(), game.motion--;
        });
        playSfx('stripe');
        c1.remove();
    },
    StripedX_StripedY: (c0, c1) => combo.StripedX_StripedX(c0, c1),
    StripedY_StripedX: (c0, c1) => combo.StripedX_StripedX(c0, c1),
    StripedY_StripedY: (c0, c1) => combo.StripedX_StripedX(c0, c1),
    Wrapped_Wrapped: (c0, c1) => {
        const game = c0.game;
        const startpos = c0.pos;
        c1.remove();
        for (let y = -2; y < 3; y++)
            for (let x = -2; x < 3; x++) {
                game.layers.getCandy(1, startpos.sub(new Vector2(x, y)))?.trigger(false, [c0, c1].at(Math.random() * 2));
            }
        playSfx('wrapexplosion');
        c0.game.triggering.push(c0);
        c0.element.setAttribute('triggered', '');
        c0.game.score += 240;
        c0.meta.big = true;
        return true;
    },
    StripedX_Wrapped: async (c0, c1) => {
        const game = c0.game;
        const startpos = c0.pos;
        c1.remove();
        game.motion++;
        await new Promise(r => {
            let l = 0;
            const con = renderStepped.connect(dt => {
                l += dt * 24;
                for (let i = -1; i < 2; i++) {
                    game.layers.getCandy(1, startpos.add(new Vector2(l, i)))?.trigger(false, c0);
                    game.layers.getCandy(1, startpos.sub(new Vector2(l, i)))?.trigger(false, c0);
                }
                if (l > game.size.y) {
                    con.disconnect();
                    r();
                }
            });
            playSfx('stripe', 1.1);
        });
        await wait(.1);
        await new Promise(r => {
            let l = 0;
            const con = renderStepped.connect(dt => {
                l += dt * 24;
                for (let i = -1; i < 2; i++) {
                    game.layers.getCandy(1, startpos.add(new Vector2(i, l)))?.trigger(false, c0);
                    game.layers.getCandy(1, startpos.sub(new Vector2(i, l)))?.trigger(false, c0);
                }
                if (l > game.size.y) {
                    con.disconnect();
                    r();
                }
            });
            playSfx('stripe', 1.1);
        });
        game.motion--;
    },
    StripedY_Wrapped: (c0, c1) => combo.StripedX_Wrapped(c0, c1),
};
class EngineMap {
    tiles;
    meta;
    layers;
    moves;
    streak = 0;
    gravity = 16;
    _ph = false;
    _e;
    get size() { return this.tiles.size; }
    score = 0;
    /** true if the user can do a swap. doing so will trigger the cycle */
    waiting = true;
    element;
    /** findPatterns() will use this in order. Make sure to put higher level patterns first. */
    patterns;
    /** Specifies how many triggers are still in action. Next cycle iteration only starts once this value is 0 */
    motion = 0;
    triggering = [];
    swap = null;
    physicsFinished = physicsDone.event;
    renderStepped = renderStepped;
    constructor(tiles, meta, layers) {
        this.tiles = tiles;
        this.meta = meta;
        this.layers = layers;
        this.moves = meta.moveCount;
        const element = document.createElement('div');
        this.element = element;
        element.className = 'screen';
    }
    assign(parent) {
        parent.appendChild(this.element);
    }
    // ENGINE CONTROLS
    /* Find any patterns depending on the .patterns property and returns the candies forming the patterns */
    findPatterns() {
        // search by checking every candy, where candy should be root of the pattern
        const candy = [];
        for (let v of this.patterns) {
            for (let i = 0; i < this.size.product; i++) {
                const pos = Vector2.fromInt(this.size, i);
                let removal;
                // if this iter's candy is already selected, cancel this iteration. (i disabled the type error here)
                const _ = candy;
                if (_.indexOf(this.layers.getCandy(1, pos)) >= 0)
                    continue;
                const a = v.check(this.layers, this.size, pos, this.swap);
                if (a) {
                    // if it selects any candy that has already been selected, cancel.
                    const b = a.c.reduce((a, b) => {
                        return a && candy.indexOf(b) == -1;
                    }, true);
                    if (b) {
                        removal = a.c;
                        if (a.spawnpos && v.creates) {
                            this.score += 70;
                            let s;
                            const _ = special;
                            if (_.includes(v.creates)) {
                                const _ = v.creates;
                                s = new Regular(a.spawnpos, a.color, _, this);
                            }
                            else {
                                s = new Mobile(a.spawnpos, v.creates, this);
                                if (v.creates == 'ColorBomb')
                                    playSfx('colorBombSpawn');
                            }
                            this.layers[1].push(s);
                            this.layers.sorted.push(s);
                        }
                    }
                }
                if (removal)
                    candy.push(...removal);
            }
        }
        return candy;
    }
    runFrame(dt) {
        this.layers.sorted.forEach(v => v.runGravity(dt));
        this.checkSpawns();
        // true if all candies are static.
        if (this.motion == 0 && this.layers[1].reduce((a, b) => a && b.floor, true)) {
            physicsDone.fire();
        }
    }
    get physicsEnabled() { return this._ph; }
    set physicsEnabled(v) {
        if (v !== this._ph) {
            this._ph = v;
            if (v) {
                this._e = renderStepped.connect(this.runFrame, this);
            }
            else if (this._e) {
                this._e.disconnect();
            }
        }
    }
    // spawns mobiles that fall into the table
    checkSpawns() {
        this.tiles.spawn.forEach(v => {
            const c = this.layers.getCandy(1, v);
            const c2 = this.layers.getCandy(1, v.add(new Vector2(0, -1)));
            if ((!c || (c.falling && !c.spawned)) && !c2) {
                const s = new Regular(v.add(new Vector2(0, -1)), Math.floor(Math.random() * this.meta.colors), 'None', this);
                this.layers[1].push(s);
                this.layers.sorted.push(s);
                s.falling = true;
                s.floor = false;
                if (c) {
                    c.spawned = true;
                    s.offset = c.offset.mod(new Vector2(Infinity, 1));
                    s.vel = c.vel;
                }
            }
        });
    }
    /** Starts a combo between 2 swapping mobiles. `c1` is the dragged one */
    combo(c0, c1) {
        let out = false;
        if (combo[c0.getName() + '_' + c1.getName()]) {
            c0.trigger(false, c1, true);
            out = true;
        }
        if (!out && combo[c1.getName() + '_' + c0.getName()]) {
            c1.trigger(false, c0, true);
            out = true;
        }
        return out;
    }
    /** swap 2 mobiles, then start the engine. */
    async beginCycle(movePos, moveDir) {
        if (!this.waiting || this.moves == 0)
            return;
        this.waiting = false;
        this.moves -= 1;
        const dir = Vector2.fromDirEnum(moveDir);
        const c0 = this.layers.getCandy(1, movePos);
        const c1 = this.layers.getCandy(1, movePos.add(dir));
        this.swap = { x: c0.pos, y: c1.pos };
        let A = 0;
        let con;
        await new Promise(r => {
            // do swap animation
            con = renderStepped.connect(dt => {
                A += dt;
                dt = Math.min(dt, (.25 - A));
                c0.offset = c0.offset.add(dir.mul(dt * 4));
                c1.offset = c1.offset.add(dir.mul(dt * -4));
                if (A >= .25) {
                    c0.offset = Vector2.zero;
                    c1.offset = Vector2.zero;
                    c0.pos = c0.pos.add(dir);
                    c1.pos = c1.pos.add(dir.mul(-1));
                    con.disconnect();
                    r();
                }
            });
        });
        let force = this.combo(c0, c1);
        while (true) {
            while (true) {
                // Find all combinations and delete the cells
                this.layers.setSorted();
                const v = this.findPatterns();
                if (v.length == 0 && !force)
                    break;
                v.forEach(v => v.trigger());
                this.layers.reset();
                this.physicsEnabled = true;
                playSfx('combine', Math.min(this.streak / 32 + 1, 4));
                await this.physicsFinished.wait();
                this.streak += 1;
                this.physicsEnabled = false;
                this.swap = null;
                force = false;
            }
            if (this.triggering.length > 0) {
                playSfx('wrapexplosion');
                this.triggering.forEach((v, i) => {
                    this.score += 100;
                    v.trigger(true);
                    this.triggering.splice(i, 1);
                });
                force = true;
            }
            else
                break;
        }
        this.streak = 0;
        this.waiting = true;
    }
}
export { EngineMap, LevelTileMap, Layers, Mobile, Regular, Blocker, Exit, Dispenser, Vector2, Pattern, PatternTile, renderStepped };
//# sourceMappingURL=CandyCrushEngine.js.map