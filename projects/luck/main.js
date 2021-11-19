function $(e) {
    return document.getElementById(e);
};

var maxLuck = 0;
var tries = 0;
var luck = 0;

function testLuck() {
    var chance = 0;
    for (var i = 0; i < 10000; i++) {
        chance = Math.max(Math.floor(1 / Math.random()) + 1, chance);
    };
    luck = chance / 10000;
    tries++;
    maxLuck = Math.max(luck, maxLuck);

    $('luck').innerHTML = luck.toString();
    $('tries').innerHTML = 'Tries: ' + tries.toString();
    $('highscore').innerHTML = 'Highest lucky value: ' + maxLuck.toString();
}

function save() {
    save2 = {luck: luck, tries: tries, highscore: maxLuck}
    document.cookie = JSON.stringify(save2)
}
function load() {
    var isJSON = true
    try {
        JSON.parse(document.cookie)
    } catch {
        isJSON = false
    }
    if (isJSON) {
        load = JSON.parse(document.cookie)
        luck = load.luck
        tries = load.tries
        maxLuck = load.highscore

        $('luck').innerHTML = luck.toString();
        $('tries').innerHTML = 'Tries: ' + tries.toString();
        $('highscore').innerHTML = 'Highest lucky value: ' + maxLuck.toString();
    } else {
        save()
        load()
    }
}

load()