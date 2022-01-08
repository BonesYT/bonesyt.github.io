function save() {
    localStorage.setItem('2DExplorer', btoa(JSON.stringify(game)))
    return true
}
function load() {
    if (localStorage.getItem('2DExplorer') == null) return false
    game = JSON.parse(atob(localStorage.getItem('2DExplorer')))
    game.map.b[0][0][3][3] = 1
    game.map.b[0][0][7][3] = 1
    game.map.b[0][0][11][3] = 1
    return true
    
}

var saveint = setInterval(()=>{
    save()
}, 5e3)

load()