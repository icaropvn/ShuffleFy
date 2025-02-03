let themeContainer = document.getElementById('theme-button')
let themeButton = document.getElementById('checkbox')
let iconSlider = document.getElementsByClassName('theme-icons')[0]
let themeTooltip = document.getElementById('theme-tooltip')
let themeTooltipTimeout
let isTooltipVisible = false

function changeTheme(theme) {
    if(theme === 'light') {
        document.body.classList.add('light')
        document.body.classList.remove('dark')
        iconSlider.style.transform = 'translateX(-45px)'
    }
    else {
        document.body.classList.add('dark')
        document.body.classList.remove('light')
        iconSlider.style.transform = 'translateX(0)'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let savedTheme = localStorage.getItem('theme') || dark
    iconSlider.classList.add('no-transition')
    changeTheme(savedTheme)
    themeButton.checked = savedTheme === 'light'

    setTimeout(() => {
        iconSlider.classList.remove('no-transition')
    }, 100)
})

themeButton.addEventListener('change', () => {
    let currentTheme = themeButton.checked ? 'light' : 'dark'
    localStorage.setItem('theme', currentTheme)
    changeTheme(currentTheme)
})