const test = (req, res) => {
    return res.status(200).json({
        mensaje: 'soy una accion de prueba'
    });
}

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

module.exports = {
    test,
    curso
}