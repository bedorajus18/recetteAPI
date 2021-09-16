const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sitecuisine"
});
/**Importation du miniframework Express */
var express = require("express");
const { query } = require('express');
/** Création d'une application web via l'objet Express */
var app = express();
/** Config de l'application web Express */
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);
app.use(express.json());
/**requete à la db */
con.connect(function(err) {
    if (err) throw err;
    console.log("connecté à la base des données MySQL !");
    con.query("SELECT * from recette;", function(err, result) {
        if (err) throw err;
        console.log(result);
    });
});
/**Définition des routes */
app.get("/", function(request, response) {
    response.render("homePage");
});

app.get("/recette", function(request, response) {
    con.query("SELECT * from recette;", function(err, result) {
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});
app.get('/recette/:id', function(request, response) {
    // si id <= 0 ou manquant ou n'est un nombre-> 400 + petit message
    if (!Number.isInteger(request.params.id) || (request.params.id <= 0)) {
        response.status(400).json({ "message": "L'identifiant est incorrect ou manquant." });
    } else
        con.query("SELECT * from recette where id=" + request.params.id + ";", function(err, result) {
            if (err) {
                console.log(err);
                response.status(503).json({ "message": "un problème est survenu." });
            }
            res.status(200).json(result);
        })
});
app.post('/recette', (req, res) => {
    requete = "INSERT INTO RECETTE (titre, resume) values ('" + req.body.titre + "','" + req.body.resume + "');";
    console.log(requete);
    con.query(requete, function(err, result) {
        if (err) throw err;
        res.status(200).json(result);
    });
});
app.delete('/recette/:id', (req, res) => {
    const id = parseInt(req.params.id)
    requete = "DELETE FROM RECETTE WHERE id=" + id + ";";
    console.log(requete);
    con.query(requete, function(err, result) {
        console.log(requete);
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
})