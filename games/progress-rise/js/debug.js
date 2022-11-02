const debug = {

    scaleFormula(cost, value, iter=32) {

        const o = []

        for (let i = 0; i < iter; i++) {
            o.push({
                Buys:i,
                Cost:''+ cost(i),
                Value:''+ value(i)
            })
        }

        console.table(o)

    },
    lagTest(f, iter, param) {

        const a = Date.now()
        for (let i = 0; i < iter; i++) f.apply(0, param)
        return 1e3 / (Date.now() - a) * iter
        
    },
    clearIntervals() {

        let v
        for (let i in config.int) {

            v = config.int[i]
            if (typeof v == 'object') v = v.map(v => {
                clearInterval(v)
                return 0
            })
            clearInterval(v)
            config.int[i] = 0

        }

    },
    refreshBars() {

        config.bars = config.bars.map(() => 0)
        for (let i = 0; i < config.bars.length; i++) removeBars(i)
        config.bars = config.bars.map((v,i) => layerloc(i).bars.length)
        for (i = 0; i < config.bars.length; i++) placeBars(i)

    }

}