const mysql = require('mysql2')

// On créer un pool de connexion -> permet de gérer des connexions multiples
const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'eshop',
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
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
