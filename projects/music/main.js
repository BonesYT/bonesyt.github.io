songs = ['Bitbase', 'Thesuren', 'Orsical', 'Ditern', 'Ultraticalic', 'Megalatic', 'Ultrimontalitic', 'Universal0', 'Ostale', 'Ultrismate 2', 'specinal',
         'Bitbase_drums', 'Bitlog', 'Close To The Final remix', 'Glitch', 'hardination', 'hyperfy', 'Laterental', 'Luigi Friday Night Funkin VR Concept Animation remake', 'Minalest',
         'MultiSong', 'OmegaSpeed 1', 'OmegaSpeed 2', 'OmegaSpeed 3',
         /* Added in 12/22/2021 MM/DD/YYYY */ 'AMOGUS GUS 4', 'Gigatical', 'jsabum song version 3', 'Megalovania (Ultrastic Remix)', 'Myticlria', 'Traveler', 'Unispeed',
         /* Added in 01/21/2022 MM/DD/YYYY */ 'Aritical', 'Binary WarmUp', 'Calmed', 'Counaction Ultra Remix', 'Majory Bounce', 'MultiSongJSAB', 'Ultra Amogus Mode', 'Upperultra',
         /* Added in 02/03/2022 MM/DD/YYYY */ 'Mechinera', 'Megaisy', 'Myticlria 2', 'Superialer',
         /* Added in 02/19/2022 MM/DD/YYYY */ 'Eletronamia', 'Mirational']
songs.sort()
songnames = songs.map((v)=>{return v + '.mp3'})
playing = []
ap = false

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
    if (!ap | document.getElementById('multi').checked) {
        var a = new Audio('songs/'+songnames[id])
        playing.push(a)
        a.play()
        ap = true
    }
} 

function stopAll() {
    playing.forEach(element => {
        element.pause()
    });
    playing = []
    ap = false
}

document.getElementById('amm').innerHTML = 'Ammount: ' + songs.length