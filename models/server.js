const express = require('express');
const cors = require('cors');
const { dbConnect } = require('../database/config');

class Server {

    constructor(){
        //Variables de clase
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos'
        };

        /*this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';*/

        //Conexion a DB
        this.conectarDB();
        
        //Middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    }
    //METODOS DE LA CLASE

    async conectarDB(){
        await dbConnect();
    }

    middlewares(){
        //Directorio publico
        this.app.use(express.static('public'));
        //Corse protege peticiones externas al server
        this.app.use(cors());
        //Lectura y parse del body
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor en el puerto', this.port);
        });
    }
}

module.exports = Server;