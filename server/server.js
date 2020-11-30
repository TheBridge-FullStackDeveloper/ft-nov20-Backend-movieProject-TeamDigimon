//DEPENDENCIAS Y CONFIGURACIÓN INICIAL

const express = require("express");
const server = express();
const myPublicFiles = express.static("../public");			//CONEXIÓN CON FICHERO public
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
///encrypt to future modules
const base64 = require("base-64");
const crypto = require("crypto");
const fetch = require("node-fetch");
require("dotenv").config();
const client_id = "4ef49b85eefcbcbd9302"; //Client_id
const mysql = require("mysql");
const CLIENT_ID = process.env.CLIENT_ID;
const GH_SECRET = process.env.GH_SECRET;
const HOST_SQL = process.env.HOST_SQL;
const USER_SQL = process.env.USER_SQL;
const PASSWORD_SQL = process.env.PASSWORD_SQL;
const URI_MONGO = process.env.URI_MONGO;
const SECRET_JWT = process.env.SECRET_JWT;
const DATABASE_SQL = process.env.DATABASE_SQL;
const listenPort = 7777;
const MongoClient = require("mongodb").MongoClient;
const sql = require("mysql");								//MÓDULO PARA CONEXIÓN CON SQL


const options = {

	"maxAge": 1000 * 60 * 15 * 4 * 24 * 15, // would expire after 15 days		////// OPTIONS DE JWT//////
	"httpOnly": true, // The cookie only accessible by the web server
	"signed": true // Indicates if the cookie should be signed
};

//SECRET DE BACK

const SECRET = SECRET_JWT;

//CONFIG SQL
let connection = sql.createConnection({

	"host"     : HOST_SQL,
	"user"     : USER_SQL,
	"password" : PASSWORD_SQL, //ESTO PUEDE DAR NULL Y LLEVAR A PROBLEMAS MAS TARDE
	"database" : DATABASE_SQL
});
console.log("SQL connection:", connection);


server.use(myPublicFiles);
server.use(bodyParser.urlencoded({"extended":false}));
server.use(bodyParser.json());
server.use(cors());

//////////////////MONGOOO///////////////////////


server.post("/editMovieADM/:id", (req, res) => { // Opción particular de express, con el :id podemos meter dentro del endpoint el id de la peli y acceder más tarde a ello con req.params.id
	const {Title, Year, Director, Duration, Img} = req.body; //destructuring, igualamos cada una de las llaves dentro del objeto aa req.body
	try {
		MongoClient.connect(URI_MONGO, (err, db) =>{
			if (err){
				throw err;
			}
			let ObjectDB = db.db("DigimonMovies");
			ObjectDB.collection("Movies").updateOne(
				{"_id" :req.params.id}, {Title, Year, Director, Duration, Img}, (err, result) => {
					if (err){
						throw err;
					}
					if (result){
						res.send({"msg" : "Movie updated"});
					} else {
						res.send({"msg": "NOT updated"});
					}
					db.close();
				});
		});
	} catch (e){
		return { "msg" : "MongoDB error connection"};
	}
});

