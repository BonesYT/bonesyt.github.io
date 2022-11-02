config.news.msg = [
    'This is the first message haha.',
    'function tickerhaha() {throw Error("BISCOITINHO")}',
    'new game - blixer (haha)',
    'You have $points points? Wow that\'s some rookie numbers.',
    'BonesYT was called Bones before someone suggested for me to change it lol.',
    'Level 1 Crook, Level ee20 Boss. That\'s how incrementals work.',
    'PROGRESS RISE IS IN BETA MODE!!!! REPORT ANY BUGS IN MY SERVER!!!!!',
    'Hello guis. - Danidanijr',
    'https://cdn.discordapp.com/attachments/838175013784780860/944336925718900787/hahadontclickme.png',
    'rip Adobe Flash 1996 - 2021',
    'Rendering "i ascended.mp4": $progL1',
    'HMM, Eu gostei muitado!!',
    'rip Everybody Edits 2010 - 2021',
    'God Bless Ukraine!!',
    'I dare you to click me. ;)',
    'This text is currently useless',
    'this sounds like a 🐦',
    'Imagine getting to E10#10. That would be hacking... Right?',
    'fish - NewFall2022'
]

function newstick() {
    const w = $c('gamescreen').clientHeight / 2
    config.news.pos -= 3
    if (config.news.pos < -820) {
        config.news.text = config.news.msg[Math.floor(Math.random() * config.news.msg.length)]
            .replace('$points', ts(game.points))
            .replace('$progL1', $('normalpb-text-prestige').innerHTML)
        $('newstext').innerHTML = config.news.text
        config.news.pos += 1640
    }
    $('newstext').style.transform = `translateX(${config.news.pos}px)`
}

function lol() {
    if (config.news.text == config.news.msg[14]) window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),game.achievements[12].instUnlock() // HAha.
    if (config.news.text == config.news.msg[ 8]) window.open(config.news.text) // HAhaH SUS. Disugised
    return 'you big tontarsso do Meu Pão'
}