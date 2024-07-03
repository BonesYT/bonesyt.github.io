new Enum('grayscale',
    'average',
    'maximum',
    'minimum',
    'luma',
    'median',
    'geometric mean',
    'hue',
    'hsv saturation',
    'hsl saturation',
    'hsl luminance',
    'lch hue',
    'lch chroma',
    'lch luma',
    'add modulo',
    'add reflect',
)
new Enum('channel',
    'red',
    'green',
    'blue',
    'alpha',
    'hue',
    'hsv saturation',
    'hsl saturation',
    'hsl luminance',
    'lab luma',
    'lab a',
    'lab b',
    'lch hue',
    'lch chroma',
    'luma',
    'luma expo',
    'average',
    'minimum',
    'maximum'
)
new Enum('gamut',
    'srgb',
    'a98rgb',
    'prophoto',
    'rec2020',
    'acescc',
    'p3'
)
new Enum('bounds',
    'empty',
    'tile',
    'reflect',
    'clamp'
)
new Enum('colorspace',
    'rgb',
    'hsv',
    'hsl',
    'lab',
    'lch'
)
new Enum('chrmap',
    'linear',
    'reverse',
    'zero',
    'half',
    'one',
    'quadratic',
    'cubic',
    'sqrt',
    'cbrt',
    'exponential',
    'sine',
    'in-circle',
    'out-circle',
    'threshold',
    'random'
)
new Enum('blendmode',
    'alpha',
    'subtract',
    'multiply',
    'screen',
    'color-burn',
    'color-dodge',
    'linear-burn',
    'linear-dodge',
    'darken',
    'lighten',
    'darker',
    'lighter',
    'overlay',
    'overlay-linear',
    'soft-light',
    'hard-light',
    'vivid-light',
    'linear-light',
    'pin-light',
    'hard-mix',
    'difference',
    'exclusion',
    'negative-light',
    'divide',
    'divide-alt',
    'hue',
    'saturation',
    'color',
    'luminosity',
    'gamma',
    'threshold',
    'xor',
    'or',
    'and',
)

function lerp(x,a,b) {
    return !Number.isFinite(x) ? (Math.sign(x) == 1 ? b : a) : a - a * x + b * x
}
function random(seed) {
    if (seed == undefined || isNaN(seed)) return Math.random()
    seed >>>= 0;
    seed = (Math.abs(seed ^ 0xabcdefe + 0x999999) ** 1.2345 * Math.sqrt(2 + seed / (2 ** 32)) * 0x10203040 - 0x30405060) % (2 ** 32);
    return seed / 2 ** 32;
}
function nextrnd(seed) {
    return random(seed * (2**32))
}
function rngcircle(radius, seed) {
    let angle = Math.PI * 2 * random(seed)
    let dist = Math.sqrt(random(seed + 0x54525921)) * radius
    return [Math.cos(angle) * dist, Math.sin(angle) * dist]
}
function getLayerPixel(d, a) {
    return d.outputs[clamp(a.last ? d.outputs.length - a.l - 1: a.l, 0, d.outputs.length - 1)].getPixel(d.pos)
}

const rngparam = {
    name: 'Seed',
    key: 'seed',
    type: 'int',
    default: -1, softmin: -1, softmax: 65535
}
const bounds = {
    name: 'Bounds',
    key: 'bounds',
    type: '#bounds',
    default: 'reflect'
}

const effectList = []
const info = []

effectList.push(new EffectTemplate('Linear Brightness', [
    {
        name: 'Brightness',
        key: 'br',
        type: 'number',
        softmin: -256,
        softmax: 256
    }
], function (d, args) {
    return d.color.map(x => x + args.br)
}))

info.push('Change the brightness by adding or subtracting color values.')

effectList.push(new EffectTemplate('Scalar Brightness', [
    {
        name: 'Brightness',
        key: 'br',
        type: 'number',
        softmin: 0,
        softmax: 10,
        default: 1
    }
], function (d, args) {
    return d.color.map(x => x * args.br)
}))

info.push('Change the brightness by multiplying color values. Lower brightness approaches the color black.')

effectList.push(new EffectTemplate('Offset Darks', [
    {
        name: 'Brightness',
        key: 'br',
        type: 'number',
        softmin: -10,
        softmax: 1
    }
], function (d, args) {
    return d.color.map(x => 255 - (255 - x) * (1 - args.br))
}))

info.push('Change the brightness by approaching the color white.')

effectList.push(new EffectTemplate('Contrast', [
    {
        name: 'Contrast',
        key: 'cont',
        type: 'number',
        softmin: -5,
        softmax: 10,
        default: 1
    },{
        name: 'Offset',
        key: 'off',
        type: 'number',
        softmin: 0,
        softmax: 255,
        default: 127.5
    },
], function (d, a) {
    return d.color.map(x => a.off - a.off * a.cont + x * a.cont)
}))

info.push('Increases contrast to concentrate on a certain level of brightness, causing highlights and shadows to become clearer.')

