save = {
    Psave() {
        ({
            sliders: values[editing],
            animated: isanim[editing],
            slidvel: speed[editing],
            color: color[editing],
            effect: $('code').value,
            name: fn[editing]
        }).stringify().btoa().toClipboard()
    },
    Pload() {
        EasyObj.clipb.get()
        setTimeout(()=>{
            try {
                var a = EasyObj.clipb.info.atob().parse()
            } catch {
                alert('This save code is invalid. (Decoding/Syntax Error) (try doing it again, might be because of the clipboard pop-up)')
                return false
            }
            if (confirm('Are you sure you want to load this code? Any unsaved changes will be discarded.')) {
                try {
                    $('sliderA').value = a.sliders[0]
                    $('sliderB').value = a.sliders[1]
                    $('sliderC').value = a.sliders[2]
                    $('sliderD').value = a.sliders[3]
                    $('sliderE').value = a.sliders[4]
                    $('sliderF').value = a.sliders[5]
                    isanim[editing] = a.animated
                    speed[editing] = a.slidvel
                    $('color').value = a.color
                    $('code').value = a.effect
                    fn[editing] = a.name || 'Untitled'
                    
                    list.updbt()
                    tick = 0
                    updatesliders()
                    updatef()
                    ctx.clearRect(0, 0, width, height)
                } catch {
                    alert('This save code is invalid. (Reference Error)')
                }
            }
        }, 33)
    },
    Csave() {
        ({
            eff: {
                names: fn,
                codes: fs
            },
            slid: {
                val: values,
                animated: isanim,
                velocity: speed
            },
            width: width,
            height: height,
            colors: color,
            img: select,
            tick: tick,
        }).stringify().btoa().toClipboard()
    },
    Cload() {
        EasyObj.clipb.get()
        setTimeout(()=>{
            try {
                var a = EasyObj.clipb.info.atob().parse()
            } catch {
                alert('This save code is invalid. (Decoding/Syntax Error) (try doing it again, might be because of the clipboard pop-up)')
                return false
            }
            if (confirm('Are you sure you want to load this code? Any unsaved changes will be discarded.')) {
                try {
                    tick = a.tick
                    select = a.img
                    color = a.colors
                    width = a.width
                    height = a.height
                    fn = a.eff.names
                    fs = a.eff.codes
                    values = a.slid.val
                    isanim = a.slid.animated
                    speed = a.slid.velocity
                    editing = 0
            
                    list.upd()
                    list.updbt()
                    updatef()
                    tick = 0
                    updatesliders()
                    updatef()
                    ctx.clearRect(0, 0, width, height)

                } catch {
                    alert('This save code is invalid. (Reference Error)')
                }
            }
        }, 33)
    }
}