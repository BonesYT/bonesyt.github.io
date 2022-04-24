'use strict'

var EasyHTML = {
    defCSS(template = 'none') {
        return document.createElement(template).style
    },
    getId(id = '', element=document) {return element.getElementById(id)},
    getCl(Class = '', element=document) {return element.getElementsByClassName(Class)},
    getNa(name = '', element=document) {return element.getElementsByName(name)},
    getQu(selector = '', element=document) {
        try {return document.querySelector(selector)}
        catch (e) {throw new DOMException(`[EasyHTML.js] '${selector}' is not a valid selector.`)}
    },

    button(inner, funct, style) {
        var a = document.createElement('button')
        if (funct) a.addEventListener('click', funct)
        if (style) a.style = style
        return a
    },
    div(inner, style) {
        var a = document.createElement('div')
        if (style) a.style = style
        return a
    }
}
var EasyCSS, EasyCSSList

(()=>{

    function apply(target) {
        Object.keys(P).forEach(v => {
            Object.defineProperty(target.prototype, v, {
                value: P[v],
                writable: false,
                enumerable: false
            })
        })
        P = {}
    }

    EasyCSS = function (selector = '*', style={}) {
        this.style = style
        EasyHTML.getQu(selector)
        this.selector = selector
    }

    var P = {}

    P.setAll = function (element) {
        var a = element.querySelectorAll(this.selector)
        a.forEach(v => {
            Object.keys(this.style).forEach((w,i) => {
                v.style[i] = w[i]
            })
        })
    }
    P.apply = function (item = 0) {
        document.styleSheets[item].addRule(this.selector, this.style)
    }
    P.toString = function () {
        return `${this.selector} {\n${
            Object.keys(this.style).map(v =>
                `\t${v}: ${this.style[v]};`
            ).join('\n')
        }\n}`
    }

    apply(EasyCSS)

    EasyCSSList = function () {
        var a = []
        this.__defineSetter__('array', function (v) {this.length = v.length; a = v})
        this.__defineGetter__('array', function () {return [...a]});
        this.array = []
        this.length = 0
    }
    P.setAll = function (element) {
        this.array.forEach(v => {v.setAll(element)})
    }
    P.apply = function (item = 0) {
        this.array.forEach(v => {v.apply(item)})
    }

    apply(EasyCSSList)

})()