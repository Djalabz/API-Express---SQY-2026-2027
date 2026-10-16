const mysql = require('mysql2')
require('dotenv').config()


// On créer un pool de connexion -> permet de gérer des connexions multiples
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})


// Connexion et gestion des erreurs
db.getConnection((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connexion à la DB réussie")
    }  
})


module.exports = db