effectList.push(new EffectTemplate('Luma Contrast', [
    {
        name: 'Contrast',
        key: 'cont',
        type: 'number',
        softmin: -5,
        softmax: 10,
        default: 1
    },{
        name: 'Offset',
        key: 'off',
        type: 'number',
        softmin: 0,
        softmax: 255,
        default: 127.5
    },
], function (d, a) {
    const luma = colorUtils.getLuma(d.color)
    const fix = d.color.map(v => v - (luma - a.off))
    return fix.lerp(d.color, a.cont)
}))

info.push('Increases contrast to concentrate on a certain value of luma (luminosity), relative to eye color perception.')

effectList.push(new EffectTemplate('Scale Lights', [
    {
        name: 'Color',
        key: 'col',
        type: 'color',
        default: Color.white
    }
], function (d, a) {
    return d.color.map((v,k) => v * a.col[k] / 255)
}))

info.push('Adds a colored tint to the image.')

effectList.push(new EffectTemplate('HSV Adjust', [
    {
        name: 'Hue',
        key: 'h',
        type: 'number',
        default: 0, softmin: -3, softmax: 3
    },{
        name: 'Saturation',
        key: 's',
        type: 'number',
        default: 1, softmin: -1, softmax: 4
    },{
        name: 'Value',
        key: 'v',
        type: 'number',
        default: 1, softmin: 0, softmax: 2
    },{
        name: 'Linear Saturation?',
        key: 'ls',
        type: 'boolean'
    },{
        name: 'Limit Saturation?',
        key: 'cs',
        type: 'boolean'
    },{
        name: 'Limit Value?',
        key: 'cv',
        type: 'boolean'
    }
], function (d, a) {
    let hsv = colorUtils.toHSV(d.color)
    hsv[0] += a.h
    if (a.ls) hsv[1] += a.s
    else hsv[1] *= a.s
    if (a.cs) hsv[1] = clamp(hsv[1], 0, 1)
    hsv[2] *= a.v
    if (a.cv) hsv[2] = clamp(hsv[2], 0, 1)
    return colorUtils.fromHSV(...hsv, d.color.a)
}))

info.push('Modifies the <b>Hue</b>, <b>Saturation</b> and <b>Value</b> of colors.')

effectList.push(new EffectTemplate('HSL Adjust', [
    {
        name: 'Hue',
        key: 'h',
        type: 'number',
        default: 0, softmin: -3, softmax: 3
    },{
        name: 'Saturation',
        key: 's',
        type: 'number',
        default: 1, softmin: -1, softmax: 4
    },{
        name: 'Luminosity',
        key: 'l',
        type: 'number',
        default: 1, softmin: 0, softmax: 2
    },{
        name: 'Linear Saturation?',
        key: 'ls',
        type: 'boolean'
    },{
        name: 'Limit Saturation?',
        key: 'cs',
        type: 'boolean'
    },{
        name: 'Linear Luminosity?',
        key: 'll',
        type: 'boolean'
    },{
        name: 'Limit Luminosity?',
        key: 'cl',
        type: 'boolean'
    }
], function (d, a) {
    let hsl = colorUtils.toHSL(d.color)
    hsl[0] += a.h
    if (a.ls) hsl[1] += a.s
    else hsl[1] *= a.s
    if (a.cs) hsl[1] = clamp(hsl[1], 0, 1)
    if (a.ll) hsl[2] += a.l
    else hsl[2] *= a.l
    if (a.cl) hsl[2] = clamp(hsl[2], 0, 1)
    return colorUtils.fromHSL(...hsl, d.color.a)
}))

info.push('Modifies the <b>Hue</b>, <b>Saturation</b> and <b>Lightness</b> of colors.')

effectList.push(new EffectTemplate('Lab Adjust', [
    {
        name: 'Luminosity',
        key: 'l',
        type: 'number',
        default: 0, softmin: -2, softmax: 2
    },{
        name: 'a*',
        key: 'a',
        type: 'number',
        default: 0, softmin: -2, softmax: 2
    },{
        name: 'b*',
        key: 'b',
        type: 'number',
        default: 0, softmin: -2, softmax: 2
    },{
        name: 'Invert Luminosity',
        key: 'il',
        type: 'boolean'
    },{
        name: 'Scalar Luminosity',
        key: 'sl',
        type: 'boolean'
    },{
        name: 'Limit Luminosity',
        key: 'cl',
        type: 'boolean'
    },{
        name: 'Scalar a & b',
        key: 'sa',
        type: 'boolean'
    },{
        name: 'Limit a & b',
        key: 'ca',
        type: 'boolean'
    }
], function (d, a) {
    let lab = colorUtils.toLab(d.color)
    if (a.il) lab[0] = 1 - lab[0]
    if (a.sl) lab[0] *= a.l; else lab[0] += a.l
    if (a.cl) lab[0] = clamp(lab[0], 0, 1)
    if (a.sa) lab[1] *= a.a; else lab[1] += a.a
    if (a.sa) lab[2] *= a.b; else lab[2] += a.b
    if (a.ca) lab[1] = clamp(lab[1], -1, 1), lab[2] = clamp(lab[2], -1, 1)
    return colorUtils.fromLab(...lab, d.color.a)
}))

