/** get by id @returns {HTMLElement} */
const $ = v => document.getElementById(v)
/** get by selector @returns {HTMLElement} */
const $$ = v => document.querySelector(v)

const data = {
    /** @type {File} */
    file: null,
    /** @type {HTMLCanvasElement} */
    canvas: $('output'),
    /** @type {CanvasRenderingContext2D} */
    ctx: $('output').getContext('2d'),
    /** @type {AdvancedImageData} */
    input: null,
    /** @type {ImageData} */
    output: null,
    /** @type {Effect[]} */
    effects: [],
    render: 2,
    keys: {shift:false}
}

const fileopen = document.createElement('input')
fileopen.type = 'file'
fileopen.accept = 'image/*'
const inputc = document.createElement('canvas')

// file input
$('open').addEventListener('click', () => {
    fileopen.click() // open file prompt
    fileopen.addEventListener('change', () => {
        if (fileopen.files[0]) {

            data.file = fileopen.files[0]
            let fr = new FileReader
            fr.onload = () => {
                const image = new Image()
                image.src = fr.result
                image.onload = () => { // when image loads, add it to the input
                    data.canvas.width = inputc.width = image.width
                    data.canvas.height = inputc.height = image.height
                    let ctx = inputc.getContext('2d')
                    ctx.drawImage(image, 0, 0)
                    data.input = new AdvancedImageData(ctx.getImageData(0, 0, image.width, image.height))
                    $('metadata').innerHTML = `${image.width}x${image.height} (${(image.width*image.height).toLocaleString()}px)<br>${(data.file.size).toLocaleString()} B`
                }
            }
            fr.readAsDataURL(data.file)
            $('image-text').innerHTML = data.file.name

        }
    })
})
$('download').addEventListener('click', () => {
    if (data.output) {
        const a = document.createElement('a')
        a.href = data.canvas.toDataURL('image/png', 1)
        const name = prompt('What will be the file\'s name? Will export in .png format.', data.file.name.replace(/\..+/, ''))
        if (name) {
            a.download = name
            a.click()
        }
    } else alert('Import an image and add an effect first!')
})

document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase()
    if (data.keys[key] != undefined) data.keys[key] = true
})
document.addEventListener('keyup', e => {
    const key = e.key.toLowerCase()
    if (data.keys[key] != undefined) data.keys[key] = false
})

function xerp(x, a, b) {
    let alpha = unlerp(x,a,b)
    return a / a ** alpha * b ** alpha
}
function unxerp(x, a, b) {
    let alpha = (x / a) ** (a / b)
    return lerp(alpha,a,b)
}
function lerp(x, a, b) {
    return a - a * x + b * x
}
function unlerp(x, a, b) {
    return (x - a) / (b - a)
}

