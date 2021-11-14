songs = ['Bitbase', 'Thesuren', 'Orsical', 'Ditern', 'Ultraticalic', 'Megalatic', 'Ultrimontalitic', 'Universal0', 'Ostale', 'Ultrismate 2', 'specinal',
         'Bitbase_drums', 'Bitlog', 'Close To The Final remix', 'Glitch', 'hardination', 'hyperfy', 'Laterental', 'Luigi Friday Night Funkin VR Concept Animation remake', 'Minalest',
         'MultiSong', 'OmegaSpeed 1', 'OmegaSpeed 2', 'OmegaSpeed 3']
songs.sort()
songnames = songs.map((v)=>{return v + '.mp3'})
playing = []

document.makeElement = (tag, innerHTML)=>{
    var node = document.createElement(tag);
    var textnode = document.createTextNode(innerHTML);
    node.appendChild(textnode);
    return node
}
document.placeElement = (node, id)=>{
    document.getElementById(id).appendChild(node);
}

for (i=0; i<songs.length; i++) {
    a = document.makeElement('button', songs[i])
    a.id = 'Song' + i
    document.placeElement(a, 'songs')
    const testElement = document.getElementById('songs');
    const lineBreak = document.createElement('br');
    testElement.appendChild(lineBreak);
}
for (i=0; i<songs.length; i++) {
    document.getElementById('Song' + i).addEventListener('click', eval('()=>{playSong('+i+')}'))
}

function playSong(id) {
    var a = new Audio(songnames[id])
    playing.push(a)
    a.play()
} 

function stopAll() {
    playing.forEach(element => {
        element.pause()
    });
}