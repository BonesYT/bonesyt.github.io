//bar placing/removing
function placeBars(layer = 0) {
    let location = layerloc(layer).bars
    while (config.bars[layer] < location.length & config.bars[layer] <= 35) {
        var e = $('progressbar-copy').cloneNode(true)
        
        e.style.display = 'block'
        e.id = `prog-${layer}-${config.bars[layer]}`
        var c = e.querySelectorAll('.select')
        c[0].id = `prog-cont-${layer}-${config.bars[layer]}`
        c[1].id = `prog-bar-${layer}-${config.bars[layer]}`
        c[2].id = `prog-text-${layer}-${config.bars[layer]}`
        c[3].id = `prog-button-${layer}-${config.bars[layer]}`
        c[4].id = `prog-level-${layer}-${config.bars[layer]}`
        c[5].id = `prog-buy-${layer}-${config.bars[layer]}`

        c[3].addEventListener('click', new Function(`barIncrement(${config.bars[layer]}, ${layer})`))
        c[5].addEventListener('click', new Function(`barBuy(${config.bars[layer]}, ${layer})`))
        if (layer == 2) c[1].appendChild($c('pb-filter'))

        document.placeElement(e, 'progressbar-place-'+layer)
        color(config.bars[layer] / 3.75 * (layer / 3.75 + 1) - 1.4 + layer * 0.5, layer * 5.5, Math.min(85 + layer * 7.5, 100), config.bars[layer], layer)
        config.bars[layer]++
    }
}
function removeBars(layer = 0) {
    let location = layerloc(layer).bars
    while (config.bars[layer] > location.length) {
        $(`prog-${layer}-${config.bars[layer] - 1}`).remove()
        config.bars[layer]--
    }
}

//normal bar element creator
function NormalBarElement(rgb=[255,255,255], id, width, height, textColor, outWidth) {
    let bar = $('normalpb-copy').cloneNode(true),
        progress = bar.querySelector('div'),
        text = bar.querySelector('h1')

    bar.style.backgroundImage = `linear-gradient(rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) 0%, rgb(${rgb[0]/1.25}, ${rgb[1]/1.25}, ${rgb[2]/1.25}) 100%)`
    bar.style.outline = (outWidth || '4') + `px solid rgb(${rgb[0]/5}, ${rgb[1]/5}, ${rgb[2]/5})`
    bar.style.width = width ? (width + 'px') : ''
    bar.style.height = height ? (height + 'px') : ''
    progress.style.backgroundImage = `linear-gradient(rgb(${rgb[0]/1.875}, ${rgb[1]/1.875}, ${rgb[2]/1.875}) 0%, rgb(${rgb[0]/3}, ${rgb[1]/3}, ${rgb[2]/3}) 100%)`
    bar.id = 'normalpb-' + id
    progress.id = 'normalpb-prog-' + id
    text.id = 'normalpb-text-' + id
    if (height) text.style.fontSize = (height / (5 / 3)) + 'px'
    if (textColor) text.style.color = textColor.toString()

    return bar
}

//button styling
function ButtonStyle(node, rgb) {
    if (typeof rgb != 'object') rgb = [rgb, rgb, rgb]
    if (node.tagName == 'BUTTON') {
        node.style.minHeight = '48px'
        node.style.borderRadius = '2.5px'
        node.style.borderWidth = '4px'
        node.style.fontFamily = 'gameFont'
        node.style.whiteSpace = 'pre-wrap'
        node.style.borderColor = 'rgb('+(rgb[0]/5)+','+(rgb[1]/5)+','+(rgb[2]/5)+')'
        node.style.backgroundImage = `linear-gradient(rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) 0%, rgb(${rgb[0]/1.1}, ${rgb[1]/1.15}, ${rgb[2]/1.15}) 100%)`
    } else {throw Error('Element is not a button.')}
}

var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 100)
ButtonStyle($('next-bar'), [a.r, a.g, a.b])
ButtonStyle($('pause'), 255)
ButtonStyle($('export'), [0, 255, 255])
ButtonStyle($('import'), [0, 255, 255])
ButtonStyle($('save'), [255, 255, 0])
ButtonStyle($('wipe'), [255, 0, 0])
ButtonStyle($('ascend'), 70)
ButtonStyle($('ascend-2'), [46,46,70])
ButtonStyle($('scalebar-unlocker'), [0, 100, 255])
ButtonStyle($('give-scalebar'), 70)
ButtonStyle($('maxall'), 255)

AutoStart(1)
AutoStart(3)
statsCheck.upgradeUnlock()

$('progress').insertBefore(NormalBarElement([255, 0, 255], 'prestige', 450, 20, 'white'), $('progress').firstChild)
$('progress-2').insertBefore(NormalBarElement([180, 40, 255], 'prestige-2', 450, 20, 'white'), $('progress-2').firstChild)

placeBars()
update()

config.achID = []
game.achievements.forEach(v => {
    let tr, row
    if (v.secret) {
        if (config.ach[1] % 6 == 0) {
            tr = document.makeElement('tr', '')
            tr.id = 'tr-s-' + config.ach[1] / 6
            document.placeElement(tr, 'table-secret')
        }
        row = Math.floor(config.ach[1] / 6)
    } else {
        if (config.ach[0] % 6 == 0) {
            tr = document.makeElement('tr', '')
            tr.id = 'tr-n-' + config.ach[0] / 6
            document.placeElement(tr, 'table-normal')
        }
        row = Math.floor(config.ach[0] / 6)
    }
    let th = document.makeElement('th', '')
    th.innerHTML = `<div style="background-color:${v.color||'#719bbf'};border-color:${v.bcolor||'#2b3746'}" id="ach-${v.id}" onclick="achDesc(${v.id}${v.secret?','+config.ach[1]:''})"><span>${v.name}</span></div>`
    document.placeElement(th, (v.secret ? 'tr-s-' : 'tr-n-') + row)
    config.ach[+v.secret]++
});

config.audio = new Audio(`audio/songs/back${game.stats.layer}.mp3`)

function CreateUpgs(l) {

    document.querySelectorAll('#upgrades>.upg-button').forEach(v => v.remove())
    console.log(l)

    l.forEach(v => {

        let e = document.createElement('button')
        e.className = 'upg-button upg-' + v.type
        e.id = 'upg-' + v.id
        e.addEventListener('click', () => upgrade(v.id))

        switch (v.layer) {
            case 0: $('upgg-0').appendChild(e); break
            case 1: $('upgg-1').appendChild(e); break
            case 2: $('upgg-2').appendChild(e); break
        }
    })
    config.elready = true

}
CreateUpgs(game.upgrades)