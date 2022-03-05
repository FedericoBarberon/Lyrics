const API = "https://api.lyrics.ovh";

const search = document.getElementById("search-input");
const form = document.getElementById("lyric-form");
const content = document.getElementById("content");
const lyricsSection = document.getElementById("lyrics-section");
const nav = document.getElementById("nav");
const next = document.getElementById("next")
const prev = document.getElementById("prev")
const error = document.getElementById("error");
let actualSearch;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();
    content.classList.replace("show","hidden");
    nav.classList.replace("show","hidden");

    if (!searchTerm) {
        alert("You must type a valid search term");
        return;
    }

    searchSongs(searchTerm);
})

const searchSongs = async (search) => {    
    error.textContent = '';

    fetch(`${API}/suggest/${search}`)
        .then(res => res.json())
        .then(res => res.total != 0? Promise.resolve(res):Promise.reject("Search Error"))
        .then(response => {
            const data = response.data;
            checkNav(response.next,response.prev);
            showSongs(data);
        })
        .catch(showError);
}

const showSongs = (songs) => {
    content.classList.replace("hidden", "show");
    nav.classList.replace("hidden","show");
    actualSearch = `
        <ul class="songs">
            ${songs.map(song => {
                return `<li class="song" data-title="${song.title}" data-artist="${song.artist.name}">
                    <img src="${song.album.cover_small}" class="album-image"></img>
                    <span class="song-data">${song.title} - <a href="#" class="artist-link">${song.artist.name} </a></span>
                    <button class="button enable" id="show-lyric">Lyric</button>
                </li>`
            }).join('')}
        </ul>
    `;
    lyricsSection.innerHTML = actualSearch;
}

content.addEventListener("click", (ev) => {
    const target = ev.target;

    if(target.id == 'show-lyric'){
        const songArtist = target.parentElement.dataset.artist;
        const songTitle = target.parentElement.dataset.title;
        
        searchLyric(songArtist,songTitle);
    }
    else if(target.id == 'back'){
        nav.classList.replace("hidden","show");
        lyricsSection.innerHTML = actualSearch;
    }
})

const searchLyric = (artist,title) => {
    error.textContent = '';

    fetch(`${API}/v1/${artist}/${title}`)
        .then(res => res.json())
        .then(res => res.error? Promise.reject("The song has no lyrics"):Promise.resolve(res))
        .then(response => {
            const lyric = response.lyrics.replace(/[\r\n|\n|\r]/g, '<br>');
        
            showLyric(lyric, title, artist);
        })
        .catch(showError);

}

const showLyric = (lyric,title,artist) => {
    nav.classList.replace("show","hidden");
    lyricsSection.innerHTML = `
        <span class="lyric-data">${title} <i>by</i> <a href="#" class="artist-link">${artist}</a></span>
        <button class="button enable back" id="back">Back</button>

        <p class="lyric">${lyric}</p>
    `;
}

const showError = (err) => {
    error.textContent = err;
}

const checkNav = (nextUrl, prevUrl) => {
    if(nextUrl) {
        next.classList.replace("disable","enable");

        next.addEventListener("click", () => {
            searchNext(nextUrl);
        })
    } else {
        next.classList.replace("enable","disable");
    }

    if(prevUrl) {
        prev.classList.replace("disable","enable");
    } else {
        prev.classList.replace("enable","disable");
    }
}

const searchNext = (url) => {
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(res => console.log(res))
}