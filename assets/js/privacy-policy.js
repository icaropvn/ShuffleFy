function changeTheme(theme) {
    if(theme === 'light') {
        document.body.classList.add('light')
        document.body.classList.remove('dark')
    }
    else {
        document.body.classList.add('dark')
        document.body.classList.remove('light')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let savedTheme = localStorage.getItem('theme') || dark
    changeTheme(savedTheme)
})