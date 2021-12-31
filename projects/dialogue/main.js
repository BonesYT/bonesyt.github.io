function $(e) {
    return document.getElementById(e)
}

function Confirm() {
    var str = $('cmdinput').value
    var cmd = str.split(': ')[0].split(' ')
    var act = str.split(': ')[1]
    switch (cmd[0]) {
        case 'say':
            say(act)
        break
        case 'config': {switch (cmd[1]) {
            case 'delay': sys.delay = Number(act); break;
            case 'textSize': $('dialogue').style.fontSize = act + 'px'; break;
            case 'audio': {switch (cmd[2]) {
                case 'play': if (audio.paused) audio.play(); break;
                case 'pause': audio.pause(); break;
            }}; break
        }}; break
    }
}

function say(s) {
    var str = ''
    int = setInterval(()=>{
        str += s[str.length]
        $('dialogue').innerHTML = str
        new Audio('stuff/dialogue.mp3').play()
        if (str == s) clearInterval(int)
    }, sys.delay)
}

sys = {
    delay: 160
}

document.onmousedown = ()=>{
    if (!this['audio']) {
        audio = new Audio('stuff/pad.mp3')
        audio.loop = 'loop'
        audio.play()
    }
}

console.log('say, config delay, config textSize, config audio play, config audio pause')