const aboutButton = document.querySelector('#about-button')
const aboutDialog = document.querySelector('#about-dialog')
const closeButton = document.querySelector('#close-icon')

aboutButton.addEventListener('click', () => {
    aboutDialog.showModal()
})

closeButton.addEventListener('click', () => {
    aboutDialog.close()
})