info.push('Modifies the <b>Luminosity</b>, <b>A value</b> and <b>B value</b> of colors.<br>+A ⇒ Red<br>+B ⇒ Yellow<br>-A ⇒ Green<br>-B ⇒ Blue')

effectList.push(new EffectTemplate('Lch Adjust', [
    {
        name: 'Hue',
        key: 'h',
        type: 'number',
        default: 0, softmin: -.5, softmax: .5
    },{
        name: 'Chroma',
        key: 'c',
        type: 'number',
        default: 1, softmin: -2, softmax: 2
    },{
        name: 'Luminosity',
        key: 'l',
        type: 'number',
        default: 0, softmin: -2, softmax: 2
    },{
        name: 'Linear Chroma',
        key: 'lc',
        type: 'boolean'
    },{
        name: 'Limit Chroma',
        key: 'cc',
        type: 'boolean'
    },{
        name: 'Invert Luminosity',
        key: 'il',
        type: 'boolean'
    },{
        name: 'Scalar Luminosity',
        key: 'sl',
        type: 'boolean'
    },{
        name: 'Limit Luminosity',
        key: 'cl',
        type: 'boolean'
    }
], function (d, a) {
    let lch = colorUtils.toLch(d.color)
    lch[2] += a.h
    if (a.lc) lch[1] += a.c; else lch[1] *= a.c
    if (a.cc) lch[1] = clamp(lch[1], 0, 1)
    if (a.il) lch[0] = 1 - lch[0]
    if (a.sl) lch[0] *= a.l; else lch[0] += a.l
    if (a.cl) lch[0] = clamp(lch[0], 0, 1)
    return colorUtils.fromLch(...lch, d.color.a)
}))

info.push('Modifies the <b>Luminosity</b>, <b>Chromacity</b> and <b>Hue</b> of colors.<br>LCH is the polar version of LAB. C being the distance to gray, H being the angle around gray.')

effectList.push(new EffectTemplate('Opacity', [
    {
        name: 'Alpha',
        key: 'a',
        type: 'number',
        default: 1, softmin: -1, softmax: 2
    },{
        name: 'Linear Alpha',
        key: 'l',
        type: 'boolean'
    },{
        name: 'Limit Alpha',
        key: 'c',
        type: 'boolean',
        default: true
    },
], function (d, a) {
    let alpha = d.color.a
    if (a.l) alpha += a.a * 255; else alpha *= a.a
    if (a.c) alpha = clamp(alpha, 0, 255)
    return new Color(d.color.r, d.color.g, d.color.b, alpha)
}))

info.push('Changes the alpha (transparency) of an image.')

effectList.push(new EffectTemplate('Gamma', [
    {
        name: 'Gamma',
        key: 'g',
        type: 'number',
        default: 1, softmin: 0.25, softmax: 4,
        exponential: true,
    },{
        name: 'Color modifier',
        key: 'col',
        type: 'color',
        default: Color.white
    }
], function (d, a) {
    return d.color.map((v,k) => (v / 255) ** (1 / (a.g * (a.col[k] / 255))) * 255)
}))

info.push('Adds an exponent to color values, making it darker or lighter while preserving the colors black and white.')

effectList.push(new EffectTemplate('Posterization', [
    {
        name: 'Red steps',
        key: 'r',
        type: 'int',
        default: 2, softmin: 2, softmax: 256,
        exponential: true,
    },{
        name: 'Green steps',
        key: 'g',
        type: 'int',
        default: 2, softmin: 2, softmax: 256,
        exponential: true,
        writable: a => !a.eq
    },{
        name: 'Blue steps',
        key: 'b',
        type: 'int',
        default: 2, softmin: 2, softmax: 256,
        exponential: true,
        writable: a => !a.eq
    },{
        name: 'Alpha steps',
        key: 'a',
        type: 'number',
        default: 2, softmin: 2, softmax: 256,
        exponential: true,
    },{
        name: 'Red offset',
        key: 'sr',
        type: 'number',
        default: 0, softmin: 0, softmax: 1
    },{
        name: 'Green offset',
        key: 'sg',
        type: 'number',
        default: 0, softmin: 0, softmax: 1,
        writable: a => !a.eq
    },{
        name: 'Blue offset',
        key: 'sb',
        type: 'number',
        default: 0, softmin: 0, softmax: 1,
        writable: a => !a.eq
    },{
        name: 'Alpha offset',
        key: 'sa',
        type: 'number',
        default: 0, softmin: 0, softmax: 1
    },{
        name: 'R = G = B',
        key: 'eq',
        type: 'boolean',
        default: true
    },
], function (d, a) {
    const step = {red:a.r, green:a.eq ? a.r : a.g, blue:a.eq ? a.r : a.b, alpha:a.a}
    const off = {red:a.sr, green:a.eq ? a.sr : a.sg, blue:a.eq ? a.sr : a.sb, alpha:a.sa}
    
    return d.color.map((v,k) => {
        const s = (255 / step[k])
        return (Math.floor(v / s + off[k]) - off[k]) * s / ((step[k] - 1) / step[k])
    }, true)
}))

