// Função de Login
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html"; // Redireciona para a página de administração
        return false;
    } else {
        alert("Credenciais inválidas");
        return false;
    }
}

// Função de Busca de Álbuns
function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    
    // Recupera os álbuns salvos no localStorage
    const albums = JSON.parse(localStorage.getItem("albums")) || [];

    // Filtra os álbuns que correspondem à busca
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

    // Verifica se há fotos
    if (photos.length === 0) {
        alert("Por favor, adicione fotos!");
        return false;
    }

    // Converte as fotos para URLs (como exemplo)
    const photosArray = [];
    for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const reader = new FileReader();

        reader.onloadend = function() {
            // Adiciona a foto à lista de fotos do álbum
            photosArray.push(reader.result);

            // Salva o álbum no localStorage
            const album = {
                name: name,
                cpf: cpf,
                photos: photosArray
            };

            let albums = JSON.parse(localStorage.getItem("albums")) || [];
            albums.push(album);
            localStorage.setItem("albums", JSON.stringify(albums));

            alert(`Cliente ${name} cadastrado com sucesso!`);

            // Limpa o formulário
            document.getElementById("clientName").value = "";
            document.getElementById("clientCPF").value = "";
            document.getElementById("albumPhotos").value = "";
        };

        reader.readAsDataURL(file); // Lê a foto como URL
    }

    return false;
}
