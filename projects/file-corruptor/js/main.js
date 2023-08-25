const $ = i => document.getElementById(i),
      tabs = ['br','bs','bh','ba','cp','fn']

let mode = 0,
    ready = false,
    loading = false,
    content = null

tabs.forEach((v,i) => {
    $(v).addEventListener('click', e => {
        tab(v)
        mode = i
    })
})
document.querySelectorAll('span:not(.stats)').forEach(v => {
    v.addEventListener('click', e => {
        const val = prompt('Set this slider to?')
        if (v) $(v.id.substring(1)).value = val, upd()
    })
})
document.querySelectorAll('input[type="range"]').forEach(v => {
    v.addEventListener('input', upd)
})
$('charset').addEventListener('input', e => {
    document.querySelectorAll('.rcg').forEach(v => {

        const l = charsets[$('charset').value].length - 1
        v.max = l
        upd()

    })
})
$('byte-count').addEventListener('click', () => {

    if (!ready) return
    const v = prompt('Set the byte count to?')
    if (v) document.querySelector('div[select]').childNodes[1].value = v / $('input').files[0].size * 100, upd()

})
$('input').addEventListener('input', () => content = null)

function bitMeas(i) {
    if (i < 1024) return Math.floor(i) + ' bytes'
    if (i < 2**20) return (i / 2**10).toFixed(2) + ' KB'
    if (i < 2**30) return (i / 2**20).toFixed(2) + ' MB'
    return (i / 2**30).toFixed(2) + ' GB'
}

function tab(i) {

    document.querySelectorAll('.tab').forEach(v => {
        if (v.id == i) v.setAttribute('select', '')
        else v.removeAttribute('select')
    })
    upd()

}

function upd() {

    document.querySelectorAll('span:not(.stats)').forEach(v => {
        v.innerHTML = $(v.id.substring(1)).value
    })

    if ($('input').files[0]) {
        const s = $('input').files[0].size
        $('input-size').innerHTML = 'Input file size: ' + bitMeas(s)
        const a = document.querySelector('div[select]').childNodes[1].value
        $('byte-count').innerHTML = `Average modified bytes: ` + bitMeas(s * (a / 100))
    }

}

async function upload(cs) {

    const f = $('input').files[0]
    return [f, f.size, f.name]

}
function download(name, data, charset) {

    let a = document.createElement('a')
    a.href = data.constructor == Blob
        ? URL.createObjectURL(data)
        : `data:text/plain;charset=${charset},${encodeURIComponent(data)}`
    a.target = '_blank'
    a.download = name
    a.click();

}

upd()