const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')

// Définitions des routers
const userRouter = require("./routes/user")

// Convertit toutes les entrées depuis JSON
app.use(express.json())

// Les options des CORS : qui peut faire des requetes ? Quel type ?
let corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
} 

// On utilise les CORS dans l'ensemble de l'application
app.use(cors(corsOptions))

// ROUTES 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mise en place du router -> Les routes sont regroupés poar catégories, ici toutes celles liées aux user 
// seront disponibles après /user au niveau du endpoint 
app.use('/user', userRouter)


// On spécifie que notre app écoute les requetes arrivant sur le port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});