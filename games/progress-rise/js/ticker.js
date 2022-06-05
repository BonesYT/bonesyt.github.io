config.news.msg = [
    'This is the first message haha.',
    'function tickerhaha() {throw Error("BISCOITINHO")}',
    'new game - blixer (haha)',
    'You have $points points? Wow that\'s some rookie numbers.',
    'BonesYT was called Bones before someone told me to change it lol.',
    'Level 1 Crook, Level ee20 Boss. That\'s how Progress Rise works.',
    'PROGRESS RISE IS IN BETA MODE!!!! REPORT ANY BUGS IN MY SERVER!!!!!',
    'Hello guis. - Danidanijr',
    'https://cdn.discordapp.com/attachments/838175013784780860/944336925718900787/hahadontclickme.png',
    'rip Adobe Flash 1996 - 2021',
    'Rendering "i ascended.mp4": $progL1',
    'HMM, Eu gostei muitado!!',
    'rip Everybody Edits 2010 - 2021',
    'God Bless Ukraine!!',
    'I dare you to click me. ;)'
]

function newstick() {
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
    if (config.news.text == config.news.msg[14]) window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
}