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
