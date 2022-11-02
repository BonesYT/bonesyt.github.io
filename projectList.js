let projects

const fr = new FileReader
async function a(){
    fr.readAsText(await fetch('projects.json').then(r => r.blob()))
}
a()
fr.onload = () => {

    projects = JSON.parse(fr.result)
    document.getElementById('list').innerHTML = ''
    document.getElementById('amount').innerHTML = 'Amount: ' + projects.amount

    let div, title, desc, spanTitle, spanDesc
    for (let i = 0; i < projects.amount; i++) {

        div = document.createElement('div')
        div.className = 'proj-item'
        title = document.createElement('div')
        desc = document.createElement('div')
        title.className = 'title'
        desc.className = 'desc'
        spanTitle = document.createElement('span')
        spanDesc = document.createElement('span')
        spanTitle.innerHTML = projects.title[i]
        spanDesc.innerHTML = projects.description[i]
        div.addEventListener('click', () => window.open(projects.directory[i], '_self'))

        title.appendChild(spanTitle)
        desc.appendChild(spanDesc)
        div.appendChild(title)
        div.appendChild(desc)
        document.getElementById(projects.section[i] ?? projects.section).appendChild(div)

    }

}