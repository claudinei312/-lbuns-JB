// Carregar dados ao iniciar
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("albums")) {
        localStorage.setItem("albums", JSON.stringify([]));
    }
});

// Função de busca de álbuns
function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const albums = JSON.parse(localStorage.getItem("albums")) || [];

    const results = albums.filter(album =>
        album.name.toLowerCase().includes(searchValue) || album.cpf.includes(searchValue)
    );

    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = '';

    if (results.length === 0) {
        albumsSection.innerHTML = '<p>Nenhum álbum encontrado.</p>';
        return;
    }

    results.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");
        albumDiv.innerHTML = `
            <h3>${album.name}</h3>
            <img src="${album.photo}" alt="${album.name}" />
        `;
        albumsSection.appendChild(albumDiv);
    });
}

// Login simples (apenas para fins de demonstração)
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html";
    } else {
        alert("Usuário ou senha inválidos!");
    }

    return false;
}

// Função para cadastrar novo cliente
function addClient(event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const cpf = document.getElementById("clientCPF").value.trim();
    const photoInput = document.getElementById("albumPhotos");

    if (!name || !cpf || photoInput.files.length === 0) {
        alert("Preencha todos os campos e selecione uma foto.");
        return false;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const photoData = e.target.result;

        const newAlbum = {
            name,
            cpf,
            photo: photoData
        };

        const albums = JSON.parse(localStorage.getItem("albums")) || [];
        albums.push(newAlbum);
        localStorage.setItem("albums", JSON.stringify(albums));

        alert(`Álbum de ${name} cadastrado com sucesso!`);
        document.querySelector("form").reset();
    };

    reader.readAsDataURL(photoInput.files[0]);
}
