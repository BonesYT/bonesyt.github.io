guesses = []
answer = -1
won = 0
highscore = 101
points = 0
nhighscore = 1
lastguess = 0

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

        lastguess = guesses.length
        $('last').innerHTML = 'Won last round with ' + lastguess + ' guesses.'
        $('won').innerHTML = 'Times won: ' + won

		guesses = []

        points += Math.floor(Math.log10(numbers)*50 + (1 / lastguess) * (Math.log10(numbers)*50 * 1.2))
        $('pts').innerHTML = 'Points: ' + points
        
        if (numbers > nhighscore) nhighscore = numbers
        if ($('min').value == 0 & $('max').value == 100) {
            if (lastguess < highscore) highscore = lastguess
        }

        $('nhigh').innerHTML = 'Highest ammount of numbers won: ' + nhighscore
        $('high').innerHTML = 'Lowest guesses using default min/max: ' + highscore

        save()
    } else {
        if ($('guess').value > answer) {
            $('answer').innerHTML = 'Lower!'
        } else {
            $('answer').innerHTML = 'Higher!'
        }
    }
}