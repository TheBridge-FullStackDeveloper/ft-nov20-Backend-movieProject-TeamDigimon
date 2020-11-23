// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test
// ejemplo

const suma = require('./main.js');

test('sumar 1 + 2 es igual a 3', () => {
	expect(suma(1, 2)).toBe(3);
});

// a partir de aqui, tests:


const checkPassword = require('.main.js');
const checkUsers = require('.main.js');
const popUp = require('.main.js');

test('Aqui se valida el login', () => {
	expect(checkPassword(password.value).toBe(true));
	expect(checkUsers(user.value).toBe(true));
	expect(popUp().toBe("string"));
});

const registerUser = require('.main.js');


const user1 = {
	email: "test1@test.com",
	password: "Test12*."
}
const user2 = {
	email: "test1aest.com",
	password: "Test12*."
}

test('Aqui se valida el register', () => {
	expect(registerUser("aa@aa.aa").toBe(false));
	expect(registerUser(user1.value).toBe(false));
	expect(registerUser().toBe(false));
})





