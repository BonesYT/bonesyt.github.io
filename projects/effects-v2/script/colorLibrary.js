/* utility stuff for the effects

   rgb range: 0 to 255
   hsv & hsl range: 0 to 6, 0 to 1, 0 to 1 
   lab range: 0 to 1, -1 to +1, -1 to +1
   lch range: 0 to 1
   
   HSV and HSL conversion comes from https://gist.github.com/mjackson/5311256
   Lab conversion comes from https://github.com/antimatter15/rgb-lab/blob/master/color.js */


function mod2(x,a,b) {
    return mod(x-a, b-a) + a
}
function refl2(x,a,b) {
    return refl(x-a, b-a, true) + a
}
colorUtils = {

    /** @param {Color} color */
    getLuma(color) {
        return .2126*color.red + .7152*color.green + .0722*color.blue
    },



    // conversions

    /** @returns {Color} */
    fromHSV(h, s, v, α) {
        h = mod(h, 6)
        let r, g, b;

        let i = Math.floor(h);
        let f = h - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
      
        switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
        }
      
        return Color.unit(r, g, b, α);
    },
    /** @param {Color} color */
    toHSV(color) {
        let r = color.r/255, g = color.g/255, b = color.b/255

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;

        let d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        return [h, s, v];
    },


    
    /** @returns {Color} */
    fromHSL(h, s, l, α) {
        h = mod(h, 6)
        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 6;
                if (t > 6) t -= 6;
                if (t < 1) return p + (q - p) * t;
                if (t < 3) return q;
                if (t < 4) return p + (q - p) * (4 - t);
                return p;
            }

            let q = l < .5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;

            r = hue2rgb(p, q, h + 2);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 2);
        }

        return Color.unit(r, g, b, α);

    },
    /** @param {Color} color */
    toHSL(color) {
        let r = color.r/255, g = color.g/255, b = color.b/255

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
        }

        return [h, s, l];
    },



    /** @returns {Color} */
    fromLab(l, a, b, α) {
        let y = (l + .16) / 1.16,
            x = a / 5 + y,
            z = y - b / 2
    
        x = .95047 * ((x ** 3 > .008856) ? x ** 3 : (x - 16/116) / 7.787);
        y = 1.00000 * ((y ** 3 > .008856) ? y ** 3 : (y - 16/116) / 7.787);
        z = 1.08883 * ((z ** 3 > .008856) ? z ** 3 : (z - 16/116) / 7.787);
    
        let R = x *  3.2406 + y * -1.5372 + z * -.4986,
            G = x * -.9689 + y *  1.8758 + z *  .0415,
            B = x *  .0557 + y * -.2040 + z *  1.0570;
    
        R = (R > .0031308) ? (1.055 * Math.pow(R, 1/2.4) - .055) : 12.92 * R;
        G = (G > .0031308) ? (1.055 * Math.pow(G, 1/2.4) - .055) : 12.92 * G;
        B = (B > .0031308) ? (1.055 * Math.pow(B, 1/2.4) - .055) : 12.92 * B;
    
        return Color.unit(R, G, B, α)
    },
    /** @param {Color} color */
    toLab(color) {
        let r = color.r / 255, g = color.g / 255, b = color.b / 255
  
        r = (r > .04045) ? Math.pow((r + .055) / 1.055, 2.4) : r / 12.92;
        g = (g > .04045) ? Math.pow((g + .055) / 1.055, 2.4) : g / 12.92;
        b = (b > .04045) ? Math.pow((b + .055) / 1.055, 2.4) : b / 12.92;
    
        let x = (r * .4124 + g * .3576 + b * .1805) / .95047,
            y = (r * .2126 + g * .7152 + b * .0722) / 1.00000,
            z = (r * .0193 + g * .1192 + b * .9505) / 1.08883;
    
        x = (x > .008856) ? Math.cbrt(x) : (7.787 * x) + 16/116;
        y = (y > .008856) ? Math.cbrt(y) : (7.787 * y) + 16/116;
        z = (z > .008856) ? Math.cbrt(z) : (7.787 * z) + 16/116;
    
        return [(1.16 * y) - .16, 5 * (x - y), 2 * (y - z)]
    },



    /** @returns {Color} */
    fromLch(l, c, h, α) {
        h *= Math.PI * 2
        return this.fromLab(l, Math.cos(h) * c, Math.sin(h) * c, α)
    },
    /** @param {Color} color */
    toLch(color) {
        const lab = this.toLab(color)
        return [lab[0], Math.sqrt(lab[1] ** 2 + lab[2] ** 2), Math.atan2(lab[2], lab[1]) / Math.PI / 2]
    },



    fromxyY(x_, y_, y, α) {
        let x = x_ * y / y_,
            z = (1 - x_ - y_) * y / y_
        if (y_ == 0) x = y = z = 0

        let R = x *  3.2406 + y * -1.5372 + z * -.4986,
            G = x *  -.9689 + y *  1.8758 + z *  .0415,
            B = x *   .0557 + y *  -.2040 + z * 1.0570;
    
        R = (R > .0031308) ? (1.055 * Math.pow(R, 1/2.4) - .055) : 12.92 * R;
        G = (G > .0031308) ? (1.055 * Math.pow(G, 1/2.4) - .055) : 12.92 * G;
        B = (B > .0031308) ? (1.055 * Math.pow(B, 1/2.4) - .055) : 12.92 * B;
    
        return Color.unit(R, G, B, α)
    },
    toxyY(color) {
        let r = color.r / 255, g = color.g / 255, b = color.b / 255
  
        // Convert to XYZ first
        r = (r > .04045) ? Math.pow((r + .055) / 1.055, 2.4) : r / 12.92;
        g = (g > .04045) ? Math.pow((g + .055) / 1.055, 2.4) : g / 12.92;
        b = (b > .04045) ? Math.pow((b + .055) / 1.055, 2.4) : b / 12.92;
    
        let x0 = (r * .4124 + g * .3576 + b * .1805) /  .95047,
            y0 = (r * .2126 + g * .7152 + b * .0722) / 1.00000,
            z0 = (r * .0193 + g * .1192 + b * .9505) / 1.08883;

        if (x0 == y0 == z0)
            return [1/3, 1/3, y0]
        else
            return [x0 / (x0 + y0 + z0), y0 / (x0 + y0 + z0), y0]

    },



    /** gets brightness depending on the mode. For grayscale effect
     * @param {Color} color @param {string} mode  */
    value(c, mode) {
        switch (mode) {
            case 'average': return (c.r + c.g + c.b) / 3
            case 'maximum': return Math.max(c.r, c.g, c.b)
            case 'minimum': return Math.min(c.r, c.g, c.b)
            case 'luma': return this.getLuma(c)
            case 'median': // returns the channel value above min and below max
                const order = [c.r, c.g, c.b]
                order.sort((a,b) => a-b)
                return order[1];
            case 'geometric mean': return Math.cbrt(c.r * c.g * c.b)
            case 'hue': return this.toHSV(c)[0] * 42.5
            case 'hsv saturation': return this.toHSV(c)[1] * 255
            case 'hsl saturation': return this.toHSL(c)[1] * 255
            case 'hsl luminance': return this.toHSL(c)[2] * 255
            case 'lch hue': return this.toLch(c)[2] * 255
            case 'lch chroma': return this.toLch(c)[1] * 255
            case 'lch luma': return this.toLch(c)[0] * 255
            case 'add modulo': return mod(c.r + c.g + c.b, 256)
            case 'add reflect': return refl(c.r + c.g + c.b, 256)
        }
    },

    
    /** For the channel constancy effect. Value goes from 0 to 1
     * @param {Color} color
     * @param {string} variable
     * @param {number} value
     * @param {number} mix
     * @return Color
     */
    setChannelValue(color, variable, value, mix) {
        let out = color.clone()
        let c
        switch (variable) {
            case 'red': out.red = lerp(mix, out.r, value * 255); break
            case 'green': out.green = lerp(mix, out.g, value * 255); break
            case 'blue': out.blue = lerp(mix, out.b, value * 255); break
            case 'alpha': out.alpha = lerp(mix, out.a, value * 255); break
            case 'hue': c = colorUtils.toHSV(out); c[0] = lerp(mix, c[0], value * 6); out = colorUtils.fromHSV(...c, out.a); break
            case 'hsv saturation': c = colorUtils.toHSV(out); c[1] = lerp(mix, c[1], value); out = colorUtils.fromHSV(...c, out.a); break
            case 'maximum': c = colorUtils.toHSV(out); c[2] = lerp(mix, c[2], value); out = colorUtils.fromHSV(...c, out.a); break
            case 'hsl saturation': c = colorUtils.toHSL(out); c[1] = lerp(mix, c[1], value); out = colorUtils.fromHSL(...c, out.a); break
            case 'hsl luminance': c = colorUtils.toHSL(out); c[2] = lerp(mix, c[2], value); out = colorUtils.fromHSL(...c, out.a); break
            case 'lab luma': c = colorUtils.toLab(out); c[0] = lerp(mix, c[0], value); out = colorUtils.fromLab(...c, out.a); break
            case 'lab a': c = colorUtils.toLab(out); c[1] = lerp(mix, c[1], value*2-1); out = colorUtils.fromLab(...c, out.a); break
            case 'lab b': c = colorUtils.toLab(out); c[2] = lerp(mix, c[2], value)*2-1; out = colorUtils.fromLab(...c, out.a); break
            case 'lch hue': c = colorUtils.toLch(out); c[2] = lerp(mix, c[2], value); out = colorUtils.fromLch(...c, out.a); break
            case 'lch chroma': c = colorUtils.toLch(out); c[1] = lerp(mix, c[1], value); out = colorUtils.fromLch(...c, out.a); break
            case 'luma': c = colorUtils.getLuma(out); out = out.map(v => v - lerp(mix, 0, c - value*255)); break
            case 'luma expo': c = colorUtils.getLuma(out); out = out.map(v => v / lerp(mix, 1, c / (value*255))); break
            case 'average': c = (out.r+out.g+out.b)/3; out = out.map(v => v / lerp(mix, 1, c / (value*255))); break
            case 'minimum': c = Math.min(out.r, out.g, out.b); out = out.map(v => 255 - (255-v) / lerp(mix, 1, (255-c) / (255-value*255))); break
        }
        return out
    },

    /** change x map for chrmap Enum, assuming x goes from 0 to 1 */
    tween(x, mode) {
        switch (mode) {
            case 'linear': return x
            case 'reverse': return 1-x
            case 'zero': return 0
            case 'half': return .5
            case 'one': return 1
            case 'quadratic': return x**2
            case 'cubic': return x**3
            case 'sqrt': return Math.sqrt(x)
            case 'cbrt': return Math.cbrt(x)
            case 'exponential': return (1e3 ** x - 1) / 999
            case 'sine': return .5 - Math.cos(Math.PI * x) / 2
            case 'in-circle': return 1 - Math.sqrt(1 - clamp(x,0,1) ** 2)
            case 'out-circle': return Math.sqrt(2 * clamp(x,0,1) - clamp(x,0,1) ** 2)
            case 'threshold': return x >= .5 ? 1 : 0
            case 'random': return random(x * (2**32))
        }
    },

    of(color, variable) {
        let c
        switch (variable) {
            case 'red': return color.red / 255
            case 'green': return color.green / 255
            case 'blue': return color.blue / 255
            case 'alpha': return color.alpha / 255
            case 'hue': c = colorUtils.toHSV(color); return c[0] / 6
            case 'hsv saturation': c = colorUtils.toHSV(color); return c[1]
            case 'maximum': return Math.max(color.r, color.g, color.b)
            case 'hsl saturation': c = colorUtils.toHSL(color); return c[1]
            case 'hsl luminance': c = colorUtils.toHSL(color); return c[2]
            case 'lab luma': c = colorUtils.toLab(color); return c[0]
            case 'lab a': c = colorUtils.toLab(color); return c[1] / 2 + .5
            case 'lab b': c = colorUtils.toLab(color); return c[2] / 2 + .5
            case 'lch hue': c = colorUtils.toLch(color); return c[2]
            case 'lch chroma': c = colorUtils.toLch(color); return c[1]
            case 'luma': return colorUtils.getLuma(color)
            case 'luma expo': return colorUtils.getLuma(color)
            case 'average': return (color.r+color.g+color.b)/3
            case 'minimum': return Math.min(color.r, color.g, color.b)
        }
    },
}