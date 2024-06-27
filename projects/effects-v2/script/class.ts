type ParameterTypes = 'number' | 'boolean' | 'int' | 'color' | `#${string}` | Enum | 'vector'
type WritableFunction = (args: Arguments) => boolean
type Arguments = {[key: string]: number | boolean | Enum | Color | Vector}
interface Parameter {
    name: string,
    key?: string,
    type: ParameterTypes,
    min?: number|Vector,
    max?: number|Vector,
    softmin?: number|Vector,
    softmax?: number|Vector,
    default?: any,
    exponential?: boolean,
    writable?: WritableFunction
}

function clamp(x:number, min?:number, max?:number): number {
    return Math.min(Math.max(x, min ?? -Infinity), max ?? Infinity)
}
function mod(x: number, n: number): number {
    return x - Math.floor(x / n) * n
}
function refl(x: number, n: number, int?: boolean): number {
    const m = mod(x, n)
    return mod((x / n), 2) >= 1 ? n - m - +!int : m
}

class Color {
    red: number = 0
    green: number = 0
    blue: number = 0
    alpha: number = 0
    get r() {return this.red}
    get g() {return this.green}
    get b() {return this.blue}
    get a() {return this.alpha}
    constructor(brightness: number)
    constructor(r: number, g: number, b: number)
    constructor(r: number, g: number, b: number, a: number)
    constructor(r: number, g?: number, b?: number, a?: number) {
        this.red = r
        this.green = g ?? r
        this.blue = b ?? r
        this.alpha = a ?? 255
    }
    static unit(brightness: number): Color
    static unit(r: number, g: number, b: number): Color
    static unit(r: number, g: number, b: number, a: number): Color
    static unit(r: number, g?: number, b?: number, a?: number): Color {
        return new Color(r * 255, (g ?? r) * 255, (b ?? r) * 255, (a ?? 1) * 255)
    }
    static fromInt24(value: number): Color {
        return new Color(value >> 16 & 255, value >> 8 & 255, value & 255)
    }
    /** @returns {number} */
    toInt24(): number {
        return (this.blue & 255) + ((this.green & 255) << 8) + ((this.red & 255) << 16)
    }
    /** @returns {boolean} */
    isNaN(): boolean {
        return Number.isNaN(this.red + this.green + this.blue + this.alpha)
    }
    
    /**
     * @param {(input: number, key: string) => number} f
     * @param {boolean} [alpha=false]
     * @return {Color}*/
    map(f: (input: number, key: string) => number, alpha: boolean = false): Color {
        return new Color(f(this.red,'red'), f(this.green,'green'), f(this.blue,'blue'), alpha ? f(this.alpha,'alpha') : this.alpha)
    }
    /** Put a color on top of another. Used to calculate colors for putting one transparent image over another]
     * @param {Color} other
     * @param {number} [alpha=1]
    */
    overlay(other: Color, alpha: number = 1): Color {
        const a0 = this.alpha / 255
        const a1 = other.alpha / 255 * alpha
        const a = a1 + a0 * (1 - a1)
        return new Color(
            a == 0 ? 0 : (other.red * a1 + this.red * a0 * (1 - a1)) / a,
            a == 0 ? 0 : (other.green * a1 + this.green * a0 * (1 - a1)) / a,
            a == 0 ? 0 : (other.blue * a1 + this.blue * a0 * (1 - a1)) / a,
            a * 255
        )
    }
    
    /**
     * @param {Color} other
     * @param {number} alpha
     * @return {Color}*/
    lerp(other: Color, alpha: number): Color {
        return new Color(
            this.red - this.red * alpha + other.red * alpha,
            this.green - this.green * alpha + other.green * alpha,
            this.blue - this.blue * alpha + other.blue * alpha,
            this.alpha - this.alpha * alpha + other.alpha * alpha,
        )
    }
    toString(): string {
        return [this.red, this.green, this.blue, this.alpha].join(', ')
    }
    /** @param {boolean} [alpha=true]  @returns {string} */
    toHex(alpha: boolean = true): string {
        const r = Math.floor(clamp(this.red, 0, 255)) || 0, g = Math.floor(clamp(this.green, 0, 255)) || 0, b = Math.floor(clamp(this.blue, 0, 255)) || 0, a = Math.floor(clamp(this.alpha, 0, 255)) || 0
        return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0') + (alpha ? a.toString(16).padStart(2, '0') : '')
    }
    /** @returns {Color} */
    clamp(): Color {
        return new Color(clamp(this.red, 0, 255), clamp(this.green, 0, 255), clamp(this.blue, 0, 255), clamp(this.alpha, 0, 255))
    }
    /** @returns {Color} */
    clone(): Color {
        return new Color(this.red, this.green, this.blue, this.alpha)
    }
    /** @static @type {Color} */
    static get zero() {return new Color(0,0,0,0)}
    /** @static @type {Color} */
    static get white() {return new Color(255)}
    /** @static @param {string} hex @returns {Color} */
    static fromHex(hex: string): Color {
        hex = hex.replaceAll('#', '')
        return new Color(parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16), parseInt(hex.substring(6, 8) || 'ff', 16))
    }
}

