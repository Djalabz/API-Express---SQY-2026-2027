const express = require("express")
const router = express.Router() 
const db = require("../config/db")
const bcrypt = require("bcrypt")

// Différentes routes associées au User ('/user/route')

// Route du signup
router.post('/signup', (req, res) => {
    let { username, email, password } = req.body

    // Vérifier si l'email/username n'existent pas déjà en BDD auquel cas -> annulation et renvoie un message d'erreur

    // On déclare d'abord une requete SQL 
    let sql = "SELECT * FROM users WHERE email = ? OR username = ?" 

    db.query(sql, [email, username], (error, results) => {
        if (error) {
            res.status(500).json("Erreur lors de la vérification du user")
            console.log(error)

        } else if (results.length) {
            console.log(results)

            // On vérifie qui du username ou de l'email est déjà utilisé
            // et on renvoit une réponse selon
            if (results[0].username === username) {
                res.json("Username déjà utilisé")
            } else {
                res.json("Email déjà utilisé")
            }
        } else {

            res.json('Aucun user trouvé en BDD')

            // Si pas de user en DB -> Hasher le mot de passe 
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json("Erreur durant le hash du mot de passe")
                    console.log(err)
                } else {
                    // On a maintenant accès au mot de passe hashé on peut donc ajouter le user en bdd 
                    // On explicite la requete SQL
                    sql = "INSERT INTO users(username, email, password) VALUES(?, ?, ?)"

                    // On éxecute la query SQL dans notre table users 
                    db.query(sql, [username, email, hash], (err, results) => {
                        if (err) {console.log(err)}
                        else {
                            res.status(200).json("User ajouté avec succès")
                            console.log(results)
                        }
                    })
                }
            })
        }
    })
})


// Route pour le login 


// Route le logout


module.exports = router