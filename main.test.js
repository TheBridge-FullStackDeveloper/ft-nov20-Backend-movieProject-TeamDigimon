// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test//
// ejemplo//

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
<<<<<<< HEAD
	expect(checkPassword(password.value).toBe(true));
	expect(checkUsers(user.value).toBe(true));
	expect(popUp().toBe("string"));
});

=======
	expect(checkPassword(user1).toBe(true));
	expect(checkUsers(user1).toBe(true));
	expect(popUp().toBe("string"));
});

// register

>>>>>>> cda075c956cc82e3f34f1ffcc3598e7b740d9875
const registerUser = require(".main.js");

const user1 = {
	"email": "test1@test.com",
	"password": "Test12*."
};
const user2 = {
<<<<<<< HEAD
	"email": "test1aest.com",
=======
	"email": "test1aest",
	"password": "Test12*."
};
const user3 = {
	"email": "test1aest",
	"password": "Test12*."
};
const user4 = {
	"email": "test1aest",
>>>>>>> cda075c956cc82e3f34f1ffcc3598e7b740d9875
	"password": "Test12*."
};

test("Aqui se valida el register", () => {
	expect(registerUser("aa@aa.aa").toBe(false));
	expect(registerUser(user1.value).toBe(false));
	expect(registerUser().toBe(false));
<<<<<<< HEAD
});

///TEST DE CREATE MOVIE///
cont newMovie = {
	
}


test("Aqui se valida la nueva pelicula", () =>{

=======
>>>>>>> cda075c956cc82e3f34f1ffcc3598e7b740d9875
});