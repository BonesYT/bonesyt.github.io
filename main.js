$ = i => document.getElementById(i)

const c = {
    value: 0,
    finish: 4096,
    vpc: 1,
    cost: 64,
    disguises: 0,
    won: false
}
    
$('clicker').addEventListener('click', ()=>{
    
    c.value += c.vpc
    $('clicker').innerHTML = `${c.value} / ${c.finish} (${Math.floor(c.value / c.finish * 100)}%)`
    if (!c.won & c.value >= c.finish) {
        c.won = true
        new Audio('win.wav').play()
    }

})
$('disguiser').addEventListener('click', ()=>{
    
    if (c.value >= Math.floor(c.cost)) {
        c.value -= c.cost
        c.cost *= 1.5
        c.vpc *= 1.45
        c.disguises++
        $('disguiser').innerHTML = `(${c.disguises}) Disguise for ${Math.floor(c.cost)}`
    }

})