info.push('Reduces the amount of different colors in an image by reducing the amount of different values for RGB channels between 0 and 255.')

effectList.push(new EffectTemplate('Grayscale', [
    {
        name: 'Method',
        key: 'mode',
        type: '#grayscale',
        default: 'luma'
    },{
        name: 'Mix',
        key: 'alpha',
        type: 'number',
        default: 1
    }
], function (d, a) {
    const value = colorUtils.value(d.color, a.mode.name)
    const gray = new Color(value, value, value, d.color.a)
    return d.color.lerp(gray, a.alpha)
}))

info.push('Turns the entire image monochrome, using only shades of gray. Change the method to obtain different results.')

effectList.push(new EffectTemplate('Overlay or Blend', [
    {
        name: 'Blend color', key: 'c',
        type: 'color',
        default: new Color(10, 45, 255),
        writable: a => !a.image
    },{
        name: 'Layer', key: 'l',
        type: 'int',
        softmin: 0, min: 0, softmax: 31,
        writable: a => a.image
    },{
        name: 'Last layers', key: 'last',
        type: 'boolean',
        writable: a => a.image
    },{
        name: 'Use prev. output as blend', key: 'image',
        type: 'boolean'
    },{
        name: 'Alpha',
        key: 'a',
        type: 'number',
        default: 255, softmin: 0, softmax: 255
    },{
        name: 'Blend mode', key: 'mode',
        type: '#blendmode',
        default: 'alpha'
    },{
        name: 'Swap Blend and Base?', key: 'top',
        type: 'boolean'
    }
], function (d, a) {
    a.c.alpha = a.a
    const pixel = (a.image ? getLayerPixel(d, a) : a.c).clone()
    if (a.image) pixel.alpha *= a.a / 255
    return a.top ? colorUtils.blend(pixel, d.color, a.mode.name) : colorUtils.blend(d.color, pixel, a.mode.name)
}))

info.push('Adds a solid color behind or in front of the image.')

effectList.push(new EffectTemplate('Chroma Keyer', [
    {
        name: 'Color',
        key: 'c',
        type: 'color',
        default: new Color(0, 255, 0)
    },{
        name: 'Range',
        key: 'range',
        type: 'number',
        default: 30, softmin: 0, softmax: 441.68
    },{
        name: 'Feather',
        key: 'feath',
        type: 'number',
        default: 0.25, softmin: 0, softmax: 1
    },
], function (d, a) {
    const dist = Math.sqrt((d.color.r - a.c.r) ** 2 + (d.color.g - a.c.g) ** 2 + (d.color.b - a.c.b) ** 2)
    const alpha = clamp((dist / a.range - 1) / a.feath + 1, 0, 1)
    //if (d.i==0) console.log(dist, alpha)
    return d.color.map((v,k) => k == 'alpha' ? v * alpha : v, true)
}))

info.push('Turns pixels with a similar color to the target transparent. This can be used to mask pictures.')

effectList.push(new EffectTemplate('Channel Constancy', [
    {
        name: 'Variable',
        key: 'var',
        type: '#channel',
        default: 'hue'
    },{
        name: 'Value',
        key: 'value',
        type: 'number'
    },{
        name: 'Constancy mix',
        key: 'cmix',
        type: 'number',
        default: 1
    },{
        name: 'Output mix',
        key: 'omix',
        type: 'number',
        default: 1
    }
], function (d, a) {
    return d.color.lerp(colorUtils.setChannelValue(d.color, a.var.name, a.value, a.cmix), a.omix)
}))

info.push('Locks or aproximates a variable of a color to a specific value.')

effectList.push(new EffectTemplate('xyY Adjust', [
    {
        name: 'x',
        key: 'x',
        type: 'number',
        default: 0, softmin: -1, softmax: 2
    },{
        name: 'y',
        key: 'y',
        type: 'number',
        default: 0, softmin: -1, softmax: 2
    },{
        name: 'Y',
        key: 'Y',
        type: 'number',
        default: 0, softmin: -1, softmax: 2
    },{
        name: 'Scalar x & y',
        key: 'sxy',
        type: 'boolean'
    },{
        name: 'Scalar Y',
        key: 'sY',
        type: 'boolean'
    },{
        name: 'Limit x & y',
        key: 'cxy',
        type: 'boolean',
        default: true
    },{
        name: 'Limit Y',
        key: 'cY',
        type: 'boolean'
    }
], function (d, a) {
    let xyy = colorUtils.toxyY(d.color)
    if (a.sxy) xyy[0] *= a.x; else xyy[0] += a.x
    if (a.sxy) xyy[1] *= a.y; else xyy[1] += a.y
    if (a.sY)  xyy[2] *= a.Y; else xyy[2] += a.Y
    if (a.cxy) {
        const sum = xyy[0] + xyy[1]
        if (sum >= 1) xyy[0] /= sum, xyy[1] /= sum
        xyy[0] = clamp(xyy[0], .0001, .735)
        xyy[1] = clamp(xyy[1], .0001, .835)
    }
    if (a.cY) xyy[2] = clamp(xyy[2], 0, 1)
    return colorUtils.fromxyY(...xyy, d.color.a)
}))

