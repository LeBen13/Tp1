/*Requires*/
var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const peupler = require("./mes_modules/peupler");
const util = require("util");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.set('view engine', 'ejs'); // générateur de template



////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////* Accueil *//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {
    var cursor = db.collection('adresse').find().toArray(function (err, resultat) {
        if (err) return console.log(err)

        console.log('util = ' + util.inspect(resultat));
        // transfert du contenu vers la vue index.ejs (renders)
        // affiche le contenu de la BD
        res.render('index.ejs', {
            adresse: resultat,
            acc: true
        })
    })
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////* Tableau *//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get('/list', (req, res) => {
    console.log('la route route get / = ' + req.url)

    var cursor = db.collection('adresse')
        .find().toArray(function (err, resultat) {
            if (err) return console.log(err)
            // transfert du contenu vers la vue index.ejs (renders)
            // affiche le contenu de la BD
            res.render('index.ejs', {
                adresse: resultat
            })
        })
});


app.get('/profil/:id', (req, res) => {

    var id = req.params.id
    console.log(id)
    db.collection('adresse').find({
        _id: ObjectID(req.params.id)
    }).toArray(function (err, resultat) {
        console.log(resultat);
        if (err) return console.log(err)
        res.render('index.ejs', {
            adresse: resultat,
            profil: true
        }) // redirige vers la route qui affiche la collection
    })

})


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////* Trier *///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get('/trier/:cle/:ordre', (req, res) => {
    let cle = req.params.cle
    let ordre = (req.params.ordre == 'asc' ? 1 : -1)
    let cursor = db.collection('adresse').find().sort(cle, ordre).toArray(function (err, resultat) {
        ordre = (req.params.ordre == "asc" ? "desc" : "asc")
        res.render('components/adresses.ejs', {
            adresse: resultat,
            cle,
            ordre
        })
    })
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////* Peupler *//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get('/peupler', function (req, res) {
    db.collection('adresse').insertMany([peupler(), peupler(), peupler(), peupler(), peupler(), peupler(), peupler(), peupler(), peupler()], (err, result) => {
        if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.redirect('/list')
    })
})

////////////////////////////////////////////////////////////////////////////////
////////////////////* Ajouter/Modifier/Vider/Supprimer *////////////////////////
////////////////////////////////////////////////////////////////////////////////

///////////
/*Ajouter*/
///////////

app.post('/ajouter', (req, res) => {

    console.log('ajouter util  = ' + util.inspect(req.body));
    db.collection('adresse').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.redirect('/list')
    })
});

////////////
/*Modifier*/
////////////

app.post('/modifier', (req, res) => {

    console.log('ajouter util  = ' + util.inspect(req.body));

    req.body._id = ObjectID(req.body._id)

    db.collection('adresse').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.redirect('/list')
    })
});


/////////
/*Vider*/
/////////

app.get('/vider', function (req, res) {
    db.collection('adresse').drop()
    res.redirect('/list')
});

/////////////
/*Supprimer*/
/////////////

app.get('/supprimer/:id', (req, res) => {

    var id = ObjectID(req.params.id)

    db.collection('adresse').findOneAndDelete({
        "_id": id
    }, (err, resultat) => {

        if (err) return console.log(err)
        res.redirect('/list') // redirige vers la route qui affiche la collection
    })
});

//////////////////////////////////
/*Connection à la base de donnée*/
//////////////////////////////////

let db;

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
    if (err) return console.log(err)
    db = database.db('carnet_adresse');
    // lancement du serveur Express sur le port 8081
    app.listen(8081, () => {
        console.log('connexion à la BD et on écoute sur le port 8081');
    })

})