class Enum {

    /** all options of the enum @type {EnumItem[]} */
    readonly states: EnumItem[] = []
    /** @type {string} */
    name: string
    /** @type {number} */
    readonly length: number

    constructor(name: string, ...items: string[]) {
        this.name = name
        for (let i in items) {
            this.states.push(new EnumItem(items[i], +i, this))
        }
        this.length = this.states.length
        Enum.enums[name] = this
    }
    
    /** get enum option @param {string} v  @return {EnumItem | null} */
    getItem(v: string): EnumItem | null
    /** get enum option @param {number} v  @return {EnumItem | null} */
    getItem(v: number): EnumItem | null
    /** get enum option @param {EnumItem} v  @return {EnumItem | null} */
    getItem(v: EnumItem): EnumItem | null
    getItem(v: string|number|EnumItem): EnumItem | null {
        let out:EnumItem
        if (typeof v == 'number') out = this.states.find(w => w.value == v)
        else if (typeof v == 'string') out = this.states.find(w => w.name == v)
        else out = v.parent == this ? v : null
        return out ?? null
    }

    /** @static @type {{[key: string]: Enum}}*/
    static enums: {[key: string]: Enum} = {}

}

class Vector {

    x: number = 0
    y: number = 0
    /** @type {number} */
    get mag() {return Math.sqrt(this.x ** 2 + this.y ** 2)}
    /** @type {number} */
    get angle() {return Math.atan2(this.y, this.x)}
    get unit() {return this.div(this.mag)}

    /** Creates a 2 dimensional value */
    constructor()
    constructor(x: number)
    constructor(x: number, y: number)
    constructor(x?: number, y?: number) {
        this.x = x ?? 0
        this.y = y ?? x ?? 0
    }

    static polar(t: number, r: number=1) {
        return new Vector(Math.cos(t) * r, Math.sin(t) * r)
    }
    /** @returns {Vector} */
    clone(): Vector {return new Vector(this.x, this.y)}

    /** @param {Vector} other @returns {Vector} */
    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y)
    }
    /** @param {Vector} other @returns {Vector} */
    sub(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y)
    }
    /** @param {Vector|number} other @returns {Vector} */
    mul(other: Vector|number): Vector {
        return typeof other == 'number' ? new Vector(this.x * other, this.y * other) : new Vector(this.x * other.x, this.y * other.y)
    }
    /** @param {Vector|number} other @returns {Vector} */
    div(other: Vector|number): Vector {
        return typeof other == 'number' ? new Vector(this.x / other, this.y / other) : new Vector(this.x / other.x, this.y / other.y)
    }

    /** distance between 2 points @param {Vector} other @returns {number} */
    dist(other: Vector): number {
        return this.sub(other).mag
    }

    /** rotate point around center @param {number} angle @returns {Vector} */
    rotate(angle: number): Vector
    /** rotate point around pivot @param {Vector} pivot @param {number} angle @returns {Vector} */
    rotate(pivot: Vector, angle: number): Vector
    rotate(pivot: Vector|number, deltaAngle?: number): Vector {
        if (typeof pivot == 'number') return this.rotate(Vector.zero, pivot)
        
        const dist = this.dist(pivot)
        const angle = (this.sub(pivot)).angle // angle from pivot to this
        return Vector.polar(angle + deltaAngle, dist).add(pivot)
    }

    /** linear interpolation
     * @param {Color} other
     * @param {number} alpha
    * @return {Color}*/
    lerp(other: Vector, alpha: number): Vector {
        return new Vector(
            this.x - this.x * alpha + other.x * alpha,
            this.y - this.y * alpha + other.y * alpha
        )
    }

    /** check if one of the values are invalid @returns {boolean} */
    isNaN(): boolean {
        return Number.isNaN(this.x + this.y)
    }
    toString(): string {
        return [this.x, this.y].join(', ')
    }

    
    /** @param {Vector} min @param {Vector} max @returns {Vector}*/
    clamp(min: Vector, max: Vector): Vector {
        return new Vector(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y))
    }

    static get zero() {return new Vector}
    static get one() {return new Vector(1,1)}
    
}

class EnumItem {

