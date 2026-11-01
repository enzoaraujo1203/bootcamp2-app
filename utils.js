function somar(a, b) {
  return a + b;
}

function converterCelsiusParaFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function eTemperaturaValida(temp) {
  return typeof temp === 'number' && !isNaN(temp);
}

module.exports = {
  somar,
  converterCelsiusParaFahrenheit,
  eTemperaturaValida
};