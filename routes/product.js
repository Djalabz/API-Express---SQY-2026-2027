const express = require("express")
const router = express.Router() 
var jwt = require('jsonwebtoken')
require('dotenv').config()
const db = require('../config/db')

const authJWT = require('../middlewares/jwt')

router.post("/rating", authJWT, (req, res) => {
    // Je vais vouloir recup la note et l'envoyer pour le bon produit 
    let { note, product_id } = req.body

    // Première requete SQL afin de savoir si il y a note : si note on update, sinon on insert...
    let checkNote = "SELECT id, rating FROM product_rating WHERE id_user = ? AND id_product = ?"

    db.query(checkNote, [req.user.id_user, product_id], (err, results) => {
        if (results) {
            let ratingId = results[0].id

            let updateNote = "UPDATE product_rating SET rating = ? WHERE id = ? AND id_product = ?"

            db.query(updateNote, [note, ratingId, product_id], (err, results) => {
                if (err) {
                    res.status(500)
                    console.log(err)
                } else {
                    res.status(200).send("Note modifiée avec succès !")
                }
            })
        } else {
            let createNote = "INSERT INTO product_rating(rating, id_user, id_product) VALUES(?, ?, ?)"

            db.query(createNote, [note,req.user.id_user, product_id], (err, results) => {
                if (err) {res.status(500)} else {
                    res.status(200).send("Note ajoutée avec succès :!")
                }
            })
        }
    })

})

module.exports = router