///FUNCTIONS

function popup(){}


///////////////////////SEARCH FETCH
let title = "Tomates Verdes Fritos";
let director = "cameron Diaz";
fetch("http://localhost:7777/search", {
	"method":"POST",
	"headers":{"Content-Type": "application/json"},
	"body": JSON.stringify({title, director})
}).then(res=>{
	// eslint-disable-next-line no-unused-vars
	let {title, img, premier, director, category, duration} = res.body;
});

//////////////////ADDMOVIE////////////////////
let dataFromData = {
	title,
	"img" : "www.google.img",
	"premier" : "1991-11-07",
	director, //"cameron diaz",
	"category": "cosa",
	"duration" : "02:05:00"
};

///////////////////addMoviefun////////////////////////////7
async function addMoviefun(dataFromData){
	fetch("http://localhost:7777/addMoviefun", {
		"method":"POST",
		"headers":{
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({dataFromData})
	}).then(res=>{
		if (res === 201){
			popup("Ha sido guardado");
		} else {
			popup("hemos tenido un problema");
		}
	});
}
////////////////////////deleteMovie////////////////////////////
async function deleteMovie(dataFromData){
	fetch("http://localhost:7777/addMoviefun", {
		"method":"Delete",
		"headers":{
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({dataFromData})
	})
		.then(res=>{
			if (res === 201){
				popup("Ha sido eliminado Correctamente");
			} else {
				popup("hemos tenido un problema");
			}
		});
}

// OAUTH