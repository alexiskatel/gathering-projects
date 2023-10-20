const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

function connectToDatabase() {
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
}

function returnError(status, error) {
  res.status(status).json({ message: error });
}

function selectElement(query, element, table, condition = "") {
  query = 'SELECT ' + idUser + ' from  ' + user + ' ' + condition
}

app.post('/recevoirDonnees', (req, res) => {
  connectToDatabase()
  let isError = false;
  const data = req.body;
  let userId = null;
  let produitId = null;

  let dataToSend = []

  const queryIdUser = 'SELECT idUser from user WHERE email = ?'
  db.query(queryIdUser, [data[1].email], (err, result) => {
    if (err) {
      isError = true;
      returnError(500, "Erreur lors de la récupération de l'ID utilisateur");
    } else {
      if (result.length > 0) {
        userId = result[0].idUser;
        dataToSend.push(userId)
      } else {
        const query = 'INSERT INTO user (nom,prenom,email) VALUES (?, ?, ?)'
        const userData = [data[1].lastName, data[1].firstName, data[1].email]
        db.query(query, userData, (err, result) => {
          if (err) {
            console.error("Erreur lors de l'insertion des données :", err);
          }
        });
        const queryIdUser = 'SELECT idUser from user WHERE email = ?'
        db.query(queryIdUser, [data[1].email], (err, result) => {
          if (err) {
            isError = true;
            returnError(500, "Erreur lors de la récupération de l'ID utilisateur");
          } else {
            if (result.length > 0) {
              userId = result[0].idUser;
              dataToSend.push(userId)
            } else {
              isError = true;
              returnError(404, "Utilisateur introuvable");
            }
          }
        });
      }

      data[0].forEach(obj => {
        const queryIdProduit = 'SELECT idProduit from produit WHERE nom = ?'
        db.query(queryIdProduit, obj.nom, (err, result) => {
          if (err) {
            isError = true;
            returnError(500, "Erreur lors de la récupération de l'ID du produit");
          } else {
            if (result.length > 0) {
              produitId = result[0].idProduit;
              dataToSend.push(produitId)
            } else {
              isError = true;
              returnError(404, "Produit introuvable");
            }
          }
          const date = new Date();
          const dateCommand = date.toLocaleDateString();
          const hourCommand = date.toLocaleTimeString();
          const formattedDate = `${dateCommand} à ${hourCommand}`

          const values = [userId, produitId, obj.quantite, formattedDate];
          const sql = 'INSERT INTO commande (idUser, idProduit, quantite, date) VALUES(?, ?, ?, ?)';
          db.query(sql, values, (err, result) => {
            if (err) {
              isError = true;
              returnError(500, "Erreur lors de l'insertion des données");
            }
          });

        });
      });
    }
  });

});


app.post('/obtaindatauser', (req, res) => {
  connectToDatabase()
  const { email } = req.body

  const queryIdUser = 'SELECT nom, prenom from user WHERE email = ?'
  db.query(queryIdUser, email, (err, result) => {
    if (err) {
      returnError(500, "Erreur lors de la récupération des informations de l'utilisateur");
    } else {
      res.status(200).json(result)
    }
  })
})

app.get('/allCommand', (req, res) => {
  connectToDatabase();
  const query = "select u.nom, u.prenom,u.email,p.nom as nomProduit,c.quantite, p.prix*c.quantite as prix,c.date from user u , produit p , commande c WHERE c.idUser = u.idUser and c.idProduit = p.idProduit order by c.date"
  db.query(query, (err, resultat) => {
    if (err) {
      returnError(500, "Impossible d'éxécuter la requête")
    } else {
      res.status(200).json(resultat)
    }
  })
})

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
