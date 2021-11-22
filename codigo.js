
const divStop  = document.getElementById("divStop"),
    selectAlg =  document.getElementById("algoritmos"),
    main =       document.getElementById("main-content"),
    divBotones = document.querySelector(".botones"),
    btnsMetodos= document.querySelectorAll(".botones button"),
    reset = document.getElementById("reset"),
    filaVel = document.getElementById("filaVel"),
    minValue = 0, maxValue = 40;
    
let n = 20,latencia = 30,status,quickPendientes;

revolver();
inicializar();

 const height = $(window).height();
 
function revolver(){
    let i = 0;
    elementos = Array.from({length: n},() => ((maxValue / n * ++i) + 1));
    for(i = 0; i < n - 1; i++){
        const aux = elementos[i];
        const rand = getRand(i, n - 1);
        elementos[i] = elementos[rand];
        elementos[rand] = aux;
    }
}

function inicializar(){
    main.setAttribute("class",n<=200? 'pocos':'');
    texto = '';
    for(let i = 0; i < n; i++)
        texto+=`<div style="height: ${elementos[i]}vh;
             width: calc(100% / ${n}); max-width:50px;">
                <span></span>
             </div>`;
    main.innerHTML = texto;
    $(main).children().hover(async function(){
        const text = Math.round((n / maxValue) * ($(this).height() * 100 / height - 1));
        //const text =Math.round($(this).height() * 100) / 100 ;
        $(this).children("span").html(text).show();
    });
}



function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + parseInt(min);
}


for(let i = 0; i < btnsMetodos.length; i++){
    btnsMetodos[i].addEventListener("click",function(){
        ordenar(this.getAttribute("metodo"));
    });
}

async function ordenar(metodo){
    nota1 = new (window.AudioContext || window.webkitAudioContext)();
    //nota2 = new (window.AudioContext || window.webkitAudioContext)();
    ocultarControles();
    status = "running";
    switch(metodo){
        case "burbuja":   burbuja();   break;
        case "seleccion": seleccion(); break;
        case "insercion": insercion(); break;
        case "shell":     shell();     break;
        case "merge":     
            //merge();   
            mergeAsync(1);  
            break;
        case "quick":  quickPendientes = 0;
             quick(elementos, 0 , n - 1);  
             break;
        case "count":                  break;
    }
}



async function burbuja(){
    for(let i = 0; i < n - 1; i++){
        if(latencia == 0 && i % 10 == 0)await sleep(0);
        for(let j = 0; j < n - i - 1; j++){
            pintar(j,"azul");
            pintar(j + 1 ,"azul")
            
            if(latencia > 0)await sleep(latencia);
            if(elementos[j] > elementos[j + 1]){
                let aux = elementos[j];
                elementos[j] = elementos[j + 1];
                elementos[j + 1] = aux;   
                swap(j, j + 1);
                if(latencia > 0)await sleep(latencia);
            }
            pintar(j, "blanco");
            pintar(j  + 1,"blanco")
            if(status=="stop")return;
        }
        pintar(n - i - 1, "verde");
    }
    pintar(0, "verde");
   mostrarControles();
}

async function seleccion(){
    for(let i = 0; i < n - 1; i++){
        let min = i;
        
        if(latencia == 0 && i % 10 == 0) await sleep(0);
        pintar(i,"azul");
        for(let j = i + 1; j < n; j++){
            pintar(j,"azul");
            if(latencia > 0) await sleep(latencia);
            if(elementos[min] > elementos[j]){
                if(min != i)
                    pintar(min,"blanco");
                
                min = j;
                pintar(j,"rojo");
                if(latencia > 0) await sleep(latencia);
            }else pintar(j,"blanco");
            if(status=="stop")return;
        }
        if(min != i){
            let aux = elementos[i];
            elementos[i] = elementos[min];
            elementos[min] = aux;  
            swap(i,min);
            pintar(min,"blanco");
        }pintar(i,"verde");
    }
    pintar(n - 1,"verde");
   mostrarControles();
}

