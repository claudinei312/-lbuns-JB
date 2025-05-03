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
    const photoFile = document.getElementById("albumPhotos").files[0];

    if (!photoFile) {
        alert("Por favor, selecione uma foto.");
        return false;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Photo = e.target.result;

        const albumData = {
            name: name,
            cpf: cpf,
            photo: base64Photo
        };

        let storedAlbums = JSON.parse(localStorage.getItem("albums")) || [];
        storedAlbums.push(albumData);
        localStorage.setItem("albums", JSON.stringify(storedAlbums));

        alert(`Cliente ${name} cadastrado com sucesso!`);
    };

    reader.readAsDataURL(photoFile);
    return false; // evita reload da página
}

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

// Verificar login na página inicial (index.html) e mostrar o link para o painel de administração se logado
if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("adminLink").style.display = "inline"; // Mostrar link de admin
}
