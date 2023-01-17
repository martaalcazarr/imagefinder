const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);

}

function validarFormulario(e){
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value;
    if(terminoBusqueda === ''){
        mostrarAlerta('Please, add a search term.')
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
    const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center' );
    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>  
    <span class="block sm:inline>">${mensaje}</span>
    `
    formulario.appendChild(alerta);

    setTimeout(()=>{
        alerta.remove()
    }, 3000);
    }
}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;
    const key = '32876804-36d41b6a2d118a702883145a3';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado =>{
        //console.log(resultado)
        totalPaginas = calcularPaginas(resultado.totalHits);
        //console.log(totalPaginas)
        mostrarImagenes(resultado.hits);
    })
}

//generador que registrará la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i = 1; i<= total; i++){
       yield i;
    }
}

//para calcular el total de paginas (redondeado hacia arriba 
//con math.ceil)que habra segun el numero de registros
//asignado en la variable registrosporpagina
function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina))
}

function mostrarImagenes(imagenes){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    //iterar sobre el arreglo de imagenes y construir html
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white"> 
                <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light"> Likes </span> </p>
                        <p class="font-bold mb-2">${views} <span class="font-light"> Times Seen </span> </p>
                        <a class="w-full bg-green-800 hover:bg-green-600 text-white uppercase font-bold text-center rounded mt-5 p-1"
                        href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            See image
                        </a>
                    </div>

            </div>
        </div>
        `
    });

    //limpiar el paginador previo

    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

   imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    //para despertar el *generador, uso .next, despierta y vuelve a dormir
    //console.log(iterador.next().done);
    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        //sino, genera boton por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'justify-around', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'rounded' );

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
        

    }
}