async function insercion(){
    for(let i = 1; i < n; i++){
        let j = i;
        pintar(j,"verde");
        pintar(j - 1,"azul");
        if(latencia == 0 && i % 10 == 0) await sleep(0);
        if(latencia > 0) await sleep(latencia);
        while(elementos[j] < elementos[j - 1]){
            let aux = elementos[j];
            elementos[j] = elementos[j - 1];
            elementos[j - 1] = aux;  

            item1 = main.childNodes[j];
            item2 = main.childNodes[j - 1];
            if(j!= i) pintar(j,"azul");
            pintar(j - 1,"azul");
            if(latencia > 0) await sleep(latencia);
            swap(j,j - 1);
            if(latencia > 0) await sleep(latencia);
            if(j!=i) pintar(j,"blanco");
            pintar(j - 1,"blanco");
            if(j-- == 0) break;
            if(status=="stop")return;
        }
        pintar(i,"blanco");
        pintar(i - 1,"blanco");

    }
    for(let i = 0; i < n; i++){
        if(latencia > 0) await sleep(latencia / 2);
        pintar(i,"verde");

    }
   mostrarControles();
    
}

function shellSimplificado(){
    let k = Math.floor( n / 2);
    while(k >= 1){
        for(let i = 0; i < n - k; i++){
            let j = i;
            let aux = elementos[j + k];
            while(elementos[j] > aux){
                elementos[j + k] = elementos[j];
                j -= k;
                if(j < 0) break;
            }
            elementos[j + k] = aux;
        }
        k = Math.floor(k / 2);
    }
}

async function shell(){
    let k = Math.floor( n / 2); 
    while(k >= 1){
        if(latencia == 0) await sleep(10);
        for(let i = 0; i < n - k; i++){ 
            let j = i;
            let aux = elementos[j + k];
            pintar(j,"azul");
            pintar(j + k,"azul");
            if(latencia > 0)await sleep(latencia);
            while(elementos[j] > aux){
                // pintar(j,"rojo");
                // pintar(j + k,"rojo");
                
                elementos[j + k] = elementos[j];
                setValue(j + k, getValue(j));
                if(latencia > 0)await sleep(latencia/2);
                pintar(j,"blanco");
                pintar(j + k,"blanco");
                j -= k;
                if(j < 0) break;
                pintar(j,"azul");
                pintar(j + k,"azul");
                if(latencia > 0) await sleep(latencia);

            }
            elementos[j + k] = aux;
            setValue(j + k, aux+"vh");
            if(j < 0) j += k;
            pintar(j,"blanco");
            pintar(j + k,"blanco");
            if(status=="stop")return;
        }
        k = Math.floor( k / 2);
    }
    for(let i = 0; i < n; i++){
        if(latencia > 0) await sleep(latencia / 2);
        pintar(i,"verde");
    }
   mostrarControles();
    
}

function mergeSimplificado(){
    let mitad = 1, k = 2;
    while(mitad < n){
        let array = [];
        for(let i = 0; i < n; i += k){
            const arrayA = elementos.slice(i, i + mitad);
            const arrayB = elementos.slice(i + mitad,  i + k);
            array = array.concat(getMerge(arrayA,arrayB));
        }
        elementos = array;
        mitad = k;
        k *= 2;
    }
}
function getMerge(arregloA,arregloB){
    let tamA = arregloA.length, tamB = arregloB.length,
        arregloC = [],  a = 0, b = 0;
    while(a < tamA && b < tamB){
        if(arregloA[a] <= arregloB[b])
            arregloC.push(arregloA[a++]);
        else  arregloC.push(arregloB[b++]);
    }
    while(a < tamA) arregloC.push(arregloA[a++]);
    while(b < tamB) arregloC.push(arregloB[b++]);
    
    return arregloC;
}

async function mergeAsync(mitad){
    let k = mitad * 2;
    let array = [];
    let fullArray = [];
    let pendientes = 0;
    if(latencia == 0) await sleep(10);

    for(let i = 0; i < n; i += k){
        pendientes++;
        if(status=="stop")return;
        getMergeAsync(i,k,mitad).then(function(res) {
            array[i / k] = res;
            pendientes--;
            if(pendientes == 0){
                for(j = 0; j < array.length; j++)
                    fullArray = fullArray.concat(array[j]);
                elementos = fullArray;
                if(k < n) mergeAsync(k);
            }
        });        
       
    }
}



