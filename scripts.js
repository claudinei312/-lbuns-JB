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

// LOGIN
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // Verifica se as credenciais estão corretas
  if (email === "admin@admin.com" && senha === "senha123") {
    window.location.href = "painel.html";
  } else {
    alert("E-mail ou senha inválidos.");
  }
});

    }
}

// CADASTRAR CLIENTE COM FOTO
function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photoInput = document.getElementById("albumPhotos");

    if (!name || !cpf || !photoInput.files.length) {
        alert("Preencha todos os campos e selecione uma foto.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const photoData = reader.result;

        const existing = JSON.parse(localStorage.getItem("albums")) || [];
        existing.push({ name, cpf, photo: photoData });
        localStorage.setItem("albums", JSON.stringify(existing));

        alert("Cadastro realizado com sucesso!");

        document.getElementById("clientName").value = "";
        document.getElementById("clientCPF").value = "";
        document.getElementById("albumPhotos").value = "";
    };
    reader.readAsDataURL(photoInput.files[0]);
}

// BUSCAR CLIENTE
function searchClient() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const resultArea = document.getElementById("resultArea");
    resultArea.innerHTML = "";

    const albums = JSON.parse(localStorage.getItem("albums")) || [];

    const filtered = albums.filter(entry =>
        entry.name.toLowerCase().includes(searchInput) ||
        entry.cpf.toLowerCase().includes(searchInput)
    );

    if (filtered.length === 0) {
        resultArea.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    filtered.forEach(entry => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>Nome:</strong> ${entry.name}</p>
            <p><strong>CPF:</strong> ${entry.cpf}</p>
            <img src="${entry.photo}" alt="Foto de ${entry.name}" width="200" />
            <hr>
        `;
        resultArea.appendChild(div);
    });
}

}

}