info.push('Changes the color\'s coordinates in the CIE 1961 colorspace.')

effectList.push(new EffectTemplate('Gamut Map', [
    {
        name: 'Confine to gamut',
        key: 'gamut',
        type: '#gamut',
        default: 'srgb'
    },{
        name: 'Output mix',
        key: 'mix',
        type: 'number',
        default: 1
    }
], function (d, a) {
    let out = new Color(d.color.r, d.color.g, d.color.b, d.color.a)

    if (a.gamut.name == 'sRGB') out.clamp()
    else {
        let c = new ColorAdv('sRGB', [out.r/255, out.g/255, out.b/255], out.a/255)
        c.toGamut({space: a.gamut.name})
        out = Color.unit(c.r, c.g, c.b, c.alpha)
    } 

    return d.color.lerp(out, a.mix)
}))

info.push('Confines colors to be within a gamut\'s range. You\'ll usually only notice changes with effects that would add a lot of contrast.<br>Note: this may be laggy')

effectList.push(new EffectTemplate('Noise', [
    {
        name: 'Noise Intensity',
        key: 'amp',
        type: 'number',
        default: 32, softmin: 0, softmax: 255
    },{
        name: 'Noise Saturation',
        key: 'sat',
        type: 'number',
        default: 1, softmin: 0, softmax: 1
    },{
        name: 'Noise Max Color',
        key: 'col',
        type: 'color',
        default: Color.white
    },{
        name: 'Noise Min Color',
        key: 'col2',
        type: 'color',
        default: new Color(0)
    },{
        name: 'Additive?',
        key: 'add',
        type: 'boolean',
        default: true
    }, rngparam
], function (d, a) {
    let seed = a.seed == -1 ? Math.floor(Math.random()*2**32) : a.seed + d.i ** 2 * 110
    let pixel = Color.unit(random(seed), random(seed+0x456789ab), random(seed+0x89abcdef))
    if (a.sat != 1) {
        let pixelg = Color.unit(random(seed+0x6789abcd))
        pixel = pixelg.lerp(pixel, a.sat).map((v,k) => v * (a.col[k] - a.col2[k]) / 255 + a.col2[k])
    }
    return a.add ? d.color.map((v,k) => v + (pixel[k] - 127.5) / 255 * a.amp) : d.color.lerp(pixel, a.amp/255)
}))

info.push('Adds random noise to the image, additionally, you can limit the noise colors, which is applied after saturation.')

effectList.push(new EffectTemplate('Diffusion', [
    {
        name: 'Radius',
        key: 'rad',
        type: 'number',
        default: .04, min: 0, softmin: 0, softmax: 1.414
    },{
        name: 'Mix',
        key: 'mix',
        type: 'number',
        default: 1, softmin: 0, softmax: 1
    }, bounds, rngparam
], function (d, a) {
    let scale = Math.min(d.width, d.height)
    let seed = a.seed == -1 ? Math.floor(Math.random()*2**32) : a.seed + d.i ** 2 * 110
    let pos = rngcircle(a.rad, seed)
    let other = d.get(new Vector(pos[0] * scale + d.x, pos[1] * scale + d.y), a.bounds.name)
    return d.color.lerp(other, a.mix)
}))

info.push('Scrambles pixels randomly. They will be offset at a random location within a limited radius.')

effectList.push(new EffectTemplate('Swirl', [
    {
        name: 'Radius',
        key: 'rad',
        type: 'number',
        default: .5, min: 0, softmin: 0, softmax: 1.414
    },{
        name: 'Intensity',
        key: 'am',
        type: 'number',
        default: 1, softmin: -20, softmax: 20
    },{
        name: 'Position',
        key: 'pos',
        type: 'vector', softmin: new Vector(-.5), softmax: new Vector(.5)
    },{
        name: 'Exponent',
        key: 'pow',
        type: 'number',
        default: 1, softmin: .25, softmax: 4, exponential: true
    },{
        name: 'Confined',
        key: 'fin',
        type: 'boolean',
        default: true
    }, bounds
], function (d, a) {
    let scale = Math.min(d.width, d.height)
    /** @type {Vector} */
    let center = a.pos.mul(d.size).add(d.size.div(2))
    let dist = d.pos.dist(center) // distance to center
    let amp = (((a.rad * scale) - dist) / (a.rad * scale)) ** a.pow * a.am // swirl amplitude in angles

    return dist >= a.rad * scale && a.fin ? d.color : d.get(d.pos.rotate(center, amp), a.bounds.name)
}))

