// Fichier contenant le middleware : fonction qui vient vérifier le jeton et donc protéger la route 
var jwt = require('jsonwebtoken')
require('dotenv').config()

function authJWT(req, res, next) {
    // Récupérer le token depuis Authorization dans le header 
    const authHeader = req.headers.authorization

    // Si jamais pas de token -> Renvoit un message d'erreur
    if (!authHeader) {
        return res.status(401).json({ message: 'Token manquant' })
    }

    // On vient extraire les infos dont on a besoin du token : decoded payload
    const token = authHeader.split("")[1]

    // On va tenter de vérifier le token 
    try {
        // On vérifie dans un premier temps puis on ajoute les infos à l'objet req
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded

        next()
    } catch(err) {
        return res.status().json({ message : "Token est invalide" })
    }
}

module.exports = authJWT