///BORRAR PELICULAS de MONGODB////
server.post("/deleteMovieMongo", (req, res) => {
	try {
		MongoClient.connect(URI_MONGO, (err, db) =>{
			if (err){
				throw err;
			}
			let ObjectDB = db.db("DigimonMovies");
			ObjectDB.collection("Movies").deleteOne(
				{"_id" : new ObjectID(req.body._id)}, (err, result) => {
					if (err){
						throw err;
					}
					if (result){
						res.send({"msg" : "Movie deleted"});
					} else {
						res.send({"msg": "NOT deleted"});
					}
					db.close();
				});
		});
	} catch (e){
		return { "msg" : "MongoDB error connection"};
	}
});
///GET PELICULA de MONGODB////
server.get("/GetMovieMongo", (req, res) => {
	try {
		MongoClient.connect(URI_MONGO, (err, db) =>{
			if (err){
				throw err;
			}
			let ObjectDB = db.db("DigimonMovies");
			ObjectDB.collection("Movies").find({"_id":new ObjectID(req.body._id)})
				.toArray((err, result) => {
					if (err){
						throw err;
					}
					if (result){
						res.send(result);
					} else {
						res.send({"msg": "Movie NOT found"});
					}
					db.close();
				});
		});
	} catch (e){
		return { "msg":"MongoDB error connection"};
	}
});
//////ENDPOINTS DE ADMIN //////
server.post("/createMovieADM", (req, res) => {

	const {Title, Year, Director, Duration, Img} = req.body;
	try {
		if (Title && Year && Director && Duration){
		// else Error
			MongoClient.connect(URI_MONGO, (err, db) =>{
				if (err){
					throw err;
				}
				let ObjectDB = db.db("DigimonMovies");
				ObjectDB.collection("Movies").insertOne(
					{Title, Year, Director, Duration, Img}, (err, result) => {
						if (err){
							throw err;
						}
						if (result){
							res.send({"msg" : "New movie created"});
						} else {
							res.send({"msg": "Problem occured"});
						}
						db.close();
					});
			});

		} else {
			res.send("Title, Year, Director and Duration required.");
		}
	} catch (e){
		return { "msg" : "MongoDB error connection"};
	}
});

////////////
/////// REGISTER END POINT/////////
server.post("/register", (req, res) => {

	let newUser = req.body;


	if (newUser.user && newUser.password) {

		connection.query(`SELECT  Email FROM users WHERE Email = "${newUser.user}";`, function (err, result) {

			if (err) {

				console.log(err);
				return;

			}

			result.map((elemento) => {

				if (elemento.Email === newUser.user) {

					return res.send("User already exists:");
				} else {

					connection.query(`INSERT INTO users (Email, pass, rules) VALUES ("${newUser.user}","${newUser.password}",0);`);

					const Payload = {

						"userName": newUser.user,
						"iat": new Date(),
						"role": "User",
						"ip": req.ip
					};
					return res.cookie("jwt", generateJWT(Payload), options).send({"msg": "New user has been created."}); //"sessionCookie", "digimonCookie", options).send(generateJWT(Payload))

				}

			});

		});

	}


});


//////  LOGIN ENDPOINT  //////////
server.post("/login", (req, res) => {

	let encryptedLogin = req.body; //VARIABLE QUE CONTIENE EL JSON LOS DATOS ENCRIPTADOS DEL FRONT.
	let derechos = req.body.derechos;


	if (encryptedLogin.user && encryptedLogin.password){


		connection.query("SELECT * FROM users", function (err, result, fields) {

			if (err) {

				console.log(err);
				return;
			}

			result.map((elemento) => {

				if (elemento.email === encryptedLogin.user && elemento.password === encryptedLogin.password){

					console.log("correct");

					if (derechos === 1) {
						const Payload = {

							"userName": "Admin",
							"iat": new Date(),
							"role": "Admin",
							"ip": req.ip
						};
						res.cookie("jwt", generateJWT(Payload), options).send({"msg": Payload});

					} else {

						const Payload = {

							"userName": encryptedLogin.user,
							"iat": new Date(),
							"role": "User",
							"ip": req.ip
						};
						res.cookie("jwt", generateJWT(Payload), options).send({"msg": Payload}); //"sessionCookie", "digimonCookie", options).send(generateJWT(Payload))

					}

				} else {
					res.send("Wrong user or password");
				}
			});

			connection.end();
		});
	}
});

//COMPROBACIÓN DEL JWT
server.get("/jwt", (req, res) => {

	const Payload = {

		"userName": "Admin",
		"iat": new Date(),
		"role": "Admin",
		"ip": req.ip
	};
	const JWT = generateJWT(Payload);
	res.cookie("jwt", JWT, {"httpOnly": true});
	res.send("Hola Mundo");
});


//FUNCIONES PARA CODIFICACION JWT  =====>> TODO ESTO VA EN FRONTEND

