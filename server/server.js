//DEPENDENCIAS Y CONFIGURACIÓN INICIAL

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const base64 = require("base-64");
const crypto = require("crypto");
require("dotenv").config();
const myPublicFiles = express.static("../public");			//CONEXIÓN CON FICHERO public
const server = express();
const listenPort = 7777;
const client_id = "4ef49b85eefcbcbd9302";

server.use(myPublicFiles);
server.use(bodyParser.urlencoded({"extended":false}));
server.use(bodyParser.json());
server.use(cors());
// ENDPOINTS Y COSAS NAZIS AQUÍ:

// OAUTH GITHUB

server.get("/loginOAuth", (req, res) => {
	res.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}&scope=read:user,user:email`);
});

server.get("/LoginGH", (req, res) => {
	console.log(req.query);
});
////// MYSQL CONNECTION
let mysql = require("mysql");
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

// function insertmovie(){

// let queryPrueba = [["a@a.es", "cosasbellas", "seller.img", " 20-20-20", "Peter languila"], ["a2@a.es", "co2sasbellas", "se2ller.img", " 20-20-20", "Pet2er languila"]];
// connection.query("INSERT INTO users(email,title,img,premier,director) VALUES ?", queryPrueba, {function (error, results) {
// 	if (error) {
// 		throw error;
// 	} else {
// 		console.log(results.insertId);
// 	}
// }
// });
// insertmovie();

server.listen(listenPort, () => {
	console.log(` http://localhost:7777/ server listening on port ${listenPort}`);
});