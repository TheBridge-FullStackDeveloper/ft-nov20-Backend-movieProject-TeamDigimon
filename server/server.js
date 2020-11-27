//DEPENDENCIAS Y CONFIGURACIÓN INICIAL

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const base64 = require("base-64");
const crypto = require("crypto");
const fetch = require("node-fetch");
const { get } = require("http");
require("dotenv").config();
const myPublicFiles = express.static("../public");			//CONEXIÓN CON FICHERO public
const server = express();
const listenPort = 7777;
const client_id = "4ef49b85eefcbcbd9302";

const CLIENT_ID = process.env.CLIENT_ID;
const GH_SECRET = process.env.GH_SECRET;

server.use(myPublicFiles);
server.use(bodyParser.urlencoded({"extended":false}));
server.use(bodyParser.json());
server.use(cors());
server.use(cookieParser());
// ENDPOINTS Y COSAS NAZIS AQUÍ:
////// MYSQL CONNECTION
let mysql = require("mysql");
const { response } = require("express");
let connection = mysql.createConnection({
	"host"     : "34.105.216.53",
	"user"     : "team-digimon",
	"password" : "",
	"database" : "usersMovie"
});

connection.connect(function(err) {
	if (err) {
		console.error(`error connecting: ${ err.stack}`);
		return;
	}

	console.log(`connected as id ${ connection.threadId}`);
});

connection.query("SELECT * FROM users", ["team-digimon"], function (error, results, fields) {

	if (error) {
		throw error;
	} else {
		console.log(results);
	}
});

// OAUTH GITHUB


server.get("/loginOAuth", (req, res) => {
	res.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}&scope=read:user,user:email`);
});

server.get("/LoginGH", (req, res) => {
	console.log(req.query);
});


server.get("/login/github", (req, res) => {
	const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user,user:email`;
	res.redirect(githubAuthUrl);
});

server.get("/redirectGH", async (req, res) => {

	if (req.query.code) {
		const requestCode = req.query.code;

		if (requestCode) {
			const token = await getTokenGH(requestCode);
			const userData = await getUserData(token);
			// Comprobar si está en el database sql
			res.send(userData);

		} else {
			res.send({"msg": "Error"});
		}
	}
});

////FALTAAAAA Generar JWT con la función de Diego y meter nuestro userData////

async function createUserOnDB(userData) {
	// meter el usuario en nuestra base de datos sql
}

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
	return {"login": userData.login, "avatarUrl": userData.avatar_url, email};
	// data; Tenemos los datos de usuario menos email
}
///////CONEXION CON MONGO VIA NATIVE DRIVERS//////////

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://Thedigimonbridge20:Thedigimonbridge20@moviesdigimon.gowkl.mongodb.net/MoviesDigimon?retryWrites=true&w=majority";
const client = new MongoClient(uri, { "useNewUrlParser": true, "useUnifiedTopology": true });
client.connect(err => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});

//////COGER PELICULAS DE API OMDB//////
const API_KEY_OMBD = process.env.API_KEY_OMBD;
// console.log(API_KEY_OMBD);

server.get("/SearchMovies/:Title", (req, res) => {
	let Title = req.params.Title;

	if (Title !== null){
		fetch(`http://www.omdbapi.com/?s=${Title}&apikey=${API_KEY_OMBD}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if (data.Search){
					const movieData = data.Search.map(movie => {
						const {Title, Year, "Id": imdbID, "Img": Poster} = movie;
						return {Title, Year, "Id": `O_${Id}`, Img};
					});
					res.send({"movies" : movieData});

				} else {

					res.send(SearchinMongoTitle(Title));
				}
			})
			.catch({"msg" : "Error connection with Omdb"});
	} else {
		res.send({"msg" : "Empty Title"});
	}

});

server.get("/SearchMovieInfoExtra/:filmId", (req, res) => {
	//Nuestra id puede tener 2 variantes:
	//	Mongo
	//	OMDB
	//Para poder distinguirlas:
	//	M_
	//	O_
	let filmId = req.params.filmId;
	console.log(filmId);
	if (filmId !== null){
		const id = filmId.substr(2);
		switch (filmId[0]) {
		case "M":
			//Buscar en mongo
			res.send(SearchinMongoId(filmId));
			break;
		case "O":
			fetch(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY_OMBD}`)
				.then(response => {
					response.json();
				})
				.then(data => {
					console.log(data);
					if (data.Search) {
						const movieData = data.Search.map(movie => {
							const {Title, Year, "Id": imdbID, "Img": Poster} = movie;
							return {Title, Year, "Id": `O_${Id}`, Img};
						});
						res.send({"movies" : movieData});

					} else {
						SearchinMongoId(filmId).then(result => {
							if (filmId) {
								res.send(`M_ ${filmId}`);
							} else {
								res.send({"msg": "Film not found"});
							}
							//No funciona
						});
					}
				})

				.catch((data) => {
					SearchinMongoId(id).then(result => {
						if (filmId) {
							res.send(`MO ${filmId}`); //Tenemos peli
						} else {
							res.send({"msg": "Film not found"}); //No funciona
						}
					});
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
			MongoClient.connect(uri, (err, db) => {

				if (err) {
					throw err;
				}
				let ObjectDB = db.db("DigimonMovies");


				ObjectDB.collection("Movies").find({"Title": {"$regex": `.*${Title}.*`}}, (err, result) => {

					if (err) {
						throw err;
					}
					if (result){
						res({"msg":"Movies Found in MongoDB", "ResponseMongoDB" : ""});
					} else {
						res({"msg":"NOT Found in MongoDB"});
					}
					//Cierro base de datos de Mongo
					db.close();
				});
			});

		} catch (e){
			res({"msg": "MongoDB error connection"});

		}
	});
}
function SearchinMongoId (filmId){
	return new Promise((res) => {
		try {
			MongoClient.connect(uri, (err, db) => {

				if (err) {
					throw err;
				}
				let ObjectDB = db.db("DigimonMovies");


				ObjectDB.collection("Movies").find({"_id": filmId}, (err, result) => {

					if (err) {
						throw err;
					}
					if (result){
						res({"msg":"Movies Found in MongoDB", "ResponseMongoDB" : ""});
					} else {
						res({"msg":"NOT Found in MongoDB"});
					}
					//Cierro base de datos de Mongo
					db.close();
				});
			});

		} catch (e){
			res({"msg": "MongoDB error connection"});

		}
	});
}

///////////////////////SERVER LISTEN ON PORT ///////////////
server.listen(listenPort, () => {
	// eslint-disable-next-line no-console
	console.log(`http://localhost:7777/server listening on port ${listenPort}`);
});