async function getMergeAsync(i,k,mitad){
    let ultima = k >= n;
    const arregloA = elementos.slice(i, i + mitad);
    const arregloB = elementos.slice(i + mitad,  i + k);

    const tamA = arregloA.length, tamB = arregloB.length;
    let arregloC = [],  a = 0, b = 0, c = i;

    while(a < tamA || b < tamB){
        
        pintar(c, ultima? "verde":"azul");
        if(c + mitad < n)pintar(c + mitad,"azul");
        if(latencia > 0)await sleep(latencia);
        if(!ultima) pintar(c,"blanco");
        if(c + mitad < n)pintar(c + mitad,"blanco");
        if(a == tamA){
            setValue(c++,arregloB[b]+"vh");
            arregloC.push(arregloB[b++]);
            continue;
        }
        if(b == tamB){
            setValue(c++,arregloA[a]+"vh");
            arregloC.push(arregloA[a++]);
            continue;
        }
        if(arregloA[a] <= arregloB[b]){
            setValue(c++,arregloA[a]+"vh");
            arregloC.push(arregloA[a++]);
        }
        else{
            setValue(c++,arregloB[b]+"vh");
            arregloC.push(arregloB[b++]);               
        }        
    }
    if(ultima)mostrarControles();
    return arregloC;
}

async function merge(){
    let mitad = 1;
    let k = 2;
    while(mitad < n){
        if(latencia == 0) await sleep(10);
        let ultima = k > n;
        let array = [];
        for(let i = 0; i < n; i += k){
    
            const arregloA = elementos.slice(i, i + mitad);
            const arregloB = elementos.slice(i + mitad,  i + k);
    
            const tamA = arregloA.length, tamB = arregloB.length;
            let arregloC = [],  a = 0, b = 0, c = i;
    
            while(a < tamA || b < tamB){
                
                pintar(c, ultima? "verde":"azul");
                if(c + mitad < n)pintar(c + mitad,"azul");
                if(latencia > 0)await sleep(latencia);
                if(!ultima) pintar(c,"blanco");
                if(c + mitad < n)pintar(c + mitad,"blanco");
                if(a == tamA){
                    setValue(c++,arregloB[b]+"vh");
                    arregloC.push(arregloB[b++]);
                    continue;
                }
                if(b == tamB){
                    setValue(c++,arregloA[a]+"vh");
                    arregloC.push(arregloA[a++]);
                    continue;
                }
                if(arregloA[a] <= arregloB[b]){
                    setValue(c++,arregloA[a]+"vh");
                    arregloC.push(arregloA[a++]);
                }
                else{
                    setValue(c++,arregloB[b]+"vh");
                    arregloC.push(arregloB[b++]);               
                }                
                
            }
            array = array.concat(arregloC);
        }
        elementos = array;
        mitad = k;
        k *= 2;
    }
        
}
function partitionSimple(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], 
        i = left, j = right; 
    while (i <= j) {
        while (items[i] < pivot)  i++; 
        while (items[j] > pivot)  j--;
        if (i <= j) {
            var temp = items[i];
            items[i] = items[j];
            items[j] = temp;
            i++; j--;
        }
    }
    return i;
}

function quickSimplificado(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partitionSimple(items, left, right); 
        if (left < index - 1)
            quickSimplificado(items, left, index - 1);
        if (index < right) 
            quickSimplificado(items, index, right);
    }
    return items;
}




