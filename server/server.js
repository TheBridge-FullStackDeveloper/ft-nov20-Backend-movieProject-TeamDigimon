//DEPENDENCIAS Y CONFIGURACIÓN INICIAL

const express = require("express");
const server = express();
const myPublicFiles = express.static("../public");			//CONEXIÓN CON FICHERO public
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const base64 = require("base-64");
const crypto = require("crypto");
const listenPort = 7777;
const MongoClient = require("mongodb").MongoClient;
const sql = require("mysql");								//MÓDULO PARA CONEXIÓN CON SQL
const mongoose = require("mongoose");

let MoviesSchema = new mongoose.Schema({


	"Title": {
		"type":String,
		"required": "Required"
	},
	"Year": {
		"type": Number
	}, "Director": {
		"type": String
	}, "Duration": {
		"type": String
	},
	"Img": {
		"type": String
	}
});
mongoose.model("Movies", MoviesSchema);
// const {MongoClient} = require("mongodb");					//MÓDULO PARA CONEXIÓN CON MONGO

// const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://Thedigimonbridge20:Thedigimonbridge20@moviesdigimon.gowkl.mongodb.net/MoviesDigimon?retryWrites=true&w=majority"; //CONFIG MONGO


mongoose.connect(uri, {"useNewUrlParser": true, "useUnifiedTopology": true}, (error) => {
	if (!error){

		console.log("connected");
	} else {

		console.log("error:", error);
	}

});


const options = {

	"maxAge": 1000 * 60 * 15 * 4 * 24 * 15, // would expire after 15 days		////// OPTIONS DE JWT//////
	"httpOnly": true, // The cookie only accessible by the web server
	"signed": true // Indicates if the cookie should be signed
};

//SECRET DE BACK

const SECRET = "0c8fac131404423d3faf25d02ad39faad6639387537616342a25837a2c9a49cb5b592c27fb1ea30dae368ffad941abd69c3c5032e3fd8cfefa9e220a92105b5f044092c1e3fa8dbf142754100b9f6900741b5e2a10fabe6140e7084b2b96973e249143dd774e9113931f988761f1128fa6a2024aadb52cc222f9eb4d1233bb3a61d724332696d5dcb9b2c85cc9b490dc5a4cb2883fd7ed59a0d4c8bfa521e40c40fe3d565bf27b4628dc58dc13f9618c7d878311ccf9d3650195b0c06c21753017ed80dd0dde54f32e0408b21dc2f79163a854916299df6566db301ec593e9c047b998ee3410b906443c79867d6ef45abc9bcc75e840f6616164ae6c068f33133b45cabdb71d876fd95d0c9fd589fce6a9b26ec42460e6513647a52c77d355eda05528c7067d4ea5af63e02f5c3d02c88f1863259e4543090ab64b751cd9906816c3b095c6a60d8658300e02acfb06851feb9643b0a0edc0f279202096bc158f8374fb54e1e72952a8dd7e515666f25ff92d6113b4741337045c9747e5b0a4b2dda6bd3e60873e86f45c37ada7b38893cb2cca31eac1b3bb89c2cc87bc6a0d30c555aad3f1ee167da1c511b212f4c038453dc5e95b8f35b56a38231a3b208bb4c893467d537c1999556c177c34546ffb712a40deafb3ea801f3c0646d64914fa68fb10a3acebcfc3fab0375e2879096abfb49dbe7f17fe28a62b59c1fb11588ca924d434036775a5ac53cecdf6e39f41e9f4a40996af7389601db107cfe81d03fb3b35396f13b5bdad7fee4e57b1519129f1742af40c5677cba4f12bbc2571074f77086757331efa08d633e0ecf587c840803bfa2c412adeeece32447a22cc654f8e39adabc983db7abf18340a1d0e01a57017f3c0bcfae5fa70a658353598c0be09f9fee2169d135572db55dc60859fccba95e078107210c2041ca9fbde3b8c79b3469f29b5553bcbf6a43bca0f988c3ae3149160537a699db951147b2e6b7a7feb592d7b1ec148f382fcbe3b83edafc1eaa5e6eb46de0d81c6d94f0c6872a8498b89c83e61b175de8072f71bd9698d1301a8ceebfdacdeb1aa900d777a74d802f88b5dbfc7eb7a2ef4971a336fe09f27673ce91653335114f335fd24729242e45056f8c127050bb7c4664aded0687cadfea022a713ca0df0c3a7bcff01c4ca91d6a7d906f28b5b479bae234bd3a1e5533fee3f561c012dcbdbde1fd55aa05ca16afc63da72a139e0282052e5bfd674acb01cc227ab59559e2cee2de7b6d04bddbbb6674fdbabde9566d22193577049b10e67f9831c45e7db3a5bb02882bc6d2d11187509e9abe28e989d8b1f28d388d63d59d36cec877efe46f3614cec31c7ba9a60dddaf2a24ac1be34fb44c8db1278e4085975d6d13724430cdc8d7f924ecce6b02288b3937ab4801ee380466363e735a486c50b5133a550dab210f2b103";

//CONFIG SQL
let connection = sql.createConnection({

	"host"     : "34.105.216.53",
	"user"     : "team-digimon",
	"password" : "",
	"database" : "usersMovie"
});
console.log("SQL connection:", connection);


server.use(myPublicFiles);
server.use(bodyParser.urlencoded({"extended":false}));
server.use(bodyParser.json());
server.use(cors());

// "SELECT * Email FROM users WHERE Email = Admin@gmail.com"
//https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs    ====> Mirar la parte de mongo puesto que cubre todos los endpoints que utilizará el ADMIN

/////// ENDPOINTS Y COSAS NAZIS AQUÍ//////

////////endpoints de prueba////////////////

////////PRUEBA SQL//////////////////
server.get("/dbSql", (req, res) => {


	connection.query("SELECT  Email FROM users WHERE Email = \"Admin@gmail.com\";", function (err, result, fields) {


		if (err) {
			console.log(err);
			return;
		}


		result.map((e) => {
			console.log(e.Email);
		});


	});
});

////////////PRUEBA MONGO/////////////////
server.get("/dbMongo", (req, res) => {

	mongoose.model("Movies").find((error, movies) => {


		console.log(Object.values(movies));

		res.send(console.log(movies));
	})
		.toArray();


});
server.post("/editMovieADM/:id", (req, res) => { // Opción particular de express, con el :id podemos meter dentro del endpoint el id de la peli y acceder más tarde a ello con req.params.id
	const {Title, Year, Director, Duration, Img} = req.body; //destructuring, igualamos cada una de las llaves dentro del objeto aa req.body
	try {
		MongoClient.connect(uri, (err, db) =>{
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
		MongoClient.connect(uri, (err, db) =>{
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
			MongoClient.connect(uri, (err, db) =>{
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


///////////////////////
server.listen(listenPort, () => {
	console.log(`http://localhost:${listenPort}/ server listening on port ${listenPort}`);
});