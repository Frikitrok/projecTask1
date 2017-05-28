var loadingImage = document.getElementById('loading');
var mainInput = document.getElementById('pokemon');
var inputWrapper = document.getElementById('pokemon-wrapper');
var pokemonStatsWrapper = document.getElementById('pokemon-stat-wrapper');

//request api
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        	callback(xmlHttp.responseText); 
        	loadingImage.style.display = "none";
        	mainInput.style.color = "black";
        	mainInput.disabled = false;
        	mainInput.focus()
     	} else {
     		mainInput.disabled = true;
     		loadingImage.style.display = "block";
     		mainInput.style.color = "white";
     	}
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

//response for request
function call_response(responseText){ 
	//alert(responseText);
	response = JSON.parse(responseText);
	pokemonArray = response.results;
}


//event for clicking main input 
mainInput.addEventListener('click', function(){
	if(checkRequest < 1) {
		httpGetAsync('http://www.pokeapi.co/api/v2/pokemon/?limit=900',  call_response);
		checkRequest++;
	}
});

//onchange main input couse dropdown menu
var checkRequest = 0;
var count = 0;
var response, pokemonArray;
mainInput.addEventListener('input', function() {
	dropDown();
});


//dropdown
function dropDown() {
	var pokemonInput = mainInput.value.toLowerCase();
	var resultArr = [];
	if(response!==undefined) {	
		pokemonArray.forEach(function callback(currentValue, index, arr) {
    		let inPokemonIndex = currentValue.name.indexOf(pokemonInput);
    		if(inPokemonIndex == 0) {
    			resultArr.push(currentValue.name);
    		}
		});
		//console.log(resultArr);

		addElement(resultArr, pokemonInput);
	}
}

//add li menu to dropdown
function addElement (resultArr, pokemonInput) { 
	try {
		var parent = document.getElementById("pokemon-wrapper");
		var child = document.getElementById("pokemon-dropdown");
		parent.removeChild(child);
	} 
	catch(err) {
    	
	}
	if(pokemonInput!=""){
		function makeLi(value) {
			var li = document.createElement("li");     // Create a <button> element
			var node = document.createTextNode(value);
			li.setAttribute("onclick", "pressCase(this);");  
			li.setAttribute("data", value); 
			ul.appendChild(li);    
			li.appendChild(node);  
		}

		var counter = 0;
		var ul = document.createElement("ul");  	
	  	resultArr.forEach(function callback(value, index, arr){
	  		if(counter < 5) {
		  		makeLi(value);
				counter++;
			}
	  	});  

	  	var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	  	var timeInput = pokemonInput.split('');
	  	//console.log(counter);

  		for(var z = resultArr.length; z < 5; z++) {
			for(var k = 0; k < timeInput.length; k++) {
				for(var d = 0; d < alphabet.length; d++) {
					timeInput[k] = alphabet[d];
					//console.log(timeInput);
					var resultInput =  timeInput.join('');
					for(var l = 0; l < pokemonArray.length; l++) {
						let inPokemonIndex = pokemonArray[l].name.indexOf(resultInput);
			    		if(inPokemonIndex == 0 && resultArr.indexOf(pokemonArray[l].name) < 0){

		    				resultArr.push(pokemonArray[l].name);
		    				//console.log(k);
			    			z++;
			    			makeLi(pokemonArray[l].name);
			    			//console.log(pokemonArray[l].name);
			    			if(z >= 5) {
			    				break;
			    			}

			    		}
			    	}
			    	timeInput[k] =  pokemonInput.split('')[k];
				}
			}
		}
		//console.log(resultArr);
		var timeInput = pokemonInput.split('');
		

		console.log('Code lag couse of big loop searching with mistakes');
		//this the code that makes lag couse of big loops
		for(var z = resultArr.length; z < 5; z++) {
			for(var k = 0; k < timeInput.length; k++) {
				for(var d = 0; d < alphabet.length; d++) {
					for(var x = k + 1; x < timeInput.length; x++) {
						for(var c = 0; c < alphabet.length; c++) {

							timeInput[k] = alphabet[d];
							timeInput[x] = alphabet[c];
							var resultInput =  timeInput.join('');
							for(var l = 0; l < pokemonArray.length; l++) {
								let inPokemonIndex = pokemonArray[l].name.indexOf(resultInput);
					    		if(inPokemonIndex == 0 && resultArr.indexOf(pokemonArray[l].name) < 0){

				    				resultArr.push(pokemonArray[l].name);
				    				//console.log(k);
					    			z++;
					    			makeLi(pokemonArray[l].name);
					    			//console.log(pokemonArray[l].name);
					    			if(z >= 5) {
					    				break; 
					    			}
					    		}
					    	}
					    	timeInput[k] =  pokemonInput.split('')[k];
							
						}
						timeInput[x] =  pokemonInput.split('')[x];
					}
				}
				timeInput[k] = pokemonInput.split('')[k];
			}
		}

	  	
	  	if(1 > resultArr.length) {
			var ul = document.createElement("ul");
		  	var li = document.createElement("li");     // Create a <button> element
			var node = document.createTextNode('No result');
			li.setAttribute("onclick", "pressCase(this);");  
			ul.appendChild(li);    
			li.appendChild(node);  

			ul.setAttribute("id", "pokemon-dropdown");                        // Append the text to <button>
			inputWrapper.appendChild(ul);   
		} 
		else {
			ul.setAttribute("id", "pokemon-dropdown");                        // Append the text to <button>
			inputWrapper.appendChild(ul);   
		}
		
	}  
}

