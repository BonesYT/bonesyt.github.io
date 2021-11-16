function $(e) {
    return document.getElementById(e);
};

var rgb = {r: 0, g: 0, b: 0}
var truergb = {r: 0, g: 0, b: 0}
$('adder').value = 32

function rgbAdd(id) {
    switch (id) {
        case 0:
            rgb.r += Number($('adder').value)
            break
        case 1:
            rgb.g += Number($('adder').value)
            break
        case 2:
            rgb.b += Number($('adder').value)
        break
    }
}

function realRGB(obj) {
    var a = {}
    var multi = Math.min(255 / Math.max(obj.r, obj.g, obj.b), 1)
    a.r = obj.r * multi
    a.g = obj.g * multi
    a.b = obj.b * multi
    return a
}

int = setInterval(()=>{
    truergb = realRGB(rgb)

    var canvas = $('canvas');
    var ctx = canvas.getContext('2d'); 
    ctx.fillStyle = 'rgb('+truergb.r+','+truergb.g+','+truergb.b+')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    $('red').innerHTML = 'Add red (' + rgb.r + ')'
    $('green').innerHTML = 'Add green (' + rgb.g + ')'
    $('blue').innerHTML = 'Add blue (' + rgb.b + ')'
    $('rgb').innerHTML = 'Output RGB: ' + [truergb.r,truergb.g,truergb.b].join(', ')

    canvas = $('rgbshow');
    ctx = canvas.getContext('2d'); 
    var add, rgb2
	for (i=0; i<128; i++) {
        add = (i-64) * Number($('adder').value) / 2
        rgb2 = {r: rgb.r, g: rgb.g, b: rgb.b}
        rgb2.r += add
        rgb2 = realRGB(rgb2)
        ctx.fillStyle = 'rgb('+rgb2.r+','+rgb2.g+','+rgb2.b+')';
        ctx.fillRect(i*2, 0, 2, 10);
    }
	for (i=0; i<128; i++) {
        add = (i-64) * Number($('adder').value) / 2
        rgb2 = {r: rgb.r, g: rgb.g, b: rgb.b}
        rgb2.g += add
        rgb2 = realRGB(rgb2)
        ctx.fillStyle = 'rgb('+rgb2.r+','+rgb2.g+','+rgb2.b+')';
        ctx.fillRect(i*2, 10, 2, 10);
    }
	for (i=0; i<128; i++) {
        add = (i-64) * Number($('adder').value) / 2
        rgb2 = {r: rgb.r, g: rgb.g, b: rgb.b}
        rgb2.b += add
        rgb2 = realRGB(rgb2)
        ctx.fillStyle = 'rgb('+rgb2.r+','+rgb2.g+','+rgb2.b+')';
        ctx.fillRect(i*2, 20, 2, 10);
    }
}, 33)