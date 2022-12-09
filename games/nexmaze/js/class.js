'use strict'

/**
 * @description Creates a Game object from scratch
 * @param {Game} object
 * @author BonesYT
 */
class Game {

    x = 0
    y = 0
    dir = 0
    sx = 0
    sy = 0
    sdir = 0
    spd = 1
    isAlive = false
    map = {
        t: null,
        at: [], // tile attr target
        attr: Object.assign([], {'-1': {
            color: [255, 255, 255],
            brightness: 1,
            target: 0
        }}),  // attributes,
        f: [], // tile function
        /**
         * @type Texture[]
         */
        tx: [],
        w: 16,
        h: 16,
        /**
         * @type {Orb[]}
         */
        orbs: [],
        /**
         * @type {Item[]}
         */
        items: []
    }
    can = $('canvas')
    /**
     * @type {CanvasRenderingContext2D}
     */
    ctx = $('canvas').getContext('2d', { willReadFrequently: true })
    k = {}
    kh = {}
    /**
     * @type Entity[]
     */
    ent = []
    nextSpawn = []
    nbNextTick = []
    nbTick = []
    hitW = .5
    hitH = .5
    running = true
    lightMax = Infinity
    hx; hy; hs
    hold = false; ht = 0
    level = 0
    levelName = ''
    red = 0
    wind = []

    paused = false

    orbs = 0
    maxOrbs = 0
    stamina = 1
    locks = 0
    maxLocks = 0
    airbox = 0
    lockDist = 0

}

class Item {

    collected = false
    colmode = 'collision'
    tick = 0

    /**
     * Creates Item (null)
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x =+ x
        this.y =+ y
    }

    /**
     * If player is colliding with the item, it gets collected.
     * @param {boolean} force Instantly collect the item, without requiring collision.
     */
    collect(force) {
        const f = Math.floor
        let cond
        switch (this.colmode) {
            case 'collision':
                cond = f(game.x) == f(this.x) & f(game.y) == f(this.y)
            break; case 'interact':
                cond = f(game.hx) == f(this.x) & f(game.hy) == f(this.y) && game.hs < 1 && game.hold
        }
        if ((force || cond) & !this.collected) {
            this.collected = true
            this.ef()
        }
    }

}
class Orb extends Item {

    /**
     * Collectable orbs used to progress a level.
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super(x, y)
    }
    ef() {
        game.orbs++
        playSFX('orb')
        game.stamina = Math.min(game.stamina + .85, 1)
        game.ent.forEach(v => v.ent.spd += config.levelData[game.level].nextbot_vel_add ?? .018)
    }

}
class Airbox extends Item {

    /**
     * Used to release wind to push nextbots away.
     * @param {number} x
     * @param {number} y
     */
    colmode = 'interact'
    constructor(x, y) {
        super(x, y)
    }
    ef() {
        game.airbox++
        playSFX('item')
    }

}

class Texture {

    /**
     * @description Physical texture for a tile.
     * @param {string | HTMLImageElement} north Front face of a tile
     * @param {string | HTMLImageElement} east Right face of a tile
     * @param {string | HTMLImageElement} south South face of a tile
     * @param {string | HTMLImageElement} west Left face of a tile
     */
    constructor(north, east, south, west, status) {

        function constr(i) {

            let img
            if (i.constructor == HTMLImageElement)
                img = i
            else {
                let a = new Image
                a.src = `img/${i}.png`
                img = a
            }

            return Texture.imageData(img)

        }

        /** @type {ImageData} */ this.north = constr(north)
        /** @type {ImageData} */ this.east = constr(east || north)
        /** @type {ImageData} */ this.south = constr(south || north)
        /** @type {ImageData} */ this.west = constr(west || north)
        /** @type {*} */         this.status = status

    }

    static imageData(img) {

        let c = document.createElement('canvas');
        [c.width, c.height] = [img.width, img.height]
        c = c.getContext('2d')
        c.drawImage(img, 0, 0)
        return c.getImageData(0, 0, img.width, img.height)

    }

    /**
     * Gets a pixel from a face image.
     * @param {string} face Cardinal direction of the tile
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} decRange Specifies if x and y coordinates goes from 0 and 1.
     * @returns {Uint8ClampedArray}
     */
    getPixel(face, x, y, decRange=true) {

        let i = this[face]
        if (decRange) x *= i.width, y *= i.height
        let p = (Math.floor(x) + Math.floor(y) * i.width) * 4

        return i.data.slice(p, p + 4)

    }
    setImage(img) {
        this.north = this.east = this.south = this.west = Texture.imageData(img)
    }

}

class Entity {

    img = null
    aud = null

    /**
     * @description Creates an entity.
     * @param {number} sx 
     * @param {number} sy
     */
    constructor(sx, sy, dir, img) {
        if (img.constructor != HTMLImageElement) throw TypeError("[NextBot] 'img' parameter should be type of Image")

        this.spawn = {x: +sx, y: +sy}
        this.ent = {
            x: +sx,
            y: +sy,
            dir: +dir,
            offset: .5,
            alive: true
        }
        this.img = img

    }
    /**
     * @description Assigns audio to the entity.
     * @param {HTMLAudioElement | string} audio 
     * @returns {HTMLAudioElement}
     */
    setAudio(audio) {

        if (typeof audio == 'string') {
            this.aud = new Audio(audio)
        } else this.aud = audio
        return this.aud

    }
    updateVolume(x, y) {
        
        try {
            const d = Math.sqrt((this.ent.x - x) + (this.ent.y - y) ** 2)
            this.aud.volume = Math.max(Math.min((1 / d / 2) ** .5, 1), 0) * $('musvol').value
        } catch {}

    }
    setImageData(sqrRatio=true, set=false) {

        const c = document.createElement('canvas'),
              i = this.img,
              s = Math.max(i.width, i.height)
        
        if (sqrRatio) {
            c.width = s
            c.height = s
        } else {
            c.width = i.width
            c.height = i.height
        }
        
        const ctx = c.getContext('2d')
        ctx.drawImage(i, 0, 0, s, s)
        const o = ctx.getImageData(0, 0, s, s)
        if (set) this.img = o
        return o

    }
    getPixel(x, y, decRange=true) {

        let i = this.img
        if (decRange) x *= i.width, y *= i.height
        let p = (Math.floor(x) + Math.floor(y) * i.width) * 4

        return i.data.slice(p, p + 4)

    }

}