function encodeBase64(string) {
	const encodedString = base64.encode(string);
	const parsedString = encodedString
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
	return parsedString;
}

function decodeBase64(base64String) {
	const decodedString = base64.decoded(base64String);
	return decodedString;
}

function generateJWT(Payload) {
	const header = {
		"alg": "HS256",
		"typ": "JWT"
	};
	const base64Payload = encodeBase64(JSON.stringify(Payload));
	const base64Header = encodeBase64(JSON.stringify(header));
	const signature = encodeBase64(hash(`${base64Header}.${base64Payload}`));
	const JWT = `${base64Header}.${base64Payload}.${signature}`;
	return JWT;
}

function hash(string) {
	const hashedString = crypto
		.createHmac("sha256", SECRET)
		.update(string)
		.digest("base64");
	return hashedString;
}

function verifyJWT(jwt) {
	const [header, payload, signature] = jwt.split(".");
	if (header && payload && signature) {
		const expectedSignature = encodeBase64(hash(`${header}.${payload}`));
		if (expectedSignature === signature) {
			return true;
		}
	}
	return false;
}

function getJWTInfo(jwt) {
	const [payload] = jwt.split(".")[1];
	if (payload) {
		try {
			const data = JSON.parse(decodeBase64(payload));
			return data;
		} catch (e) {
			return null;
		}
	}
	return null;
}
// FUNCIONES DE ENCRIPTACION DE CONTRASEÑA

function encryptPassword(string) {
	const salt = "";
	let saltedPassword = salt + string + salt;

}
///////////////////////

server.use(cookieParser());

/////////////////////////////////// MYSQL CONNECTION////////////////////////////////
////////////////FUNCTIONS/////////////////////////////////////////
function SQLquery(string, options = {}) {
	return new Promise((resolve, reject) => {
		connection.query(string, options, (err, response) => {
			if (err) {
				reject(err);
			} else {
				resolve(response);
			}
		});
	});
}
////// MYSQL CONNECTION
const { ObjectID } = require("mongodb");


connection.connect(function(err) {
	if (err) {
		console.error(`error connecting: ${ err.stack}`);
		return;
	}

	console.log(`connected as id ${ connection.threadId}`);
});


//////////////////////bring all the conections from mysql///////////////////////////////////////////
function BringMeAll(){
	connection.query("SELECT * FROM users", ["team-digimon"], () => {
		connection.query("SELECT * FROM users", ["team-digimon"], function (error, results){
			if (error) {
				throw error;
			} else {
				console.log(results);
			}
		});
	});
}

///////////////////////////////////////////////////////ADDMOVIE//////////////////////////////////////////////////////////////////////////////

server.get("/addmovie", async (req, res)=>{
	let {user, favmovie} = req.body;
	SQLquery("SELECT iduser FROM users WHERE Email = ?", [user])
		.then(
			(result)=>{
				SQLquery("INSERT INTO favMovies (idusers,idFilm) VALUES (?, ?)", [result.iduser, favmovie])
					.then(result => res.send(result));
			}
		)
		.catch(err => res.send(err));
});
//////////////////////////////////////////////////////////////////////DELETEMOVIE/////////////////////////////////////////////////////////////////
server.get("/deletemovie", async (req, res)=>{
	let {user, favmovie} = req.body;
	SQLquery("DELETE FROM favMovies WHERE idFilm = ? AND idusers = ?", [favmovie, user])
		.then(result =>res.send(result));
});
///////////////////////////////////////// OAUTH GITHUB/////////////////////////////////////////


server.get("/loginOAuth", ( res) => {
	res.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}&scope=read:user,user:email`);
});

server.get("/login/github", ( res) => {
	const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user,user:email`;
	res.redirect(githubAuthUrl);
});

