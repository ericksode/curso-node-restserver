const mongoose = require('mongoose');

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Base de datos Online')
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicar Base de datos');
    }
};

module.exports = {
    dbConnect
}