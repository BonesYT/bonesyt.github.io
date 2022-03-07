'use strict'
var Equation
(function(){

    function set(p,v,t) {
        Object.defineProperty(t,p,{value:v,writable:false,enumerable:true})
    }

    Equation = function (type='eq', name='unnamed') {
        if (!Equation.eqTypes.includes(type)) throw TypeError('[Equation.js] Invalid type')
        set('type', type,this)
        Object.defineProperty(this,'name',{
            value: name + '',
            set var(val) {
                return val + ''
            },
            enumerable: true
        })
        set('inner', [],this)
    }
    Equation.prototype.addStart = function (v) {
        if (v.type == 'operator') throw SyntaxError('[Equation.js] Operators should not be added at the start')
        if (this.inner.length > 0) throw SyntaxError('[Equation.js] Already started') 
        this.inner.push(v)
    }
    Equation.prototype.add = function (op, v) {
        if (this.inner.length == 0) throw SyntaxError('[Equation.js] Operators should not be added at the start, use .addStart first')
        if (op.type != 'operator') throw TypeError('[Equation.js] Type is not operator')
        if (v.type == 'operator') throw TypeError('[Equation.js] Type has to be not an operator')
        this.inner.push(op)
        this.inner.push(v)
    }
    Equation.prototype.remove = function (id) {
        var a = Math.floor((i + 1) / 2) * 2 - 1
        if (a == -1) a = 0
        this.inner.splice(a, 2)
    }

    Equation.eqTypes = ['eq','funct']
    Equation.opers = ['add','sub','mul','div','pow']
    Equation.opersSym = ['+','-','×','÷','^']

    Equation.Operator = function (op) {
        if (!Equation.opers.includes(op)&!Equation.opersSym.includes(op)) throw TypeError('[Equation.js] Invalid operator')
        if (!Equation.opers.includes(op)&Equation.opersSym.includes(op)) op = Equation.opers[Equation.opersSym.indexOf(op)]
        set('type', 'operator',this)
        set('oper', op,this)
    }
    Equation.Operator.prototype.setOper = function (op) {
        if (!Equation.opers.includes(op)&!Equation.opersSym.includes(op)) throw TypeError('[Equation.js] Invalid operator')
        if (!Equation.opers.includes(op)&Equation.opersSym.includes(op)) op = Equation.opers[Equation.opersSym.indexOf(op)]
        this.oper = op
    }
    Equation.Operator.prototype.toString = function () {
        return Equation.opersSym[Equation.opers.indexOf(this.oper)]
    }

    Equation.Value = function (num) {
        set('type', 'value',this)
        Object.defineProperty(this,'val',{
            value: Number(num),
            set var(val) {
                console.log(val)
                return Number(val)
            },
            enumerable: true
        })
    }
    Equation.Value.prototype.toString = function () {
        return this.val + ''
    }

    Equation.Variable = function (name) {
        set('type', 'variable',this)
        Object.defineProperty(this,'name',{
            value: num,
            set var(val) {
                return val + ''
            },
            enumerable: true
        })
    }
    Equation.Variable.prototype.toString = function () {
        return this.name
    }

    Equation.Parenthesis = function () {
        set('type', 'parenthesis',this)
        set('inner', [],this)
    }
    Equation.Parenthesis.prototype.addStart = Equation.prototype.addStart
    Equation.Parenthesis.prototype.add = Equation.prototype.add
    Equation.Parenthesis.prototype.remove = Equation.prototype.remove

})()