info.push(`Adds a swirl on the image, distorting every pixel to go around the center point depending on distance.<br>\
If not confined, the swirl will be applied onto the entire image.`)

effectList.push(new EffectTemplate('Fisheye', [
    {
        name: 'Radius',
        key: 'rad',
        type: 'number',
        default: 1, min: 0, softmin: 0, softmax: 1.414
    },{
        name: 'Intensity (exp)',
        key: 'am',
        type: 'number',
        default: 0.5, softmin: -3, softmax: 3
    },{
        name: 'Position',
        key: 'pos',
        type: 'vector', softmin: new Vector(-.5), softmax: new Vector(.5)
    },{
        name: 'Confined',
        key: 'fin',
        type: 'boolean'
    }, bounds
], function (d, a) {
    let scale = Math.min(d.width, d.height)
    let radius = scale * a.rad
    /** @type {Vector} */
    let center = a.pos.mul(d.size).add(d.size.div(2))

    let pos = d.pos.sub(center) // position relative to center
    let dist = pos.mag / radius // distance to center (if in confine, should be between 0 and 1)
    let newpos = pos.div(radius).div(dist / dist ** Math.exp(a.am)).mul(radius)

    return dist >= 1 && a.fin ? d.color : d.get(newpos.add(center), a.bounds.name)
}))

info.push(`Adds a fisheye effect, distorting every pixel to be closer or further to the center, exponentially depending on distance.<br>\
If confined, it will only form a bulge effect.`)

effectList.push(new EffectTemplate('Transform', [
    {
        name: 'Size',
        key: 'size',
        type: 'vector',
        default: Vector.one
    },{
        name: 'Position',
        key: 'pos',
        type: 'vector', softmin: new Vector(-.5), softmax: new Vector(.5)
    },{
        name: 'Rotate',
        key: 'angle',
        type: 'number', softmin: -360, softmax: 360
    },{
        name: 'Anchor',
        key: 'anch',
        type: 'vector',
        default: new Vector(.5)
    },{
        name: 'Flip Horizontally',
        key: 'flipx',
        type: 'boolean'
    },{
        name: 'Flip Vertically',
        key: 'flipy',
        type: 'boolean'
    },{
        name: 'Resize after rotate',
        key: 'ordr',
        type: 'boolean'
    },{
        name: 'Position last',
        key: 'ordp',
        type: 'boolean'
    }, bounds
], function (d, a) {
    let pos = d.pos
    let anch = d.size.mul(a.anch)

    function trans(id) {
        switch (id) {
            case 0: pos = pos.sub(a.pos.mul(d.size)); return
            case 1: pos = pos.sub(anch).rotate(a.angle / 180 * Math.PI).add(anch); return
            case 2: pos = pos.sub(anch).div(a.size).add(anch);
            if (!Number.isFinite(pos.x)) pos.x = d.width*2+anch; if (!Number.isFinite(pos.y)) pos.y = d.height*2+anch; return
        }
    }

    if (a.flipx) pos.x = d.size.x - pos.x - 1
    if (a.flipy) pos.y = d.size.y - pos.y - 1

    if (!a.ordp) trans(0)
    if (a.ordr) trans(2),trans(1); else trans(1),trans(2)
    if (a.ordp) trans(0)

    return d.get(pos, a.bounds.name)
}))

info.push(`Place, resize, flip and rotate the image.<br>\
If 'resize after rotate' is on, you can skew images as well.`)

