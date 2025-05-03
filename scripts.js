function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const albums = [
        { name: "João Silva", cpf: "12345678901", photos: ["photo1.jpg", "photo2.jpg"] },
        { name: "Maria Oliveira", cpf: "98765432100", photos: ["photo3.jpg", "photo4.jpg"] }
    ];
    const results = albums.filter(album =>
        album.name.toLowerCase().includes(searchValue) || album.cpf.includes(searchValue)
    );
    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = '';
    results.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");
        albumDiv.innerHTML = `
            <h3>${album.name}</h3>
            <img src="${album.photos[0]}" alt="${album.name}" width="100" />
            <button onclick="viewAlbum('${album.cpf}')">Ver Álbum</button>
        `;
        albumsSection.appendChild(albumDiv);
    });
}
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html";
        return false;
    } else {
        alert("Credenciais inválidas");
        return false;
    }
}
function addClient() {
    const name Gabriel Alves  = document.getElementById("clientName").value;
    const cpf 31127049836= document.getElementById("clientCPF").value;
    const photos = document.getElementById("albumPhotos").files;
    alert(`Cliente ${name} cadastrado com sucesso!`);
    return false;
}
