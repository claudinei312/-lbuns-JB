const API_KEY = 'AIzaSyC-HpYzj3rGLgOB6ZFQSS_ahHQLA9hc5CU';
const FOLDER_ID = '1zPo1pHzN1yivlv15qcy0kmBql05gKp3y';

async function listSubfolders() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.files || [];
}

async function listImagesInFolder(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.files || [];
}

async function buscar() {
  const termo = document.getElementById('busca').value.toLowerCase();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = 'Carregando...';

  try {
    const subpastas = await listSubfolders();
    const pastaEncontrada = subpastas.find(p => p.name.toLowerCase().includes(termo));

    if (!pastaEncontrada) {
      resultadoDiv.innerHTML = 'Nenhuma pasta encontrada.';
      return;
    }

    const imagens = await listImagesInFolder(pastaEncontrada.id);

    if (imagens.length === 0) {
      resultadoDiv.innerHTML = 'Nenhuma imagem encontrada.';
      return;
    }

    resultadoDiv.innerHTML = `<h3>${pastaEncontrada.name}</h3>`;
    imagens.forEach(img => {
      const imgUrl = `https://drive.google.com/uc?id=${img.id}`;
      const imgElement = document.createElement('img');
      imgElement.src = imgUrl;
      imgElement.alt = img.name;
      imgElement.style = 'max-width:200px;margin:10px;';
      resultadoDiv.appendChild(imgElement);
    });
  } catch (erro) {
    console.error('Erro ao buscar fotos:', erro);
    resultadoDiv.innerHTML = 'Erro ao buscar fotos. Verifique o console para detalhes.';
  }
}

  }

  const imagens = await listImagesInFolder(pastaEncontrada.id);

  if (imagens.length === 0) {
    resultadoDiv.innerHTML = 'Nenhuma imagem encontrada.';
    return;
  }

  resultadoDiv.innerHTML = `<h3>${pastaEncontrada.name}</h3>`;
  imagens.forEach(img => {
    const imgUrl = `https://drive.google.com/uc?id=${img.id}`;
    const imgElement = document.createElement('img');
    imgElement.src = imgUrl;
    imgElement.alt = img.name;
    imgElement.style = 'max-width:200px;margin:10px;';
    resultadoDiv.appendChild(imgElement);
  });
}
