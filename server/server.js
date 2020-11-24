//DEPENDENCIAS Y CONFIGURACIÓN INICIAL

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const base64 = require("base-64");
const crypto = require("crypto");
const myPublicFiles = express.static("../public");			//CONEXIÓN CON FICHERO public
const server = express();
const listenPort = 7777;

server.use(myPublicFiles);
server.use(bodyParser.urlencoded({"extended":false}));
server.use(bodyParser.json());
server.use(cors());
// ENDPOINTS Y COSAS NAZIS AQUÍ:

///////////////////////
server.listen(listenPort, () => {
	console.log(` http://localhost:7777/ server listening on port ${listenPort}`);
});