/** create an editor for an effect @param {Effect} effect */
function createEffectEditor(effect, index) {

    // create effect element from template
    const clone = $$('#templates > .effect').cloneNode(true)
    const paramlist = clone.querySelector('.parameter-list')

    clone.querySelector('.effect-name').innerHTML = effect.template.name
    if (index != undefined) $('effect-list').insertBefore(clone, $('effect-list').children[index])
    else $('effect-list').appendChild(clone)

    /** @type {{[key:string]: HTMLDivElement}} */
    const vclones = {}

    /** updates parameter visibility */
    function updatevisible() {

        for (let param of effect.template.parameters) {
            if (param.writable) {
                const vclone = vclones[param.key]
                if (param.writable(effect.arguments)) vclone.parentElement.removeAttribute('hidden')
                    else vclone.parentElement.setAttribute('hidden', '')
            }
        }

    }

    for (let v of effect.template.parameters) {

        const pclone = $$('#templates > .parameter').cloneNode(true)
    
        pclone.querySelector('.parameter-name').innerHTML = v.name
        paramlist.appendChild(pclone)

        const initvalue = effect.arguments[v.key]
        /** @type {HTMLDivElement} */
        let vclone

        if (v.type == 'number' | v.type == 'int') {


            //--- NUMBERS ---


            vclone = $$('#templates > .number').cloneNode(true)

            /** @type {HTMLInputElement} */
            const number = vclone.querySelector('.number-input')
            /** @type {HTMLInputElement} */
            const slider = vclone.querySelector('.slider-input')

            slider.min = v.softmin.toString()
            slider.max = v.softmax.toString()
            number.value = slider.value = initvalue.toString()
            slider.step = v.type == 'int' && !v.exponential ? 1 : .001

            function condFloor(x) {
                return v.type == 'int' ? Math.floor(x) : x
            }

            function update(w) {
                let value =+ w.value
                if (value.type == 'int') value >>= 0
                if (w!=number) number.value = v.exponential ? condFloor(xerp(value, v.softmin, v.softmax)) : value
                if (w!=slider) slider.value = v.exponential ? unxerp(condFloor(value), v.softmin, v.softmax) : value
                else if (v.exponential) value = condFloor(xerp(value, v.softmin, v.softmax))
                effect.arguments[v.key] =+ value
                updatevisible()
            }

            number.addEventListener('input', () => update(number))
            slider.addEventListener('input', () => update(slider))

        } else if (v.type == 'color') {


            //--- COLORS ---


            vclone = $$('#templates > .color').cloneNode(true)

            /** @type {HTMLInputElement} */
            const text = vclone.querySelector('.text-input')
            /** @type {HTMLInputElement} */
            const color = vclone.querySelector('.color-input')

            color.value = initvalue.toHex(false)
            text.value = initvalue.toString()

            color.addEventListener('input', () => {
                const colorr = Color.fromHex(color.value)
                colorr.alpha = effect.arguments[v.key].alpha
                text.value = colorr.toString()
                effect.arguments[v.key] = colorr
                updatevisible()
            })
            text.addEventListener('input', () => {
                let colorr
                if (text.value[0] == '#') colorr = Color.fromHex(text.value)
                else if (text.value.split(',').length == 1) colorr = Color.fromInt24(+text.value)
                else {
                    const a = text.value.split(',').map(v => v.trim())
                    colorr = new Color(a[0], a[1] ?? a[0], a[2] ?? a[0], a[3] ?? 255)
                }
                color.value = colorr.toHex(false)
                effect.arguments[v.key] = colorr
                updatevisible()
            })

        } else if (v.type == 'boolean') {


            //--- BOOLEANS ---


            vclone = $$('#templates > .bool').cloneNode(true)

            /** @type {HTMLInputElement} */
            const check = vclone.querySelector('.check-input')

            check.checked = initvalue
            check.addEventListener('change', () => {
                effect.arguments[v.key] = check.checked
                updatevisible()
            })

        } else if (v.type instanceof Enum) {


            //--- ENUMERATIONS ---


            vclone = $$('#templates > .enum').cloneNode(true)

            /** @type {HTMLSelectElement} */
            const select = vclone.querySelector('.enum-input')
            select.name = v.type.name

            for (let item of v.type.states) {
                const option = document.createElement('option')
                option.value = item.name
                option.innerHTML = `${item.name} (${item.value})`
                select.appendChild(option)
            }
            select.value = initvalue.name

            select.addEventListener('change', () => {
                effect.arguments[v.key] = select.value
                updatevisible()
            })
            
        } else if (v.type == 'vector') {


            //--- VECTOR 2D ---


            vclone = $$('#templates > .vector').cloneNode(true)

            /** @type {HTMLDivElement} */
            const panel = vclone.querySelector('.v2handle-contain')
            /** @type {HTMLDivElement} */
            const handle = vclone.querySelector('.v2handle')
            /** @type {HTMLInputElement} */
            const inputx = vclone.querySelector('.v2x-input')
            /** @type {HTMLInputElement} */
            const inputy = vclone.querySelector('.v2y-input')

            let drag = false
            let sx, sy, bx, by //s: start, b: handle start
            let X = unlerp(initvalue.x, v.softmin.x, v.softmax.x), Y = unlerp(initvalue.y, v.softmin.y, v.softmax.y)

            // e is the element to not modify
            function update(e) {
                if (e != handle) {
                    X = unlerp(effect.arguments[v.key].x, v.softmin.x, v.softmax.x), Y = unlerp(effect.arguments[v.key].y, v.softmin.y, v.softmax.y)
                    handle.style.left = X * 100 + '%'
                    handle.style.top = Y * 100 + '%'
                    handle.style.translate = `transform(-${X * 100}%, -${Y * 100}%)`
                }
                if (e != inputx) inputx.value = effect.arguments[v.key].x
                if (e != inputy) inputy.value = effect.arguments[v.key].y

                updatevisible()
            }

            // controllable handle
            handle.addEventListener('mousedown', e => {
                drag = true
                e.preventDefault()
                sx = e.clientX, sy = e.clientY
                bx = X, by = Y
            })
            document.addEventListener('mouseup', () => {
                if (drag) drag = false
            })
            document.addEventListener('mousemove', e => {
                if (drag) {
                    let scale = panel.getBoundingClientRect().width
                    let dx = e.clientX - sx, dy = e.clientY - sy
                    X = clamp(bx + dx / scale, 0, 1), Y = clamp(by + dy / scale, 0, 1)
                    handle.style.left = X * 100 + '%'
                    handle.style.top = Y * 100 + '%'
                    effect.arguments[v.key] = new Vector(lerp(X, v.softmin.x, v.softmax.x), lerp(Y, v.softmin.y, v.softmax.y))
                    update(handle)
                }
            })
            inputx.addEventListener('input', () => {
                effect.arguments[v.key] = new Vector(+inputx.value, effect.arguments[v.key].y)
                update(inputx)
            })
            inputy.addEventListener('input', () => {
                effect.arguments[v.key] = new Vector(effect.arguments[v.key].x, +inputy.value)
                update(inputy)
            })
            update()
            
        }
        vclones[v.key] = vclone
        pclone.appendChild(vclone)
        vclone.className += ' parameter-value'

    }

    function updparam(arg,i,param) {

        if (typeof arg == 'number') {
            vclones[i].querySelector('.number-input').value = arg
            vclones[i].querySelector('.slider-input').value = arg
        } else if (arg instanceof Color) {
            vclones[i].querySelector('.text-input').value = arg.toString()
            vclones[i].querySelector('.color-input').value = arg.toHex(false)
        } else if (arg instanceof Vector) {
            vclones[i].querySelector('.v2x-input').value = arg.x
            vclones[i].querySelector('.v2y-input').value = arg.y
            vclones[i].querySelector('.v2handle').style.left = unlerp(arg.x, param.softmin.x, param.softmax.x)*100 + '%'
            vclones[i].querySelector('.v2handle').style.top  = unlerp(arg.y, param.softmin.y, param.softmax.y)*100 + '%'
        } else if (typeof arg == 'boolean') {
            vclones[i].querySelector('.check-input').checked = arg
        } else if (arg instanceof EnumItem) {
            vclones[i].querySelector('.enum-input').value = arg.name
        }

    }

    // delete
    clone.querySelector('.remove').addEventListener('click', () => {
        data.effects.splice(data.effects.indexOf(effect), 1)
        clone.remove()
    })
    // toggle
    clone.querySelector('.effect-toggle').addEventListener('click', () => {
        effect.enabled = !effect.enabled
        if (effect.enabled) {
            clone.removeAttribute('disabled')
        } else {
            clone.setAttribute('disabled', '')
        }
    })
    clone.querySelector('.expand').addEventListener('click', () => {
        if (paramlist.hasAttribute('hidden')) {
            paramlist.removeAttribute('hidden')
            clone.querySelector('.expand > img').src = 'images/expanded.png'
        } else {
            paramlist.setAttribute('hidden', '')
            clone.querySelector('.expand > img').src = 'images/collapsed.png'
        }
    })
    clone.querySelector('.default').addEventListener('click', () => {
        for (let i in effect.arguments) {

            const param = effect.template.parameters.find(v => v.key == i)
            effect.arguments[i] = param.default

            updparam(param.default, i, param)
            
        }
        updatevisible()
    })
    clone.querySelector('.move-above').addEventListener('click', () => {
        const index = data.effects.indexOf(effect)
        if (index > 0) {
            data.effects.splice(index, 1)
            data.effects.splice(index - 1, 0, effect)
            clone.remove()
            $('effect-list').insertBefore(clone, $('effect-list').children[index - 1])
        }
    })
    clone.querySelector('.move-below').addEventListener('click', () => {
        const index = data.effects.indexOf(effect)
        if (index < data.effects.length - 1) {
            data.effects.splice(index, 1)
            data.effects.splice(index + 1, 0, effect)
            clone.remove()
            $('effect-list').insertBefore(clone, $('effect-list').children[index + 1])
        }
    })
    clone.querySelector('.clone').addEventListener('click', () => {
        const index = data.effects.indexOf(effect)
        const clone = effect.clone()
        data.effects.splice(index + 1, 0, clone)
        createEffectEditor(clone, index + 1)
    })
    clone.querySelector('.random').addEventListener('click', () => {
        // randomize all arguments
        for (let i in effect.arguments) {

            const param = effect.template.parameters.find(v => v.key == i)
            let value
            switch (param.type) {

                case 'number':
                    value = Math.random() * (param.softmax - param.softmin) + param.softmin
                    if (param.exponential) value = xerp(value, param.softmin, param.softmax)
                break; case 'int':
                    value = Math.random() * (param.softmax - param.softmin + 1) + param.softmin
                    value = param.exponential ? Math.floor(xerp(value, param.softmin, param.softmax)) : Math.floor(value)
                break; case 'boolean':
                    value = Math.random() < .5
                    //vclones[i].querySelector('.check-input').checked = value
                break; case 'vector':
                    value = new Vector(Math.random() * (param.softmax.x - param.softmin.x) + param.softmin.x, Math.random() * (param.softmax.y - param.softmin.y) + param.softmin.y)
                    //vclones[i].querySelector('.check-input').checked = value
                break; case 'color':
                    value = Color.unit(Math.random(), Math.random(), Math.random())
                    //vclones[i].querySelector('.text-input').value = value.toString()
                    //vclones[i].querySelector('.color-input').value = value.toHex(false)
                break; default:
                    value = param.type.getItem(Math.floor(Math.random() * param.type.length))
                    //vclones[i].querySelector('.enum-input').value = value.name
                break; 

            }
            updparam(value, i, param)
            effect.arguments[i] = value
            
        }
        updatevisible()
    })
    clone.querySelector('.export-preset').addEventListener('click', () => {
        download(effect.template.name.replace(/\s/g, '') + '_Preset', JSON.stringify(json.to(effect)))
    })
    clone.querySelector('.import-preset').addEventListener('click', async () => {
        let a = await upload()
        try {json.from(JSON.parse(a), effect)} catch (e) {alert('Error: ',e)}
        for (let i in effect.arguments) updparam(effect.arguments[i], i, effect.template.parameters.find(v=>v.key==i))
        updatevisible()
    })
    updatevisible()

}

