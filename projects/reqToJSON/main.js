function $(e) {
    return document.getElementById(e)
}

var ef = [
    'Pitch','VolumeAdd','Reverse','Speed1','Speed2','Speed3','Delay','Reverb','InsanityReverbation','Rightpan','Leftpan',
    'Distortion','OOFDROP','Vibrato','Equalization','ILVocodex','Flange','Phaser','WahWah','LoopStretch','ResonantFilter','FrequencyBoost',
    'OutputGain','IncreasingVolume','DecreasingVolume','MultiTap','SawtoothThreshold','SemiOOFDROP','NoiseGate','ChorusModulation','NegateVibrato',
    'Voldelay','URL','MinResFilter','Beep'
]
var efr = [
    [[-50,50,0.01]],[[-Infinity,6,0.01]],[],[[0.25,4,0.01]],[[0.0625,16,0.0001]],[[0.2,2,0.1]],[[0.001,5,0.001]],[],[],[],[],[[0,100,0.1]],
    [[0.0002,3,0.0001]],[[-2,2,0.001],[0.001,1e3,0.001]],[[-25,25,0.1],[-25,25,0.1],[-25,25,0.1]],[['string']],[[0,100]],[[100,5e3]],[[0,100]],
    [[50,500]],[[20,1e4]],[[0,100],[20,15e3],[0.3,2.5,0.1]],[[-60,20,0.1]],[[1e-3,5e3]],[[1e-3,5e3]],[[1,2500],[0,150]],[[0,1,0.01],[0,24,0.1]],
    [],[[-Infinity,0,0.1],[0,500],[0,5e3]],[[0.001,20,0.001],[1,100]],[[-24,24],[1e-3,1e3]],[[2e-4,1e3,1e-4],[0,100],[0,100],[0,1.667,0.001]],
    [['string']],[[100,2e4]],[]
]

function convert() {
    var input = $('input').value
    var output = {
        vars: [],
        name: ''
    }
    console.log(input)
    input = input.split('\n').allowIf(v => {
        return v.trim() != ''
    })
    try {
        var a, b, k, l, z = 0
        for (var I = 0; I < input.length; I++) { // vars
            if (input[I].hasFirst('Group Name:')) {

                a = input[I].substr(11).trim()
                if (a.length > 25) throw `RuleError: Group name is over 25 characters.\n\t`
                if (z == 1) throw `RuleError: Group is not allowed with only 1 variation.`
                output.name = a

            } else {

                z++
                output.vars.push({
                    name: undefined,
                    sfx: [],
                    image: []
                })
                if (z > 3) throw `RuleError: Too maybe lines or too many variations.\nUse "Group Name:" at the last line to name your group.`
                a = input[I].until(0,'|',1).trim()
                if (a.length > 45) throw `RuleError: Variation name is over 45 characters.\n\tAt Variation ${I + 1}`
                if (a.hasFirst(`var ${I + 1}:`)) a = a.substr(6).trim()
                output.vars[I].name = a

                b = input[I].map(v => {
                    return v + ' '
                }).untilPrt('|','|',['|','\n'],1,2).trim().untilSplitPrt(',','[',']').mapTrim()

                for (k = 0; k < b.length; k++) {
                    if (b[k].includes('^')) {
                        l = Number(b[k].cutFirst('^').substr(1))
                        if (l.isNaN() | l > 4) throw `RuleError: Iteration amount is not a number or over 4 times.\n\tAt Variation ${I + 1}`
                        b.splice.apply(b, [k, 0].concat([b[k].cutLast('^')].repeat(l - 1)))
                        k += l
                    }
                }

                if (b.length > 12) throw `RuleError: Effect amount is over 12.\n\tAt Variation ${I + 1}`

                b.forEach((v,i) => { // effects

                    if (v.findCount('[') != v.findCount(']')) {
                        if (v.findCount('[') > v.findCount(']')) {
                            throw `SyntaxError: "]" missing.\n\tAt Variation ${I + 1}: Effect ${i + 1}`
                        } else throw `SyntaxError: "]" unexpected.\n\tAt Variation ${I + 1}: Effect ${i + 1}`
                    }

                    var c = v.until(0,'[',1).replaceAll(' ',''),
                        d = v.until('[',']',1,2).split(',').mapTrim()
                    if (!ef.includes(c)) {
                        if (c.trim() == '') {throw `SyntaxError: Effect name is blank.\n\tAt Variation ${I + 1}: Effect ${i + 1}`}
                        else throw `ReferenceError: ${c} is not an available effect.\n\tAt Variation ${I + 1}: Effect ${i + 1}`
                    }

                    output.vars[I].sfx.push({
                        name: c,
                        args: []
                    })

                    var e = efr[ef.indexOf(c)]
                    if (d.length > e.length & e.length > 0) throw `RangeError: Too many arguments. Limit = ${e.length}\n\tAt Variation ${I + 1}: Effect ${i + 1}`

                    if (e.length > 0) d.map((v,j) => { // arguments
                        if (e[j][0] == 'string') {
                            output.vars[I].sfx[i].args.push(v)
                            return v
                        } else {
                            if (Number(v).isNaN()) throw `TypeError: Argument is not a number. \n\tAt Variation ${I + 1}: Effect ${i + 1}: Argument ${j + 1}`
                            var f = e[j][2] ?? 1
                            if (Number(v) > e[j][1] | Number(v) < e[j][0]) throw `RangeError: Argument should be between ${e[j][0]} and ${e[j][1]}. \n\tAt Variation ${I + 1}: Effect ${i + 1}: Argument ${j + 1}`
                            output.vars[I].sfx[i].args.push(Number(v))
                            return Number(v).sround(f)
                        }
                    })
                });

                output.vars[I].image = input[I].cutFirst('|').substr(1).cutFirst('|').substr(1).trim()

            }
        }
        $('output').value = JSON.stringify(output)
    } catch (e) {
        $('output').value = 'Uncaught ' + e
    }
}