// To use this, do https://bonesyt.github.io/libraries/audioEncoder.js
'use strict'

// Convert Samples to Audio
// https://stackoverflow.com/questions/62172398/convert-audiobuffer-to-arraybuffer-blob-for-wav-download

;(()=>{

Array.prototype.toAudio = function (sampleRate=48e3, isBuffer=false) {
    let audio = new Audio

    var ar = this
    var a = new (window.AudioContext || window.webkitAudioContext)()
    var b = a.createBuffer(this.length, this[0].length, sampleRate)
    for (var c = 0; c < this.length; c++) {
        var d = b.getChannelData(c)
        for (var i = 0; i < b.length; i++) {
            d[i] = ar[c][i]
        }
    }
    var s = a.createBufferSource()
    s.buffer = b
    s.connect(a.destination)

    if (!isBuffer) {
        const [L, R] =  [b.getChannelData(0), b.getChannelData(1)]

        const d = new Float32Array(L.length + R.length)
        for (let src=0, dst=0; src < L.length; src++, dst+=2) {
            d[dst] =   L[src]
            d[dst+1] = R[src]
        }
    
        // get WAV file bytes and audio params of your audio source
        const w = getWavBytes(d.buffer, {
            isFloat: true,       // floating point or 16-bit integer
            numChannels: 2,
            sampleRate: sampleRate,
        })
        const W = new Blob([w], {type: 'audio/wav'})
        audio.src = URL.createObjectURL(W)
    }

    return isBuffer ? s : audio
}

/* Returns a promise. do returned.then(v => somevar = v) to get the result
   You need to be in the same host/website as the file, because of CORS. (won't work in file:) */
String.prototype.audioToArray = async function (withBuffer = 0) {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var src = this+''
    var s, f = []

    await new Promise(p => {
    var r = new XMLHttpRequest();
    r.open('GET', src, true);
    r.responseType = 'arraybuffer';
    r.onload = () => {
        var a = r.response;
        ctx.decodeAudioData(a, a => {
            s = ctx.createBufferSource();
            s.buffer = a;
            s.connect(ctx.destination);

            for (var i = 0; i < s.channelCount; i++) {
                f.push(s.buffer.getChannelData(i))
            }

            p()
        }, e => {throw e})
    }
    r.send()
    })

    return withBuffer ? {
        buffer: s.buffer,
        samples: f
    } : f
}



function getWavBytes(t, e) {
    const n = e.isFloat ? Float32Array : Uint16Array, a = t.byteLength / n.BYTES_PER_ELEMENT, r = getWavHeader(Object.assign({}, e, {
        numFrames: a
    })), i = new Uint8Array(r.length + t.byteLength);
    return i.set(r, 0), i.set(new Uint8Array(t), r.length), i;
}

function getWavHeader(t) {
    const e = t.numFrames,
          n = t.numChannels || 2,
          a = t.sampleRate || 44100,
          r = t.isFloat ? 4 : 2,
          i = t.isFloat ? 3 : 1,
          s = n * r,
          o = a * s,
          l = e * s,
          u = new ArrayBuffer(44),
          g = new DataView(u);
    let c = 0;
    function f(t) {
        for (let e = 0; e < t.length; e++) g.setUint8(c + e, t.charCodeAt(e));
        c += t.length;
    }
    function y(t) {
        g.setUint32(c, t, !0), c += 4;
    }
    function h(t) {
        g.setUint16(c, t, !0), c += 2;
    }
    return f("RIFF"), y(l + 36), f("WAVE"), f("fmt "), y(16), h(i), h(n), y(a), y(o), 
    h(s), h(8 * r), f("data"), y(l), new Uint8Array(u);
}

})()