effectList.push(new EffectTemplate('Channel Scaler', [
    {
        name: 'Colorspace', key: 'space',
        type: '#colorspace'
    },{
        name: 'Red', key: 'r',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'rgb'
    },{
        name: 'Green', key: 'g',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'rgb'
    },{
        name: 'Blue', key: 'b',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'rgb'
    },{
        name: 'Luminance', key: 'll',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => ['lab','lch'].includes(a.space.name)
    },{
        name: 'Chrominance', key: 'c',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'lch'
    },{
        name: 'Hue', key: 'h',
        type: 'number',
        default: 1, softmin: -10, softmax: 10,
        writable: a => ['hsv','hsl','lch'].includes(a.space.name)
    },{
        name: 'Saturation', key: 's',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => ['hsv','hsl'].includes(a.space.name)
    },{
        name: 'Value', key: 'v',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'hsv'
    },{
        name: 'Lightness', key: 'l',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'hsl'
    },{
        name: 'A', key: 'a',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'lab'
    },{
        name: 'B', key: 'bb',
        type: 'number',
        default: 1, softmin: 0, softmax: 10,
        writable: a => a.space.name == 'lab'
    },{
        name: 'Alpha', key: 'al',
        type: 'number',
        default: 1, softmin: 0, softmax: 10
    }, bounds, {
        name: 'Fix modulo wrapping', key: 'fix',
        type: 'boolean', default: true,
        writable: a => a.bounds.name == 'tile'
    }
], function (d, a) {
    let color = d.color

    function b(x, aa=0, b) {
        b ??= a.fix ? 1.000001 : 1
        switch (a.bounds.name) {
            case 'clamp': return clamp(x, aa, b);
            case 'tile': return mod2(x, aa, b); 
            case 'reflect': return refl2(x, aa, b);
            case 'empty': return x<aa || x>b ? NaN : x;
        }
    }

    let c
    switch (a.space.name) {
        case 'rgb':
            color = new Color(b(color.r*a.r, 0, 256), b(color.g*a.g, 0, 256), b(color.b*a.b, 0, 256), color.a)
        break; case 'hsv':
            c = colorUtils.toHSV(color)
            c[0] = b(c[0] * a.h, 0, 6)
            c[1] = b(c[1] * a.s)
            c[2] = b(c[2] * a.v)
            color = colorUtils.fromHSV(...c, color.alpha)
        break; case 'hsl':
            c = colorUtils.toHSL(color)
            c[0] = b(c[0] * a.h, 0, 6)
            c[1] = b(c[1] * a.s)
            c[2] = b(c[2] * a.l)
            color = colorUtils.fromHSL(...c, color.alpha)
        break; case 'lab':
            c = colorUtils.toLab(color)
            c[0] = b(c[0] * a.ll)
            c[1] = b(c[1] * a.a, -1, 1)
            c[2] = b(c[2] * a.bb, -1, 1)
            color = colorUtils.fromLab(...c, color.alpha)
        break; case 'lch':
            c = colorUtils.toLch(color)
            c[0] = b(c[0] * a.ll)
            c[1] = b(c[1] * a.c)
            c[2] = b(c[2] * a.h)
            color = colorUtils.fromLch(...c, color.alpha)
        break
    }

    color.alpha = b(color.alpha*a.al/255, 0, 256)
    return color
}))

info.push(`Multiplies color variables with border wrapping.<br>\
For any colorspace selected, you can scale each channel, and their output will depend on the border mode, if values are out of natural range.<br>\
Inspired by Glitch lab.`)

effectList.push(new EffectTemplate('Channel Replicator', [
    {
        name: 'Output colorspace', key: 'space',
        type: '#colorspace',
        writable: a => !a.usei
    },{
        name: 'Value 0', key: 'v0',
        type: '#channel',
        default: 'red',
        writable: a => !a.usei
    },{
        name: 'Map 0', key: 'm0',
        type: '#chrmap',
        default: 'linear',
        writable: a => !a.usei
    },{
        name: 'Value 1', key: 'v1',
        type: '#channel',
        default: 'green',
        writable: a => !a.usei
    },{
        name: 'Map 1', key: 'm1',
        type: '#chrmap',
        default: 'linear',
        writable: a => !a.usei
    },{
        name: 'Value 2', key: 'v2',
        type: '#channel',
        default: 'blue',
        writable: a => !a.usei
    },{
        name: 'Map 2', key: 'm2',
        type: '#chrmap',
        default: 'linear',
        writable: a => !a.usei
    },{
        name: 'Unique integer', key: 'i',
        type: 'int',
        // maximum: (#chrmap * #channel) ** 3 * #colorspace - 1
        // default: #chrmap * #channel * #chrmap + (#chrmap * #channel) ** 2 * #chrmap * 2
        default: 2191050, min: 0, max: 98414999, softmin: 0, softmax: 98414999,
        writable: a => a.usei
    },{
        name: 'Use integer', key: 'usei',
        type: 'boolean'
    }
], function (d, a) {
    const name = {hsv:'HSV',hsl:'HSL',lab:'Lab',lch:'Lch'}
    const ranges = {rgb:[[0,255],[0,255],[0,255]],hsv:[[0,6],[0,1],[0,1]],hsl:[[0,6],[0,1],[0,1]],lab:[[0,1],[-1,1],[-1,1]],lch:[[0,1],[0,1],[0,1]]}
    
    let v0 = a.v0.name, m0 = a.m0.name, v1 = a.v1.name, m1 = a.m1.name, v2 = a.v2.name, m2 = a.m2.name, cs = a.space.name
    if (a.usei) {
        const i = a.i
        let div = 1
        const chrmap = Enum.enums.chrmap, channel = Enum.enums.channel

        m0 = chrmap.getItem(i % chrmap.length).name, div *= chrmap.length
        v0 = channel.getItem(Math.floor(i / div) % channel.length).name, div *= channel.length
        m1 = chrmap.getItem(Math.floor(i / div) % chrmap.length).name, div *= chrmap.length
        v1 = channel.getItem(Math.floor(i / div) % channel.length).name, div *= channel.length
        m2 = chrmap.getItem(Math.floor(i / div) % chrmap.length).name, div *= chrmap.length
        v2 = channel.getItem(Math.floor(i / div) % channel.length).name, div *= channel.length
        cs = Enum.enums.colorspace.getItem(Math.floor(i / div) % Enum.enums.colorspace.length).name
    }

    const tcolor = cs == 'rgb' ? [d.color.r,d.color.g,d.color.b] : colorUtils['to' + name[cs]](d.color)
    tcolor[0] = lerp(colorUtils.tween(colorUtils.of(d.color, v0), m0), ranges[cs][0][0], ranges[cs][0][1])
    tcolor[1] = lerp(colorUtils.tween(colorUtils.of(d.color, v1), m1), ranges[cs][1][0], ranges[cs][1][1])
    tcolor[2] = lerp(colorUtils.tween(colorUtils.of(d.color, v2), m2), ranges[cs][2][0], ranges[cs][2][1])

    return cs == 'rgb' ? new Color(...tcolor, d.color.alpha) : colorUtils['from' + name[cs]](...tcolor, d.color.alpha)
}))

