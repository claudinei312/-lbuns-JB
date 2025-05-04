// Função para verificar o código de acesso e redirecionar para o painel
function accessAdminPanel() {
    const code = document.getElementById("code").value;
    
    // Verificar se o código é o correto
    if (code === "1811") {
        window.location.href = "admin.html"; // Redireciona para o painel
    } else {
        alert("Código inválido. Tente novamente.");
    }
}

// Função de busca por nome ou CPF
function search() {
    const searchQuery = document.getElementById("search-input").value;

    // Aqui você pode integrar a busca com o Supabase ou outras fontes de dados.
    // Por enquanto, vamos apenas simular uma busca simples:

    if (searchQuery.trim() !== "") {
        // Simulação de resultados encontrados
        const results = [
            { name: "João Silva", cpf: "123.456.789-00" },
            { name: "Maria Oliveira", cpf: "987.654.321-00" }
        ];

        let resultHTML = "";
        results.forEach(person => {
            resultHTML += `
                <div class="result">
                    <p><strong>${person.name}</strong></p>
                    <p>CPF: ${person.cpf}</p>
                    <button onclick="viewPhotos('${person.name}')">Ver Fotos</button>
                </div>
            `;
        });

        document.getElementById("results").innerHTML = resultHTML;
    } else {
        alert("Por favor, insira um nome ou CPF.");
    }
}

// Função para exibir as fotos (simulação)
function viewPhotos(name) {
    // Aqui você integraria a exibição das fotos do Supabase
    alert(`Exibindo fotos de ${name}`);
}

// Função para registrar a compra
function registerPurchase(personName, albumType) {
    const formData = {
        name: personName,
        album: albumType,
        date: new Date().toISOString(),
    };

    // Aqui você deve gravar as informações no Supabase ou outro backend
    console.log("Dados de compra registrados: ", formData);

    // Exibir a confirmação de compra
    alert(`Compra registrada com sucesso para ${personName}. Tipo de álbum: ${albumType}`);
}

// Função para cadastrar fotos no Supabase
function uploadPhotos(files) {
    // Aqui você faria o upload das fotos para o Supabase
    console.log("Fotos carregadas com sucesso!");

    // Simulação de envio
    alert(`Fotos enviadas com sucesso!`);
}

// Função de visualização de múltiplas fotos e botão de compra
function showAlbumOptions(personName) {
    const optionsHTML = `
        <div class="album-options">
            <h3>Escolha o tipo de álbum para ${personName}</h3>
            <button onclick="registerPurchase('${personName}', 'Digital')">Comprar Álbum Digital - R$250</button>
            <button onclick="registerPurchase('${personName}', 'Físico')">Comprar Álbum Físico - R$330</button>
            <button onclick="registerPurchase('${personName}', 'Ambos')">Comprar Álbum Digital e Físico - R$470</button>
        </div>
    `;
    document.getElementById("results").innerHTML = optionsHTML;
}

// Exemplo de chamada para exibição de fotos (esta função deve ser conectada ao Supabase para exibir as fotos reais)
function displayPhotosForPerson(personName) {
    alert(`Exibindo fotos de ${personName}`);
}
