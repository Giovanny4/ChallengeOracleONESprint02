;(function(){
'use strict'

	var palabras = [
		"ORACLE",
		"ALURA",
		"EDUCACION",
		"SISTEMAS",
		"LENGUAJES",
		"PROGRAMAS",
		"INTELIGENCIA"
	]

	//Para agregar una nueva palabra:
	//palabra.push("NUEVAPALABRA")

	// Creando la configuración; variable para el almacenamiento actual:
	var juego = null

	//Validando si se arroja una alerta:
	var finalizando = false

	var $html = {
		persona: document.getElementById("persona"),
		adivina: document.querySelector(".adivina"),
		fallado: document.querySelector(".fallado")
	}

	//Creando la función:
	function dibujar(juego)
	{
		//Actualizando la imagen del id persona:
		var $elemento
		$elemento = $html.persona

		var estado = juego.estado
		if(estado === 8)
		{
			estado= juego.previo
		}

		$elemento.src = "./images/state/0" + estado + ".png" 

		//Creando las letras a adivinar:
		var palabra = juego.palabra
		var adivina = juego.adivina
		$elemento = $html.adivina

		//Borrando los elementos anteriores:
		$elemento.innerHTML = ""
		for(let letra of palabra)
		{
			let $span = document.createElement("span")
			let $texto = document.createTextNode("")
			if(adivina.has(letra))
			{
				$texto.nodeValue = letra
			}

			$span.setAttribute("class", "letra adivinada")
			$span.appendChild($texto)
			$elemento.appendChild($span)
		} 

		//Creando las letras erradas:
		var fallado = juego.fallado
		$elemento = $html.fallado

		//Borrando los elementos anteriores:
		$elemento.innerHTML = ""
		for(let letra of fallado)
		{	
			let $span = document.createElement("span")
			let $texto = document.createTextNode(letra)
			$span.setAttribute("class", "letra fallida")
			$span.appendChild($texto)
			$elemento.appendChild($span)
		}
	}

	//Función de transición del juego:
	function adivinar(juego, letra)
	{
		var estado = juego.estado

		//Si el usuario a perdido, o ha ganado; no hay que realizar más acciones.
		if(estado === 1 || estado === 8)
		{
			return
		}

		var adivina = juego.adivina
		var fallado = juego.fallado

		//Si ya se ha adivinado o a fallado; no hay que realizar más acciones
		if(adivina.has(letra) || fallado.has(letra))
		{
			return
		}

		var palabra = juego.palabra
		var letras = juego.letras

		//Si la letra de la palabra es:
		if(letras.has(letra))
		{
			//Agregando a lista de las palabras:
			adivina.add(letra)

			//Actualizando las letras restantes:
			juego.restante--

			//Si ya se ha ganado, se debe de indicar:
			if(juego.restante === 0)
			{
				juego.previo = juego.estado
				juego.estado = 8
			}
		   }else{
			//Si no es una letra de la palabra, la persona se acerca al un paso más hacía la horca:
			juego.estado--

			//Agregando la letra en la lista de letras incorrectas:
			fallado.add(letra)
		}
	}

	window.onkeypress = function adivinarLetra(e)
		{
			var letra = e.key
			letra = letra.toUpperCase()
			if(/[^A-ZÑ]/.test(letra))
			{
				return
			}

			adivinar(juego, letra)
			var estado = juego.estado
			if(estado === 8 && !finalizando)
			{
				setTimeout(alertaGanador, 0)
				finalizando = true
			}else if(estado === 1 && !finalizando){

			 	let palabra = juego.palabra
			 	let fn = alertaPerdido.bind(undefined, palabra)
			 	 setTimeout(fn, 0)
			 	 finalizando = true
			}
			dibujar(juego)
		}

		window.nuevoJuego = function nuevoJuego()
		{
			var palabra = palabraAleatoria()
			juego = {}
			juego.palabra = palabra
			juego.estado = 7
			juego.adivina = new Set() 
			juego.fallado = new Set() 
			finalizando = false

			var letras = new Set()
			for(let letra of palabra)
			{
				letras.add(letra)
			}
			juego.letras = letras
			juego.restante = letras.size			

			dibujar(juego)
			console.log(juego)
		}

		function palabraAleatoria()
		{
			var index = ~~(Math.random() * palabras.length)
			return palabras[index]
		}

		function alertaGanador()
		{
			alert("Felicitaciones, ¡Adivinaste la palabra!")
		}

		function alertaPerdido(palabra)
		{
			alert("Lo sento, has perdido :( la palabra era: " + palabra)
		}

		nuevoJuego()
}())