function $(e) {
    return document.getElementById(e);
};

var value = 0;
var require = 128;
var won = false;

$('clicker').addEventListener('click', ()=>{
    value++
    $('clicker').innerHTML = value + ' / ' + require + ' (' + Math.floor((value/require)*1e4)/100 + '%)'
    if (value == require & !won) {
        new Audio('gamewin.wav').play();
        won = true;
    }
});