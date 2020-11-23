// ejemplo
// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test

const suma = require('./main.js');

test('sumar 1 + 2 es igual a 3', () => {
	expect(suma(1, 2)).toBe(3);
});

