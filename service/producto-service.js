const REMOTO = true;

const servidorRemoto = "https://heroku-json-jmb.herokuapp.com/productos";
const servidorLocal = "http://localhost:3000/productos";
var servidorJSON = "";

if(REMOTO){
    servidorJSON = servidorRemoto;
}
else
{
    servidorJSON = servidorLocal;
}

const listaProductos = () => fetch(servidorJSON).then(respuesta => respuesta.json());
const verProducto = (idBuscado) => fetch(servidorJSON + "/" + idBuscado).then(respuesta => respuesta.json());
// const buscarPorNombre = (nombreBuscado) => {
//     const listaGeneral = listaProductos().then((data) => {
//         data.forEach(({nombre, precio, categoria, imagen, id}) => {
//             console.log(nombre);
//         });
//     }).then(return "prueba");
//     return "prueba";
// }

const crearProducto = (nombre, precio, descripcion, categoria, imagen) => {
    return fetch(servidorJSON, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({nombre, precio, descripcion, categoria, imagen, id: uuid.v4()}),

    })
}

const eliminarProducto = (id) => {
    return fetch(servidorJSON + "/" + id,
    {
        method: "DELETE",
    })
}

const actualizarProducto = (nombre, precio, descripcion, categoria, imagen, id) => {
    return fetch(servidorJSON + "/" + id,
    {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({nombre, precio, descripcion, categoria, imagen, id: uuid.v4()}),
    })
}

export const productServices = {
    // buscarPorNombre,
    verProducto,
    actualizarProducto,
    listaProductos,
    crearProducto,
    eliminarProducto,
}