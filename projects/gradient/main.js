function $(e) {
    return document.getElementById(e)
}

function htr(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

var can = $('canvas')
var ctx = can.getContext('2d')
var c = []
var ch = []
var f = {
    addc: ()=>{
        var a = htr($('input').value)
        a = new RGB(a.r, a.g, a.b)
        c.push(a)
        ch.push($('input').value)
        f.up()
    },
    remc: ()=>{
        c.pop()
        ch.pop()
        f.up()
    },
    up: ()=>{
        $('colors').innerHTML = 'Colors: ' + ch.join(', ')
    },
    grad: ()=>{
        if (c.length == 0) {alert('Color list is empty!'); return false}
        var width = Number($('lshift').value), co
        can.width = (width * 2 + 1) * 32
        can.height = c.length * 32
        c.forEach((v,y) => {
            for (var x = -width; x < width + 1; x++) {
                console.log(x)
                switch ($('typeShift').value) {
                    case 'add': co = v.add($('rshift').value*x, $('gshift').value*x, $('bshift').value*x); break
                    case 'mul': co = v.mul($('rshift').value**x*255, $('gshift').value**x*255, $('bshift').value**x*255); break
                    case 'pow': co = new RGB(
                        v.r ** ($('rshift').value ** x),
                        v.g ** ($('gshift').value ** x),
                        v.b ** ($('bshift').value ** x)
                    ); break
                }
                ctx.fillStyle = `rgb(${co.r},${co.g},${co.b})`
                ctx.fillRect((x+width) * 32, y * 32, 32, 32)
            }
        })
    }
}