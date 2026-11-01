const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const resultado = document.getElementById("resultado");
const listaFavoritos = document.getElementById("lista-favoritos");

// Recupera a lista de favoritos do armazenamento local
let favoritos = JSON.parse(localStorage.getItem("cidades_favoritas")) || [];
atualizarListaFavoritos();

// Mapeamento dos códigos meteorológicos WMO
function obterDescricaoClima(code) {
  const codigos = {
    0: "☀️ Céu limpo",
    1: "🌤️ Predominantemente limpo",
    2: "⛅ Parcialmente nublado",
    3: "☁️ Ensolarado a encoberto",
    45: "🌫️ Nevoeiro",
    48: "🌫️ Nevoeiro com geada",
    51: "🌧️ Garoa leve",
    53: "🌧️ Garoa moderada",
    55: "🌧️ Garoa densa",
    61: "☔ Chuva fraca",
    63: "☔ Chuva moderada",
    65: "☔ Chuva forte",
    80: "🌦️ Pancadas de chuva leves",
    81: "🌦️ Pancadas de chuva moderadas",
    82: "⛈️ Pancadas de chuva violentas",
    95: "⛈️ Tempestade"
  };
  return codigos[code] || "🌡️ Condição variável";
}

async function buscarClima(cidade) {
  resultado.classList.remove("hidden");
  resultado.innerHTML = "<p>Buscando dados meteorológicos...</p>";

  try {
    // 1. Busca latitude e longitude do nome da cidade (Geocoding API)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt`;
    const geoRes = await fetch(geoUrl);
    
    if (!geoRes.ok) throw new Error("Erro de conexão ao pesquisar a localidade.");
    
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultado.innerHTML = "<p>⚠️ Cidade não encontrada. Verifique a grafia e tente novamente.</p>";
      return;
    }

    const local = geoData.results[0];
    const { latitude, longitude, name, country, admin1 } = local;

    // 2. Busca previsão do tempo atual
    const climaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    const climaRes = await fetch(climaUrl);

    if (!climaRes.ok) throw new Error("Erro ao consultar a API de clima.");

    const climaData = await climaRes.json();
    const atual = climaData.current;

    const localTexto = `${name}${admin1 ? ', ' + admin1 : ''} (${country || ''})`;
    const condicaoTexto = obterDescricaoClima(atual.weather_code);

    // Renderiza na tela (Temperatura, Umidade, Vento e Condição)
    resultado.innerHTML = `
      <h2>${localTexto}</h2>
      <p class="clima-condicao"><strong>Condição:</strong> ${condicaoTexto}</p>
      <div class="clima-detalhes">
        <p><strong>🌡️ Temperatura:</strong> ${atual.temperature_2m} °C</p>
        <p><strong>💧 Umidade relativa:</strong> ${atual.relative_humidity_2m}%</p>
        <p><strong>💨 Vento:</strong> ${atual.wind_speed_10m} km/h</p>
      </div>
      <button onclick="salvarFavorito('${name}')" class="btn-fav">⭐ Salvar nos Favoritos</button>
    `;
  } catch (erro) {
    resultado.innerHTML = `<p>❌ Erro: ${erro.message || "Não foi possível carregar as informações."}</p>`;
  }
}

// Gerenciamento de favoritos no localStorage
function salvarFavorito(nomeCidade) {
  if (!favoritos.includes(nomeCidade)) {
    favoritos.push(nomeCidade);
    localStorage.setItem("cidades_favoritas", JSON.stringify(favoritos));
    atualizarListaFavoritos();
  }
}

function removerFavorito(nomeCidade) {
  favoritos = favoritos.filter(c => c !== nomeCidade);
  localStorage.setItem("cidades_favoritas", JSON.stringify(favoritos));
  atualizarListaFavoritos();
}

function atualizarListaFavoritos() {
  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "<li>Nenhuma cidade favoritada ainda.</li>";
    return;
  }

  listaFavoritos.innerHTML = favoritos
    .map(cidade => `
      <li>
        <span onclick="buscarClima('${cidade}')" class="fav-item">${cidade}</span>
        <button onclick="removerFavorito('${cidade}')" class="btn-remove">🗑️</button>
      </li>
    `)
    .join("");
}

// Event Listeners
botaoBuscar.addEventListener("click", () => {
  const cidade = campoBusca.value.trim();
  if (cidade) buscarClima(cidade);
});

campoBusca.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const cidade = campoBusca.value.trim();
    if (cidade) buscarClima(cidade);
  }
});