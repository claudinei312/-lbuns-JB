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
    const albums = JSON.parse(localStorage.getItem("albums")) || []; // Recupera os álbuns do localStorage

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
            <img src="${album.photo}" alt="${album.name}" width="100" />
            <button onclick="viewAlbum('${album.cpf}')">Ver Álbum</button>
        `;
        albumsSection.appendChild(albumDiv);
    });
}

// Função de visualização do álbum
function viewAlbum(cpf) {
    const albums = JSON.parse(localStorage.getItem("albums")) || []; // Recupera os álbuns do localStorage
    const album = albums.find(a => a.cpf === cpf);

    if (album) {
        alert(`Álbum de ${album.name} com a foto: ${album.photo}`);
    } else {
        alert("Álbum não encontrado.");
    }
}

// Função para cadastrar cliente no painel de administração
function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photo = document.getElementById("albumPhotos").files[0]; // Pega o arquivo de foto

    // Verifica se a foto foi selecionada
    if (!photo) {
        alert("Por favor, selecione uma foto.");
        return;
    }

    // Cria uma URL para a foto usando FileReader
    const reader = new FileReader();
    reader.onloadend = function () {
        const photoUrl = reader.result;

        // Recupera os álbuns existentes ou cria um novo array
        const albums = JSON.parse(localStorage.getItem("albums")) || [];
        
        // Adiciona o novo álbum
        albums.push({ name, cpf, photo: photoUrl });

        // Salva os álbuns no localStorage
        localStorage.setItem("albums", JSON.stringify(albums));

        alert(`Cliente ${name} cadastrado com sucesso!`);

        // Limpar os campos do formulário
        document.getElementById("clientName").value = "";
        document.getElementById("clientCPF").value = "";
        document.getElementById("albumPhotos").value = "";

        return false;
    };
    reader.readAsDataURL(photo); // Converte a foto para uma URL de base64
}
