// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test
// ejemplo

const suma = require("./main.js");

test("sumar 1 + 2 es igual a 3", () => {
	expect(suma(1, 2)).toBe(3);
});

// a partir de aqui, tests:

//login

const checkPassword = require(".main.js");
const checkUsers = require(".main.js");
const popUp = require(".main.js");

test("Aqui se valida el login", () => {
	expect(checkPassword(user1).toBe(true));
	expect(checkUsers(user1).toBe(true));
	expect(popUp().toBe("string"));
});

// register

const registerUser = require(".main.js");

const user1 = {
	"email": "test1@test.com",
	"password": "Test12*."
};
const user2 = {
	"email": "test1aest",
	"password": "Test12*."
};
const user3 = {
	"email": "",
	"password": "Test12*."
};
const user4 = {
	"email": "test1aest",
	"password": "."
};
const user5 = {
	"email": "",
	"password": "."
};

test("Aqui se valida el register", () => {
	expect(registerUser("aa@aa.aa").toBe(false));
	expect(registerUser(user1).toBe(false));
	expect(registerUser(user2).toBe(false));
	expect(registerUser(user3).toBe(false));
	expect(registerUser(user4).toBe(false));
	expect(registerUser(user5).toBe(false));
	expect(registerUser().toBe(false));
});