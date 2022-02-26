const API = "https://api.lyrics.ovh";

const lyricForm = document.getElementById("lyric-form");
const searchInput = document.getElementById("search-input");
const content = document.getElementById("lyrics");
const lyricsSection = document.getElementById("response");

const error = document.getElementById("error");


lyricForm.addEventListener("submit", (e) => {
    e.preventDefault();

    content.classList.replace('show', 'hidden');
    lyricsSection.innerHTML = '';
    error.textContent = '';

    const searchTerm = searchInput.value.trim();

    requestSearch(`${API}/suggest/${searchTerm}`)
        .then(response => {
            if (response.total != 0) {
                content.classList.replace('hidden','show');
                showResponse(response.data);
            } else {
                showError("Search Error");
            }
        })
        .catch(err => showError(err.message));
});

content.addEventListener("click", (e) => {
    let target = e.target;
    if(target.id == 'show-lyric'){
        const songTitle = target.dataset.title;
        const artist = target.dataset.artist;

        requestSearch(`${API}/v1/${artist}/${songTitle}`)
            .then(lyric => {
                showLyric(lyric.lyrics, songTitle, artist);
            })
            .catch(() => showError("The song has no lyrics"));
    }
})


const requestSearch = async (url) => {
    return await (await fetch(url)).json();
}


const showResponse = (response) => {
    response.forEach(song => {
        createSongItem(song);
    })
}

const showLyric = (lyric, title, artist) => {
    const songTitle = document.createElement("h2");
    songTitle.innerHTML = `${title} <i>by</i> <a href="#" class="artist-link">${artist}</a>`;
    songTitle.classList.add("song-title");

    const songLyric = document.createElement("p");
    songLyric.innerHTML = lyric.replace(/(\r\n|\n|\r)/g, '<br>');
    songLyric.classList.add("song-lyric");

    lyricsSection.innerHTML = '';
    lyricsSection.appendChild(songTitle);
    lyricsSection.appendChild(songLyric);
}

const createSongItem = (song) => {
    const newSong = document.createElement("div");
    newSong.classList.add("song");
    newSong.innerHTML = `<img src="${song.album.cover_small}" alt="image" class="album-image">
    <li class="song-name">${song.title} - <a href="#" class="artist-link">${song.artist.name}</a></li>
    <button id="show-lyric" class="button" data-title="${song.title}" data-artist="${song.artist.name}">Lyric</button>`;

    lyricsSection.appendChild(newSong);
}

const showError = (typeError) => {
    error.textContent = `${typeError}`;
}

