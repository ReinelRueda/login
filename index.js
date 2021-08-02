// 1 - Invocamos express 
const express = require ('express');
const app = express();

// 2 - Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// 3 - Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// 4 - Setear el directorio public 
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname+'public'));

// 5 Establecer motor de plantillas 
app.set('view engine','ejs')

// 6 - Invocamos a bcryptjs 
const bcryptjs = require('bcryptjs');

// 7 - Variables de sesion 
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true

}));

// 8 - invocamos al modulo de conexion a la DB
const connection = require('./database/db');


//9 - Estableciendo las rutas 

app.get('/',(req,res)=>{
    res.render('index',{msg:'Esto es un mensaje desde NODE'})
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register')
})

// 10 - Registrar 
app.post('/register',async (req,res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passworkHaash = await bcryptjs.hash(pass,8);
    connection.query('INSERT INTO users SET ?',{user:user,name:name,rol:rol,pass:passworkHaash},async(error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.render('register',{
                alert:true,
                alertTitle:"Registrar",
                alertMassage:"Successful Registration",
                alertIcon: "seccess",
                showConfirmButton:false,
                timer:1500,
                ruta:''

            })
        }
    })
})

app.listen(3000,(req,res)=>{
    console.log("server running in http://localhost:3000")
})

