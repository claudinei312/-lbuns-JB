// Função de Login
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verificando as credenciais
    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html"; // Redireciona para a página de administração
        return false;
    } else {
        alert("Credenciais inválidas"); // Exibe erro se as credenciais forem inválidas
        return false;
    }
}

// Função de Busca de Álbuns
function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const albums = [
        { name: "João Silva", cpf: "12345678901", photos: ["photo1.jpg", "photo2.jpg"] },
        { name: "Maria Oliveira", cpf: "98765432100", photos: ["photo3.jpg", "photo4.jpg"] }
    ];

    // Filtrando os álbuns que correspondem à busca
    const results = albums.filter(album => 
        album.name.toLowerCase().includes(searchValue) || album.cpf.includes(searchValue)
    );

    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = ''; // Limpa o conteúdo anterior

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

// Função para visualizar o álbum
function viewAlbum(cpf) {
    alert("Visualizando álbum do CPF: " + cpf);
}

// Função de Adicionar Cliente
function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photos = document.getElementById("albumPhotos").files;

    // Aqui você poderia salvar os dados no banco de dados ou localStorage
    alert(`Cliente ${name} cadastrado com sucesso!`);

    // Limpa o formulário
    document.getElementById("clientName").value = "";
    document.getElementById("clientCPF").value = "";
    document.getElementById("albumPhotos").value = "";

    return false;
}
