const Article = require("../models/Article");
const {ValidateArticle} = require("../helpers/validate");
const fs = require("fs");//filesystem se usa para eliminar archivos

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
const Delete = (req, res) =>{

    let articleId = req.params.id;

    Article.findOneAndDelete({_id: articleId}, (err, deletedArticle)=>{

        if(err || !deletedArticle){
            return res.status(404).json({
                status: 'error',
                message: 'Articulo no Encontrado para ser Borrado'
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
const Edit = (req, res) =>{

    let articleId = req.params.id;

    //recoger datos del body
    let params = req.body;

    //Validar datos
    try{
        ValidateArticle(params);
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan datos para ingresar'
        });
    }
    
    

    //buscar y actualizar                    {new: true} me devuelve el opbjeto actualziado recientemente
    Article.findOneAndUpdate({_id: articleId}, params,{new: true}, (err, updateArticle) =>{

        if(err || !updateArticle){
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

const UploadFile = (req, res) =>{

    //configurar libreria multer para subir archivos en el archivo de rutas

    //recoger archivo de imagen subida
    if(!req.file && !req.files){
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
    if(extension_file != "png" && extension_file != "jpg" &&
    extension_file != "jpeg" && extension_file != "gif" ){

        //Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (err) =>{
            res.status(400).json({
                status: 'error',
                message: 'Extenxion de la Imagen Invalida!!!!!!'
            });
        });

    }else{

        return res.status(200).json({
            status: 'success',
            file: req.file,
            extension_file
         });
    }
    


    
}




module.exports = {
    test,
    curso,
    save,
    ListArticles,
    ListArticlesById,
    Delete,
    Edit,
    UploadFile
}