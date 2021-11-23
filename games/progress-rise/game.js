EN = ExpantaNum

function Game() {
    this.points = EN(0) //points
    this.tpoints = EN(0) //total points
    this.bars = [new Bar] //progress bars
    this.next = EN(128) //progress bar cost
}

function Bar(max=30, cost=1, multi=1.2, cmulti=1.375) {
    this.points = EN(0) //points
    this.tpoints = EN(0) //total points
    this.max = EN(max) //maximum value
    this.level = EN(0) //level
    this.cost = EN(cost) //multiplier cost (buy)
    this.multi = EN(multi) //speed multiplier (buy)
    this.cmulti = EN(cmulti) //cost multiplier (buy)
    this.speed = EN(1) //speed
    this.nspeed = EN(1) //normal speed
    this.pmulti = EN(1) //previous multiplier
    this.gain = (ammount = 0) => {
        this.points = this.points.add(ammount)
        this.tpoints = this.tpoints.add(ammount)
        this.level = this.level.add(this.points.div(this.max).floor())
        this.points = this.points.mod(this.max)
    }
}

//game build
var game = new Game

function update() {
    game.bars.forEach((v,i,a)=>{
        try {
            game.bars[i].speed = v.nspeed.mul(a[i+1].pmulti)
        } catch {
            game.bars[i].speed = v.nspeed
        }
    })
    $('points').innerHTML = 'Points: ' + ts(game.points)
    $('next-bar').innerHTML = 'Buy next progress bar | Cost: ' + ts(game.next)
    for (var i in game.bars) {
        $('prog-bar-' + i).style.width = (game.bars[i].points.div(game.bars[i].max) * 100) + '%'
        $('prog-text-' + i).innerHTML = ts(EN.floor(game.bars[i].points)) + ' / ' + ts(EN.floor(game.bars[i].max)) + '\nMulti: ' + ts(game.bars[i].speed) + ', Up: x' + ts(game.bars[i].pmulti)
        $('prog-level-' + i).innerHTML = 'Level\n' + ts(game.bars[i].level)
        $('prog-buy-' + i).innerHTML = 'Upg. for:\n' + ts(EN.ceil(game.bars[i].cost))
    }
}

function barIncrement(id) {
    game.bars.forEach((v,i,a)=>{
        try {
            game.bars[i].speed = v.nspeed.mul(a[i+1].pmulti)
        } catch {
            game.bars[i].speed = v.nspeed
        }
    })
    game.bars.forEach((v,i)=>{game.bars[i].pmulti = i != 0 ? v.level.pow(0.715).div(20).add(1) : EN(1)})
    game.bars[id].points = game.bars[id].points.add(game.bars[id].speed)
    game.bars[id].tpoints = game.bars[id].tpoints.add(game.bars[id].speed)
    if (id == 0) {
        game.points = game.points.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
        game.tpoints = game.tpoints.add(EN.floor(game.bars[0].points.div(game.bars[0].max)).mul(game.bars[0].pmulti))
    }
    game.bars[id].level = game.bars[id].level.add(EN.floor(game.bars[id].points.div(game.bars[id].max)))
    game.bars[id].points = EN.mod(game.bars[id].points, game.bars[id].max)
    update()
    new Audio('audio/click.mp3').play()
}
function barBuy(id) {
    if (game.bars[id].level.gte(game.bars[id].cost)) {
        game.bars[id].cost = game.bars[id].cost.mul(game.bars[id].cmulti)
        game.bars[id].nspeed = game.bars[id].nspeed.mul(game.bars[id].multi)
        new Audio('audio/buy.mp3').play()
        update()
    } else {
        new Audio('audio/low.mp3').play()
    }
}

function NextBar() {
    if (game.points.gte(game.next)) {
        game.points = game.points.sub(game.next)
        game.next = game.next.pow(1.65)
        game.bars.push(new Bar(EN.pow(1.18, game.bars.length).mul(30).floor(), EN.pow(1.2, game.bars.length),
                               EN.pow(1.05, game.bars.length).mul(1.2), EN.pow(1.05, game.bars.length).mul(1.375)))
        placeBars()
        new Audio('audio/buy.mp3').play()
        update()
    } else {
        new Audio('audio/low.mp3').play()
    }
}

function fb(i,f) {
    return EN.div(EN.floor(EN.mul(i,f)),f)
}
function ts(i,ep=6,en=-6,f=100,a=0) {
    var neg = EN.isneg(i)
    if (neg) i=EN.mul(i,-1)
    var log = EN.log10(i)
    if (EN.gte(EN.log10(EN.log10(EN.log10(EN.log10(log)))),0)) {
        var r = '10^^' + (r2=EN.slog(i),EN.gte(EN.log(r2),ep)?ts(r2,ep,en,f,a+1):fb(r2,f))
        return neg?'-'+r:r
    } else {
        if ((log>=ep | log<=en) & a<10 & !(i==0)) {
            var r = fb(EN.div(i, EN.pow(10, EN.floor(log))),f)+'e'+ts(EN.floor(log),ep,en,f,a+1)
            return (neg?EN.mul(r,-1):r).toString()
        } else {
            return fb(neg?i*-1:i,f).toString()
        }
    }
}

placeBars()
update();

(()=>{
    var a = LdrToRGB(85, game.bars.length / 3.75 - 1.4, 100)
    ButtonStyle($('next-bar'), [a.r, a.g, a.b])
    ButtonStyle($('pause'), [255, 255, 255])
    ButtonStyle($('save'), [0, 255, 255])
    ButtonStyle($('load'), [0, 255, 255])
})()