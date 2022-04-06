Array.prototype.toAudio = function (sampleRate=48e3, channels=2) {
    var ar = this; ar=ar.map(v => Array.isArray(v) ? v : [v]) 
    var a = new (window.AudioContext || window.webkitAudioContext)()
    var b = a.createBuffer(channels, this.length, sampleRate)
    for (var c = 0; c < channels; c++) {
        var d = b.getChannelData(c)
        for (var i = 0; i < b.length; i++) {
            d[i] = ar[i][c]
        }
    }
    var s = a.createBufferSource()
    s.buffer = b
    s.connect(a.destination)
    return s
}