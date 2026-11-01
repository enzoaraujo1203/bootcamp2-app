const { somar, converterCelsiusParaFahrenheit, eTemperaturaValida } = require('./utils');

test('Soma dois numeros corretamente', () => {
  expect(somar(2, 3)).toBe(5);
});

test('Converte Celsius para Fahrenheit corretamente', () => {
  expect(converterCelsiusParaFahrenheit(0)).toBe(32);
  expect(converterCelsiusParaFahrenheit(100)).toBe(212);
});

test('Valida se a temperatura e um numero valido', () => {
  expect(eTemperaturaValida(25)).toBe(true);
  expect(eTemperaturaValida('25')).toBe(false);
});