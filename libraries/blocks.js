var sblocks = {
    repeat: (a=1, f=i=>{})=>{
        for (var i = 0; i < a; i++) {
            f(i)
        }
    },
    wait: (ms=1000, f=()=>{})=>{
        setTimeout(f, ms)
    },
    repeatUntil: (u=()=>{return true}, f=t=>{}) => {
        var t = 0
        while (!u()) {
            f(t)
            t++
        }
    }
}