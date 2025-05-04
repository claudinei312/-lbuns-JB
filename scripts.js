function saveData() {
  const name = document.getElementById("name").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const photoInput = document.getElementById("photo");

  if (!name || !cpf || !photoInput.files.length) {
    alert("Preencha todos os campos!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const photoData = reader.result;
    const entry = { name, cpf, photo: photoData };
    let records = JSON.parse(localStorage.getItem("formandos")) || [];
    records.push(entry);
    localStorage.setItem("formandos", JSON.stringify(records));
    alert("Cadastro salvo!");
    document.getElementById("name").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("photo").value = "";
  };
  reader.readAsDataURL(photoInput.files[0]);
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.trim().toLowerCase();
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
      const records = JSON.parse(localStorage.getItem("formandos")) || [];
      const filtered = records.filter(f =>
        f.name.toLowerCase().includes(query) || f.cpf.includes(query)
      );
      filtered.forEach(f => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${f.name}</strong><br>CPF: ${f.cpf}<br><img src="${f.photo}" alt="Foto de ${f.name}">`;
        resultsDiv.appendChild(div);
      });
    });
  }
});
