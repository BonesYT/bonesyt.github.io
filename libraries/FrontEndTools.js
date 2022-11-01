'use strict'
;(function(GT) {
    class FrontEndTools {

        DOM = {
    
            search(innerHTML, element) {
    
                innerHTML = innerHTML.toLowerCase()
                function recurse(e) {
                    let res = null
                    e.childNodes.forEach(v => {
                        if (res) return
                        if (v.constructor == Comment) return
                        if (v.constructor == Text) {
                            if (v.textContent.toLowerCase().includes(innerHTML))
                                res = new FESearchResults(v.parentElement, innerHTML, 'HTML')
                            return
                        }
                        if (v.childElementCount) {
                            const s = recurse(v)
                            if (s) return res = s
                        }
                        if (v.innerHTML.toLowerCase().includes(innerHTML))
                            res = new FESearchResults(v, innerHTML, 'HTML')
                    })
                    return res
                }
                return recurse(element ?? document.querySelector('html'))
    
            }
    
        }
        script = {
    
            search(object, predicate) {
    
                function recurse(o) {
    
                }
                return recurse(object ?? GT)
    
            }
    
        }
    
    }
    class FESearchResults {
        constructor(e,q,t) {
            this.type = t
            this.element = e
            const p = [e]
            function recurse(e) {
                if (e.parentElement) {
                    p.push(e.parentElement)
                    recurse(e.parentElement)
                }
            }
            recurse(e)
            this.path = p
            this.query = q
        }
    }

    GT.FrontEndTools = new FrontEndTools
    GT.FESearchResults = FESearchResults

})(this)