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
        // Verifica se a URL da foto foi encontrada
        const imageUrl = album.photo;
        if (imageUrl) {
            // Exibe a foto em um formato de popup ou nova janela
            const imgWindow = window.open("", "_blank");
            imgWindow.document.write(`<img src="${imageUrl}" alt="${album.name}" style="width:100%; height:auto;">`);
        } else {
            alert("Foto não encontrada.");
        }
    } else {
        alert("Álbum não encontrado.");
    }
}

// Função de login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Defina as credenciais válidas para login (esses valores são apenas de exemplo)
    const validEmail = "admin@admin.com";
    const validPassword = "senha123";

    if (email === validEmail && password === validPassword) {
        // Se o login for bem-sucedido, redireciona para o painel de administração
        window.location.href = "admin.html";  // Direciona para a página de administração
    } else {
        alert("Email ou senha incorretos. Tente novamente.");
    }
}

// Função de cadastro de cliente (continua a mesma do exemplo anterior)
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

}
