//bar placing/removing
function placeBars(layer = 0) {
    var location
    switch (layer) {
        case 0: location = game.bars; break;
        case 1: location = game.prestige.bars; break;
    }
    while (config.bars[layer] < location.length) {
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

        c[0].addEventListener('click', new Function(`barIncrement(${config.bars[layer]}, ${layer})`))
        c[5].addEventListener('click', new Function(`barBuy(${config.bars[layer]}, ${layer})`))

        document.placeElement(e, 'progressbar-place-'+layer)
        color(config.bars[layer] / 3.75 * (layer / 3.75 + 1) - 1.4 + layer * 0.5, layer * 5.5, Math.min(85 + layer * 7.5, 100), config.bars[layer], layer)
        config.bars[layer]++
    }
}
function removeBars(layer = 0) {
    var location
    switch (layer) {
        case 0: location = game.bars; break;
        case 1: location = game.prestige.bars; break;
    }
    while (config.bars[layer] > location.length) {
        $(`prog-${layer}-${config.bars[layer] - 1}`).remove()
        config.bars[layer]--
    }
}

//normal bar element creator
function NormalBarElement(rgb=[255,255,255], id, width, height, textColor, outWidth) {
    var bar = $('normalpb-copy').cloneNode(true)
    var progress = bar.querySelector('div')
    var text = bar.querySelector('h1')

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
ButtonStyle($('scalebar-unlocker'), [0, 100, 255])
ButtonStyle($('give-scalebar'), 70)
ButtonStyle($('maxall'), 255)

AutoStart(1)
AutoStart(3)
statsCheck.upgradeUnlock()

$('progress').insertBefore(NormalBarElement([255, 0, 255], 'prestige', 450, 20, 'white'), $('progress').firstChild)

placeBars()
update()

game.achievements.forEach((v,i) => {
    if (config.ach % 6 == 0) {
        var tr = document.makeElement('tr', '')
        tr.id = 'tr' + config.ach / 6
        document.placeElement(tr, 'table')
    }
    var row = Math.floor(config.ach / 6)
    var th = document.makeElement('th', '')
    th.innerHTML = `<div style="background-color:${v.color||'#719bbf'};border-color:${v.bcolor||'#2b3746'}" id="ach-${config.ach}" onclick="achDesc(${config.ach})"><h1>${v.name}</h1></div>`
    document.placeElement(th, 'tr' + row)
    config.ach++
});

config.audio = new Audio(`audio/songs/back${game.stats.layer}.mp3`)