//onclick event to li in menu
function pressCase(obj) {
	var nameCase = obj.getAttribute('data');
	if(document.getElementById('focused') != null) {
    	document.getElementById('focused').removeAttribute('id');
    }
	obj.setAttribute("id", 'focused');
	mainInput.value = nameCase;
	resetPokeStat(nameCase);
	mainInput.focus();
}


//keys control
document.addEventListener('keydown', function(e) {
	var focused;
	if(document.getElementById('pokemon') != document.activeElement || document.getElementsByClassName('focus-on')[0] != null) {
    	focused = document.getElementsByClassName('focus-on')[0];
    	if (e.keyCode == '38') {  //up
     		focused.removeAttribute('class');
    		if(focused == document.getElementsByTagName('Li')[0]) {
	        	mainInput.focus();
	        } 
	        else {
	        	focused.previousElementSibling.setAttribute("class", 'focus-on');
	        	mainInput.blur();
	        }
	    } 
	    else if (e.keyCode == '40') { //down
	    	if(focused == document.getElementsByTagName('Li')[4]) {

	    	} 
	    	else {
		    	focused.removeAttribute('class');
		        focused.nextElementSibling.setAttribute("class", 'focus-on');
		        mainInput.blur();
		    }
	    }
	    else if (e.keyCode == '13') { //enter
	    	if(document.getElementById('focused') != null) {
		    	document.getElementById('focused').removeAttribute('id');
		    }
	        mainInput.value = focused.getAttribute('data');
	        mainInput.focus();
	        focused.setAttribute("id", 'focused');
	        resetPokeStat(focused.getAttribute('data'));
	    }
    } 
    else {
    	focused = document.getElementById('pokemon');
    	//try {document.getElementById('focused').removeAttribute('id');} catch(err) {}
		if (e.keyCode == '40') { //down
	        focused.blur();
	        document.getElementsByTagName('Li')[0].setAttribute("class", 'focus-on');
	    }
	    else if (e.keyCode == '13') { //enter
			resetPokeStat(focused.getAttribute('data'));
	    }
    }
});

//display poke stats
var focusedPokemon;
function call_response_pokemon(responseText){ 
	//alert(responseText);
	try {
		var parent = document.getElementById("pokemon-stat-wrapper");
		var child = document.getElementById("table");
		parent.removeChild(child);
	} 
	catch(err) {
    	
	}


	focusedPokemon = JSON.parse(responseText);
	var pokemonCharacteristic = focusedPokemon.stats;
	var pokemonAbilities = focusedPokemon.abilities;
	var table = document.createElement("table");
	table.setAttribute("id", 'table');
	pokemonCharacteristic.forEach(function callback(value, index, arr) {
		var tr = document.createElement("tr");
  		var th1 = document.createElement("th");     // Create a <th> element
  		var th2 = document.createElement("th"); 
		var namaFild = document.createTextNode(focusedPokemon.stats[index].stat.name);
		var namaValue = document.createTextNode(focusedPokemon.stats[index].base_stat);
		table.appendChild(tr);
		tr.appendChild(th1);    
		tr.appendChild(th2);
		th1.appendChild(namaFild);  
		th2.appendChild(namaValue);  
	});
	pokemonAbilities.forEach(function callback(value, index, arr) {
		var tr = document.createElement("tr");
  		var th1 = document.createElement("th");     // Create a <th> element
  		var th2 = document.createElement("th"); 
		var namaFild = document.createTextNode('Ability ' + (index + 1));
		var namaValue = document.createTextNode(focusedPokemon.abilities[index].ability.name);
		table.appendChild(tr);  
		tr.appendChild(th1);    
		tr.appendChild(th2);
		th1.appendChild(namaFild);  
		th2.appendChild(namaValue);  
	});
	pokemonStatsWrapper.appendChild(table);   
}


function resetPokeStat(focused) {
	if(focused != null) {
		var link = 'http://www.pokeapi.co/api/v2/pokemon/' + focused;
		httpGetAsync(link,  call_response_pokemon);
	}
}


//dropdown click controll
document.getElementsByTagName('html')[0].addEventListener('click', function(e) {
	if(e.target != document.getElementById('pokemon') && e.target != document.getElementById('focused')){
		try {
		document.getElementById("pokemon-dropdown").style.display = "none";
		} 
		catch(err) {
			
		}
	}
});


mainInput.addEventListener('click', function() {
	try {
		document.getElementById("pokemon-dropdown").style.display = "block";
	}
	catch(e) {

	}
});
