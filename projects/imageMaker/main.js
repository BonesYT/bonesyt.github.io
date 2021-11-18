function $(e) {
    return document.getElementById(e);
};
var canvas = $('canvas')
var ctx = canvas.getContext('2d')

var link = []
var places = []
var pos = {}
var saves = []

function start() {
    $('start').style.display = 'none'
    $('main').style.display = 'block'
    canvas.width = Math.floor($('width').value)
    canvas.height = Math.floor($('height').value)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function options(a) {
    link.push(a)
    switch (a) {
        case 0:
            $('main-options').style.display = 'none'
            $('draw').style.display = 'block'
        break
        case 1:
            $('main-options').style.display = 'none'
            $('effects').style.display = 'block'
        break
    }
}
function back() {
    link.pop()
    $('main-options').style.display = 'block'
    $('draw').style.display = 'none'
    $('effects').style.display = 'none'
}
function draw(a) {
    link.push(a)
    $('show-radius').style.display = 'block'
    $('show-outline').style.display = 'block'
    $('show-fill').style.display = 'block'
    $('show-polygon').style.display = 'none'
    $('back').style.display = 'block'
    switch (a) {
        case 0:
            $('wait-dialogue').innerHTML = 'Draw in the canvas.'
            $('show-radius').style.display = 'none'
            $('wait').style.display = 'block'
            $('draw').style.display = 'none'
            $('show-polygon').style.display = 'block'
            $('show-fill').style.display = 'none'
            $('back').style.display = 'none'
            ctx.moveTo(pos.x, pos.y)
            int = setInterval(()=>{
                if (mouseDown) {
                    console.log('test')
                    ctx.lineTo(pos.x, pos.y);
                    ctx.lineWidth = $('outline-width').value;
                    ctx.strokeStyle = $('outline-color').value;
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.moveTo(pos.x, pos.y);
                } else {
                    ctx.moveTo(pos.x, pos.y);
                    ctx.closePath();
                }
            }, 20)
        break
        case 1:
            $('wait-dialogue').innerHTML = 'Please click on a location to create a circle.'
            $('wait').style.display = 'block'
            $('draw').style.display = 'none'
            places = []
        break
        case 2:
            $('show-radius').style.display = 'none'
            $('wait-dialogue').innerHTML = 'Please click on 2 locations to create a rectangle.'
            $('wait').style.display = 'block'
            $('draw').style.display = 'none'
            places = []
        break
        case 3:
            $('show-radius').style.display = 'none'
            $('show-polygon').style.display = 'block'
            $('wait-dialogue').innerHTML = 'Click on places you want for the vertices to be.'
            $('wait').style.display = 'block'
            $('draw').style.display = 'none'
            ctx.beginPath()
            places = []
        break
        case 4:
            $('show-radius').style.display = 'none'
            $('show-outline').style.display = 'none'
            $('wait-dialogue').innerHTML = 'Select color and click on canvas to fill all.'
            $('wait').style.display = 'block'
            $('draw').style.display = 'none'
            places = []
        break
    }
}
function effect(a) {
    $('wait-dialogue-2').innerHTML = 'Apply effect.'
    link.push(a)
    $('wait-2').style.display = 'block'
    $('effects').style.display = 'none'
}
function done() {
    var rgb, r0, g0, b0, r1 = htc($('effect-color').value).r, g1 = htc($('effect-color').value).g, b1 = htc($('effect-color').value).b
    for (var x=0; x<canvas.width; x++) {
        for (var y=0; y<canvas.height; y++) {
            r0 = ctx.getImageData(x, y, 1, 1).data[0]
            g0 = ctx.getImageData(x, y, 1, 1).data[1]
            b0 = ctx.getImageData(x, y, 1, 1).data[2]
            switch (link[1]) {
                case 0:
                    rgb = [
                        r0 + r1,
                        g0 + g1,
                        b0 + b1
                    ]
                break
                case 1:
                    rgb = [
                        r0 - r1,
                        g0 - g1,
                        b0 - b1
                    ]
                break
                case 2:
                    rgb = [
                        r0 * (r1 / 255),
                        g0 * (g1 / 255),
                        b0 * (b1 / 255)
                    ]
                break
                case 3:
                    rgb = [
                        r0 * (1 - r1 / 255) + (255 - r0) * (r1 / 255),
                        g0 * (1 - g1 / 255) + (255 - g0) * (g1 / 255),
                        b0 * (1 - b1 / 255) + (255 - b0) * (b1 / 255)
                    ]
                break
                case 4:
                    rgb = [
                        (r0+g0+b0)/3,
                        (r0+g0+b0)/3,
                        (r0+g0+b0)/3
                    ]
                break
            }
            ctx.fillStyle = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')'
            ctx.fillRect(x, y, 1, 1);
        }
    }
    link.pop()
    $('wait-2').style.display = 'none'
    $('effects').style.display = 'block'
}
function saveImage() {
    saves.push(ctx.getImageData(0, 0, canvas.width, canvas.height).data)
    var newcanvas = document.makeElement('canvas', '')
    newcanvas.id = 'save' + (saves.length-1)
    newcanvas.width = canvas.width
    newcanvas.height = canvas.height
    newcanvas.style.zoom = 32 / canvas.height
    newcanvas.style.margin = '20px'
    document.placeElement(newcanvas, 'saves')
    var newctx = newcanvas.getContext('2d')
    newctx.drawImage($('canvas'), 0, 0, canvas.width, canvas.height)
    newcanvas.addEventListener('click', eval('()=>{loadImage('+(saves.length-1)+')}'))
}
function loadImage(id) {
    ctx.drawImage($('save'+id), 0, 0, $('save'+id).width, $('save'+id).height)
}
function deleteSaves() {
    for (var i in saves) {
        $('save'+i).remove()
    }
    saves = []
}

function backundo() {
    ctx.closePath()
    link.pop()
    $('wait').style.display = 'none'
    $('wait-2').style.display = 'none'
    switch (link[0]) {
        case 0: $('draw').style.display = 'block'; break;
        case 1: $('effects').style.display = 'block'; break;
    }
}
function happen(a) {
    if (link[0]==0&link[1]==0) {
        link.pop()
        $('wait').style.display = 'none'
        $('draw').style.display = 'block'
        clearInterval(int)
    } else {
        switch (a) {
            case 0:
                ctx.lineWidth = $('outline-width').value;
                ctx.closePath()
                ctx.strokeStyle = $('outline-color').value;
                ctx.stroke();

                ctx.fillStyle = $('fill-color').value;
                ctx.fill();
                link.pop()
                $('wait').style.display = 'none'
                $('draw').style.display = 'block'
            break
        }
    }
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (link[0] == 0) {
        switch (link[1]) {
            case 1:
                ctx.lineWidth = $('outline-width').value;
                ctx.beginPath();
                ctx.arc(x, y, $('radius').value, 0, Math.PI * 2);
                ctx.fillStyle = $('fill-color').value;
                ctx.fill();
                ctx.beginPath();
                ctx.strokeStyle = $('outline-color').value;
                ctx.arc(x, y, $('radius').value, 0, Math.PI * 2);
                ctx.stroke();

                link.pop()
                $('wait').style.display = 'none'
                $('draw').style.display = 'block'
            break
            case 2:
                places.push([x, y])
                if (places.length == 2) {
                    ctx.fillStyle = $('fill-color').value;
                    ctx.fillRect(places[0][0], places[0][1], places[1][0]-places[0][0]+1, places[1][1]-places[0][1]+1);
   
                    ctx.beginPath();
                    ctx.lineWidth = $('outline-width').value;
                    ctx.strokeStyle = $('outline-color').value;
                    ctx.rect(places[0][0], places[0][1], places[1][0]-places[0][0]+1, places[1][1]-places[0][1]+1);
                    ctx.stroke();

                    link.pop()
                    $('wait').style.display = 'none'
                    $('draw').style.display = 'block'
                }
            break
            case 3:
                places.push([x, y])
                if (places.length == 1) {ctx.moveTo(x, y)}
                else {ctx.lineTo(x, y)}
            break
            case 4:
                ctx.fillStyle = $('fill-color').value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                link.pop()
                $('wait').style.display = 'none'
                $('draw').style.display = 'block'
            break
        }
    }
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

function getPos(event) {
    pos = {x: event.offsetX, y: event.offsetY}
    return pos
}

function htc(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

document.makeElement = (tag, innerHTML)=>{
    var node = document.createElement(tag);
    var textnode = document.createTextNode(innerHTML);
    node.appendChild(textnode);
    return node
}
document.placeElement = (node, id)=>{
    document.getElementById(id).appendChild(node);
}