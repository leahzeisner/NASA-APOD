// DOM Elements
const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')



// NASA API
const count = 10
const apiKey = "DEMO_KEY"
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {}




// Remove loading icon and show content after everything has loaded
function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (page === 'results') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')
    } else {
        favoritesNav.classList.remove('hidden')
        resultsNav.classList.add('hidden')
    }
    loader.classList.add('hidden')
}


// Create DOM Elements
function createDOM(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
    currentArray.forEach((result) => {
        // CREATE ELEMENTS

        // Card Container
        const card = document.createElement('div')
        card.classList.add('card')

        // Link
        const link = document.createElement('a')
        link.href = result.hdurl
        link.title = 'View Full Image'
        link.target = '_blank'

        // Image
        const image = document.createElement('img')
        image.src = result.hdurl
        image.alt = 'NASA Picture of the Day'
        image.loading = 'lazy'
        image.classList.add('card-img-top')

        // Card Title
        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title')
        cardTitle.textContent = result.title

        // Card Body
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        // Card Text
        const cardText = document.createElement('p')
        cardText.textContent = result.explanation

        // Save Text
        const saveText = document.createElement('p')
        saveText.classList.add('clickable')
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites'
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`)
        } else {
            saveText.textContent = 'Remove From Favorites'
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`)
        }

        // Footer Container
        const footer = document.createElement('small')
        footer.classList.add('text-muted')

        // Date
        const date = document.createElement('strong')
        date.textContent = result.date + '  '

        // Copyright
        const copyright = document.createElement('span')
        const copyrightText = result.copyright ? `${result.copyright}` : ''
        copyright.textContent = copyrightText



        // APPEND ELEMENTS

        footer.append(date, copyright)
        cardBody.append(cardTitle, saveText, cardText, footer)
        link.appendChild(image)
        card.append(link, cardBody)
        imagesContainer.appendChild(card)
    })
}


// Update DOM Elements
function updateDOM(page) {
    storedFavs = localStorage.getItem('nasaFavorites')
    favorites = storedFavs ? JSON.parse(storedFavs) : {}
    imagesContainer.textContent = ''
    createDOM(page)
    showContent(page)
}


// Get Images from NASA API
async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden')

    try {
        const response = await fetch(apiUrl)
        resultsArray = await response.json()
        updateDOM('results')
    } catch (error) {
        // Catch error here
        console.log('Error!', error)
    }
}

// Add result to favorites
function saveFavorite(itemUrl) {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item

            // Show save confirmation for 2 seconds
            saveConfirmed.hidden = false
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000)

            // Save to localstorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
}

// Remove picture from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl]

        // Save to localstorage and update
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        updateDOM('favorites')
    }
}




// On Load
getNasaPictures()