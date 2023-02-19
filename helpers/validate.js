
const validator = require("validator");

const ValidateArticle = (params) =>{

    let validar_title = !validator.isEmpty(params.title) &&
        validator.isLength(params.title, { min: 5, max: undefined });
    let validar_content = !validator.isEmpty(params.content);

    if (!validar_title || !validar_content) {
        throw new Error("No se han validado los campos");
    }
}

module.exports = {
    ValidateArticle
}
