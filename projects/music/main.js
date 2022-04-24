// Date format: MM/DD/YYYY
songs = ['Bitbase', 'Thesuren', 'Orsical', 'Ditern', 'Ultraticalic', 'Megalatic', 'Ultrimontalitic', 'Universal0', 'Ostale', 'Ultrismate 2', 'specinal',
         'Bitbase_drums', 'Bitlog', 'Close To The Final remix', 'Glitch', 'hardination', 'hyperfy', 'Laterental', 'Luigi Friday Night Funkin VR Concept Animation remake', 'Minalest',
         'MultiSong', 'OmegaSpeed 1', 'OmegaSpeed 2', 'OmegaSpeed 3',
         /* Added in 12/22/2021 */ 'AMOGUS GUS 4', 'Gigatical', 'jsabum song version 3', 'Megalovania (Ultrastic Remix)', 'Myticlria', 'Traveler', 'Unispeed',
         /* Added in 01/21/2022 */ 'Aritical', 'Binary WarmUp', 'Calmed', 'Counaction Ultra Remix', 'Majory Bounce', 'MultiSongJSAB', 'Ultra Amogus Mode', 'Upperultra',
         /* Added in 02/03/2022 */ 'Mechinera', 'Megaisy', 'Myticlria 2', 'Superialer',
         /* Added in 02/19/2022 */ 'Eletronamia', 'Mirational',
         /* Added in 09/24/2022 */ 'Akordot Univert', 'Frequentic', 'Komberst', 'Misteiral', 'Superialer Remixer Beats Cover', 'Synth Chords', 'Ultrepeat', 'Ultinatium']
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

(() => {
var a

for (i=0; i<songs.length; i++) {
    a = document.makeElement('button', songs[i])
    a.id = 'Song' + i
    document.placeElement(a, 'songs')
    document.getElementById('songs').appendChild(document.createElement('br'));
}
for (i=0; i<songs.length; i++) {
    document.getElementById('Song' + i).addEventListener('click', eval('()=>playSong('+i+')'))
}

document.getElementById('songs').appendChild(document.createElement('br'))
a = document.makeElement('button', '~~ ULTIMATE BonesYT SONGS MERGE [2022] ~~')
a.className = 'special'
a.addEventListener('click', () => {
    var a = new Audio('songs/UltimateMerge.mp3')
    playing.push(a)
    a.play()
    ap = true
})
document.getElementById('songs').appendChild(a)

})()

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