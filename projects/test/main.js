audioPlayed = false
audio = []
version = '1.2'

defaultCSS = document.getElementById('style').innerHTML
previousCSS = document.getElementById('style').innerHTML

updateText('', 'loopText')
updateText(`Version: ${version}`, 'version')
updateText(defaultCSS, 'cssStyle')
updateText('[\n\t"Hello World"\n]', 'funcArg')

function funcRun() {
	var func = document.getElementById('funcOption').value
	var args = document.getElementById('funcArg').value
	var split = document.getElementById('splitSelect').value
	var isarray, out
	var stringify = document.getElementById('JSONinstead').checked
	try {
		isarray = Array.isArray(JSON.parse(args))
	} catch {
		isarray = false
	}
	try {
		if (split=='$array') {
			if (isarray) {out = stringExpression(func + '.apply(null, ' + args + ')')}
			else {alert('The arguments input is not an array!')}
		} else if (split=='$arg') {
			out = stringExpression(func + '(' + args + ')')
		} else {
			out = stringExpression(func + '.apply(null,' + JSON.stringify(args.split(split)) + ')')
		}
	} catch {
		alert('Error. Is everything good?')
	}
	return stringify? JSON.stringify(out) : out
}
function value(i) {
	return i
}

function playAudioButton() {
	repeat = document.getElementById('songRepeat').checked
	isarray = document.getElementById('songArray').checked
	if (!audioPlayed) {
		if (isarray) {
			try {
				audioArray = JSON.parse(document.getElementById("audioInput").value)
				if (document.getElementById("audioSelect").value != 'any') {
					audioArray = audioArray.map((v)=>{return v + '.' + document.getElementById("audioSelect").value})
				}
				var audioName
				for (i=0; i<audioArray.length; i++) {
					audioName = audioArray[i]
					try {
						playAudio(audioName)
						if (!repeat) audioPlayed = true
					} catch {
						alert('The file "' + audioName + '" doesn\'t exist. Perhaps you put the wrong inputs?')
					}
				}
			} catch {
				alert('Something is wrong in the JSON input.')
			}
		} else {
			var audioName = document.getElementById("audioInput").value + '.' + document.getElementById("audioSelect").value
			try {
				playAudio(audioName)
				if (!repeat) audioPlayed = true
			} catch {
				alert('The file "' + audioName + '" doesn\'t exist. Perhaps you put the wrong inputs?')
			}
		}
	}
}
function remAudio(i='') {
	if (i=='') {
		audio[audio.length-1].pause()
		audio.pop()
	} else if (i=='all') {
		audio.map((v)=>{v.pause()})
		audio = []
	}
}
function changeImage() {
	var imageName = document.getElementById("imageInput").value + '.' + document.getElementById("imageSelect").value
	document.getElementById('image').src = imageName
}
function bonesytCss() {
	document.getElementById('cssStyle').value = "body {\n    background-image: url('background.png');\n    background-size: cover;\n    text-align: center;\n}\nh1, h2, h3 {\n    font-variant: small-caps;\n    font-weight: 800;\n    -webkit-background-clip: text;\n}\n.wt {\n    color: white;\n}\n.logo {\n    width: auto;\n    height: 128px;\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n}\nh1{\n    font-size: 3.2em;\n    color: rgb(255, 255, 255);\n    background-image: linear-gradient(\n        rgb(255, 255, 255) 46%,\n        rgb(125, 142, 167) 49%,\n        rgb(211, 226, 249) 80%\n      );\n    -webkit-text-fill-color: transparent;\n    -webkit-text-stroke: 1px rgb(36, 36, 36);\n}\nh3 {\n    color: rgb(0, 255, 128);\n    background-image: linear-gradient(\n        rgb(0, 255, 128) 1%,\n        rgb(17, 192, 169) 99%\n    );\n    -webkit-text-fill-color: transparent;\n}\nbutton {\n    font-family: 'Trebuchet MS', sans-serif;\n    color: rgb(255, 255, 255);\n    background-image: linear-gradient(\n        rgb(53, 45, 0) 0%,\n        rgba(0, 26, 82) 100%\n    );\n    border-radius: 6px;\n    font-size: 18px;\n    padding: 6px 11px;\n}\nbutton:hover {\n    color: rgb(255, 255, 255);\n    background-image: linear-gradient(\n        rgb(120, 110, 0) 0%,\n        rgba(0, 110, 120) 100%\n    );\n    border-color: rgb(180, 180, 180);\n}\na {font-family: 'Trebuchet MS', sans-serif; color: rgb(0, 255, 255)}\na:visited {font-family: 'Trebuchet MS', sans-serif; color: rgb(255, 255, 30)}"
}