function $(e) {
    return document.getElementById(e)
}

var Obj = {}
var ID = []
var Show = []

function load() {
    var work
    try {
        Obj = JSON.parse($('input').value)
        work = true
    } catch {
        alert('Something\'s wrong in the JSON code!')
        word = false
    }
    if (work) {
        ID = []
        Show = []

        $('json').querySelectorAll(['button', 'div']).forEach((v)=>{
            v.remove()
        })
        var name, type, button, div
        for (var i in Object.keys(Obj)) {
            name = Object.keys(Obj)[i]
            type = typeof Obj[name]
            ID.push(name)
            Show.push(-1)
            button = document.createElement('button')
            button.id = 'button-' + (ID.length - 1)
            button.innerHTML = name + (type == 'object' ? ('<small>(' + Object.keys(Obj[name]).length + ')</small>') : '')
            button.style.width = '100%'
            button.addEventListener('click', new Function('click(event.srcElement.id)'))
            $('json').appendChild(button)
            div = document.createElement('div')
            div.id = 'div-' + (ID.length - 1)
            $('json').appendChild(div)
        }
    }
}

function click(name) {
    var id = name.slice(7), divname = 'div-' + id, amm = ID[id].split('.').length, val = getFromPath(ID[id], Obj)
    switch (Show[id]) {
    case -1:
        if (typeof val == 'object') {
            var name, type, button, div
            for (var i in Object.keys(val)) {
                name = Object.keys(val)[i]
                type = typeof val[name]
                ID.push(ID[id] + '.' + name)
                Show.push(-1)
                button = document.createElement('button')
                button.id = 'button-' + (ID.length - 1)
                button.innerHTML = name + (type == 'object' ? ('<small>(' + Object.keys(val[name]).length + ')</small>') : '')
                button.style.width = (100 - (amm * 5)) + '%'
                button.addEventListener('click', new Function('click(event.srcElement.id)'))
                $(divname).appendChild(button)
                div = document.createElement('div')
                div.id = 'div-' + (ID.length - 1)
                $(divname).appendChild(div)
            }
        } else {
            button = document.createElement('button')
            button.innerHTML = typeof val + ': ' + val
            button.style.width = (100 - (amm * 5)) + '%'
            $(divname).appendChild(button)
        }
        Show[id] = 1
    break
    case 0:
        $(divname).style.display = 'block'
        Show[id] = 1
    break
    case 1:
        $(divname).style.display = 'none'
        Show[id] = 0
    break
    }
}

function getFromPath(path, val) {
    path = path.split('.')
    for (var i in path) {
        val = val[path[i]]
    }
    return val
}