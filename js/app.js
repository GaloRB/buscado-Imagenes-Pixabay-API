const resultado = document.querySelector('#resultado');
const form = document.querySelector('#formulario');
const paginationDiv = document.querySelector('#paginacion');
const resultsPerPage = 30;
let totalPages;
let iterator;
let currentlyPage = 1;

window.onload = () =>{
    form.addEventListener('submit', validateForm);

    function validateForm(e){
        e.preventDefault();
        
        const searchTerm = document.querySelector('#termino').value;

        if(searchTerm === ''){
        showAlert('Agrega un termino de busqueda');
        return;
        }

        searchImgs();

        
    }

    function showAlert(msg){

        const alertExist = document.querySelector('.bg-red-100');

        if(!alertExist){
            const alert = document.createElement('P');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto',  'mt-6', 'text-center');

        alert.innerHTML=`
            <srtong class="font-bold">Error!</strong>
            <span class="block sm:inline">${msg}</span>
        `;

        form.appendChild(alert);

        setTimeout(() => {
            alert.remove()
        }, 2000);
    }
    }

    function searchImgs(searchTerm){
        const term = document.querySelector('#termino').value;
        const key = '17984000-3e8b964af67202b547ac3a1bd';
        const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${resultsPerPage}&page=${currentlyPage}`;

        fetch(url)
                .then(response => response.json())
                .then(result => {
                    totalPages = calcPages(result.totalHits)
                    showImgs(result.hits);
                });
    }

    function showImgs(resultImgs){
            //console.log(resultImgs);

            clearDiv(resultado);

        resultImgs.forEach(result => {
            const {previewURL, likes, views, largeImageURL} = result;

            resultado.innerHTML += `
                <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <div class="bg-white">
                        <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer"><img class="w-full h-40 object-cover" src="${previewURL}"></a>
                        <div class="p-4">
                            <p class"font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                            <p class"font-bold">${views} <span class="font-light">Veces vista</span></p>
                            <a class="w-full block bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                                Ver Imagen
                            </a> 
                        </div>
                    </div>
                </div>
            `;
        });  
        
        //limpiar div del paginador
        clearDiv(paginationDiv);

        // imprimir paginador
        printPager();
        
    };


    function calcPages(total){
        return parseInt(Math.ceil(total / resultsPerPage))
    }

    // genera el paginador
    function* createPager(total){
        console.log(total);
        for (let i = 1; i <= total; i++) {
            yield i;
            
        }
    }   

    function printPager(){
        iterator = createPager(totalPages);
        while(true){
            const {value, done} = iterator.next();
            if(done) return;

            //Caso contrario genera un botón por cada elemento en el generador
            const button = document.createElement('a');
            button.href = "#";
            button.dataset.page = value;
            button.textContent = value;
            button.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-3', 'uppercase', 'rouded');
            paginationDiv.appendChild(button);

            button.onclick = () =>{

                currentlyPage = value;
                //console.log(currentlyPage);
                searchImgs();
            }
        }
    }

    function clearDiv(div){
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
    }

}