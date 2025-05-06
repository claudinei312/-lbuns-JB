// Substitua com sua chave de API e ID da pasta do Google Drive
const API_KEY = 'AIzaSyC-HpYzj3rGLgOB6ZFQSS_ahHQLA9hc5CU';  // Sua chave API
const FOLDER_ID = '1zPo1pHzN1yivlv15qcy0kmBql05gKp3y';  // O ID da sua pasta no Google Drive

const API_URL = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}`;

const searchAlbum = () => {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    if (!searchQuery) {
        alert('Por favor, insira um nome para buscar!');
        return;
    }

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const albums = data.files;
            const filteredAlbums = albums.filter(album => album.name.toLowerCase().includes(searchQuery));

            const albumsContainer = document.getElementById('albums-container');
            albumsContainer.innerHTML = ''; // Limpa os resultados anteriores

            if (filteredAlbums.length === 0) {
                albumsContainer.innerHTML = '<p>Nenhum álbum encontrado.</p>';
            } else {
                filteredAlbums.forEach(album => {
                    const albumElement = document.createElement('div');
                    albumElement.classList.add('album');
                    albumElement.innerHTML = `
                        <h3>${album.name}</h3>
                        <img src="https://drive.google.com/uc?id=${album.id}" alt="${album.name}" />
                    `;
                    albumsContainer.appendChild(albumElement);
                });
            }
        })
        .catch(error => console.error('Erro ao buscar dados: ', error));
};
