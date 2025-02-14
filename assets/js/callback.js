const hash = window.location.hash.substring(1)
const params = new URLSearchParams(hash)
const accessToken = params.get('access_token')

let lastScrollTop = 0

function hideSkeletonScreen() {
    let skeletonBoxes = document.getElementsByClassName('skeleton-element')
    let skeletonShimmers = document.getElementsByClassName('skeleton-shimmer')
    let skeletonPlaylists = document.getElementsByClassName('skeleton-playlist-container')

    let skeletonElements = [...skeletonBoxes, ...skeletonShimmers, ...skeletonPlaylists]

    skeletonElements.forEach(element => element.style.display = 'none')

    let divider = document.getElementsByClassName('divider')[0]
    divider.style.display = 'block'

    let buttonsContainer = document.getElementsByClassName('buttons-container')[0]
    buttonsContainer.style.display = 'flex'

    let footer = document.querySelector('footer')
    footer.style.display = 'flex'
}

function personalizeGreeting() {
    let completeTime = new Date()
    let hour = completeTime.getHours()

    if(hour >= 5 && hour < 12)
        return "Good morning"
    else if(hour < 18)
        return "Good afternoon"
    else
        return "Good evening"
}

function updateWelcomeMessage(userName) {
    let welcomeMessage = document.getElementById('welcome-msg')

    welcomeMessage.textContent = `${personalizeGreeting()}, ${userName}!`
}

function displayProfileImage(userImages) {
    let userImg = document.getElementById('profile-picture')

    userImg.src = userImages.url
}

function displayPlaylists(userPlaylists) {
    let container = document.getElementsByClassName('playlists-container')[0]

    userPlaylists.forEach(playlist => {
        let playlistElement = document.createElement('div')
        playlistElement.classList.add('playlist-item')
        playlistElement.setAttribute('data-playlist-id', playlist.id)

        let playlistCover = document.createElement('img')
        playlistCover.src = playlist.images[0].url

        let titleWrapper = document.createElement('div')
        titleWrapper.classList.add('playlist-name-wrapper')

        let playlistTitle = document.createElement('p')
        playlistTitle.textContent = playlist.name
        titleWrapper.appendChild(playlistTitle)

        titleWrapper.addEventListener('mouseover', () => {
            let textClone = playlistTitle.cloneNode(true)
            textClone.style.position = 'absolute'
            textClone.style.visibility = 'hidden'
            textClone.style.whiteSpace = 'nowrap'
            textClone.style.overflow = 'visible'
            textClone.style.fontSize = window.getComputedStyle(playlistTitle).fontSize;
            textClone.style.fontFamily = window.getComputedStyle(playlistTitle).fontFamily;
            textClone.style.fontWeight = window.getComputedStyle(playlistTitle).fontWeight;
            textClone.style.lineHeight = 'normal';
            document.body.appendChild(textClone)

            let textWidth = textClone.offsetWidth
            let wrapperWidth = titleWrapper.offsetWidth

            document.body.removeChild(textClone)

            if(textWidth > wrapperWidth) {
                let scrollDistance = -(textWidth - wrapperWidth) + 'px'
                let duration = (textWidth - wrapperWidth) / 15

                playlistTitle.style.setProperty('--scroll-distance', scrollDistance)
                playlistTitle.style.overflow = 'visible'
                playlistTitle.style.animation = `scroll-playlist-title ${duration}s linear infinite`
            }
        })
    
        titleWrapper.addEventListener('mouseout', () => {
            playlistTitle.style.removeProperty('animation')
            playlistTitle.style.removeProperty('--scroll-distance')
            playlistTitle.style.overflow = 'hidden'
        })

        let shuffleButton = document.createElement('button')
        shuffleButton.classList.add('shuffle-button')
        
        let shuffleButtonText = document.createElement('span')
        shuffleButtonText.classList.add('shuffle-btn-text')
        shuffleButtonText.textContent = 'Shuffle'
        shuffleButton.appendChild(shuffleButtonText)

        let shuffleIcon = document.createElement('span')
        shuffleIcon.classList.add('material-symbols-outlined')
        shuffleIcon.classList.add('shuffle-icon')
        shuffleIcon.textContent = 'shuffle'
        shuffleButton.appendChild(shuffleIcon)

        let shuffleAnimationContainer = document.createElement('div')
        shuffleAnimationContainer.classList.add('shuffle-animation-container')
        shuffleButton.appendChild(shuffleAnimationContainer)

        playlistElement.appendChild(playlistCover)
        playlistElement.appendChild(titleWrapper)
        playlistElement.appendChild(shuffleButton)
        container.appendChild(playlistElement)
    })

    loadShuffleAnimation()
}

function generateErrorToken() {
    return Math.random().toString(36).slice(2, 11)
}

async function getData() {
    try {
        const [userResponse, playlistsResponse] = await Promise.all([
            fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            fetch('https://api.spotify.com/v1/me/playlists', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        ])

        if(!userResponse.ok || !playlistsResponse.ok)
            throw new Error(`HTTP error ${userResponse.status || playlistsResponse.status}.`)

        const userData = await userResponse.json()
        const playlistsData = await playlistsResponse.json()

        hideSkeletonScreen()
        updateWelcomeMessage(userData.display_name)
        displayProfileImage(userData.images[0])
        displayPlaylists(playlistsData.items)
    }
    catch(error) {
        console.error(error)

        let errorCode = 'unknown'
        let errorToken = generateErrorToken()

        sessionStorage.setItem('error_token', errorToken)

        if(error.message.includes('HTTP error'))
            errorCode = error.message.split(' ')[2]
        
        window.location.href = `./error.html?code=${errorCode}&token=${errorToken}`
    }
}

function loadShuffleAnimation() {
    document.querySelectorAll('.shuffle-button').forEach(button => {
        let animationContainer = button.querySelector('.shuffle-animation-container')

        let animation = lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: '/ShuffleFy/assets/img/loading-dots-animation.json'
        })

        button._animation = animation
    })
}

document.addEventListener('DOMContentLoaded', () => {
    let skipConfirmation = localStorage.getItem('skipConfirmation') || 'false'
    localStorage.setItem('skipConfirmation', skipConfirmation)
})

window.addEventListener('scroll', () => {
    const header = document.getElementById('header')

    let scrollTop = window.scrollY || document.documentElement.scrollTop

    if(scrollTop > lastScrollTop) {
        header.style.transform = 'translateY(-100%)'
        header.style.boxShadow = 'none'
    }
    else {
        header.style.transform = 'translateY(0)'
        header.style.boxShadow = '0 5px 10px 0 #0000001e'
    }

    lastScrollTop = scrollTop
})

getData()