// put all available effects here
effectList.sort((a, b) => a.name > b.name ? 1 : -1)

for (let v of effectList) {

    const temp = $$('#templates > .effect-option')
    const clone = temp.cloneNode(true)

    clone.querySelector('.effect-option-name').innerHTML = v.name
    clone.querySelector('div').style.backgroundPosition = `-${(v.id % 16) * 40}px -${Math.floor(v.id / 16) * 200}px`

    $('effect-option-list').appendChild(clone)

    clone.addEventListener('click', () => {
        const e = new Effect(v)
        data.effects.push(e)
        createEffectEditor(e)
        if (!data.keys.shift) $('add-effect').setAttribute('hidden', '')   
    })

}

$('add').addEventListener('click', () => {
    $('add-effect').removeAttribute('hidden')              
})
$('close').addEventListener('click', () => {
    $('add-effect').setAttribute('hidden', '')        
})

$('toggle-all').addEventListener('click', () => {
    data.render = data.render == 2 ? 0 : 2
    if (data.render) {
        $('effect-section').removeAttribute('disabled')
    } else {
        $('effect-section').setAttribute('disabled', '')
    }
})

$('export').addEventListener('click', () => {
    // Export array of effects into file
    if (data.effects.length > 0) download('FilterSet', JSON.stringify(json.arrayTo()))
    else alert('There are no effects present.')
})
$('import').addEventListener('click', async () => {
    // Import file
    try {json.arrayFrom(JSON.parse(await upload()), effect)} catch (e) {alert('Error: ',e)}

    const node = $('effect-list')
    while (node.firstChild) node.removeChild(node.lastChild)
      
    for (let v of data.effects) createEffectEditor(v)
})

