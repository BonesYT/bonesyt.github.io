// If toRGB is false, it'll convert rgb to target.
// If toRGB is true, it'll convert target to rgb.

function conv(arr, target, toRGB=false, hasAlpha=true, A=[], v=[], w=[]) {
    v = [...arr]
    if (target == 'rgb') return v
    if (!toRGB) {
        switch (target) {
            case 'hsv':
                A = [void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0]
                A[0] = v[0] / 255;
                A[1] = v[1] / 255;
                A[2] = v[2] / 255;
                A[8] = Math.max(A[0], A[1], A[2]),
                A[9] = A[8] - Math.min(A[0], A[1], A[2]);
                A[10] = c => (A[8] - c) / 6 / A[9] + 1 / 2;
                A[11] = num => Math.round(num * 100) / 100;
                if (A[9] == 0) {
                    A[6] = A[7] = 0;
                } else {
                    A[7] = A[9] / A[8];
                    A[3] = A[10](A[0]);
                    A[4] = A[10](A[1]);
                    A[5] = A[10](A[2]);
                    if (A[0] === A[8]) {
                        A[6] = A[5] - A[4];
                    } else if (A[1] === A[8]) {
                        A[6] = (1 / 3) + A[3] - A[5];
                    } else if (A[2] === A[8]) {
                        A[6] = (2 / 3) + A[4] - A[3];
                    }
                    if (A[6] < 0) {
                        A[6] += 1;
                    }else if (A[6] > 1) {
                        A[6] -= 1;
                    }
                }
                result = [A[6] * 360, A[7] * 100, A[8] * 100]
            break; case 'hsl':
                A = []
                A[0] = v[0]
			    A[1] = v[1]
				A[2] = v[2]
                A[0] /= 255, A[1] /= 255, A[2] /= 255;
                A[3] = Math.max(A[0], A[1], A[2])
                A[4] = Math.min(A[0], A[1], A[2]);
                A[5]=void 0, A[6]=void 0, A[7] = (A[3] + A[4]) / 2;
                if (A[3] == A[4]) {
                    A[5] = A[6] = 0; // achromatic
                } else {
                    A[8] = A[3] - A[4];
                    A[6] = A[7] > 0.5 ? A[8] / (2 - A[3] - A[4]) : A[8] / (A[3] + A[4]);
                    switch (A[3]) {
                    case A[0]: A[5] = (A[1] - A[2]) / A[8] + (A[1] < A[2] ? 6 : 0); break;
                    case A[1]: A[5] = (A[2] - A[0]) / A[8] + 2; break;
                    case A[2]: A[5] = (A[0] - A[1]) / A[8] + 4; break;
                    }
                    A[5] /= 6;
                }	
                result = [A[5]*360, A[6]*100, A[7]*100];
            break; case 'cmyk':
                A = [1 - (v[0] / 255),
                    1 - (v[1] / 255),
                    1 - (v[2] / 255),
                    Math.min(A[0], Math.min(A[1], A[2]))]
                A[0] = (A[0] - A[3]) / (1 - A[3]);
                A[1] = (A[1] - A[3]) / (1 - A[3]);
                A[2] = (A[2] - A[3]) / (1 - A[3]);
                A[0] = isNaN(A[0]) ? 0 : A[0];
                A[1] = isNaN(A[1]) ? 0 : A[1];
                A[2] = isNaN(A[2]) ? 0 : A[2];
                A[3] = isNaN(A[3]) ? 0 : A[3];
                result = [A[0]*100,A[1]*100,A[2]*100,A[3]*100]
            break; case 'lab':
                A = [v[0] / 255,
                    v[1] / 255,
                    v[2] / 255,
                    void 0,void 0,void 0]
                A[0] = (A[0] > 0.04045) ? Math.pow((A[0] + 0.055) / 1.055, 2.4) : A[0] / 12.92;
                A[1] = (A[1] > 0.04045) ? Math.pow((A[1] + 0.055) / 1.055, 2.4) : A[1] / 12.92;
                A[2] = (A[2] > 0.04045) ? Math.pow((A[2] + 0.055) / 1.055, 2.4) : A[2] / 12.92;
                A[3] = (A[0] * 0.4124 + A[1] * 0.3576 + A[2] * 0.1805) / 0.95047;
                A[4] = (A[0] * 0.2126 + A[1] * 0.7152 + A[2] * 0.0722) / 1.00000;
                A[5] = (A[0] * 0.0193 + A[1] * 0.1192 + A[2] * 0.9505) / 1.08883;
                A[3] = (A[3] > 0.008856) ? Math.pow(A[3], 1/3) : (7.787 * A[3]) + 16/116;
                A[4] = (A[4] > 0.008856) ? Math.pow(A[4], 1/3) : (7.787 * A[4]) + 16/116;
                A[5] = (A[5] > 0.008856) ? Math.pow(A[5], 1/3) : (7.787 * A[5]) + 16/116;
                result = [(116 * A[4]) - 16, 500 * (A[3] - A[5]), 200 * (A[4] - A[5])]
        }
    } else {
        switch (target) {
            case 'hsv':
                A[0] = { };
                A[1] = Math.round(v[0]%360);
                A[2] = Math.round(v[1] * 255 / 100);
                A[3] = Math.round(v[2] * 255 / 100)
                if (A[2] == 0) {
                A[0].r = A[0].g = A[0].b = A[3]
                } else {
                A[4] = A[3];
                A[5] = (255 - A[2]) * A[3] / 255;
                A[6] = (A[4] - A[5]) * (A[1] % 60) / 60;
                    if (A[1] == 360) A[1] = 0;
                        if (A[1] < 60) { A[0].r = A[4]; A[0].b = A[5]; A[0].g = A[5] + A[6] }
                        else if (A[1] < 120) { A[0].g = A[4]; A[0].b = A[5]; A[0].r = A[4] - A[6] }
                        else if (A[1] < 180) { A[0].g = A[4]; A[0].r = A[5]; A[0].b = A[5] + A[6] }
                        else if (A[1] < 240) { A[0].b = A[4]; A[0].r = A[5]; A[0].g = A[4] - A[6] }
                        else if (A[1] < 300) { A[0].b = A[4]; A[0].g = A[5]; A[0].r = A[5] + A[6] }
                        else if (A[1] < 360) { A[0].r = A[4]; A[0].g = A[5]; A[0].b = A[4] - A[6] }
                        else { A[0].r = 0; A[0].g = 0; A[0].b = 0 }
                }
                result = [A[0].r, A[0].g, A[0].b];
            break; case 'hsl':
                v[0] /= 360;
                v[0] %= 1;
                v[1] /= 100;
                v[2] /= 100
                A=[void 0,void 0,void 0]
                if(v[1] == 0){
                    A[0] = A[1] = A[2] = v[2]; // achromatic
                }else{
                    A[5] = function (p, q, t){
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }
                    A[3] = v[2] < 0.5 ? v[2] * (1 + v[1]) : v[2] + v[1] - v[2] * v[1];
                    A[4] = 2 * v[2] - A[3];
                    A[0] = A[5](A[4], A[3], v[0] + 1/3);
                    A[1] = A[5](A[4], A[3], v[0]);
                    A[2] = A[5](A[4], A[3], v[0] - 1/3);
                }
                result = [Math.round(A[0] * 255), Math.round(A[1] * 255), Math.round(A[2] * 255)];
            break; case 'cmyk':
                v[0] = (v[0] / 100);
                v[1] = (v[1] / 100);
                v[2] = (v[2] / 100);
                v[3] = (v[3] / 100);
                v[0] = v[0] * (1 - v[3]) + v[3];
                v[1] = v[1] * (1 - v[3]) + v[3];
                v[2] = v[2] * (1 - v[3]) + v[3];
                A[0] = 1 - v[0];
                A[1] = 1 - v[1];
                A[2] = 1 - v[2];
                result = [A[0]*255,A[1]*255,A[2]*255]
            break; case 'lab':
                A[1] = (v[0] + 16) / 116,
                A[0] = v[1] / 500 + A[1],
                A[2] = A[1] - v[2] / 200,
                A[3], A[4], A[5];
                A[0] = 0.95047 * ((A[0] * A[0] * A[0] > 0.008856) ? A[0] * A[0] * A[0] : (A[0] - 16/116) / 7.787);
                A[1] = 1.00000 * ((A[1] * A[1] * A[1] > 0.008856) ? A[1] * A[1] * A[1] : (A[1] - 16/116) / 7.787);
                A[2] = 1.08883 * ((A[2] * A[2] * A[2] > 0.008856) ? A[2] * A[2] * A[2] : (A[2] - 16/116) / 7.787);
                A[3] = A[0] *  3.2406 + A[1] * -1.5372 + A[2] * -0.4986;
                A[4] = A[0] * -0.9689 + A[1] *  1.8758 + A[2] *  0.0415;
                A[5] = A[0] *  0.0557 + A[1] * -0.2040 + A[2] *  1.0570;
                A[3] = (A[3] > 0.0031308) ? (1.055 * Math.pow(A[3], 1/2.4) - 0.055) : 12.92 * A[3];
                A[4] = (A[4] > 0.0031308) ? (1.055 * Math.pow(A[4], 1/2.4) - 0.055) : 12.92 * A[4];
                A[5] = (A[5] > 0.0031308) ? (1.055 * Math.pow(A[5], 1/2.4) - 0.055) : 12.92 * A[5];
              
                result = [Math.max(0, Math.min(1, A[3])) * 255, 
                        Math.max(0, Math.min(1, A[4])) * 255, 
                        Math.max(0, Math.min(1, A[5])) * 255]
        }
    }
    return [...result, v[v.length-1]]
}