function TUOVProgress(epis=1, vars=20, maxvars=80, maxreq=14, render=0, failed=0, renderfail=0, check=false, thumbnail=false, post=0, epistime=3e5, fps=30) {
	this.episode = Number(epis)
	this.variations = Number(vars)
	this.maxVariations = Number(maxvars)
	this.maxRequests = Number(maxreq)
	this.varsLeft = Math.max(this.maxVariations - this.variations, 0)
	this.requestVarsLeft = Math.max(this.maxRequests - this.variations, 0)
	this.variationsCompleted = this.varsLeft == 0
	this.requestCompleted = this.requestVarsLeft == 0
	this.varsPercent = Math.min(this.variations / this.maxVariations * 100, 100) + '%'
	this.requestPercent = Math.min(this.variations / this.maxRequests * 100, 100) + '%'
	this.rendered = typeof render == 'string' ? (Number(render.replace(/%/, '')) / 100) : render
	this.renderLeft = 1 - this.rendered
	this.renderFails = failed
	this.renderFailed = renderfail
	this.isRendered = this.rendered >= 1
	this.checked = Boolean(check)
	this.madeThumbnail = Boolean(thumbnail)
	this.post = typeof post == 'string' ? (Number(post.replace(/%/, '')) / 100) : post
	this.postLeft = 1 - post
	this.episodeLength = epistime
	this.episodeFPS = fps
	this.lastFrames = this.episodeLength != undefined ? ((this.episodeLength / 1000) % 1 / (1 / this.episodeFPS)) : undefined
	this.started = this.variations != 0
	this.finished = post >= 1
	this.getTotalProg = () => {
		if (!this.postLeft) {
			return 6
		} else if (this.madeThumbnail) {
			return 5
		} else if (this.checked) {
			return 4
		} else if (!this.renderLeft) {
			return 3
		} else if (this.varsLeft == 0) {
			return 2
		} else if (this.requestVarsLeft == 0) {
			return 1
		} else {
			return 0
		}
	}
	this.getEpisodeTime = () => {
		if (this.episodeLength == undefined) {
			return null
		}
		var a = Math.floor(this.episodeLength / 1e3 % 60),
		    b = Math.floor(this.episodeLength / 6e4 % 60),
		    c = Math.floor(this.episodeLength / 3.6e6),
		    d = a.toString().padStart(2, '0'),
			e = (b ? (b.toString() + ':') : ':').padStart(3, '0'),
			f = c ? ((c.toString() + ':').padStart(2, '0')) : ''
		return f + e + d
	}
	this.progress = (input, amm) => {
		input = Math.min(input, 1)
		var a = Math.floor(input * amm),
		    b = amm - Math.floor(input * amm),
			o = ''
		for (var i = 0; i < a; i++) {
			o += 'I'
		} for (var i = 0; i < b; i++) {
			o += '.'
		}
		return o
	}
	this.getString = () => {
		return `Progress for the episode ${this.episode}:\n\nStart status: ${this.started?'True':'False'}\n\nEditing:\n  Variations:\n    ${this.varsPercent} (${Math.min(this.variations, this.maxVariations)}/${this.maxVariations}) ${this.progress(this.variations / this.maxVariations, 20)} (${this.varsLeft} left)\n  Request Variations:\n    ${this.requestPercent} (${Math.min(this.variations, this.maxRequests)}/${this.maxRequests}) ${this.progress(this.variations / this.maxRequests, 20)} (${this.requestVarsLeft} left)\nRendering:\n  ${Math.floor(this.rendered * 100) + '%'} ${this.progress(this.rendered, 20)} (cancelled ${this.renderFails} times, ${this.renderFailed}% wasted)\nChecking:\n  ${this.checked?'Completed':'Not completed'}\nThumbnail:\n  ${this.madeThumbnail?'Completed':'Not completed'}\nPosting:\n  ${Math.floor(this.post * 100) + '%'} ${this.progress(this.post, 20)}\nTotal Progress:\n  ${Math.floor(this.getTotalProg()*(100/6))}% (${this.getTotalProg()}/6) ${this.progress(this.getTotalProg()/6, 12)}\n\nEpisode time: ${this.getEpisodeTime()} (${Math.floor(this.lastFrames)} frames/${this.episodeFPS} FPS)`
	}
	this.string = this.getString()
	this.f = {
		valueSet: input => {
			var type = ''
			if (typeof input == 'string') {
				var a = false
				switch (input[0]) {
					case '=': type = 'set'; a = true; break
					case '+': type = 'add'; a = true; break
					case '-': type = 'sub'; a = true; break
					case '*': type = 'mul'; a = true; break
					case '/': type = 'div'; a = true; break
				}
				if (a) {
					return {number: Number(input.replace(/(=|\+|-|\*|\/)/g, '')), mode: type}
				}
			} else if (typeof input == 'object') {
				if (input.number && input.mode) {
					return input
				}
			}
			return {number: Number(input), mode: 'set'}
		},
		valueChange: (input, obj) => {
			switch (obj.mode) {
				case 'set': return obj.number; break
				case 'add': return input + obj.number; break
				case 'sub': return input - obj.number; break
				case 'mul': return input * obj.number; break
				case 'div': return input / obj.number; break
			}
		},
		setVars: amm => {
			amm = this.f.valueSet(amm)
			this.variations = this.f.valueChange(this.variations, amm)
			this.varsLeft = Math.max(this.maxVariations - this.variations, 0)
			this.requestVarsLeft = Math.max(this.maxRequests - this.variations, 0)
			this.variationsCompleted = this.varsLeft == 0
			this.requestCompleted = this.requestVarsLeft == 0
			this.varsPercent = Math.min(this.variations / this.maxVariations * 100, 100) + '%'
			this.requestPercent = Math.min(this.variations / this.maxRequests * 100, 100) + '%'
			this.string = this.getString()
		},
		setRender: amm => {
			amm = this.f.valueSet(amm)
			this.rendered = this.f.valueChange(this.rendered, amm)
			this.renderLeft = 1 - this.rendered
			this.renderFails = failed
			this.renderFailed = renderfail
			this.isRendered = this.rendered >= 1
			this.string = this.getString()
		},
		setCheck: out => {
			this.checked = Boolean(out)
			this.string = this.getString()
		},
		setThumbnail: out => {
			this.madeThumbnail = Boolean(out)
			this.string = this.getString()
		},
		setPost: amm => {
			amm = this.f.valueSet(amm)
			this.post = this.f.valueChange(this.post, amm)
			this.postLeft = 1 - post
			this.finished = this.getTotalProg() == 6
		},
		setEpisodeTime: (time, fps) => {
			time = this.f.valueSet(time)
			fps = this.f.valueSet(fps)
			this.episodeLength = this.f.valueChange(this.episodeLength, amm)
			this.episodeFPS = this.f.valueChange(this.episodeFPS, amm)
			this.lastFrames = (this.episodeLength / 1000) % 1 / (1 / this.episodeFPS)
		},
		start: () => {
			this.started = true
		},
		renderFail: () => {
			this.renderFails++
			this.renderFailed += this.render
			this.rendered = 0
			this.renderLeft = 1
		},
		newEpisode: (maxVars, maxReq, fps) => {
			this.variations = 0
			this.maxVariations = maxVars
			this.maxRequests = maxReq
			this.varsLeft = maxVars
			this.requestVarsLeft = maxReq
			this.variationsCompleted = false
			this.requestCompleted = false
			this.varsPercent = '0%'
			this.requestPercent = '0%'
			this.episodeFPS = fps
			this.episodeLength = undefined
			this.lastFrames = null
			this.rendered = 0
			this.renderLeft = 1
			this.renderFails = 0
			this.renderFailed = 0
			this.isRendered = false
			this.checked = false
			this.madeThumbnail = false
			this.post = 0
			this.postLeft = 1
			this.started = false
			this.finished = false
			this.episode++
		}
	}
	this.save = () => {
		return JSON.stringify(this)
	},
	this.load = string => {
		var a = JSON.parse(string)
		a.getTotalProg = new TUOVProgress().getTotalProg
		a.getEpisodeTime = new TUOVProgress().getEpisodeTime
		a.progress = new TUOVProgress().progress
		a.getString = new TUOVProgress().getString
		a.f = {}
		a.f.valueSet = new TUOVProgress().f.valueSet
		a.f.valueChange = new TUOVProgress().f.valueChange
		a.f.setVars = new TUOVProgress().f.setVars
		a.f.setRender = new TUOVProgress().f.setRender
		a.f.setCheck = new TUOVProgress().f.setCheck
		a.f.setThumbnail = new TUOVProgress().f.setThumbnail
		a.f.setPost = new TUOVProgress().f.setPost
		a.f.setEpisodeTime = new TUOVProgress().f.setEpisodeTime
		a.f.start = new TUOVProgress().f.start
		a.f.renderFail = new TUOVProgress().f.renderFail
		a.f.newEpisode = new TUOVProgress().f.newEpisode
		a = new TUOVProgress(a)
		return a
	}
	if (typeof epis == 'object') {
		var b = Object.keys(this)
		b.forEach(v => {
			this[v] = epis[v]
		})
	} 
}