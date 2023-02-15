const mongoose = require("mongoose");

const connection = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");

            console.log('Conectados a la Base de datos en MongoDB!!!');   

    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la Base de datos");
    }
};


module.exports = { connection }
