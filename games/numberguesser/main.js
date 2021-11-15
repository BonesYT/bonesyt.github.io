function $(e) {
    return document.getElementById(e);
};

int = setInterval(()=>{
    $('min').value = Math.max(Math.round($('min').value), 0)
    $('max').value = Math.min(Math.round($('max').value), 999999999)
	$('max').value = Math.max($('max').value, $('min').value)
	$('min').value = Math.min($('min').value, $('max').value)
    numbers = Math.abs($('max').value - $('min').value + 1)
    $('total').innerHTML = 'Total numbers: ' + numbers
}, 33)

function save() {
    save = {wins: won, high: highscore, points: points, nhigh: nhighscore, last: lastguess}
    document.cookie = JSON.stringify(save)
}
function load() {
    if (document.cookie) {
        load = JSON.parse(document.cookie)
        won = load.wins
        highscore = load.high
        points = load.points
        nhighscore = load.nhigh
        lastguess = load.last
        lastguess: load.last
        $('nhigh').innerHTML = 'Highest ammount of numbers won: ' + nhighscore
        $('high').innerHTML = 'Lowest guesses using default min/max: ' + highscore
        $('last').innerHTML = 'Won last round with ' + lastguess + ' guesses.'
        $('won').innerHTML = 'Times won: ' + won
        $('pts').innerHTML = 'Points: ' + points
    } else {
        save()
        load()
    }
}

load()