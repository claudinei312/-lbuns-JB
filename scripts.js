let albumData = [];

function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photosInput = document.getElementById("albumPhotos").value;

    const photos = photosInput.split(',').map(photo => photo.trim());

    albumData.push({ name, cpf, photos });
    alert("Cliente adicionado com sucesso!");
    document.querySelector("form").reset();
    return false;
}

function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = '';

    const results = albumData.filter(album =>
        album.name.toLowerCase().includes(searchValue) ||
        album.cpf.includes(searchValue)
    );

    if (results.length === 0) {
        albumsSection.innerHTML = "<p>Nenhum álbum encontrado.</p>";
        return;
    }

    results.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");
        albumDiv.innerHTML = `
            <h3>${album.name}</h3>
            ${album.photos.map(photo => `<img src="${photo}" alt="${album.name}" width="100">`).join('')}
        `;
        albumsSection.appendChild(albumDiv);
    });