    name: string
    value: number
    parent: Enum
    constructor(name:string,value:number,parent:Enum) {
        this.name = name
        this.value = value
        this.parent = parent
    }

}

const defaults: {[key in Extract<ParameterTypes, string>]: any} = {
    number: 0,
    int: 0,
    boolean: false,
    color: new Color(0),
    vector: Vector.zero
}


interface PixelData {
    x: number
    y: number
    pos: Vector // alias
    width: number
    height: number
    size: Vector // alias
    i: number
    color: Color
    image: AdvancedImageData
    get(x: number, y: number, z?: BoundsMode): Color
}

type EffectFunction<T = any> = (data: PixelData, args: Arguments, pre: T) => Color
type InitiateFunction<T = any> = (image: AdvancedImageData, args: Arguments) => T

let _id = 0
class EffectTemplate<T = any> {

    /** @type {string} */
    name: string
    /** @type {number} */
    id: number
    /** @type {Parameter[]} */
    parameters: Parameter[]
    /** Function to be run every pixel
     * @type {EffectFunction<T>}
     * @memberof EffectTemplate
     */
    function: EffectFunction<T>
    /** Function that returns a value that is accessible globally for all pixels (through "pre" parameter)
     * @type {InitiateFunction<T>}
     * @memberof EffectTemplate
     */
    prefunction?: InitiateFunction<T>
    
    /** 
     * @param {string} name
     * @param {Parameter[]} params
     * @param {EffectFunction<T>} func
     * @param {InitiateFunction<T>} [prefunc]
     * @memberof EffectTemplate
     */
    constructor(name:string, params:Parameter[], func: EffectFunction<T>, prefunc?: InitiateFunction<T>) {
        this.name = name
        this.parameters = params.map(v => {
            if (typeof v.type == 'string' && v.type.startsWith('#')) {
                v.type = Enum.enums[v.type.substring(1)]
                if (v.default) v.default = v.type.getItem(v.default)
            }
            v.default ??= typeof v.type == 'string' ? defaults[v.type] : v.type.getItem(0)
            if (v.type == 'number') {
                v.min ??= -Infinity
                v.max ??= Infinity
                v.softmin ??= 0
                v.softmax ??= 1
            } else if (v.type == 'int') {
                v.min ??= -(3**31)
                v.max ??= 3**31-1
                v.softmin ??= -128
                v.softmax ??= 127
            } else if (v.type == 'vector') {
                v.min ??= new Vector(-Infinity)
                v.max ??= new Vector(Infinity)
                v.softmin ??= Vector.zero
                v.softmax ??= Vector.one
            }
            return v
        })
        this.function = func
        this.prefunction = prefunc
        this.id = _id
        _id++
    }

}

type BoundsMode = 'empty' | 'tile' | 'reflect' | 'clamp'
class AdvancedImageData {
    readonly width: number = 0
    readonly height: number = 0
    
    /** @type {Color[]} */
    readonly data: Color[] = []
    
    /**
     * @param {ImageData} imageData
     * @memberof AdvancedImageData
     */
    constructor(imageData: ImageData)
    /**
     * @param {Color[]} imageData
     * @param {number} width
     * @param {number} height
     * @memberof AdvancedImageData
     */
    constructor(imageData: Color[], width: number, height: number)
    constructor(imageData: ImageData | Color[], width?: number, height?: number) {
        if (imageData instanceof ImageData) {
            this.width = imageData.width
            this.height = imageData.height
            const data = imageData.data
            for (let i = 0; i < imageData.data.length / 4; i++) {
                this.data.push(new Color(data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]))
            }
        } else {
            this.width = width ?? 1
            this.height = height ?? 1
            this.data = imageData
        }
    }
    
    /**
     * @param {Vector} pos
     * @param {BoundsMode} [bounds='empty']
     * @returns {Color}
     * @memberof AdvancedImageData
     */
    getPixel(pos: Vector, bounds: BoundsMode = 'empty'): Color {
        let fx = mod(pos.x, 1), fy = mod(pos.y, 1)
        let x = Math.floor(pos.x), y = Math.floor(pos.y)
        switch (bounds) {
            case "empty": 
                if (x < 0 || x >= this.width || y < 0 || y >= this.height) return Color.zero
            break; case "tile":
                x = mod(x, this.width), y = mod(y, this.height)
            break; case "reflect":
                x = refl(x, this.width), y = refl(y, this.height)
            break; case "clamp":   
                x = clamp(x, 0, this.width - 1), y = clamp(y, 0, this.height - 1)
        }
        if (fx > 0 || fy > 0) { // Bilinear interpolation
            let c00 = this.getPixel(new Vector(x,   y  ), bounds)
            let c10 = this.getPixel(new Vector(x+1, y  ), bounds)
            let c01 = this.getPixel(new Vector(x,   y+1), bounds)
            let c11 = this.getPixel(new Vector(x+1, y+1), bounds)
            return c00.lerp(c10, fx).lerp(c01.lerp(c11, fx), fy)
        }
        return this.data[x + y * this.width] ?? Color.zero
    }

    /** converts to regular image data
     * @returns {ImageData}
     * @memberof AdvancedImageData
     */
    output(): ImageData {
        const data = []
        for (let v of this.data) {
            data.push(v.red, v.green, v.blue, v.alpha)
        }
        return new ImageData(new Uint8ClampedArray(data), this.width, this.height)
    }
}

