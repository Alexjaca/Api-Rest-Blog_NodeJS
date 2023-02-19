const{ connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Inicializar App
console.log('Iniciando index.js...');

//Conectar a la Base de datos
connection();

//Crear servidor de Node
const app = express();
const puerto = 3900;

//configurar cors
app.use(cors());

//convertir body a objeto json
app.use(express.json());//Recibir datos de content-type app/json
app.use(express.urlencoded({ extended:true})); //Poder recibir parametros x-www-form-urlencode de formularios


//Crear Rutas
app.get('/probando', (req, res) =>{
    console.log('Se ha ejecutando el endpoint Probando');
    return res.status(200).send([{
        curso: 'Api rest con NodeJs',
        autor: 'Alex Cardenas',
        academia: 'UDEMY'
    },
    {
        curso: 'Api rest con NodeJs',
        autor: 'Alex Cardenas',
        academia: 'UDEMY'
    }
]);
});


//CARGA DE LAS RUTAS
const rutas_articulo = require("./routes/article");
const { urlencoded } = require("express");


//RUTAS TEST HARDCODEADA
app.use("/api", rutas_articulo);


//Crear el servidor y escuchar peticiones
app.listen(puerto, ()=>{
    console.log('Servidor corriendo en el puerto '+ puerto);
});

