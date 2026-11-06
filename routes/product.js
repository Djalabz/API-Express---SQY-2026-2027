const express = require("express")
const router = express.Router() 
var jwt = require('jsonwebtoken')
require('dotenv').config()
const db = require('../config/db')

const authJWT = require('../middlewares/jwt')

// Route d'affichage de l'ensemble des produits 
router.get("/all",  (req, res) => {
    let sql = "SELECT p.*, AVG(pr.rating) AS moyenne_note FROM products p LEFT JOIN product_ratings pr ON p.id_product = pr.id_product GROUP BY p.id_product"

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err)
            res.send(err)

        } else {
            console.log(results)
            res.json(results)
        }
    })
})


// Route d'affichage des détails d'un produit via son id
router.get("/:id", (req, res) => {
    // Je recup l'id du produit depuis les params de l'url
    let { id } = req.params

    // Requete qui recup les details d'un produit + la moyenne des notes qui le concernent
    let sql = "SELECT p.*, AVG(pr.rating) AS moyenne_note FROM products p JOIN product_ratings pr ON p.id_product = pr.id_product GROUP BY p.id_product HAVING p.id_product = ?"

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err)
            res.send(err)

        } else {
            console.log(results)
            res.json(results)
        }
    })
})



// Route qui va nous permettre de noter un produit
router.post("/rating", authJWT, (req, res) => {
    // Je vais vouloir recup la note et l'envoyer pour le bon produit 
    let { note, product_id } = req.body
    let user_id = req.user.id_user 

    // Première requete SQL afin de savoir si il y a note : si note on update, sinon on insert...
    let checkNote = "SELECT id FROM product_ratings WHERE id_user = ? AND id_product = ?"

    db.query(checkNote, [user_id, product_id], (err, results) => {

        console.log(err)
        console.log(results)

        if (results.length) {
            let ratingId = results[0].id

            let updateNote = "UPDATE product_ratings SET rating = ? WHERE id = ? AND id_product = ?"

            db.query(updateNote, [note, ratingId, product_id], (err, results) => {
                if (err) {
                    res.status(500)
                    console.log(err)
                } else {
                    res.status(200).send("Note modifiée avec succès !")
                }
            })
        } else {
            let createNote = "INSERT INTO product_ratings(rating, id_user, id_product) VALUES(?, ?, ?)"

            db.query(createNote, [note, user_id, product_id], (err, results) => {
                if (err) {res.status(500)} else {
                    res.status(200).send("Note ajoutée avec succès :!")
                }
            })
        }
    })

})

module.exports = router