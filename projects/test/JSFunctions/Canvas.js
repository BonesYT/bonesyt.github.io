canvas = {
	"start":
	function(target) {
		target=target||canvas.target
		canvas2 = document.querySelector(target)
		ctx = canvas2.getContext('2d');
	},
	"edit":
	function(input, xo, yo, w, h, xs, ys) {
		console.log('Loading... Please wait.')
		canvas.start(canvas.target)
		w=w||canvas2.width,h=h||canvas2.height
		xo=xo||0,yo=yo||0,xs=xs||0,ys=ys||0
		t=Date.now()
		for (y=0; y<h; y++) {
			for (x=0; x<w; x++) {
				input2='x='+(x+xs)+',y='+(y+ys)+',i='+((x+xs)+(y+ys)*256)+',t='+t+','+input
				ctx.fillStyle = hex.number(stringExpression(input2));
				ctx.fillRect(x+xo, y+yo, 1, 1);
			}
		}
		console.log('Done')
	},
	"square":
	function(x, y, width, height, r, g, b) {
		canvas.start(canvas.target)
		ctx.fillStyle = hex.number(Math.floor(r)*65536+Math.floor(g)*256+Math.floor(b));
		ctx.fillRect(x, y, width, height);
	},
	"clear":
	function() {
		canvas.start(canvas.target)
		ctx.clearRect(0, 0, canvas2.width, canvas2.height);
	},
	"art":
	function(type, r, g, b, values) {
		type=type||'square-circle'
		r=r||255,g=g||0,b=b||0
		if (type=='square-circle') {
			values=values||256
			for (i=0; i<values; i++) {
				x=(Math.sin(i*(Math.PI*2/values))/2+0.5)*0.75
				y=(Math.cos(i*(Math.PI*2/values))/2+0.5)*0.75
				canvas.square(x*canvas2.width, y*canvas2.height, canvas2.width/4, canvas2.height/4, r, g, b)
			}
		}
	},
	"image":
	function(x, y, w, h, imageFile) {
		imageFile=imageFile||'image'
		x=x||0,y=y||0,w=w||256,h=h||256
		var drawing = document.getElementById("imgCanvas");
		var ctx = drawing.getContext("2d");
		var image = document.getElementById(imageFile);
		ctx.drawImage(image, x, y, w, h);
	},
	"getPixel":
	function(x, y, hasAlpha=false, number=false) {
		canvas.start(canvas.target)
		a91=ctx.getImageData(x, y, 1, 1).data
		b91=hasAlpha?[a91[0],a91[1],a91[2],a91[3]]:[a91[0],a91[1],a91[2]]
		return number?(!(hasAlpha)?b91[2]+b91[1]*256+b91[0]*65536:b91[2]+b91[1]*256+b91[0]*65536+b91[3]*16777216):b91
	},
	"getAll":
	function(sx, sy, sw, sh, hasAlpha=false, number=false) {
		canvas.start(canvas.target)
		o=[]
		for (y=sy; y<sy+sh; y++) {
			for (x=sx; x<sx+sw; x++) {
				o.push(canvas.getPixel(x, y, hasAlpha, number))
			}
		}
		return o
	},
	"colorApprox":
	function(x, y, rgbMin, rgbMax) {
		rgb = canvas.getPixel(x, y)
		rgbJoin = [(rgbMin[0]+rgbMax[0])/2, (rgbMin[1]+rgbMax[1])/2, (rgbMin[2]+rgbMax[2])/2]
		min=0,max=0
		rgb[0]>rgbJoin[0]?max++:min++
		rgb[1]>rgbJoin[1]?max++:min++
		rgb[2]>rgbJoin[2]?max++:min++
		return max>min?rgbMax:rgbMin
	},
	"code":
	function(input) {
		canvas.clear()
		textLeng=input.length+1
		size=Math.max(2**Math.ceil(Math.log2(Math.sqrt(textLeng*16))), 16)
		i=0
		input=addUntil(input, '0', size, 'last')
		input=String.fromCharCode(Math.log2(size))+input
		stop=false
		for (y=0; y<size; y++) {
			for (x=0; x<size; x+=16) {
				binary = addUntil(((a39=(i>=textLeng?stop=true:0,input[i]),a39==undefined?'0':a39).charCodeAt()).toString(2), '0', 16)
				for (c=0; c<16; c++) {
					char = binary[c]
					if (!(stop)) {
						if (char=='0') {canvas.square(x+c, y, 1, 1, 255, 255, 255)}
						if (char=='1') {canvas.square(x+c, y, 1, 1, 0, 0, 0)}
					} else {
						canvas.square(x+c, y, 1, 1, 255, 255, 255)
					}
				}
				i++
			}
		}
	},
	"read":
	function(rgbMin=[0,0,0], rgbMax=[255,255,255], sx=0, sy=0) {
		a93=''
		for (x=0; x<16; x++) {
			canvas.colorApprox(x+sx, sy, rgbMin, rgbMax)==rgbMin?a93+='1':a93+='0'
		}
		size = Math.min(2**parseInt(a93, 2), 256)
		output='',i=0,a93=''
		for (y=0; y<size; y++) {
			for (y==0?x=16:x=0; x<size; x++) {
				canvas.colorApprox(x+sx, y+sy, rgbMin, rgbMax)==rgbMin?a93+='1':a93+='0'
				i++
				if (i==16) {
					output+=(b93=String.fromCharCode(parseInt(a93, 2)),b93=='\u0000'?'':b93)
					i=0
					a93=''
				}
			}
		}
		return output
	},
	"target":"canvas"
}