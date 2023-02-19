const express = require("express");
const multer = require("multer");
const router = express.Router();


const ArticleController = require("../controlers/article");


const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './images/articles/'); //ubicacion de la imagena guardar
    },
    filename: (req, file, cb) =>{
        cb(null, "article" + Date.now() + file.originalname);//nombre del archivo a guardar
    }
});

//creando la funcion que hara subir los archivos
const subidas = multer({storage: almacenamiento});

//Rutas de pruebas
router.get("/test", ArticleController.test);
router.get("/curso", ArticleController.curso);

//rutas utiles
router.post("/save", ArticleController.save);
router.get("/articles/:last?", ArticleController.ListArticles);
router.get("/article/:id", ArticleController.ListArticlesById);
router.delete("/article/:id", ArticleController.Delete);
router.put("/article/:id", ArticleController.Edit);
router.post("/upload-image/:id",[subidas.single("file0")], ArticleController.UploadFile);//pasandole el nombre con el que subiremos la imagen
router.get("/image/:fichero", ArticleController.image);
router.get("/buscar/:search", ArticleController.search);






module.exports = router;