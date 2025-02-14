const aboutButton = document.querySelectorAll('.about-button, #about-button')
const aboutButtonFooter = document.querySelector('#footer-about-button')
const aboutDialog = document.querySelector('#about-dialog')
const closeButton = document.querySelector('#close-icon')
const dialogContent = document.querySelector('#about-dialog-content')
const gif = document.querySelector('#usability-demo')

function openAboutModal() {
    aboutDialog.showModal()
    dialogContent.scrollTop = 0
}

function closeAboutModal() {
    aboutDialog.close()
}

function getCorrectGifPath() {
    const path = window.location.pathname
    let pageName = path.split('/').pop()

    if(pageName !== 'index.html')
        return '../'
    
    return ''
}

aboutButton.forEach(button => {
    button.addEventListener('click', () => {
        openAboutModal()
    })
})

if(aboutButtonFooter) {
    aboutButtonFooter.addEventListener('click', () => {
        openAboutModal()
    })
}

closeButton.addEventListener('click', () => {
    closeAboutModal()
})

gif.addEventListener('mouseover', () => {
    gif.src = getCorrectGifPath() + 'assets/img/usability-demonstration.gif'
})

gif.addEventListener('mouseout', () => {
    gif.src = getCorrectGifPath() + 'assets/img/usability-demo-paused-frame.jpg'
})