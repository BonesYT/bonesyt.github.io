function help(item='help') {
	path = item.split('/')
	if (path[0]=='help') {
		updateText('Functions: help, updateText, big, bigRepeat, iterSeed, negPosIndentifier, compress, uncompress, numberListify, collatz, numberString, valueFix, reverseBoolean, allCharacters, spam, hex., stringExpression, canvas., '+
		'removeAllChar, rgbFilter, HueToRGB, Math.sinBetw, fractal, binaryCompress, addUntil, gradient, addElement')
		if (path[1]=='help'|path[1]=='about') updateText('Shows help.')
		if (path[1]=='updateText') updateText('Updates this text to what you put in the function (as string)')
		if (path[1]=='big') updateText('Increases the a value with OmegaNum.js. Enter a=5 or any other number to make it work.')
		if (path[1]=='bigRepeat') updateText('It\'s like the big function but it repeats. The first argument is all the arguments from big function as an array (list). Second is the a variable start, Third is how many times it repeats.')
		if (path[1]=='iterSeed') updateText('Random seed with iterations. Argument 1: The input as a number. Argument 2: Ammount of iterations. Argument 3: Custom seed as an array with 20 items.')
		if (path[1]=='negPosIndentifier') updateText('Turns a number into a string with a or b as the first letter. If the number is positive it\'ll show "a". If negative it\'ll show "b".')
		if (path[1]=='compress') updateText('Compresses any number and turns them smaller.')
		if (path[1]=='uncompress') updateText('The opposite of compress function. Turns a compressed number (like 1e30) to a number as a string.')
		if (path[1]=='numberListify') updateText('Turns number into an array with 3 items in it.')
		if (path[1]=='collatz') updateText('It\'s the collatz thing I found in YouTube lol. Enter any number.')
		if (path[1]=='numberString') updateText('Joins multiple numbers and turns them into a single string. Argument 1: Ammount of numbers. 2: Number start. 3: Split. adds an \\n every \'split\' numbers.')
		if (path[1]=='valueFix') updateText('Fixes any value you put and returns them fixed. For example: If the value is undefined, NaN or null, it\'ll return 0.')
		if (path[1]=='reverseBoolean') updateText('Inverts booleans. true will be 1, false will be 0, 0 will be false and 1 will be true.')
		if (path[1]=='allCharacters') updateText('Shows all the 65536 characters.')
		if (path[1]=='spam') updateText('Spams this text with the string you put.')
		if (path[1]=='stringExpression') updateText('Turns an string into code. (safe version of e v a l (i can\'t even say that without spaces))')
		if (path[1]=='removeAllChar') updateText('Removes every specific letter from a string.')
		if (path[1]=='rgbFilter') updateText('Adds a filter to the RGBA values you put. Input has to be an array: [r, g, b, a]')
		if (path[1]=='hueToRGB') updateText('Turns hue (as number) to RGB array.')
		if (path[1]=='Math.sinBetw') updateText('New Math function that\'s the sine function but the result is always between the values from and to.')
		if (path[1]=='fractal') updateText('Parenthesis fractal. Argument 1: Iterations. 2: Multiplier every iteration. 3: Value to be in the result. Can be an array. 4: Split symbol. Default is \',\'. 5: Bracket symbols. Default: [\'[\', \']\']')
		if (path[1]=='binaryCompress') updateText('Compresses binary numbers to a smaller number. Example: 01100011100111011111100000 to 011203130213011605. Version: 1')
		if (path[1]=='addUntil') updateText('Adds strings to another string until it has an specific ammount of chars in the string. Enter pos variable as \'first\' to put the strings in the left side. \'last\' for the right side.')
		if (path[1]=='gradient') updateText('Returns any number between a and b.')
		if (path[1]=='addElement') updateText('Creates an HTML Element to a specific location.')
		if (path[1]=='corrupt') updateText('Corrupts text with randomized chars. cr = char range, prob = corrupt probability, lr = letter range')
		if (path[1]=='hex') {
			updateText('component, number')
			if (path[2]=='about') updateText('Turns stuff into hex code.')
			if (path[2]=='component') updateText('Converts numbers between 0 and 255 to a hex code component.')
			if (path[2]=='number') updateText('Converts a number to hex code.')
		} else if (path[1]=='canvas') {
			updateText('start, edit, square, clear, art, image, getPixel, getAll, colorApprox, code, read')
			if (path[2]=='about') updateText('Canvas stuff. canvas2.width and canvas2.height are also variables.')
			if (path[2]=='start') updateText('Starts the canvas. Use this command before getting its width and height.')
			if (path[2]=='edit') updateText('Edit canvas with daydun.com/random images. Takes a while to load. Input has to be a string.')
			if (path[2]=='square') updateText('Places a square in the canvas.')
			if (path[2]=='clear') updateText('Clears canvas.')
			if (path[2]=='art') updateText('Makes art in canvas.')
			if (path[2]=='image') updateText('Places an image from HTML in canvas.')
			if (path[2]=='getPixel') updateText('Gets pixel info in canvas.')
			if (path[2]=='getAll') updateText('Geta every pixel info in canvas.')
			if (path[2]=='colorApprox') updateText('Returns the closest color from a pixel. rgbMin and rgbMax has to be an array with 3 items.')
			if (path[2]=='code') updateText('Makes an ASCII Code in the canvas.')
			if (path[2]=='read') updateText('Reads/scans the ASCII Code in the canvas.')
		}
	}
}
function updateText(text, id='text') {
	document.getElementById(id).textContent = text
}
function big(pow, tetr, pent, arrow, by) {
    pow=pow||0.2
    tetr=tetr||1
    pent=pent||1
    arrow=arrow||6
    by=by||1
    a=OmegaNum.pow(OmegaNum.pow(a, pow), OmegaNum.pow(OmegaNum.pow(a, pow), OmegaNum.tetr(OmegaNum.pent(OmegaNum.arrow(a, arrow, by), OmegaNum.pent(pent, tetr)), tetr)))
    return a.toString()
}
function bigRepeat(bigList, aStart, repeat) {
    a=aStart
    for (i=0; i<repeat; i++) {
        console.log(a.toString())
        big(bigList[0], bigList[1], bigList[2], bigList[3], bigList[4])
    }
}
function iterSeed(input, iter, cust) {
	a=input.toString()
	cust=cust||['0','37','1','29','2','81','3','76','4','10','5','19','6','63','7','85','8','50','9','03']
	for (i=0; i<iter; i++) {
		output=''
		for (l=0; l<a.length; l++) {
			char=a.charAt(l)
			if (char==cust[0]) {char=cust[1]}
			if (char==cust[2]) {char=cust[3]}
			if (char==cust[4]) {char=cust[5]}
			if (char==cust[6]) {char=cust[7]}
			if (char==cust[8]) {char=cust[9]}
			if (char==cust[10]) {char=cust[11]}
			if (char==cust[12]) {char=cust[13]}
			if (char==cust[14]) {char=cust[15]}
			if (char==cust[16]) {char=cust[17]}
			if (char==cust[18]) {char=cust[19]}
			output=output+char
		}
		a=output
	}
	return a
}
function negPosIndentifier(input) {
	if (input>=0) {
		return 'a'+input
	} else {
		return 'b'+input*-1
	}
}
function compress(input, floorBy, require) {
	floorBy=floorBy||100
	if (input<10**require) {
		return input
	} else {
		var log=Math.floor(Math.log10(input))
		var rem=Math.floor((input/10**Math.floor(Math.log10(input)))*floorBy)/floorBy
		return rem+'e'+log
	}
}
function uncompress(input, commas) {
	commas=commas||false
	isNeg=input<0,dec=(Math.abs(input%1)).toString()
	a=numberListify(input)[0]
	b=(e2=numberListify(input)[1],e2==undefined?0:e2)*10**(e=numberListify(input)[2],e==undefined?0:e)
    a=a.toString()
	o=''
	for (i=0; i<b+1; i++) {
		c=a[(i==0?0:i+1)+reverseBoolean(isNeg)]
		o+=(d=(c==undefined?0:c),commas&(i%3==b%3&!(i==b))?d+',':d)
	}
	return f=input<10?input.toString():o,f=isNeg?'-'+f:f,dec==0?f:f+(arr=dec.split(''),(arr.slice(1, arr.length-1)).join(''))
}
function numberListify(input) {
	isNeg=input<0,input=isNeg?-input:input
	a=input/10**Math.floor(Math.log10(input))
	b=Math.floor(Math.log10(input))
	b=b/10**Math.floor(Math.log10(b))
	c=Math.floor(Math.log10(Math.floor(Math.log10(input))))
	r=input<10?[isNeg?-a:a]:[isNeg?-a:a,b]
	r=input<1e10?r:[isNeg?-a:a,b,c]
	return r
}
function collatz(input, limit, custom) {
    limit=limit||256
    custom=custom||[3, 1, 0.5, 0]
    input=Math.floor(input)
    a=input
    r=[a]
    for (i=0; (!(a==1))&i<limit&a<Infinity; i++) {
        if (Math.floor(a)%2==1) {
            a=a*custom[0]+custom[1]
        } else {
            a*=custom[2]+custom[3]
        }
        a=Math.floor(a)
        r.push(a)
    }
    return r
}
function type(input) {
	a=''
	for (i=0; i<input.length; i++) {
		setTimeout(function () {
			a=a+input[i]
			updateText(a)
		}, 80);
	}
}
function numberString(amm, start, split) {
    a=''
    start=start||0
    split=split||Infinity
    for (i=start; i<amm+start; i++) {
        a+=i
        if (i%split==0) {
            a+='\n'
        }
    }
    return a
}
function valueFix(input) {
	if (input==undefined) input=0
	if (input==null) input=0
	if (isNaN(input)) input=0
	return input
}
function reverseBoolean(a) {
	b90=a
	if (b90===0) a=false
	if (b90===1) a=true
	if (b90==false) a=0
	if (b90==true) a=1
	return a
}
function allCharacters() {
    a=''
    for (i=0; i<65536; i++) {
        a+=String.fromCharCode(i);
    }
    return a
}
function spam(char, clear=false) {
	a89=''
	b89=0
	int=setInterval(function(){
		a89+=char;
		if (b89%30==0) {
			a89+='\n'
		}
		b89++
		updateText(a89)
	}, 40)
}
hex = {
	"component":
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	},"number":
	function numberToHex(input) {
		input=Math.floor(input)%16777216
		return "#" + hex.component(Math.floor(input/65536)%256) + hex.component(Math.floor(input/256)%256) + hex.component(input%256);
	}
}
function stringExpression(input) {
  return new Function('return ' + input)();
}
function removeAllChar(input, char0='	') {
	o=''
	for (i=0; i<input.length; i++) {
		a88=input[i]
		o+=a88==char0?'':a88
	}
	return o
}
function rgbFilter(rgba) {
	rgba[3] = rgba[3] || undefined
	r = Math.floor(Math.max(Math.min(rgba[0], 255), 0))
	g = Math.floor(Math.max(Math.min(rgba[1], 255), 0))
	b = Math.floor(Math.max(Math.min(rgba[2], 255), 0))
	if (!(rgba[3]==undefined)) a = Math.floor(Math.max(Math.min(rgba[3], 255), 0))
	return rgba[3]==undefined?[r,g,b]:[r,g,b,a]
}
function hueToRGB(hue, toNumber=false) {
	var r=0, g=0, b=0
	hue = hue%360
	grad = (hue%60)*4.25,revgrad = 255-grad
	if (hue<=60)           r=255, g=grad
	if (hue>=60&hue<=120)  r=revgrad, g=255
	if (hue>=120&hue<=180) g=255, b=grad
	if (hue>=180&hue<=240) g=revgrad, b=255
	if (hue>=240&hue<=300) b=255, r=grad
	if (hue>=300)          b=revgrad, r=255
	r2 = [r, g, b]
	return toNumber?(a92=rgbFilter([r, g, b]),a92[0]*65536+a92[1]*256+a92[2]):[r, g, b]
}
Math.sinBetw = function(input, from, to) {
	a87=Math.sin(input)/2+0.5
	a87*=to-from
	a87+=from
	return a87
}
function fractal(iter, multi, value, split, brackets) {
	split=split||',',brackets=brackets||['[', ']']
	a91=value
	for (i=0; i<iter; i++) {
		b91=''
		for (i2=0; i2<multi; i2++) {
			c91=Array.isArray(a91)?a91[i2]:a91
			b91+=i2==multi-1?c91:c91+','
		}
		b91=brackets[0]+b91+brackets[1]
		a91=b91
	}
	return a91
}
function binaryCompress(input) {
	if (isNaN(parseInt(input, 2))) {
		console.error('Input isn\'t in binary.')
	}
	var output = ''
		row = 0
		selected = input[0]
	for (i=0; i<input.length+1; i++) {
		if (!(input[i]==selected)) {
			output += selected+row.toString()+(row>9&(!(i==input.length))?',':'')
			row=0
			selected = input[i]
		}
		row++
	}
	return output
}
function addUntil(input, add, limit, pos='first') {
	while (input.length<limit) {
		input=pos=='first'?add+input:input+add
	}
	return input
}
function gradient(a, b, pos) {
	return a*pos+b*(1-pos)
}
function addElement(tag, text, location) {
	var node = document.createElement(tag);
	var textnode = document.createTextNode(text);
	node.appendChild(textnode);
	document.getElementById(location).appendChild(node);
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}
function corrupt(input, cr, prob, lr) {
	var rn = -Math.floor((lr-1)/2)
	var rx = Math.floor((lr)/2)+1
	var o = input
	for (i=0; i<input.length; i++) {
		rng = Math.random()
		if (rng<prob) {
			for (x=Math.max(i+rn, 0); x<Math.min(i+rx, input.length); x++) {
				ochar=o[x].charCodeAt()
				char=Math.floor(ochar+Math.random()*(cr/2)-(cr/4))
				char=String.fromCharCode(char)
				o=setCharAt(o,x,char)
			}
		}
	}
	return o
}
turn={
	'up':
	function (input, base=36) {
		o=''
		c=0
		for (i=0; i<input.length; i++) {
			char=input[i]
			cc=char.charCodeAt()
			cc=cc.toString(base)
			if (c!==Math.max(cc.length, 2)) {
				c=Math.max(cc.length, 2)
				o+=String.fromCharCode(63+c)
			}
			if (cc.length==1) o+='0'
			o+=cc
		}
		return o
	},
	'down':
	function (input, base=36) {
		o='',c=0,cl=0,ol='',ll=0,lc=0
		for (i=0; i<input.length; i++) {
			ll=input[i].charCodeAt()-63,c=ll>1&ll<17?(i++,ll):c
			ol+=input[i]
			lc++
			if (lc==c) {
				lc=0
				ol=parseInt(ol, base)
				ol=String.fromCharCode(ol)
				o+=ol
				ol=''
			}
		}
		if (lc!==0) console.error('Uncaught TypeError: Could not finish the last char')
		return o
	}
}
function arrayRepeat(array, repeat) {
    o = []
    for (i=0; i<repeat; i++) {
        o=o.concat(array)
    }
    return o
}
saveWarn = {
    add:
    (boolean)=>{
        window.addEventListener('beforeunload', function (e) {
            if (stringExpression(boolean)) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },
    update:
    (boolean)=>{
        window.removeEventListener('beforeunload', ()=>{})
        window.addEventListener('beforeunload', function (e) {
            if (stringExpression(boolean)) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
}
inc={
	a:0,
	l:[20],
	p:[0],
	m:[1.3],
	s:1,
	f:function(){
		min = Math.min.apply(null, inc.l)
		for (i=0; i<inc.l.length; i++) {
			if (inc.a>=inc.l[i]) {
				inc.s*=1.175
				inc.a-=inc.l[i]
				inc.l[i]*=inc.m[i]
				inc.p[i]++
			}
		}
		if ((min-inc.a)/inc.s>80) {
			inc.l.push(inc.a+60)
			inc.p.push(0)
			inc.m.push(1.3**((inc.l.length/2)+0.5)**1.8)
		}
	},
	t:function(){
		int=setInterval(()=>{
			inc.a+=inc.s
			inc.f()
			updateText(Math.floor(inc.a)+'\n'+(inc.l.map((v)=>{return Math.floor(v)})).join('\n'))
		}, 10)
	}
}
function runSpeed(func, iter) {
	timeBef=Date.now()
	for (i=0; i<iter; i++) {
		func.call()
	}
	timeAft=Date.now()
	return timeAft-timeBef
}
function fracRule2JSON(rule) {
	var a = true
	var i = 0
	var o = {a:{l:4,i:4,b:120,s:0,f:{n:-Infinity,x:Infinity}}}
	var s = 0
	var r = false
	var r2 = ''
	while (a) {
		l = rule[i]
		switch (r) {
			case false:
				if (l == 'L') {
					r = true
					l2 = l
				}
				break;
			case true:
				if (l == ';') {
					r = false
					switch (l2) {
						case 'L': o.a.l = Number(r2)
						case 'I': o.a.i = Number(r2)
						case 'B': o.a.b = Number(r2)
						case 'S': o.a.s = Number(r2)
					}
				} else {
					r2 += l
				}
		}
		l++
	}
}
Math.not = (input)=>{
	var b = input.toString(2)
	var o = ''
	for (var i in b) {
		if (b[i] == '0') o += '1'
		if (b[i] == '1') o += '0'
	}
	return parseInt(o, 2)
}
function wait(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}
function playAudio(src='sound.mp3') {
	audio.push(new Audio(src))
	var audio2 = audio[audio.length-1]
	audio2.autoplay = true
	audio2.play()
}
function afterLoad(fb, f, ms=5) {
	fb();
	setTimeout(()=>{
		f()
	}, ms)
}
function EN_Inc() {
    a = ExpantaNum.add(a, 1)
    switch (Math.floor(t/100)) {
        case 1:
            a = ExpantaNum.add(a, 10)
            break
        case 2:
            a = ExpantaNum.add(a, 8327)
            break
        case 3:
            a = ExpantaNum.mul(a, 3)
            break
        case 4:
            a = ExpantaNum.mul(a, 34)
            break
        case 5:
            a = ExpantaNum.mul(a, 1849)
            break
        case 6:
            a = ExpantaNum.mul(a, 83728)
            break
        case 7:
            a = ExpantaNum.pow(a, 3)
            break
        case 8:
            a = ExpantaNum.pow(a, 20)
            break
        case 9:
            a = ExpantaNum.pow(a, 384)
            break
        case 10:
            a = ExpantaNum.pow(a, 72839)
            break
    } if (t>1100) {
        a = ExpantaNum.arrow(a, Math.floor(t/80-13.75)+2, ((t-1100)%80+1)**4)
    }
    t++
    return a.toString()
}
function secondSplit(input, by=',', strStart='(', strEnd=')', inStr=false) {
	var o = [], t = '', str = false, a = false
	for (i=0; i<input.length+1; i++) {
		if ((input[i] == by | input[i] == undefined) & !str) {
			o.push(t)
			t = ''
		} else {
			a = false
			if (input[i] == strStart & !str) {
				str = true
				a = true
				inStr ? i++ : 0
			} if (input[i] == strEnd & str & !a) {
				str = false
				inStr ? i++ : 0
				if ((input[i] == by | input[i] == undefined) & inStr) {
					o.push(t)
					t = ''
					i++
				}
			}
			t += input[i]
		}
	}
	return o
}
function duplicate(array) {
	var n = 2, o = '', array2 = array
	for (var i in array) {
		n = 2
		o = array2[i] + ' Copy'
		if (array2.includes(o)) {
			while (array2.includes(o)) {
				o = array2[i] + ' Copy ' + n
				n++
			}
		}
		array2.push(o)
	}
	array = array2
	return array
}

function stuckOnLoop() {
	updateText('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nYou Reached: The End', 'loopText')
	stuck = setInterval(()=>{
		if (scrollY > 2260) {
			scrollTo(scrollX, 400)
		}
	}, 5)
}

calcBuy={
	add: function(i, r, m) {
		return ON.floor(ON.div(ON.ln(ON.div(ON.add(ON.div(i,ON.div(ON.div(ON.sub(r,10),ON.div(ON.sub(r,10),10)),ON.sub(ON.mul(m,10),10))),r),r)),ON.ln(m)))
	},
	cost: function(a, r, m) {
		return ON.mul(ON.sub(ON.mul(ON.pow(m,a),r),r),ON.div(20,ON.sub(ON.mul(m,20),20)))
	}
};

ON = OmegaNum
inc2 = {
	t:ON(0),
	p:ON(0),
	s:ON(1),
	c:ON(50),
	pa:ON(0),
	po:ON(3),
	cpo:ON('ee4000'),
	cm:ON(1.5),
	sm:ON(1.55),
	game:()=>{
		if (ON.gte(inc2.p, inc2.cpo)) {
			add = calcBuy.add(inc2.p, inc2.cpo, 1.0000001)
			cost = calcBuy.cost(add, inc2.cpo, 1.0000001)
			
			inc2.p = ON.sub(inc2.p, cost)
			inc2.cpa = ON.add(inc2.cpa, add)
			inc2.cpo = ON.mul(inc2.cpo, ON.pow(1.0000001, add))
			inc2.po = ON.mul(inc2.po, add)
			inc2.p = ON.max(inc2.p, 'ee2000')
		}
		if (ON.gte(inc2.p, inc2.c)) {
			var add = calcBuy.add(inc2.p, inc2.c, inc2.cm)
			var cost = calcBuy.cost(add, inc2.c, inc2.cm)
			
			inc2.p = ON.sub(inc2.p, cost)
			inc2.pa = ON.add(inc2.pa, add)
			inc2.c = ON.mul(inc2.c, ON.pow(inc2.cm, add))
			inc2.s = ON.mul(inc2.s, ON.pow(inc2.sm, add))
		}
		inc2.p = ON.add(inc2.p, inc2.s)
		inc2.t = ON.add(inc2.t, 1)
		inc2.sm = ON.mul(ON.pow(inc2.t, ON.pow(ON.log10(ON.log10(inc2.p)), inc2.po)), 1.01)
	},
	text:()=>{
		return `Points: ${ON.letterfy(ON.floor(inc2.p))}\nSpeed: ${ON.letterfy(ON.floor(inc2.s))}\n\nCost for x${ON.letterfy(ON.div(ON.floor(ON.mul(inc2.sm, 100)), 100))}: ${ON.letterfy(ON.floor(inc2.c))}\nPaid: ${ON.letterfy(inc2.pa)}\n\nUltraBoost: ^${ON.letterfy(inc2.po)}\nIncrease UltraBoost for: ${ON.letterfy(inc2.cpo)}`
	},
	play:()=>{
		int = setInterval(()=>{
			inc2.game();
			updateText(inc2.text())
		}, 33)
	}
}