info.push(`Sets color variables to another variable, with an added mapping function for the values.\
<br>The value parameters (0, 1, 2) correspond respectively to the variables in the selected colorspace.\
<br>As an extra feature, you can input an integer, each integer being a different combination of the parameters.\
<br>Inspired by Glitch lab.`)

effectList.push(new EffectTemplate('Waves', [
    {
        name: 'Amplitude', key: 'amp',
        type: 'number',
        default: .05, softmin: 0, softmax: 1
    },{
        name: 'Frequency', key: 'freq',
        type: 'number',
        default: 8, softmin: 0, softmax: 16
    },{
        name: 'Offset', key: 'off',
        type: 'number',
        default: 0, softmin: 0, softmax: 1
    },{
        name: 'Wave angle', key: 'angle',
        type: 'number',
        default: 0, softmin: -180, softmax: 180
    },{
        name: 'Distortion angle', key: 'disang',
        type: 'number',
        default: 0, softmin: -180, softmax: 180
    }, bounds
], function (d, a) {
    const scale = Math.max(d.width, d.height)
    const pos = d.pos.rotate(a.angle / 180 * Math.PI)
    const theta = (pos.x / scale * a.freq / 2 + a.off) * Math.PI * 2
    let delta = new Vector(0, Math.sin(theta) * scale * a.amp)
    if (a.disang) delta = delta.rotate(a.disang / 180 * Math.PI)

    return d.get(pos.add(delta).rotate(-a.angle / 180 * Math.PI), a.bounds.name)
}))

info.push(`Distorts the image with a wavy effect in any angle.<br>\
Distortion angle specifies the direction a pixel will shift to, relative to the wave's angle.`)

effectList.push(new EffectTemplate('Mix', [
    {
        name: 'Layer', key: 'l',
        type: 'int',
        softmin: 0, min: 0, softmax: 31
    },{
        name: 'Last layers', key: 'last',
        type: 'boolean'
    },{
        name: 'Mix', key: 'mix',
        type: 'number',
        default: .5, softmin: 0, softmax: 1
    }
], function (d, a) {
    if (d.outputs.length == 0) return d.color
    const pixel = getLayerPixel(d, a)
    return pixel.lerp(d.color, a.mix)
}))

info.push(`Mixes the last effect's output with the output of a specific effect that comes before.`)

effectList.push(new EffectTemplate('Pixel Sorter', [
    {
        name: 'Array values', key: 'mode',
        type: '#channel',
        default: 'luma'
    }, {
        name: 'Sort reset chance', key: 'reset',
        type: 'number',
        default: .9, min: 0, max: 1
    }, {
        name: 'Reverse order', key: 'flip',
        type: 'boolean'
    }, {
        name: 'Vertical', key: 'isv',
        type: 'boolean'
    }, rngparam
], function (d, a, v) {
    return a.isv ? v[d.x][d.y] : v[d.y][d.x]
}, function (img, a) {
    // sort rows.
    const chance = a.reset
    let rng = random(a.seed == -1 ? null : a.seed)
    const sign = a.flip ? -1 : 1
    const out = []

    const w = a.isv ? img.height : img.width, h = a.isv ? img.width : img.height
    for (let y = 0; y < h; y++) {

        // make sorting arrays for input
        /** @type {Color[][]} */
        const arrays = [[]]
        for (let x = 0; x < w; x++) {
            arrays[arrays.length - 1].push(img.getPixel(a.isv ? new Vector(y, x) : new Vector(x, y)))
            if (rng < chance) arrays.push([])
            rng = nextrnd(rng)
        }

        for (let v of arrays) {
            v.sort((A, B) => (colorUtils.of(A, a.mode.name) - colorUtils.of(B, a.mode.name)) * sign)
        }

        out.push(arrays.flat())

    }
    return out
}))