/** apply effects in order */
function render(force) {
    const t = Date.now()

    let image = data.input
    if (data.render == 2 || force) {
        for (let v of data.effects) {
            image = v.applyToImage(image)
        }
    } else data.render = 1
    data.output = image.output()
    data.ctx.putImageData(data.output, 0, 0)

    const time = Math.max((Date.now() - t) / 1e3, .001)
    $('fps').innerHTML = `Rendering: ${Math.round(1 / time * data.canvas.width * data.canvas.height).toLocaleString().padStart(11, '0')} px/s, ${Math.round(100 / time) / 100} fps`
}

setInterval(() => {
    if (data.input && data.render != 1) render()
})

$('render').addEventListener('click', async () => {
    if (data.input && data.render == 1) render(true)
})

async function download(name, string) {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: name + '.json',
            types: [{
                description: 'Effect preset',
                accept: {'application/json': ['.json']}
            }]
        });

        // Create a writable stream
        const writable = await handle.createWritable();

        // Write the text to the file
        await writable.write(string);

        // Close the file and write the contents to disk.
        await writable.close();
    } catch (error) {
        console.warn('Error saving file:', error);
    }
}
async function upload() {

    // open file prompt
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    //document.body.appendChild(input)
    //input.style.display = false
    input.click()

    await new Promise(r => input.addEventListener('change', r))
    if (input.files[0]) {

        // read file
        const file = input.files[0]
        let fr = new FileReader
        fr.readAsText(file)
        await new Promise(r => fr.onload = r)
        return fr.result

    }

}

