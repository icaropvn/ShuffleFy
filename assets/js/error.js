document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    const errorCode = params.get('code')
    const token = params.get('token')
    const storedToken = sessionStorage.getItem('error_token')
    const errorCodeElement = document.getElementById('error-code')

    if(!errorCode || !token || token !== storedToken)
        window.location.href = '../index.html'

    errorCodeElement.innerHTML = `Error code: <strong>${errorCode}</strong>`
})