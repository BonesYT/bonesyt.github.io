// To use this, do https://bonesyt.github.io/projects/effect/audio/js/convert.js
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



// Returns Uint8Array of WAV bytes
function getWavBytes(buffer, options) {
    const type = options.isFloat ? Float32Array : Uint16Array
    const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT
  
    const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
    const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
  
    // prepend header, then add pcmBytes
    wavBytes.set(headerBytes, 0)
    wavBytes.set(new Uint8Array(buffer), headerBytes.length)
  
    return wavBytes
}
  
// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
    const numFrames =      options.numFrames
    const numChannels =    options.numChannels || 2
    const sampleRate =     options.sampleRate || 44100
    const bytesPerSample = options.isFloat? 4 : 2
    const format =         options.isFloat? 3 : 1
  
    const blockAlign = numChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = numFrames * blockAlign
  
    const buffer = new ArrayBuffer(44)
    const dv = new DataView(buffer)
  
    let p = 0
  
    function A(s) {
      for (let i = 0; i < s.length; i++) {
        dv.setUint8(p + i, s.charCodeAt(i))
      }
      p += s.length
    }
  
    function C(d) {
      dv.setUint32(p, d, true)
      p += 4
    }
  
    function B(d) {
      dv.setUint16(p, d, true)
      p += 2
    }
  
    A('RIFF')              // ChunkID
    C(dataSize + 36)       // ChunkSize
    A('WAVE')              // Format
    A('fmt ')              // Subchunk1ID
    C(16)                  // Subchunk1Size
    B(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
    B(numChannels)         // NumChannels
    C(sampleRate)          // SampleRate
    C(byteRate)            // ByteRate
    B(blockAlign)          // BlockAlign
    B(bytesPerSample * 8)  // BitsPerSample
    A('data')              // Subchunk2ID
    C(dataSize)            // Subchunk2Size
  
    return new Uint8Array(buffer)
}

})()