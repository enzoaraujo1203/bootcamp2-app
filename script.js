// Dicionário para mapear códigos de tempo da Open-Meteo para textos legíveis
const condicoesTempo = {
  0: "Céu limpo ☀️",
  1: "Predominantemente limpo 🌤️",
  2: "Parcialmente nublado ⛅",
  3: "Nublado ☁️",
  45: "Nevoeiro 🌫️",
  48: "Nevoeiro com geada 🌫️",
  51: "Garoa leve 🌧️",
  53: "Garoa moderada 🌧️",
  55: "Garoa densa 🌧️",
  61: "Chuva leve 🌧️",
  63: "Chuva moderada 🌧️",
  65: "Chuva forte 🌧️",
  80: "Pancadas de chuva 🌦️",
  95: "Tempestade ⛈️"
};

async function buscarClima(cidade) {
  const areaResultado = document.getElementById("resultado");
  areaResultado.classList.remove("hidden");
  areaResultado.innerHTML = "<p>Buscando informações do clima...</p>";

  try {
    // 1. Consulta a API de Geocodificação para obter latitude e longitude
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt`;
    const resGeo = await fetch(urlGeo);
    
    if (!resGeo.ok) throw new Error("Erro ao conectar à API de busca.");
    
    const dadosGeo = await resGeo.json();

    if (!dadosGeo.results || dadosGeo.results.length === 0) {
      throw new Error("Cidade não encontrada. Verifique o nome e tente novamente.");
    }

    const { latitude, longitude, name, country, admin1 } = dadosGeo.results[0];

    // 2. Consulta a API do Clima
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const resClima = await fetch(urlClima);

    if (!resClima.ok) throw new Error("Erro ao obter dados do clima.");

    const dadosClima = await resClima.json();
    const climaAtual = dadosClima.current_weather;

    // Tradução do código da condição
    const condicaoTexto = condicoesTempo[climaAtual.weathercode] || "Condição desconhecida";

    // Exibição dos dados (Local, Temperatura, Condição e Vento - 4 informações)
    areaResultado.innerHTML = `
      <h2>${name}${admin1 ? `, ${admin1}` : ""} - ${country}</h2>
      <div class="temperatura">${climaAtual.temperature} °C</div>
      <p class="info"><strong>Condição:</strong> ${condicaoTexto}</p>
      <p class="info"><strong>Velocidade do Vento:</strong> ${climaAtual.windspeed} km/h</p>
    `;

  } catch (erro) {
    areaResultado.innerHTML = `<p class="mensagem-erro">Ops! ${erro.message}</p>`;
  }
}

// Evento do botão de busca
document.getElementById("botao-buscar").addEventListener("click", () => {
  const termo = document.getElementById("campo-busca").value.trim();
  if (termo) {
    buscarClima(termo);
  }
});

// Permitir busca pressionando a tecla 'Enter'
document.getElementById("campo-busca").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const termo = e.target.value.trim();
    if (termo) buscarClima(termo);
  }
});