/** @typedef {{name: string, parameters: {[key: string]: number|boolean|{r:number,g:number,b:number,a:number}|{item:string}}}} EffectPresetOutput */
const json = {
    /** @param {Effect} effect @returns {EffectPresetOutput} */
    to(effect) {
        const out = {
            name: effect.template.name,
            parameters: {}
        }

        for (let i in effect.arguments) {
            let v = effect.arguments[i]
            if (v instanceof Color) v = {r: v.red, g: v.green, b: v.blue, a: v.alpha}
            else if (v instanceof EnumItem) v = {item: v.name}
            out.parameters[i] = v
        }

        return out
    },
    /** @param {EffectPresetOutput} json @param {Effect} effect @returns {Effect} */
    from(json, effect) {

        if (effect && json.name != effect.template.name) throw Error(`Invalid preset: effect name does not match (${json.name})`)
        effect ??= new Effect(effectList.find(v => v.name == json.name))
        for (let key in json.parameters) {
            if (effect.arguments[key] == undefined) throw Error(`Invalid preset: no parameter with the name '${key}'`)
            let value = json.parameters[key]

            if (value.r) value = new Color(value.r, value.g, value.b, value.a)
            else if (value.item) value = effect.template.parameters.find(v => v.key == key).type.getItem(value.item)

            effect.arguments[key] = value
        }
        return effect

    },
    /** @param {Effect[]} effects @returns {EffectPresetOutput[]} */
    arrayTo() {
        return data.effects.map(v => json.to(v))
    },
    /** @param {EffectPresetOutput[]} json @returns {Effect[]} */
    arrayFrom(jsonn) {
        return data.effects = jsonn.map(v => json.from(v))
    }
}