save = {
    Psave() {
        ({
            media: media,
            sliders: values[editing],
            animated: isanim[editing],
            slidvel: speed[editing],
            color: media=='audio'?void 0:color[editing],
            effect: $('code').value,
            name: fn[editing]
        }).stringify().btoa().toClipboard()
        saved=true
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
            try {
                if (a.media != media) {
                    alert(`Error: This effect is not a ${media} type.`)
                    return
                }
                if (confirm('Are you sure you want to load this code? Any unsaved changes will be discarded.')) {
                    $('sliderA').value = a.sliders[0]
                    $('sliderB').value = a.sliders[1]
                    $('sliderC').value = a.sliders[2]
                    $('sliderD').value = a.sliders[3]
                    $('sliderE').value = a.sliders[4]
                    $('sliderF').value = a.sliders[5]
                    isanim[editing] = a.animated
                    speed[editing] = a.slidvel
                    if (media=='image') $('color').value = a.color
                    $('code').value = a.effect
                    fn[editing] = a.name || 'Untitled'
                    
                    list.updbt()
                    updatesliders()
                    updslidmod()
                    updatef()
                }
            } catch (e) {
                alert('This save code is invalid. (Reference/Type Error)')
                console.log(e)
            }
        }, 33)
    },
    Csave() {
        ({
            media: media,
            eff: {
                names: fn,
                codes: fs
            },
            slid: {
                val: values,
                animated: isanim,
                velocity: speed
            },
            width: media=='audio'?void 0:width,
            height: media=='audio'?void 0:height,
            colors: media=='audio'?void 0:color,
            media: select,
            tick: media=='audio'?void 0:tick,
        }).stringify().btoa().toClipboard()
        saved=true
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
            try {
                if (a.media != media) {
                    alert(`Error: This save is not a ${media} type.`)
                    return
                }
                if (confirm('Are you sure you want to load this code? Any unsaved changes will be discarded.')) {
                    if (media=='image') {
                        tick = a.tick
                        color = a.colors
                        width = a.width
                        height = a.height
                    }
                    select = a.media ?? a.img
                    fn = a.eff.names
                    fs = a.eff.codes
                    values = a.slid.val
                    isanim = a.slid.animated
                    speed = a.slid.velocity
                    editing = 0
            
                    list.upd()
                    list.updbt()
                    updatesliders()
                    updslidmod()
                    updatef()

                }
            } catch (e) {
                alert('This save code is invalid. (Reference/Type Error)')
                console.log(e)
            }
        }, 33)
    }
}