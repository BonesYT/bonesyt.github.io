$ = i => document.getElementById(i)

$('mode').addEventListener('input', updslid)

let enm = [], enm2 = [], id
const canvas = $('rtc'),
      ctx = canvas.getContext('2d')

async function updslid() {

    const v = $('value'), v2 = $('E-value') , m = $('mode').value
    v.step = 1
    enm = null
    switch (m) {

        case 'xorb':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'XOR value'
            v.max = 255
            v.min = 0
            v.value = 0
        break; case 'xorf':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'XOR value'
            v.max = 2 ** 31 - 1
            v.min = -(2 ** 31)
            v.value = 0
        break; case 'xorp':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'XOR value'
            v.max = 2 ** 24
            v.min = 0
            v.value = 0
        break; case 'xorm':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'XOR value'
            v.max = 4096
            v.min = 0
            v.value = 0
        break; case 'chord':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'Shuffle seed'
            v.max = 23
            v.min = 0
            v.value = 0
        break; case 'step':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'Set bit step per pixel to'
            v.max = 64
            v.min = 0
            v.value = 32
            v.step = 1e-3
        break; case 'sorta':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'Sort:'
            v.max = 2
            v.min = 0
            enm = ['Bytes', 'Pixels', 'Rows']
        break; case 'vel':
            $('valdiv').style.display = ''
            $('varname').innerHTML = 'Set bit velocity to'
            v.max = 16
            v.min = -16
            v.step = 1e-3
        break; default:
            $('valdiv').style.display = 'none'
            $('E-valdiv').style.display = 'none'

    }
    if (m.startsWith('sort')) {
        $('E-valdiv').style.display = ''
        $('E-varname').innerHTML = 'Sort type'
        v2.min = 0
        v2.max = 2
        enm2 = ['Increment','Decrement','Alphabetic']
    }
    id = await RGBDecoder.imageData($('input').files[0])
    updval()

}

$('value').addEventListener('input', updval)
$('E-value').addEventListener('input', updval)
$('input').addEventListener('input', async () => {
    $('input-size').innerHTML = 'Input file size: ' + bitMeas($('input').files[0].size)
    id = await RGBDecoder.imageData($('input').files[0])
})

function updval() {

    const m = $('mode').value
    $('valdisp').innerHTML = enm
    ? enm[$('value').value]
    : $('value').value + (m == 'chshu'
        ? ` [${RGBDecoder.shuffle[$('value').value].split('').map(v=>'RGBA'[v]).join('')}]`
        : '')
    $('E-valdisp').innerHTML = enm2[$('E-value').value]

}

function bitMeas(i) {
    if (i < 1024) return Math.floor(i) + ' bytes'
    if (i < 2**20) return (i / 2**10).toFixed(2) + ' KB'
    if (i < 2**30) return (i / 2**20).toFixed(2) + ' MB'
    return (i / 2**30).toFixed(2) + ' GB'
}

$('dec').addEventListener('click', () => RGBDecoder.decode(id))
$('enc').addEventListener('click', () => RGBDecoder.encode(id))

updslid()

async function RTRender() {

    if (!$('rt').checked) return
    const d = await RGBDecoder.decode(id, false)
    canvas.width = d.width
    canvas.height = d.height
    ctx.putImageData(d, 0, 0)

}

setInterval(RTRender, 33)