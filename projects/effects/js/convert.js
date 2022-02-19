// If toRGB is false, it'll convert rgb to target.
// If toRGB is true, it'll convert target to rgb.

Array.prototype.conv = function (target, toRGB=false, hasAlpha=true) {
    var v = this.clone()
    if (hasAlpha) var w = v.pop()
    if (target == 'rgb') result = v
    if (!toRGB) {
        switch (target) {
            case 'hsv':
                var rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
                rabs = v[0] / 255;
                gabs = v[1] / 255;
                babs = v[2] / 255;
                v = Math.max(rabs, gabs, babs),
                diff = v - Math.min(rabs, gabs, babs);
                diffc = c => (v - c) / 6 / diff + 1 / 2;
                percentRoundFn = num => Math.round(num * 100) / 100;
                if (diff == 0) {
                    h = s = 0;
                } else {
                    s = diff / v;
                    rr = diffc(rabs);
                    gg = diffc(gabs);
                    bb = diffc(babs);
                    if (rabs === v) {
                        h = bb - gg;
                    } else if (gabs === v) {
                        h = (1 / 3) + rr - bb;
                    } else if (babs === v) {
                        h = (2 / 3) + gg - rr;
                    }
                    if (h < 0) {
                        h += 1;
                    }else if (h > 1) {
                        h -= 1;
                    }
                }
                result = [h * 360, s * 100, v * 100]
            break; case 'hsl':
                var r = v[0],
				    g = v[1],
				    b = v[2];
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;
                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }	
                result = [h*360, s*100, l*100];
            break; case 'cmyk':
                var c = 1 - (v[0] / 255);
                var m = 1 - (v[1] / 255);
                var y = 1 - (v[2] / 255);
                var k = Math.min(c, Math.min(m, y));
                c = (c - k) / (1 - k);
                m = (m - k) / (1 - k);
                y = (y - k) / (1 - k);
                c = isNaN(c) ? 0 : c;
                m = isNaN(m) ? 0 : m;
                y = isNaN(y) ? 0 : y;
                k = isNaN(k) ? 0 : k;
                result = [c*100,m*100,y*100,k*100]
            break; case 'lab':
                var r = v[0] / 255,
                    g = v[1] / 255,
                    b = v[2] / 255,
                    x, y, z;
                r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
                g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
                b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
                x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
                y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
                z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
                x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
                y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
                z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
                result = [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
        }
    } else {
        switch (target) {
            case 'hsv':
                var rgb = { };
                var h = Math.round(v[0]%360);
                var s = Math.round(v[1] * 255 / 100);
                var v = Math.round(v[2] * 255 / 100)
                if (s == 0) {
                rgb.r = rgb.g = rgb.b = v;
                } else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                    if (h == 360) h = 0;
                        if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
                        else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
                        else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
                        else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
                        else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
                        else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
                        else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
                }
                result = [rgb.r, rgb.g, rgb.b];
            break; case 'hsl':
                v[0] /= 360;
                v[0] %= 1;
                v[1] /= 100;
                v[2] /= 100
                var r, g, b;
                if(s == 0){
                    r = g = b = v[2]; // achromatic
                }else{
                    var a = function (p, q, t){
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }
                    var q = v[2] < 0.5 ? v[2] * (1 + v[1]) : v[2] + v[1] - v[2] * v[1];
                    var p = 2 * v[2] - q;
                    r = a(p, q, v[0] + 1/3);
                    g = a(p, q, v[0]);
                    b = a(p, q, v[0] - 1/3);
                }
                result = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            break; case 'cmyk':
                v[0] = (v[0] / 100);
                v[1] = (v[1] / 100);
                v[2] = (v[2] / 100);
                v[3] = (v[3] / 100);
                v[0] = v[0] * (1 - v[3]) + v[3];
                v[1] = v[1] * (1 - v[3]) + v[3];
                v[2] = v[2] * (1 - v[3]) + v[3];
                var r = 1 - v[0];
                var g = 1 - v[1];
                var b = 1 - v[2];
                result = [r*255,g*255,b*255]
            break; case 'lab':
                var y = (v[0] + 16) / 116,
                x = v[1] / 500 + y,
                z = y - v[2] / 200,
                r, g, b;
                x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
                y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
                z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);
                r = x *  3.2406 + y * -1.5372 + z * -0.4986;
                g = x * -0.9689 + y *  1.8758 + z *  0.0415;
                b = x *  0.0557 + y * -0.2040 + z *  1.0570;
                r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
                g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
                b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;
              
                result = [Math.max(0, Math.min(1, r)) * 255, 
                        Math.max(0, Math.min(1, g)) * 255, 
                        Math.max(0, Math.min(1, b)) * 255]
        }
    }
    return hasAlpha ? result.concat(w) : result
}