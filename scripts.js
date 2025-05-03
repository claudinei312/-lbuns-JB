let albumData = [];

function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const results = albumData.filter(album =>
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

    }
}

function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photoFiles = document.getElementById("albumPhotos").files;

    const photos = [];

    for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const url = URL.createObjectURL(file);
        photos.push(url);
    }

    const newClient = { name, cpf, photos };
    albumData.push(newClient);

    alert(`Cliente ${name} cadastrado com sucesso!`);
    updateClientList();
    return false;
}

}

function updateClientList() {
    const list = document.getElementById("orderList");
    list.innerHTML = '';
    albumData.sort((a, b) => a.name.localeCompare(b.name));

    albumData.forEach(client => {
        const item = document.createElement("li");
        item.textContent = `${client.name} - CPF: ${client.cpf}`;
        list.appendChild(item);
    });
}

function viewAlbum(cpf) {
    alert(`Exibindo álbum do CPF: ${cpf}`);
}
