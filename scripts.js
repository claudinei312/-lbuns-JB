const apiKey = "AIzaSyC-HpYzj3rGLgOB6ZFQSS_ahHQLA9hc5CU";
const folderId = "1zPo1pHzN1yivlv15qcy0kmBql05gKp3y";

document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  if (searchValue.length >= 3) {
    listFolderContents(folderId, searchValue);
  } else {
    document.getElementById("gallery").innerHTML = "";
  }
});

function listFolderContents(folderId, searchTerm) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const folders = data.files;
      const matchedFolder = folders.find((folder) =>
        folder.name.toLowerCase().includes(searchTerm)
      );

      if (matchedFolder) {
        fetchImagesFromFolder(matchedFolder.id);
      } else {
        document.getElementById("gallery").innerHTML = "<p>Nenhuma pasta encontrada.</p>";
      }
    })
    .catch((error) => {
      console.error("Erro ao listar pastas:", error);
    });
}

function fetchImagesFromFolder(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType='image/jpeg'+or+mimeType='image/png')&fields=files(id,name)&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const images = data.files;
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = "";

      if (images.length === 0) {
        gallery.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
        return;
      }

      images.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = `https://drive.google.com/uc?export=view&id=${image.id}`;
        imgElement.alt = image.name;
        gallery.appendChild(imgElement);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar imagens:", error);
    });
}
