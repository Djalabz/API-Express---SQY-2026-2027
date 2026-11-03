const express = require("express")
const router = express.Router() 
const db = require("../config/db")
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken')
require('dotenv').config()
const authJWT = require('../middlewares/jwt')


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
router.post('/login', (req, res) => {
    // Récupération des éléments du body 
    let { username, password } = req.body

    console.log(req.body)

    let sql = "SELECT * FROM users WHERE username = ?"

    db.query(sql, [username], (err, results) => {

        if (err) {
            res.status(500).json("erreur lors de la vérification du username")
            console.log(err)

        } else if (results.length) {

            // Si ok on recup le hash depuis le résultat de la BDD
            let hash = results[0].password

            // On compare les hashs
            bcrypt.compare(password, hash, (err, results) => {
                if (err) {
                    res.status(500).json("erreur lors de la comparaison des mdp")
                    console.log(err)
                } else if (results) {

                    console.log("password ok -> phase de création des jwt")

                    // On crée l'access token -> le token court terme qui vient valider les actions du user
                    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m'});

                    // On crée aussi le refresh token -> token long terme qui permet de renouveller les access token
                    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d'});

                    // Le refresh token est envoyé dans un cookie en httpOnly -> On ne peut pas recup le token avec du JS depuis le front
                    res.cookie('jwt', refreshToken, {
                        httpOnly: true,
                        sameSite: 'None', 
                        secure: true,
                        maxAge: 10 * 24 * 60 * 60 * 1000
                    })

                    console.log(accessToken)

                    // On renvoit l'access token simplement en json
                    res.json(accessToken)


                } else {
                    res.json("Le mot de passe n'est pas correct")
                }
            })
        } else {
            res.json("Pas de résultats pour le user donné")
        }
    })
})

// Route pirate ....
router.post('/pirate', (req, res) => {
    let { body } = req
    console.log(body)
})

router.post('/cart', authJWT, (req, res) => {

})


module.exports = router