server.get("/redirectGH", async (req, res) => {

	if (req.query.code) {
		const requestCode = req.query.code;
		if (requestCode) {
			const token = await getTokenGH(requestCode);
			const userData = await getUserData(token);
			let newUser = {"user": userData.login, "avatar": userData.avatarUrl, "email" : userData.email};
			res.send(newUser);
		}
	}
});
async function getTokenGH (code) {
	// res.redirect("/index.html");
	if (code) {
		const res = await fetch("https://github.com/login/oauth/access_token", {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			"body": JSON.stringify({
				"client_id": CLIENT_ID,
				"client_secret": GH_SECRET,
				code
			})
		});
		const data = await res.json();

		if (!data.error) {
			const token = `${data.token_type} ${data.access_token}`;
			return token;
		}
	}
	return {"msg": "Error"};
}
async function getUserEmail(token) {
	const res = await fetch("https://api.github.com/user/emails", {
		"headers": {
			"Authorization": token,
			"Accept": "application/vnd.github.v3+json"
		}
	});
	const emails = await res.json();
	return emails[0].email;
}
async function getUserData(token) {

	const res = await fetch("https://api.github.com/user", {
		"headers": {
			"Authorization": token,
			"Accept": "application/vnd.github.v3+json"
		}
	});
	const userData = await res.json();
	const email = await getUserEmail(token);

	///JWT
	function JWT(Payload) {
		const header = {
			"alg": "HS256",
			"typ": "JWT"
		};
		const base64Payload = encodeBase64(JSON.stringify(Payload));
		const base64Header = encodeBase64(JSON.stringify(header));
		const signature = encodeBase64(hash(`${base64Header}.${base64Payload}`));
		const JWT = `${base64Header}.${base64Payload}.${signature}`;
		return JWT;
	}
	const Payload = {
		"user" : req.body.user, ///ToSolidAccess//
		"profile" : "user",
		"iat" : new Date()
	};
	const jwt = JWT(Payload);
	//Grant access based on profile
	switch (result[0].USER_PROFILE) { // toSolidAccess
	case "admin":
	{
		//Access as administrator
		res.cookie("JWT", jwt, {"httpOnly" : true})
			.send({"res" : "1", "msg" : "admin"});
		break;
	}
	}
	return {"login": userData.login, "avatarUrl": userData.avatar_url, email};
	// data; Tenemos los datos de usuario menos email
}


///////CONEXION CON MONGO VIA NATIVE DRIVERS////////////////////MOOOOOOONGOOOOOOO//////////////////////////////////////////


