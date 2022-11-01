/* unfinished */

'use strict'
;(function(T){

    class RealCode {

        rules = []

        constructor(...rules) {

            const a = rules.findIndex(v => !RealCode.ruleList.includes(v))
            if (a >= 0) throw ReferenceError(`"${rules[a]}" is not a RealCode rule`)

        }
    
    }
    
    RealCode.ruleList = [
        'natural','natureless','true-physics','constant-physics','redefinable-physics','third-dimension',
        'unnatural-dimension','unliving','total-counscious','ai-counscious','infinite','idle','seeded-universe',
        'multiverse-tree','universe-connection','atomic','hyperquality','multi-timeline','figurable','alternate-reality'
    ]

})(this)