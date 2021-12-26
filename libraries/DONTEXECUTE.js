int=[]
function DontExecuteHaha(can) {
    if (can) {
        this.execute = (candoit)=>{
            if (!candoit) throw Error('Haha you forgot another switch =)')
            if (!this.switches.length==10) throw Error('Haha switches are missing or too much =)')
            this.switches.forEach((v,i)=>{
                if (!v) throw Error('Haha, switch ' + i + ' is off lol =)')
            })
            if (!confirm('Something is will okay happen!! =)')) throw Error('Okay! Nevermind!!!!!!!')
            img = document.querySelectorAll('img')
            var text = document.querySelectorAll('*')
            a = 0
            var opts = ['Haha Macaco','Bom dia!','Ostrich Tongue','Ubuntu Higgins','Objeting','Ostriching','Gostosos!']
            var imgs = ['https://cdn.discordapp.com/attachments/886741619431333918/887039895707725824/ezgif-3-d2914d54adc7.gif',
                        'https://cdn.discordapp.com/attachments/838175013784780860/923388631744409680/20210306_191113.jpg',
                        'https://cdn.discordapp.com/attachments/838175013784780860/923377651853426738/5963476960a5b3a9cf36e7bf8b435928.png']
            text.forEach(v=>{
                if (!v.hasChildNodes()) {
                    v.innerHTML = opts[Math.floor(Math.random()*7)]
                }
            })
            img.forEach((v,i)=>{
                v.src = imgs[Math.floor(Math.random()*3)]
            })
            thisint=setInterval(() => {
                img.forEach(v=>{
                    v.style.width = (Math.sin(a)*150+200)+'px'
                    v.style.height = (Math.cos(a)*150+200)+'px'
                })
                a+=0.18
            }, 33);
            thisint2 = setInterval(() => {
                new Audio('https://cdn.discordapp.com/attachments/838175013784780860/923390305204592640/ubuntu_seven.wav').play()
            }, 1000);
            new Audio('https://cdn.discordapp.com/attachments/838175013784780860/923390419738431498/OSTRICH_TONGUE_MUSIC.mp3').play()
        },
        this.switches = [false,false,false,false,false,false,false,false,false,false]
    } else {
        throw Error('Haha you forgot a switch =)')
    }
}

//EXECUTE THIS IF YOU WANT EVERY IMAGE REPLACED =)