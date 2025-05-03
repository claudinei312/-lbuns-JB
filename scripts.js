// Salvar novo cliente e fotos
function addClient() {
    const name = document.getElementById("clientName").value.trim();
    const cpf = document.getElementById("clientCPF").value.trim();
    const photoFiles = document.getElementById("albumPhotos").files;

    if (!name || !cpf || photoFiles.length === 0) {
        alert("Preencha todos os campos e adicione pelo menos uma foto.");
        return false;
    }

    const readerPromises = Array.from(photoFiles).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readerPromises).then(base64Photos => {
        const newClient = {
            name,
            cpf,
            photos: base64Photos
        };

        const existingClients = JSON.parse(localStorage.getItem("clients") || "[]");
        existingClients.push(newClient);
        localStorage.setItem("clients", JSON.stringify(existingClients));

        alert(`Cliente ${name} cadastrado com sucesso!`);
        document.querySelector("form").reset();
    });

    return false;
}

// Buscar álbum por nome ou CPF
function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");

    const results = clients.filter(client =>
        client.name.toLowerCase().includes(searchValue) ||
        client.cpf.includes(searchValue)
    );

    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = '';

    if (results.length === 0) {
        albumsSection.innerHTML = '<p>Nenhum álbum encontrado.</p>';
        return;
    }

    results.forEach(client => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");
        albumDiv.innerHTML = `<h3>${client.name}</h3>`;

        client.photos.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo;
            img.alt = client.name;
            img.width = 100;
            albumDiv.appendChild(img);
        });

        albumsSection.appendChild(albumDiv);
    });
}

// Login básico
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
