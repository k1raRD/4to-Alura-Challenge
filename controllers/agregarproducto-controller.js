import { productServices } from "../service/producto-service.js";
let imagenBase64="";

const urlActual = window.location.search;
const SearchParams = new URLSearchParams(urlActual);

let idEditado = "";


const botonSubir = document.querySelector("#botonsubir");
botonSubir.addEventListener("click",clickSubir);

const divImagen = document.querySelector("#imgsubida");
divImagen.addEventListener("click", clickImgsubida);

const botonAgregar = document.querySelector("#botonagregar");
botonAgregar.addEventListener("click", agregarProducto);

if(SearchParams.get("editar")!==null) 
  {
    idEditado = SearchParams.get("editar");
    console.log("Editando: " + idEditado);
    const botonAgregar = document.querySelector("#botonagregar");
    botonAgregar.innerHTML = "Modificar producto";

    //LEER DATOS

    productServices.verProducto(idEditado).then((data)=>{
      console.log("leyendo producto");
      
      //Limpio el formato del base64 para que funcione con style.backgroundImage;
      let url=data.imagen;
      url = url.replace(/(\r\n|\n|\r)/gm, "");
      //--
      divImagen.style.backgroundImage = "url('" + url + "')";
      bImagenCargada = true;
      document.querySelector("#nombreagregado").value = data.nombre;
      document.querySelector("#precioagregado").value = data.precio;
      document.querySelector("#descripcionagregado").value = data.descripcion;
      document.querySelector("#selectcategoria").value = data.categoria;

  })

    //---


  }

var imgSubida;
var listaArchivos;
var bImagenCargada = false;

// Arrastrar sobre el div
divImagen.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Definir que soltar haga una operación de copia.
  event.dataTransfer.dropEffect = 'copy';
});

// Soltar en el div
divImagen.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  listaArchivos = event.dataTransfer.files;
  
  readImage(listaArchivos[0]);
});

// Convertir la imagen a Data URI
const readImage = (file) => {
  imagenBase64 = "";
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    imgSubida = event.target.result;
    console.log(imgSubida);
    imagenBase64 = imgSubida;
    divImagen.style.backgroundImage = `url(${imgSubida})`;
  });
  reader.readAsDataURL(file);
  bImagenCargada = true;
}

function clickImgsubida()
{
  if(screen.width < 768){clickSubir()};
}

function clickSubir() {
  //Creo un campo input para recibir el archivo
  let input = document.createElement('input');
  input.type = 'file';
  input.accept="image/*";
  //Defino el evento onchange del campo input que acabo de crear
  input.onchange = _ => {
            listaArchivos =   Array.from(input.files);
            console.log(listaArchivos);
            readImage(listaArchivos[0]);
        };
  //Llamo al evento click de mi input recién creado
  input.click();
}

function agregarProducto() {

  var szNombre = document.querySelector("#nombreagregado").value;
  var szPrecio = document.querySelector("#precioagregado").value;
  var szDescripcionagregado = document.querySelector("#descripcionagregado").value;
  var szCategoriaagregado = document.querySelector("#selectcategoria").value;
  var szError = "";

  if(szCategoriaagregado == "") {szError += "Debe seleccionar una categoría para el producto<br>";}
  if(szNombre == "") { szError += "El campo nombre no puede estar en blanco.<br>";}
  if(szNombre.length > 20 ) { szError += "El campo nombre no puede tener más de 20 caraceres.<br>"}
  if(szPrecio == "") { szError += "El campo precio no puede estar en blanco.<br>";}
  if(szDescripcionagregado == "") { szError += "El campo descripción no puede estar en blanco.<br>";}
  if(szDescripcionagregado.length > 150 ) { szError += "El campo descripción no puede tener más de 150 caraceres.<br>"}
  if(!bImagenCargada) { szError += "Debe subir una imagen para el producto.<br>"};

  document.querySelector("#erroragregar").innerHTML = szError;

  if(szError == "")
  {
    if(idEditado=="")
    {

      productServices.crearProducto(szNombre, szPrecio, szDescripcionagregado, szCategoriaagregado, imagenBase64).then(() => {
        alert("Producto agregado correctamente.");
        document.querySelector("#selectcategoria").value = "";
        document.querySelector("#nombreagregado").value = ""; 
        document.querySelector("#precioagregado").value = ""; 
        document.querySelector("#descripcionagregado").value = "";
      }).catch(err => console.log(err))
      if(screen.width < 768){
        divImagen.style.backgroundImage = "url('./img/agregarfoto.png')";
      }
      else
      {
        divImagen.style.backgroundImage = "url('./img/arrastre.png')";
      }

    }
    else
    {
      if(confirm("¿Está seguro de que desea modificar el producto?"))
                {
                  // alert("Se va a modificar el producto");
                  imagenBase64 = document.querySelector("#imgsubida").style.backgroundImage;
                  
                  //limpio la cadena de Base64
                  imagenBase64 = imagenBase64.replace("url(\"", "");
                  imagenBase64 = imagenBase64.replace("\")", "");

                  // console.log(imagenBase64);

                  productServices.actualizarProducto(szNombre, szPrecio, szDescripcionagregado, szCategoriaagregado, imagenBase64, idEditado).then(() =>
                  {
                    alert("Producto modificado correctamente.");
                  })
                }
    }

  }
}