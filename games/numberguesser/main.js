function $(e) {
    return document.getElementById(e);
};

int = setInterval(()=>{
    $('min').value = Math.max(Math.round($('min').value), 0)
    $('max').value = Math.min(Math.round($('max').value), 999999999)
	$('max').value = Math.max($('max').value, $('min').value)
	$('min').value = Math.min($('min').value, $('max').value)
    $('total').innerHTML = 'Total numbers: ' + Math.abs($('max').value - $('min').value + 1)
}, 33)