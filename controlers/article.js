const Article = require("../models/Article");
const { ValidateArticle } = require("../helpers/validate");
const fs = require("fs");//filesystem se usa para eliminar archivos
const path = require("path");//extrater archivo desde la ruta

///////////////////////////////////////////////////////////////////////////////////////////////
const test = (req, res) => {
    return res.status(200).json({
        mensaje: 'soy una accion de prueba'
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////
const curso = (req, res) => {
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
}

///////////////////////////////////////////////////////////////////////////////////////////////
const save = (req, res) => {

    //Recoger parametros por POST a guardar
    let params = req.body;


    //Validar datos
    try {
        ValidateArticle(params);

    } catch (err) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan datos para ingresar'
        });
    }


    //Crear el opbjeto a guardar
    //FORMA AUTOMATICA PASANDO PARAMS AL OBJETO
    const article = new Article(params);


    //Asignar valores a objeto basado en modelo (manual o automatico)
    //article.title = params.title;  //FORMA MANUAL


    //Guardar articulo en la base de datos
    article.save((err, SavedArticle) => {
        if (err || !SavedArticle) {
            return res.status(400).json({
                status: 'error',
                message: 'Articulos no fueron guardados'
            });
        }


        //Devolver resultadop
        return res.status(200).json({
            status: 'success',
            message: 'Saved Article',
            SavedArticle

        });

    });
}

///////////////////////////////////////////////////////////////////////////////////////////////
const ListArticles = (req, res) => {

    let consulta = Article.find({});

    //si le paso el parametro /last me pone limite a la consulta de solo 3
    if (req.params.last) {
        consulta.limit(3);
    }

    //ordenando por fecha en orden contrario
    consulta.sort({ date: -1 })
        .exec((err, articles) => {

            if (err || !articles) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Articulos no Encontrados en la Base de datos'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
}

///////////////////////////////////////////////////////////////////////////////////////////////
const ListArticlesById = (req, res) => {
    //recoger parametro pòr la url
    let id = req.params.id;

    //hacer la busqueda del articulo
    Article.findById(id, (err, article) => {

        //si no existe devolver error

        if (err || !article) {
            return res.status(404).json({
                status: 'error',
                message: 'Articulo no Encontrados en la Base de datos'
            });
        }

        //mostrar datos

        return res.status(200).send({
            status: 'success',
            article
        });

    });
}

///////////////////////////////////////////////////////////////////////////////////////////////
const Delete = (req, res) => {

    let articleId = req.params.id;

    Article.findOneAndDelete({ _id: articleId }, (err, deletedArticle) => {

        if (err || !deletedArticle) {
            return res.status(404).json({
                status: 'error',
                message: 'Articulo no Encontrado para ser Borrado'
            });
        }


        let image = deletedArticle.image;
        let ruta_fisica = "./images/articles/"+image;

        //ELIMINANDO LA IMAGEN TAMBIEN AL ELIMINAR EL ARCHIVO
        if(ruta_fisica){
            fs.unlink(ruta_fisica, (err) =>{
                if(err){
                    console.log("No se puro eliminar la Imagen!!!!");
                }
            });
        }

        return res.status(200).send({
            status: 'success',
            Article: deletedArticle,
            message: 'Articulo borrado correctamente!!!'
        });
 
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////
const Edit = (req, res) => {

    let articleId = req.params.id;

    //recoger datos del body
    let params = req.body;

    //Validar datos
    try {
        ValidateArticle(params);
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan datos para ingresar'
        });
    }



    //buscar y actualizar                    {new: true} me devuelve el opbjeto actualziado recientemente
    Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, updateArticle) => {

        if (err || !updateArticle) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al Actualizar'
            });
        }

        //devolver respuesta
        return res.status(200).json({
            status: 'success',
            article: updateArticle
        });

    });
}


///////////////////////////////////////////////////////////////////////////////////////////////
const UploadFile = (req, res) => {

    //configurar libreria multer para subir archivos en el archivo de rutas

    //recoger archivo de imagen subida
    if (!req.file && !req.files) {
        res.status(400).json({
            status: 'error',
            message: 'Peticion invalida!!'
        });
    }

    //nombree del archivo
    let file = req.file.originalname;

    //extension del archivo
    let file_split = file.split("\.");
    let extension_file = file_split[1];

    //comprobar extenxion correcta
    if (extension_file != "png" && extension_file != "jpg" &&
        extension_file != "jpeg" && extension_file != "gif") {

        //Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (err) => {
            res.status(400).json({
                status: 'error',
                message: 'Extenxion de la Imagen Invalida!!!!!!'
            });
        });

    } else {

        let articleId = req.params.id;

        //buscar y actualizar                    {new: true} me devuelve el opbjeto actualziado recientemente
        Article.findOneAndUpdate({ _id: articleId }, {image: req.file.filename}, { new: true }, (err, updateArticle) => {

            if (err || !updateArticle) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al Actualizar'
                });
            }

            //devolver respuesta
            return res.status(200).json({
                status: 'success',
                article: updateArticle,
                updatefile: req.file
            });

        });
    }

}


///////////////////////////////////////////////////////////////////////////////////////////////
const image = (req, res) =>{
    let fichero = req.params.fichero;
    let ruta_fisica = "./images/articles/" + fichero;

    fs.stat(ruta_fisica, (err, existe)=>{

        if(existe){
            res.sendFile(path.resolve(ruta_fisica)); //extrae arhivo desde la ruta fisica y lo muestra
        }else{
            res.status(404).json({
                status: 'error',
                messasge: 'Imagen no encontrada en la Base de Datos',
                err
            });
        }
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////
const search = (req, res) =>{
    //sacar el string de la url
    let search = req.params.search;

    //Find or
    Article.find({ "$or": [
        {"title": { "$regex": search, "$options": "i"}},
        {"content": { "$regex": search, "$options": "i"}}
    ]})
    .sort({date: -1}) //ordenar
    .exec((err, ArticulosEncontrados) =>{ //ejecutar consulta
        if(err || !ArticulosEncontrados || ArticulosEncontrados.length <= 0){
            res.status(404).json({
                status: 'error',
                messasge: 'No hay resultados de la busqueda',
                error: err
            });
        }else{ //devolver resultad0
            res.status(200).send({
                status: 'success',
                Articles: ArticulosEncontrados
            });
        }
    });

    //Devolver resultado
}


module.exports = {
    test,
    curso,
    save,
    ListArticles,
    ListArticlesById,
    Delete,
    Edit,
    UploadFile,
    image,
    search
}