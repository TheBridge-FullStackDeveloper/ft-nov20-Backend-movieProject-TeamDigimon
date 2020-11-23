<<<<<<< HEAD
// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test//
// ejemplo//
=======


// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test
// ejemplo
>>>>>>> a5fc4edf949cdd2d41e55f4510d4ff3ed0b88a63

// const suma = require("./main.js");

// test("sumar 1 + 2 es igual a 3", () => {
// 	expect(suma(1, 2)).toBe(3);
// });

// a partir de aqui, tests:

//login

<<<<<<< HEAD
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

=======
>>>>>>> a5fc4edf949cdd2d41e55f4510d4ff3ed0b88a63
const user1 = {
	"email": "test1@test.com",
	"password": "Test12*."
};
const user2 = {
<<<<<<< HEAD
<<<<<<< HEAD
	"email": "test1aest.com",
=======
	"email": "test1aest",
=======
	"email": "test1aest.com",
>>>>>>> a5fc4edf949cdd2d41e55f4510d4ff3ed0b88a63
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
const FavMovie = {
	"title" : "algo",
	"img" : "nose.img",
	"year": 2019,
	"director" : "cameron diaz",
	"category" : "crimen",
	"duration" : 200000
};

const registerUser = require(".main.js");
const checkPassword = require(".main.js");
const checkUsers = require(".main.js");
const popUp = require(".main.js");
const IsthereFav = require(".main.js");
const addMoviefun = require(".main.js");
const deleteMovie = require(".main.js");

test("Aqui se valida el login", () => {
	expect(checkPassword(user1.password).toBe(true));
	expect(checkUsers(user2.email).toBe(true));
	expect(popUp().toBe("string"));
});


test("Aqui se valida el register", () => {
	expect(registerUser("aa@aa.aa").toBe(false));
	expect(registerUser(user1.value).toBe(false));
	expect(registerUser().toBe(false));
<<<<<<< HEAD
<<<<<<< HEAD
});

///TEST DE CREATE MOVIE///
cont newMovie = {
	
}


test("Aqui se valida la nueva pelicula", () =>{

=======
>>>>>>> cda075c956cc82e3f34f1ffcc3598e7b740d9875
=======
});

///// ADDMOVIE USER

test("Aqui se valida El favorito al movie", () => {
	expect(IsthereFav(FavMovie)).tobe(false);
	expect(addMoviefun(FavMovie).tobe("added") );
	expect(popUp().tobe("string"));
});

///////DeleteMovie//////////////////

test("Aqui se valida el DeleteMovie", ()=>{
	expect(deleteMovie(FavMovie)).tobe(true);
>>>>>>> a5fc4edf949cdd2d41e55f4510d4ff3ed0b88a63
});