// Fichier contenant le middleware : fonction qui vient vérifier le jeton et donc protéger la route 
var jwt = require('jsonwebtoken')
require('dotenv').config()

const authJWT = (req, res, next) => {
    // Logique de vérification / signature du jwt

    // Cette fonction vient récupérer le token de notre app React -> Depuis par exemple des cookies, la mémoire, le localStorage...
    
    // Elle viendra ensuite vérifier le token en question ainsi que la secret key associée (qui est .env)
}

module.exports = jwtAuth