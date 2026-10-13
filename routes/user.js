const express = require("express")
const router = express.Router() 
const db = require("../config/db")
const app = express()


app.post('/signup', (req, res) => {
    // let { username, email, password } = req.body
    console.log(req.body.username)

    // Vérifier si l'email/username n'existent pas déjà en BDD auquel cas -> annulation et renvoie un message d'erreur

    // Hasher le mdp 

    // Avec du SQL faire une requete préparée et enregistrer le nouveau user en BDD 
    // On envoit aussi un message de confirmation avec un status particulier -> 200 is OK
})

module.exports = router