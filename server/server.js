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

const CLIENT_ID = process.env.CLIENT_ID;
const GH_SECRET = process.env.GH_SECRET;

server.use(myPublicFiles);
server.use(bodyParser.urlencoded({"extended":false}));
server.use(bodyParser.json());
server.use(cors());
server.use(cookieParser());
// ENDPOINTS Y COSAS NAZIS AQUÍ:

// OAUTH GITHUB

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

//Generar JWT con la función de Diego y meter nuestro userData

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


server.get("/SearchMovies/:Title", (req, res) => {
	let Title = req.params.Title;

	if (Title !== null){

		fetch(`http://www.omdbapi.com/?s=${Title}&apikey=4c909483`)
			.then(response => response.json())
			.then(data => {

				if (data.Search){
					res.send({"msg" : "Omdb Movies Found", "MoviesOmdb" : data.Search});

				} else {

					try {
						MongoClient.connect(url, (err, db) => {

							if (err) {
								throw err;
							}

							//MI  NOMBRE DE MONGO
							let ObjectDB = db.db("DigimonMovies");


							ObjectDB.collection("Movies").find({"title": {"$regex": `.*${Title}.*`}}, (err, result) => {

								if (err) {
									throw err;
								}
								if (result){
									res.send({"msg":"Movies Found in MongoDB", "ResponseMongoDB" : ""});
								} else {
									res.send({"msg":"NOT Found in MongoDB"});
								}
								//Cierro base de datos de Mongo
								db.close();
							});
						});

					} catch (e){
						return {"msg": "MongoDB error connection"};

					}
				}
			})
			.catch({"msg" : "Error connection with Omdb"});
	} else {
		res.send({"msg" : "Empty Title"});
	}

});

///////////////////////
server.listen(listenPort, () => {
	// eslint-disable-next-line no-console
	console.log(`http://localhost:7777/server listening on port ${listenPort}`);
});