const client = new MongoClient(URI_MONGO, { "useNewUrlParser": true, "useUnifiedTopology": true });
client.connect(err => {
	// const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});

///BORRAR PELICULAS de MONGODB////

server.post("/DeleteMovieMongo/", (req, res) => {
	try {
		MongoClient.connect(uri, (err, db) =>{
			if (err){
				throw err;
			}
			let ObjectDB = db.db("DigimonMovies");
			ObjectDB.collection("Movies").deleteOne(
				{"_id" : new ObjectID(req.body._id)}, (err, result) => {
					if (err){
						throw err;
					}
					if (result){
						res.send({"msg" : "Movie deleted"});
					} else {
						res.send({"msg": "NOT deleted"});
					}
					db.close();
				});
		});
	} catch (e){
		return { "msg" : "MongoDB error connection"};
	}
});

///GET PELICULA de MONGODB////
server.get("/GetMovieMongo", (req, res) => {
	try {
		MongoClient.connect(URI_MONGO, (err, db) =>{
			if (err){
				throw err;
			}
			let ObjectDB = db.db("DigimonMovies");
			ObjectDB.collection("Movies").find({"_id":new ObjectID(req.body._id)})
				.toArray((err, result) => {
					if (err){
						throw err;
					}
					if (result){
						res.send(result);
					} else {
						res.send({"msg": "Movie NOT found"});
					}
					db.close();
				});
		});
	} catch (e){
		return { "msg":"MongoDB error connection"};
	}
});

//////COGER PELICULAS DE API OMDB////////////////////////////O-M-D-B MOVIES/////////////////////////////////////////////////////
const API_KEY_OMBD = process.env.API_KEY_OMBD;
// console.log(API_KEY_OMBD);

server.get("/SearchMovies/:Title", (req, res) => {
	let Title = req.params.Title;

	if (Title !== null){
		fetch(`http://www.omdbapi.com/?s=${Title}&apikey=${API_KEY_OMBD}`)
			.then(response => response.json())
			.then(async data => {
				if (data.Search){
					const movieData = data.Search.map(movie => {
						const {Title, Year, imdbID, Poster} = movie;
						return {
							"Title" : Title,
							"Year" : Year,
							"Id": `O_${imdbID}`,
							"Img" : Poster
						};
					});
					res.send({"movies" : movieData});

				} else {
					res.send(await SearchinMongoTitle(Title));
				}
			})
			.catch({"msg" : "Error connection with Omdb"});
	} else {
		res.send({"msg" : "Empty Title"});
	}

});

server.get("/SearchExtra/:filmId", async (req, res) => {
	//Nuestra id puede tener 2 variantes:
	//	Mongo
	//	OMDB
	//Para poder distinguirlas:
	//	M_
	//	O_
	let filmId = req.params.filmId;
	console.log(filmId);
	if (filmId !== null){
		const id = filmId.substring(2);
		console.log("id =", id, "\nFilmID[0] =", filmId[0]);
		switch (filmId[0]) {
		case "M":
			//Buscar en mongo
			res.send(await SearchinMongoId(id));
			break;
		case "O":
			fetch(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY_OMBD}`)
				.then(response => response.json())
				.then(data => {
					console.log(data);
					if (data.Response === "True") {
						const movieData = {
							"Title" : data.Title,
							"Year" : data.Year,
							"Id": `O_${data.imdbID}`,
							"Img" : data.Poster
						};
						res.send({"movies" : movieData});

					}
				})
				.catch(() => {
					res.send({"msg" : "Error connection with Omdb"});
				});

			break;
		default:
			res.send({"msg":"Error Chungo"});
		}
	} else {
		res.send({"msg" : "Empty Title"});
	}

});

function SearchinMongoTitle(Title){

	return new Promise((res) => {
		try {
			MongoClient.connect(URI_MONGO, (err, db) => {

				if (err) {
					throw err;
				}
				let ObjectDB = db.db("DigimonMovies");


				ObjectDB.collection("Movies").find({"Title": new RegExp(`.*${Title}`, "i")})
					.toArray((err, result) => {
						if (err) {
							throw err;
						}
						console.log(result);
						if (result.length){
							let movies = result.map(film => {
								return {
									// eslint-disable-next-line no-underscore-dangle
									"id": `M_${film._id}`,
									"Title": film.Title,
									"Img": film.Img,
									"Year": film.Year
								};
							});
							res({movies});
						} else {
							res({"msg":"NOT Found in MongoDB"});
						}
						//Cierro base de datos de Mongo
						db.close();
					});
			});

		} catch (e){
			res.send("error");
		}
	});
}
function SearchinMongoId (filmId){
	return new Promise((res) => {
		try {
			MongoClient.connect(URI_MONGO, (err, db) =>{
				if (err){
					throw err;
				}
				let ObjectDB = db.db("DigimonMovies");
				ObjectDB.collection("Movies").find({"_id":new ObjectID(req.body._id)})
					.toArray((err, result) => {
						if (err){
							throw err;
						}
						if (result){
							res.send(result);
						} else {
							res.send({"msg": "Movie NOT found"});
						}
						db.close();
					});
			});
		} catch (e){
			return { "msg":"MongoDB error connection"};
		}

	});
}

///////////////////////SERVER LISTEN ON PORT ///////////////
server.listen(listenPort, () => {
	// eslint-disable-next-line no-console
	console.log(`http://localhost:7777/server listening on port ${listenPort}`);
});

///////LLAMADA A FUNCIONES///////////////
BringMeAll();