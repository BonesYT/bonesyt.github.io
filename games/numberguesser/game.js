guesses = []
answer = -1
won = 0

function startGame() {
    $('main').style.display = 'none'
    $('game').style.display = 'block'
    answer = Math.floor(Math.random() * ($('max').value - $('min').value + 1) + $('min').value)
	$('answer').innerHTML = 'None'
	$('guesses').innerHTML = 'Guesses:'
}

function guess() {
    if (!guesses.includes($('guess').value)) {
        guesses.push($('guess').value)
    }
    $('guesses').innerHTML = 'Guesses: ' + guesses.join(', ')
    if ($('guess').value == answer) {
        won++
        $('main').style.display = 'block'
        $('game').style.display = 'none'
        $('last').innerHTML = 'Won last round with ' + guesses.length + ' guesses.'
        $('won').innerHTML = 'Times won: ' + won
		guesses = []
    } else {
        if ($('guess').value > answer) {
            $('answer').innerHTML = 'Lower!'
        } else {
            $('answer').innerHTML = 'Higher!'
        }
    }
}