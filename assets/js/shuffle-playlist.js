function shuffle(array) {
    let shuffled = array.slice()
    let randomIndex

    for(let i=shuffled.length-1; i>0; i--) {
        randomIndex = Math.floor(Math.random() * (i+1));

        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
    }

    return shuffled
}

async function shufflePlaylist(playlistId, playlistTitle) {
    showNotification('info', playlistTitle)
    
    try {
        let tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(!tracksResponse.ok)
            throw new Error('Playlist tracks obtaining error.')

        let responseData = await tracksResponse.json()
        let tracks = responseData.items.map(item => item.track.id)

        let shuffledTracks = shuffle(tracks)

        const updateRequests = shuffledTracks.map((trackId, i) => {
            let rangeStart = tracks.indexOf(trackId)

            tracks.splice(rangeStart, 1)
            tracks.splice(i, 0, trackId)

            return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    range_start: rangeStart,
                    insert_before: i
                })
            })
        })

        await Promise.all(updateRequests)
    }
    finally {
    }
}

function showNotification(type, title) {
    let container = document.getElementById('notification-container')
    let notification = createNotification(type, title)

    container.appendChild(notification)

    requestAnimationFrame(() => {
        notification.offsetWidth
        notification.classList.add('show')
    })

    setTimeout(() => {
        notification.classList.remove('show')

        notification.addEventListener('transitionend', () => {
            notification.remove()
        })
    }, 6000)
}

function createNotification(type, title) {
    let notificationWrapper = document.createElement('div')
    notificationWrapper.classList.add('notification-wrapper')

    let notificationContainer = document.createElement('div')
    notificationContainer.classList.add('notification')
    notificationWrapper.appendChild(notificationContainer)

    let notificationIcon = document.createElement('span')
    notificationIcon.classList.add('notification-icon')
    notificationIcon.classList.add('material-symbols-outlined')
    notificationContainer.appendChild(notificationIcon)

    let notificationText = document.createElement('div')
    notificationText.classList.add('notification-txt')
    notificationContainer.appendChild(notificationText)

    let notificationTitle = document.createElement('h3')
    notificationText.appendChild(notificationTitle)

    let notificationDesc = document.createElement('p')
    notificationText.appendChild(notificationDesc)

    if(type === 'success') {
        notificationContainer.classList.add('success')
        notificationIcon.textContent = 'check_circle'
        notificationTitle.textContent = 'Playlist shuffled!'
        notificationDesc.innerHTML = `<p>Playlist <strong>${title}</strong> shuffled successfuly!</p>`
    }
    else if(type === 'error') {
        notificationContainer.classList.add('error')
        notificationIcon.textContent = 'cancel'
        notificationTitle.textContent = 'Ops!'
        notificationDesc.innerHTML = `<p>Failed to shuffle playlist. Try again.</p>`
    }
    else {
        notificationContainer.classList.add('info')
        notificationIcon.textContent = 'info'
        notificationTitle.textContent = 'Shuffling...'
        notificationDesc.innerHTML = `<p>The <strong>${title}</strong> playlist shuffling has started.</p>`
    }

    return notificationWrapper
}

// Lógica da caixa de confirmação de shuffle
function confirmShuffle() {
    return new Promise((resolve) => {
        let confirmationDialog = document.getElementById('shuffle-confirmation')
        let dontShowAgainCheckbox = document.getElementById('confirm-ask-again')
        let confirm = document.getElementById('confirm-shuffle')
        let cancel = document.getElementById('cancel-shuffle')

        dontShowAgainCheckbox.checked = false

        confirm.replaceWith(confirm.cloneNode(true))
        cancel.replaceWith(cancel.cloneNode(true))

        confirm = document.getElementById('confirm-shuffle')
        cancel = document.getElementById('cancel-shuffle')

        confirmationDialog.showModal()

        confirm.addEventListener('click', () => {
            confirmationDialog.close()
            resolve(true)
        })

        cancel.addEventListener('click', () => {
            confirmationDialog.close()
            resolve(false)
        })
    })
}

// Evento de click do botão de shuffle
document.addEventListener('click', async (event) => {
    let shuffleButton = event.target.closest('.shuffle-button')
    let confirmation = true
    
    if(!shuffleButton) 
        return
    
    if(localStorage.getItem('skipConfirmation') !== 'true') {
        confirmation = await confirmShuffle()

        let dontShowAgainCheckbox = document.getElementById('confirm-ask-again')
        
        if(dontShowAgainCheckbox.checked && confirmation === true)
            localStorage.setItem('skipConfirmation', 'true')
    }

    if(!confirmation)
        return

    let container = shuffleButton.closest('.playlist-item')
    let playlistId = container.dataset.playlistId
    let playlistTitle = container.querySelector('p').textContent

    shuffleButton.disabled = true
    shuffleButton._animation.play()
    shuffleButton.classList.add('loading')

    try {
        await shufflePlaylist(playlistId, playlistTitle)
        showNotification('success', playlistTitle)
    }
    catch(error) {
        showNotification('error', playlistTitle)
        console.error(error)
    }

    shuffleButton.classList.remove('loading')
    shuffleButton._animation.stop()
    shuffleButton.disabled = false
})