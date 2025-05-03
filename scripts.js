// Função de login
function loginUser() {
    // Obter os valores inseridos
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Usuário e senha pré-definidos
    const validUsername = "admin";
    const validPassword = "admin123";

    // Verificação
    if (username === validUsername && password === validPassword) {
        // Redirecionar para o painel de administração
        window.location.href = "admin.html"; // Certifique-se de ter a página admin.html
        return false;
    } else {
        alert("Credenciais inválidas");
        return false;
    }
}

// Função de busca de álbuns
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

// Função de visualização do álbum
function viewAlbum(cpf) {
    const albums = [
        { name: "João Silva", cpf: "12345678901", photos: ["photo1.jpg", "photo2.jpg"] },
        { name: "Maria Oliveira", cpf: "98765432100", photos: ["photo3.jpg", "photo4.jpg"] }
    ];

    const album = albums.find(a => a.cpf === cpf);
    if (album) {
        alert(`Álbum de ${album.name} com as fotos: ${album.photos.join(', ')}`);
    } else {
        alert("Álbum não encontrado.");
    }
}

// Função para cadastrar cliente no painel de administração
function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photos = document.getElementById("albumPhotos").files;

    // Aqui você salvaria os dados no servidor ou banco de dados
    alert(`Cliente ${name} cadastrado com sucesso!`);

    // Limpar os campos do formulário
    document.getElementById("clientName").value = "";
    document.getElementById("clientCPF").value = "";
    document.getElementById("albumPhotos").value = "";

    return false;
}
