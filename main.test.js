

// dentro del require ponemos el nombre del archivo al que vamos a hacerle el test
// ejemplo

// const suma = require("./main.js");

// test("sumar 1 + 2 es igual a 3", () => {
// 	expect(suma(1, 2)).toBe(3);
// });

// a partir de aqui, tests:


const user1 = {
	"email": "test1@test.com",
	"password": "Test12*."
};
const user2 = {
	"email": "test1aest.com",
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
});