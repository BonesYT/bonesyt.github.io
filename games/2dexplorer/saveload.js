function save() {
    localStorage.setItem('2DExplorer', btoa(JSON.stringify(game)))
    return true
}
function load() {
    if (localStorage.getItem('2DExplorer') == null) return false
    game = JSON.parse(atob(localStorage.getItem('2DExplorer')))
    return true
}

var saveint = setInterval(()=>{
    save()
}, 5e3)

load()