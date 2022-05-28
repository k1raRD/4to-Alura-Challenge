import { productServices } from "../service/producto-service.js";

const urlActual = window.location.search;
const SearchParams = new URLSearchParams(urlActual);

var busquedaPorNombre = false;
var categoriaElegido = "";
let verTodo = "";
// if(SearchParams.has("vertodo"))
// {
    verTodo = SearchParams.get("vertodo")=="true";
// }
let getNombre = ""
getNombre = SearchParams.get("nombre");
if(getNombre !== null) {
    console.log("Se está buscando por nombre: " + getNombre);
    buscarPorNombre();
}

let formBuscar = document.querySelector(".form-buscar");

//Para buscar por nombre parcial o total
function buscarPorNombre()
{
    const listaGeneral = productServices.listaProductos().then((data) => {
        var newArray = data.filter(function (filtrado) {
    return filtrado.nombre.toLowerCase().includes(getNombre.toLowerCase()) ||
        filtrado.descripcion.toLowerCase().includes(getNombre.toLowerCase());
     });
   busquedaPorNombre = true;
   llenarProductos(newArray);
});    
}
    
let idBuscado = "";
if(SearchParams.has("id")) {
    idBuscado = SearchParams.get("id");
 }

if(idBuscado==""){
    document.querySelector("#productoelegido").style.display = "none";
}
else
{
    // console.log("Buscando por id");
    productServices.verProducto(idBuscado).then((data)=>{
    
        document.querySelector("#imagenelegido img").src = data.imagen;
        document.querySelector("#imagenelegido img").style.width = "560px";
        document.querySelector("#tituloelegido").innerHTML = data.nombre;
        document.querySelector("#precioelegido").innerHTML = data.precio;
        document.querySelector("#descripcionelegido").innerHTML = data.descripcion;
        categoriaElegido = data.categoria;

        const linkEliminar = document.querySelector("#linkeliminar");
        linkEliminar.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
           
            if(confirm("¿Está seguro de que desea eliminar el producto?"))
                {
                        document.querySelector("#productoelegido").style.display = "none";
                        productServices.eliminarProducto(idBuscado).then(()=>{
                        // alert("Producto eliminado.");
                        idBuscado = "";
                        window.location.href = "index.html?vertodo=true";
                    });
                }
        } );

        const linkEditar = document.querySelector("#linkeditar");
        linkEditar.href = "agregarproducto.html?editar=" + idBuscado;
    })
}



const listarProducto = (nombre, precio, categoria, imagen, id) => {
    const linea = document.createElement("div");
    linea.className = "itemproducto";
    const contenido = ` <div class="imagenproducto"><img src="${imagen}"></div>
    <div class="tituloproducto">${nombre}</div>
    <div class="precioproducto">\$${precio}</div>
    <div class="linkproducto"><a href="index.html?id=${id}">Ver producto</a></div>`;
    linea.innerHTML = contenido;
    return linea;
}

function llenarProductos(filtrado = null){
    
    productServices.listaProductos().then((data) => {
        let maxItems = 6; //Máximo de productos por categoría en vista de categorías
    
        //Cambio el máximo de productos para tablet
        if (window.matchMedia("(min-width: 768px)").matches && window.matchMedia("(max-width: 1365px)").matches){
            // console.log("tablet");
            maxItems=4;
        }
        //Y para celular
        if (window.matchMedia("(max-width: 767px)").matches){
            // console.log("celular");
            maxItems=2;
        }
    
        let productosMostrados = {
            starwars: "0",
            consolas: "0",
            diversos: "0" 
        }
        
    
        //Si estoy buscando por nombre borro el contenido de todas las categorías


        if(filtrado!==null)
        {
            // alert("asfasf");
            const todasLasCategorias = ["todo", "starwars", "consolas", "diversos"];
            todasLasCategorias.forEach((nombreCategoria) => {
                document.querySelector(".lista" + nombreCategoria).innerHTML = "";
                console.log("Borrando .lista" + nombreCategoria);
            })
            const productoElegido = document.querySelector("#productoelegido");
            productoElegido.style.display = "none";
            data = filtrado;
            verTodo = true;
        }

        //---

        //Si no di la orden de mostrar todos los productos...
        if(!verTodo){
            //busco el div de la categoría de todos los productos buscando el parent del de la lista y lo oculto
            const parentCategoria = document.querySelector(".listatodo").closest(".categoria");
            parentCategoria.style.display="none";
        }
        else{
            //oculto los divs de las otras categorías para mandar todo a la general
            const ocultarCategorias = ["starwars", "consolas", "diversos"];
            ocultarCategorias.forEach((nombreCategoria) => {
                    const parentCategoria = document.querySelector(".lista" + nombreCategoria).closest(".categoria");
                    parentCategoria.style.display="none";
                })
            //oculto el banner
            document.querySelector("#banner").style.display = "none";

            //Muestro la lista de todas las categorias
            const parentTodo = document.querySelector(".listatodo").closest(".categoria");
            parentTodo.style.display="block";
            
            //Si llegué por búsqueda, cambio el título
            if(filtrado!==null)
            {
                const tituloTodo = document.querySelector(".titulotodo");
                tituloTodo.innerHTML = "Resultados de la búsqueda";
            }
            
        }

        data.forEach(({nombre, precio, categoria, imagen, id}) => {
            let listaCategoria = "";
            let nuevaLinea = "";
            //console.log(verTodo==true);
            if(verTodo)
            {
                // console.log("ok");
                listaCategoria = document.querySelector(".listatodo");
                //console.log(listaCategoria.closest(".categoria").innerHTML);
                nuevaLinea = listarProducto(nombre, precio, categoria, imagen, id); 
                listaCategoria.appendChild(nuevaLinea);
            }
            else
            {
                listaCategoria = document.querySelector(".lista" + categoria);
                productosMostrados[categoria]++;
                // console.log("Mostrados " + categoria + "=" + productosMostrados[categoria]); 
                if(productosMostrados[categoria]<= maxItems)
                {
                    nuevaLinea = listarProducto(nombre, precio, categoria, imagen, id); 
                    listaCategoria.appendChild(nuevaLinea);
                }
            }
    
          
        
    });
    })

}

llenarProductos();


//AGREGAR .catch((error) => alert("Error en la operación: " + error));