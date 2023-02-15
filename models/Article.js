const { Schema, model } = require("mongoose");

const ArticleSchema = Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: "default.png"
    }
});

//                  NOMBRE MODELO, SCHEMA A USAR, NOMBRE DE LA COLECCION EN LA BD
module.exports = model("Article", ArticleSchema, "articles");