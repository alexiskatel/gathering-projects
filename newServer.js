const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

const secretKey = 'qROzYbo2X2u3Z94VMamUXJYdoFfXe1QeoGE6mQay0TPqcaNJWnKKddaVbLeb';

// Configuration de la base de données
(() => {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'commerce_stage'
  });

  db.connect(err => {
    if (err) {
      console.error('Erreur de connexion à la base de données :', err);
    } else {
      console.log('Connecté à la base de données MySQL');
    }
  });
})()


function verifyToken(req, res, next) {
  var token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Token not provided');
  }
  token = token.replace(/^Bearer\s+/, "");
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.status(401).send('Token is not valid');
    }
    req.user = decoded;
    next();
  });
}

app.post('/api/store', (req, res) => {
  const utilisateur = req.body.utilisateur;
  const produits = req.body.produits;

  const selectUserQuery = 'SELECT idUser FROM user WHERE email = ?';
  db.query(selectUserQuery, [utilisateur.email], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
      return;
    }

    let userId = null;
    if (results.length > 0) {
      userId = results[0].idUser;
    }

    if (!userId) {
      const insertUserQuery = 'INSERT INTO user (nom, prenom, email, secretCode) VALUES (?, ?, ?, ?)';
      db.query(insertUserQuery, [utilisateur.lastName, utilisateur.firstName, utilisateur.email, utilisateur.secretCode], (error, results) => {
        if (error) {
          console.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
          res.status(500).json({ error: 'Erreur lors de l\'insertion de l\' utilisateur' });
          return;
        }
        userId = results.insertId;
        insertPanier(userId);
      });
    } else {
      insertPanier(userId);
    }

    function insertPanier(userId) {
      const date = new Date();
      const dateCommand = date.toLocaleDateString();
      const hourCommand = date.toLocaleTimeString();
      const formattedDate = `${dateCommand} à ${hourCommand}`
      const insertPanierQuery = 'INSERT INTO panier (idUser, date) VALUES (?, ?)';
      db.query(insertPanierQuery, [userId, formattedDate], (error, results) => {
        if (error) {
          console.error('Erreur lors de l\'insertion du panier :', error);
          res.status(500).json({ error: 'Erreur lors de l\'insertion du panier' });
          return;
        }
        const panierId = results.insertId;
        insertProduits(panierId);
      });
    }

    function insertProduits(panierId) {
      const insertProduitsQuery = 'INSERT INTO produit_panier (idPanier, idProduit, quantite) VALUES (?, ?, ?)';
      let insertedCount = 0;

      produits.forEach((produit) => {
        const selectProduitQuery = 'SELECT idProduit FROM produit WHERE nom = ?';
        db.query(selectProduitQuery, [produit.nom], (error, results) => {
          if (error) {
            console.error('Erreur lors de la récupération de l\'ID du produit :', error);
            return;
          }

          const produitId = results[0].idProduit;

          db.query(insertProduitsQuery, [panierId, produitId, produit.quantite], (error) => {
            if (error) {
              console.error('Erreur lors de l\'insertion du produit du panier :', error);
              return;
            }

            insertedCount++;
            if (insertedCount === produits.length) {
              res.json({ message: 'Panier enregistré avec succès' });
            }
          });
        });
      });
    }
  });
});

app.post('/api/obtaindatauser', (req, res) => {
  const email = req.body.email;
  const queryIdUser = "SELECT * FROM user WHERE email = ?";
  db.query(queryIdUser, [email], (error, results) => {
    if (error) {
      console.error('Erreur lors de la requête :', error);
      res.status(500).json({ error: 'Erreur lors de la requête' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' + email });
      return;
    }
    const user = results[0];
    res.json(user);
  });
});

app.get('/api/alldata', (req, res) => {
  const query = "SELECT user.*, panier.idPanier, GROUP_CONCAT(produit.nom SEPARATOR ', ') AS produits, SUM(produit.prix) AS prixTotal, panier.date FROM user JOIN panier ON user.idUser = panier.idUser JOIN produit_panier ON panier.idPanier = produit_panier.idPanier JOIN produit ON produit_panier.idProduit = produit.idProduit GROUP BY user.nom, panier.idPanier, panier.date;";
  db.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la requête :', error);
      res.status(500).json({ error: 'Erreur lors de la requête' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/detailUser', verifyToken, (req, res) => {
  const id = req.body.id
  const query = "SELECT panier.idPanier, user.*, produit.idProduit, produit.nom AS NomProduit, produit_panier.quantite, produit.prix , panier.date, produit.prix*produit_panier.quantite as prixTotal  FROM panier JOIN user ON panier.idUser = user.idUser JOIN produit_panier ON panier.idPanier = produit_panier.idPanier JOIN produit ON produit_panier.idProduit = produit.idProduit WHERE panier.idPanier = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la requête :', error);
      res.status(500).json({ error: 'Erreur lors de la requête' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/getAllDataUserByMAil', verifyToken, (req, res) => {
  const email = req.body.email
  const query = "SELECT user.*, panier.idPanier, GROUP_CONCAT(produit.nom SEPARATOR ', ') AS produits, GROUP_CONCAT(produit_panier.quantite SEPARATOR ', ') AS quantite, SUM(produit.prix * produit_panier.quantite) AS prixTotal, panier.date FROM user JOIN panier ON user.idUser = panier.idUser JOIN produit_panier ON panier.idPanier = produit_panier.idPanier JOIN produit ON produit_panier.idProduit = produit.idProduit WHERE user.email = ? GROUP BY user.idUser, user.nom, panier.idPanier, panier.date ";
  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Erreur lors de la requête :', error);
      res.status(500).json({ error: 'Erreur lors de la requête' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/login', (req, res) => {
  const { email, secretCode } = req.body
  const query = "select * from user where email = ?"
  db.query(query, [email], (error, result) => {
    if (error) {
      console.error('Erreur lors de la requête :', error);
      res.status(500).json({ error: 'Erreur lors de la requête' });
      // return;
    } else {
      if (result[0].secretCode === secretCode) {
        const payload = {
          userId: result[0].idUser,
          username: result[0].name
        };

        isAdmin = false
        const token = jwt.sign(payload, secretKey);
        if (result[0].email == "admin@admin.com") {
          isAdmin = true
        }
        console.log(token);
        res.json({
          valid: true,
          token: token,
          email: result[0].email,
          admin: isAdmin
        })
      } else {
        res.json(false)
      }
    }
  })
})

// Port d'écoute du serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
