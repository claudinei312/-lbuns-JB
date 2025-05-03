// Simulação de armazenamento de dados em um array
let clients = [];

// Função para adicionar um novo cliente (formando)
function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photos = document.getElementById("albumPhotos").files;

    // Verificando se os campos estão preenchidos corretamente
    if (!name || !cpf || photos.length === 0) {
        alert("Por favor, preencha todos os campos corretamente!");
        return false;
    }

    // Adicionando o cliente no array de clientes
    const client = {
        name: name,
        cpf: cpf,
        photos: Array.from(photos).map(photo => URL.createObjectURL(photo))
    };

    // Armazenando o cliente na lista
    clients.push(client);

    alert(`Cliente ${name} cadastrado com sucesso!`);

    // Limpar os campos após o cadastro
    document.getElementById("clientName").value = "";
    document.getElementById("clientCPF").value = "";
    document.getElementById("albumPhotos").value = "";

    // Atualizar a lista de pedidos de álbuns
    updateOrderList();

    return false; // Impedir o envio do formulário e recarregamento da página
}

// Função para atualizar a lista de pedidos de álbuns
function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = ""; // Limpar lista atual

    clients.forEach(client => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${client.name}</strong> (CPF: ${client.cpf})
            <br>
            <img src="${client.photos[0]}" alt="${client.name}" width="100" />
        `;
        orderList.appendChild(listItem);
    });
}

// Função de busca por nome ou CPF na página inicial
function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const results = clients.filter(client => 
        client.name.toLowerCase().includes(searchValue) || client.cpf.includes(searchValue)
    );

    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = ''; // Limpar resultados anteriores

    results.forEach(client => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");
        albumDiv.innerHTML = `
            <h3>${client.name}</h3>
            <p>CPF: ${client.cpf}</p>
            <img src="${client.photos[0]}" alt="${client.name}" width="100" />
        `;
        albumsSection.appendChild(albumDiv);
    });
}

// Função para visualização do álbum (exemplo simples)
function viewAlbum(cpf) {
    alert("Mostrando álbum para CPF: " + cpf);
}
