var list = {
    add() {
        if (f.length == 36) {
            alert('Hello there! There\'s way too many effects! Limit is 36.')
            return undefined
        }
        f.push(()=>{})
        fs.push('return v')
        fn.push('Untitled ' + fn.length)
        values.push([0,0,0,0,0,0])
        isanim.push([false].repeat(6))
        speed.push(speed[editing])
        color.push('RGB')
        allow.push(true)
        list.upd()
        list.updbt()
        updatef()
    },
    rem() {
        if (f.length > 1) {
            if (confirm('Are you sure you want to delete this effect? You cannot undo this action.')) {
                f.splice(editing, 1)
                fs.splice(editing, 1)
                fn.splice(editing, 1)
                values.splice(editing, 1)
                isanim.splice(editing, 1)
                speed.splice(editing, 1)
                color.splice(editing, 1)
                allow.splice(editing, 1)
            }
            if (editing == f.length) editing -= 1
            list.upd()
            list.updbt()
            updatef()
        } else {
            alert('You cannot have no effects! Instead, just press the power button.')
        }
    },
    ml() {
        if (editing != f.length - 1) {
            var a = f[editing], b = fs[editing], c = fn[editing], d = values[editing], e = isanim[editing], F = speed[editing], g = color[editing], h = allow[editing]
            f.splice(editing, 1)
            fs.splice(editing, 1)
            fn.splice(editing, 1)
            values.splice(editing, 1)
            isanim.splice(editing, 1)
            speed.splice(editing, 1)
            color.splice(editing, 1)
            allow.splice(editing, 1)
            editing += 1
            f.splice(editing, 0, a)
            fs.splice(editing, 0, b)
            fn.splice(editing, 0, c)
            values.splice(editing, 0, d)
            isanim.splice(editing, 0, e)
            speed.splice(editing, 0, F)
            color.splice(editing, 0, g)
            allow.splice(editing, 0, h)
        }
        list.updbt()
        updatef()
    },
    mr() {
        if (editing != 0) {
            var a = f[editing], b = fs[editing], c = fn[editing], d = values[editing], e = isanim[editing], F = speed[editing], g = color[editing]
            f.splice(editing, 1)
            fs.splice(editing, 1)
            fn.splice(editing, 1)
            values.splice(editing, 1)
            isanim.splice(editing, 1)
            speed.splice(editing, 1)
            color.splice(editing, 1)
            allow.splice(editing, 1)
            editing -= 1
            f.splice(editing, 0, a)
            fs.splice(editing, 0, b)
            fn.splice(editing, 0, c)
            values.splice(editing, 0, d)
            isanim.splice(editing, 0, e)
            speed.splice(editing, 0, F)
            color.splice(editing, 0, g)
            allow.splice(editing, 0, h)
        }
        list.updbt()
        updatef()
    },
    name() {
        var a = prompt(`Enter the new name for this effect (ID: ${editing}).`)
        if (a.length > 64) {
            alert('You cannot name it that long!! Limit is 64 characters.')
            return undefined
        } 
        if (a) {
            fn[editing] = a
        }
        list.updbt()
    },
    upd() {
        fs[editing] = $('code').value
        $('sliderA').value = values[editing][0]
        $('sliderB').value = values[editing][1]
        $('sliderC').value = values[editing][2]
        $('sliderD').value = values[editing][3]
        $('sliderE').value = values[editing][4]
        $('sliderF').value = values[editing][5]
        $('sliderS').value = speed[editing]
        $('color').value = color[editing]
        for (var i = 0; i < 6; i++) {
            if (isanim[editing][i]) {
                $('anim' + i).src = 'textures/pause.png'
            } else {
                $('anim' + i).src = 'textures/play.png'
            }
        }
    },
    updbt() {
        $('effectlist').innerHTML = ''
        var a
        for (var i = 0; i < fn.length; i++) {
            a = document.createElement('button')
            a.id = 'effect' + i
            a.innerHTML = fn[i]
            a.addEventListener('click', e => {
                list.click(Number(e.srcElement.id.substr(6)))
            })
            if (i == editing) a.setAttribute('selected', '')
            if (!allow[i]) a.setAttribute('off', '')
            $('effectlist').appendChild(a)
        }
    },
    click(a) {
        editing = a
        $('code').value = fs[editing]
        list.upd()
        list.updbt()
    },
    allow() {
        allow[editing] = !allow[editing]
        list.updbt()
    }
}

list.updbt()
updatef()