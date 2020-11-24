// ejemplo

function suma(a, b) {
	return a + b;
}

// de esta forma exportamos la funcion y podemos hacer "require" en otro archivo.js

module.exports = {suma};

///////////////////////SEARCH FETCH
let title = "Tomates Verdes Fritos";
let director = "cameron Diaz";
fetch("http://localhost:8800/search", {
	"method":"POST",
	"headers":{"Content-Type": "application/json"},
	"body": JSON.stringify({title, director})
}).then(res=>{
	let {title, img, premier, director, category, duration} = res.body;
});

//////////////////ADDMOVIE////////////////////
let dataFromData = {
	title,
	"img" : "www.google.img",
	"premier" : 1991-11-07,
	director,
	category,
	duration
};
async function addMoviefun(dataFromData){

}