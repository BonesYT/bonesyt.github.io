function $(e) {
    return document.getElementById(e)
}

adder = 8388608
colors = [0]
hasclicked = [false]
buttons = 1
power = 0.5

cmd = e=>{
    var id = Number(e.srcElement.id.slice(7))
    if (id < power & !hasclicked[id]) {
        hasclicked[id] = true
        var color = colors[id] + adder
        var button = document.createElement('button')
        button.id = 'button-' + buttons
        colors.push(color)
        hasclicked.push(false)
        if (Math.log2(buttons)%1 == 0) {
            adder /= 2
            power *= 2
            set()
        }
        button.style.backgroundColor = `rgb(${Math.floor(color/65536)},${Math.floor(color/256)%256},${color%256})`
        button.addEventListener('click',cmd)
        $('buttons').appendChild(button)
        buttons++
    }
}

function set() {
    hasclicked = hasclicked.map(()=>{return false})
}

function clickAll() {
    colors.forEach((v,i) => {
        $('button-'+i).click()
    });
}

$('button-0').addEventListener('click',cmd)