const express = require("express");
const router = express.Router();

const ArticleController = require("../controlers/article");

//Rutas de pruebas
router.get("/test", ArticleController.test);
router.get("/curso", ArticleController.curso);







module.exports = router;