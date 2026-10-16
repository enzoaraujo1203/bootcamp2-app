// Configuração do Supabase
const SUPABASE_URL = "https://bwmkvatrqltdhfsjjeem.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_gCkGXeXh_6gZEsWH2vtf8Q_-fTiGJLf";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// CRUD SUPABASE: Create
async function salvarFavorito(nomeCidade, detalhesClima) {
  const { error } = await supabaseClient
    .from("favoritos")
    .insert({ nome_item: nomeCidade, dados_extra: detalhesClima });

  if (error) {
    console.error("Erro ao salvar favorito:", error);
    alert("Erro ao salvar nos favoritos.");
  } else {
    listarFavoritos();
  }
}

// CRUD SUPABASE: Read
async function listarFavoritos() {
  const listaElemento = document.getElementById("lista-favoritos");
  listaElemento.innerHTML = "<li>Carregando favoritos...</li>";

  const { data, error } = await supabaseClient
    .from("favoritos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar favoritos:", error);
    listaElemento.innerHTML = "<li class='mensagem-erro'>Erro ao carregar favoritos.</li>";
    return;
  }

  if (!data || data.length === 0) {
    listaElemento.innerHTML = "<li>Nenhuma cidade favorita salva.</li>";
    return;
  }

  listaElemento.innerHTML = "";
  data.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${item.nome_item}</strong> (${item.dados_extra})</span>
      <button class="btn-remover" onclick="removerFavorito(${item.id})">Excluir</button>
    `;
    listaElemento.appendChild(li);
  });
}

// CRUD SUPABASE: Delete
async function removerFavorito(id) {
  const { error } = await supabaseClient
    .from("favoritos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao remover favorito:", error);
    alert("Erro ao remover dos favoritos.");
  } else {
    listarFavoritos();
  }
}

// Consumo da API Open-Meteo
async function buscarClima(cidade) {
  const areaResultado = document.getElementById("resultado");
  areaResultado.classList.remove("hidden");
  areaResultado.innerHTML = "<p>Buscando informações do clima...</p>";

  try {
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt`;
    const resGeo = await fetch(urlGeo);
    if (!resGeo.ok) throw new Error("Erro ao buscar coordenadas da cidade.");

    const dadosGeo = await resGeo.json();
    if (!dadosGeo.results || dadosGeo.results.length === 0) {
      throw new Error("Cidade não encontrada. Verifique o nome e tente novamente.");
    }

    const { latitude, longitude, name, country, admin1 } = dadosGeo.results[0];

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const resClima = await fetch(urlClima);
    if (!resClima.ok) throw new Error("Erro ao obter dados meteorológicos.");

    const dadosClima = await resClima.json();
    const climaAtual = dadosClima.current_weather;
    const condicaoTexto = condicoesTempo[climaAtual.weathercode] || "Condição desconhecida";
    const localFormatado = `${name}${admin1 ? `, ${admin1}` : ""} - ${country}`;
    const infoResumida = `${climaAtual.temperature}°C - ${condicaoTexto}`;

    areaResultado.innerHTML = `
      <h2>${localFormatado}</h2>
      <div class="temperatura">${climaAtual.temperature} °C</div>
      <p class="info"><strong>Condição:</strong> ${condicaoTexto}</p>
      <p class="info"><strong>Vento:</strong> ${climaAtual.windspeed} km/h</p>
      <button id="btn-favoritar" class="btn-favoritar">⭐ Favoritar Cidade</button>
    `;

    document.getElementById("btn-favoritar").addEventListener("click", () => {
      salvarFavorito(localFormatado, infoResumida);
    });

  } catch (erro) {
    areaResultado.innerHTML = `<p class="mensagem-erro">Ops! ${erro.message}</p>`;
  }
}

document.getElementById("botao-buscar").addEventListener("click", () => {
  const termo = document.getElementById("campo-busca").value.trim();
  if (termo) buscarClima(termo);
});

document.getElementById("campo-busca").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const termo = e.target.value.trim();
    if (termo) buscarClima(termo);
  }
});

document.addEventListener("DOMContentLoaded", listarFavoritos);