async function quick(items, left, right) {
    quickPendientes++;
    if(latencia == 0 && right - left > 50) await sleep(0);
    var index;
    if (items.length > 1) {
        var half = Math.floor((right + left) / 2),
            pivot   = items[half], //middle element
        i = left, j = right; //right pointer
        pintar(half,"rojo");
        while (i <= j) {
           
            while (items[i] < pivot) {
                
                if(i != half)pintar(i, "azul");
                if(latencia > 0) await sleep(latencia);
                i++;
                if(i - 1 != half)pintar(i - 1, "blanco");
                 if(status=="stop")return;

            }
            while (items[j] > pivot) {
                if(j != half)pintar(j,"azul");
                if(latencia > 0) await sleep(latencia);
                j--;

                if(j + 1 != half)pintar(j + 1, "blanco");
            }
            if(i != half)pintar(i, "azul");
            if(j != half)pintar(j,"azul");
            
            if (i <= j) {
                if(latencia > 0) await sleep(latencia);
                var temp = items[i];
                items[i] = items[j];
                items[j] = temp;
                swap(i,j);
                i++;
                j--;
            }
            
            if(i - 1 != half)pintar(i - 1, "blanco");
            if(j + 1 != half)pintar(j + 1, "blanco");
        }
        pintar(half,"blanco");
        index = i; //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quick(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quick(items, index, right);
        }
    }
    quickPendientes--;
    if(quickPendientes == 0){
        for(let i = 0; i < n; i++){
            if(latencia > 0) await sleep(latencia / 2);
            pintar(i,"verde");
           mostrarControles();
        }
    }
    return items;
}


function swap(div1, div2) {
    let aux = getValue(div1);
    setValue(div1, getValue(div2));
    setValue(div2, aux);
}
function getValue(i){
    return main.childNodes[i].style.height;
}
function setValue(i,value){
    main.childNodes[i].style.height = value;
}
function pintar(i,color){
    let hex = "";
    switch(color){
        case "verde": 
            Sonido(i);
            hex = "#53a653"; break;
        case "blanco": hex = "#eee"; break;
        case "azul":   hex = "#0041C2"; 
            Sonido(i);
            break;
        case "rojo":   hex = "#ff0000"; break;
    }
    main.childNodes[i].style.backgroundColor = hex;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms - 1));
}


divStop.addEventListener("click",function(){
    status="stop";
   mostrarControles();
    for(let i = 0; i < n; i++)
        pintar(i,"blanco");
});

// slider

  //Se cambia el numero de elementos
$("#inputN").on("change",function(){
    n = $(this).val();
    $("#spanN").html(n);
    revolver();
    inicializar();
    reset.style.display ="none";
});
    
$("#inputTime").on("change",function(){
    latencia = $(this).val();
    $("#spanTime").html(latencia);
});


function ocultarControles(){
    divStop.style.display = "block";
    divBotones.style.display = "none";
    reset.style.display ="none";
    filaVel.style.marginTop = "80px";
 }
function mostrarControles(){
    divBotones.style.display = "grid";
    divStop.style.display = "none";
    reset.style.display = "block";
    filaVel.style.marginTop = "0px";
}
reset.style.display ="none";
reset.addEventListener("click",function(){
    revolver();
    inicializar();
    reset.style.display ="none";
});
var nota1, nota2; 
var Sonidos= [261,277,293,311,329,349,369,392,415,440,466,493];
let notasActivas = 0;
function Sonido(valor){
    if(notasActivas > 2 || latencia < 10) return;
    valor = elementos[valor] * 10;
    //creamos oscilador
   const osc = nota1.createOscillator();

   gain = nota1.createGain();
// establece el valor inicial del volumen
gain.gain.value = .05;
   // admite: sine, square, sawtooth, triangle
   osc.type = 'square'; 
//    console.log("n: " + n);
//    console.log("x: " + valor);
//    valor = Math.round((valor -20) / (maxValue / n)) - 1;
//     valor = Math.floor(valor * 12 / n);
    // console.log("valor: "+valor);
  // osc.frequency.value=Sonidos[valor];
 // console.log(250 + ((valor / n) * 250));
  //osc.frequency.value=250 + ((valor / n) * 250);
  osc.frequency.value=250 + ((valor / 2));
   //asignamos el destino para el sonido
   osc.connect(gain);
   gain.connect(nota1.destination);
   //iniciamos la valor
 
   osc.start();
   ++notasActivas;
   const stopNote =(latencia / 1000) - .001;
   //detenemos la valor medio segundo despues
   osc.stop(nota1.currentTime + stopNote);
   setTimeout( () => --notasActivas, stopNote);
//osc.stop(context.currentTime + .01);
}