class Effect {

    
    /**
     * @readonly
     * @type {EffectTemplate}
     * @memberof Effect*/
    readonly template: EffectTemplate
    
    /**
     * @type {Arguments}
     * @memberof Effect*/
    arguments: Arguments = {}
    enabled: boolean = true
    /**
     * @param {EffectTemplate} template
     * @memberof Effect
     */
    constructor(template: EffectTemplate) {
        this.template = template
        for (let param of template.parameters) {

            let value = param.default
            Object.defineProperty(this.arguments, param.key, {
                get() {return value},
                set(v) {
                    let out: unknown
                    let change = true

                    switch (param.type) {
                        case 'number':
                            if (Number.isNaN(v) || typeof v != 'number') change = false
                            else out = clamp(v, param.min as number, param.max as number)
                        break; case 'int':
                            if (!Number.isFinite(v) || typeof v != 'number') change = false
                            else out = Math.floor(clamp(v, param.min as number, param.max as number))
                        break; case 'boolean':
                            out =!! v
                        break; case 'color':
                            if (!(v instanceof Color) || v.isNaN()) change = false
                            else out = v
                        break; case 'vector':
                            if (!(v instanceof Vector) || v.isNaN()) change = false
                            else out = v.clamp(param.min as Vector, param.max as Vector)
                        break; default: if (param.type instanceof Enum) {
                            out = param.type.getItem(v)
                            if (!out) change = false
                        }
                    }
                    if (change) value = out
                },
                enumerable: true
            })

        }
    }
    /**
     * @param {AdvancedImageData} imageData
     * @returns {AdvancedImageData}
     * @memberof Effect
     */
    applyToImage(imageData: AdvancedImageData): AdvancedImageData {
        if (!this.enabled) return imageData
        const data = imageData.data

        let init: unknown
        if (this.template.prefunction) init = this.template.prefunction(imageData, this.arguments)

        const out: Color[] = []
        for (let i = 0; i < data.length; i++) {
            const color = data[i]
            const x=i % imageData.width, y=Math.floor(i / imageData.width)
            let pixel = this.template.function({
                i: i,
                color: color,
                x: x,
                y: y,
                pos: new Vector(x, y),
                width: imageData.width,
                height: imageData.height,
                size: new Vector(imageData.width, imageData.height),
                image: imageData,
                get: (x,y) => imageData.getPixel.call(imageData, x,y)
            }, this.arguments, init)
            if (pixel.isNaN()) pixel = Color.zero
            out.push(pixel)
        }

        return new AdvancedImageData(out, imageData.width, imageData.height)
    }

    /** Creates a copy of this effect
     * @returns {Effect} */
    clone(): Effect {

        const copy = new Effect(this.template)
        for (let key in copy.arguments) {
            const obj = this.arguments[key]
            copy.arguments[key] = obj instanceof Color ? obj.clone() : obj
        }
        return copy

    }

}
/** @typedef {{[key: string]: number | boolean | Enum | Color | Vector}} Arguments */
/** @typedef {(args: Arguments) => boolean} WritableFunction */
/** @typedef {{name: string,key?: string,type: ParameterTypes,min?: number|Vector,max?: number|Vector,softmin?: number|Vector,softmax?: number|Vector,default?: number,exponential?: boolean,writable:WritableFunction}} Parameter */
/** @typedef {(data: PixelData, args: Arguments, pre: T) => Color} EffectFunction @template {any} T */
/** @typedef {(image: AdvancedImageData, args: Arguments) => T} InitiateFunction @template {any} T */
/** @typedef {{x: number,y: number,pos: Vector,width: number,height: number,size: Vector,i: number,color: Color,image: AdvancedImageData,get(pos: Vector, z?: BoundsMode): Color}} PixelData*/
/** @typedef {'empty' | 'tile' | 'reflect' | 'clamp'} BoundsMode */
/** @typedef {'number' | 'boolean' | 'int' | 'color' | `#${string}`} ParameterTypes */