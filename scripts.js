// Função de Login (Simples)
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validação do login
    if (username === "admin" && password === "admin123") {
        // Armazenando a sessão de login
        localStorage.setItem("loggedIn", "true");
        window.location.href = "admin.html"; // Redireciona para a área de administração após login bem-sucedido
        return false;
    } else {
        alert("Credenciais inválidas");
        return false; // impede o envio do formulário
    }
}

// Função de Adicionar Cliente (Simples)
function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photos = document.getElementById("albumPhotos").files;

    // Aqui você salvaria os dados no servidor ou banco de dados
    alert(`Cliente ${name} cadastrado com sucesso!`);

    // Simulação de salvamento: aqui você pode implementar o código para salvar no banco de dados
    const albumData = {
        name: name,
        cpf: cpf,
        photos: Array.from(photos).map(photo => URL.createObjectURL(photo)),
    };

    // Armazenando no localStorage (para testes), pode ser substituído por uma API real
    let storedAlbums = JSON.parse(localStorage.getItem("albums")) || [];
    storedAlbums.push(albumData);
    localStorage.setItem("albums", JSON.stringify(storedAlbums));

    return false; // impede o envio do formulário
}

// Função de Busca de Álbuns
function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const albums = JSON.parse(localStorage.getItem("albums")) || [];

    const results = albums.filter(album =>
        album.name.toLowerCase().includes(searchValue) || album.cpf.includes(searchValue)
    );

    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = ''; // Limpa a seção antes de mostrar os resultados

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

// Função para exibir o álbum
function viewAlbum(cpf) {
    alert(`Exibindo álbum do CPF: ${cpf}`);
}

// Simulação de verificação de login em admin.html
if (window.location.href.includes("admin.html")) {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html"; // Se não estiver logado, redireciona para a página de login
    }
}
