"use strict";

const tableau = require("./tableaux.js");

console.log(tableau.tabNom);
console.log(tableau.tabPrenom);
console.log(tableau.tabTelephone);
console.log(tableau.tabCourriel);

const maxNom = tableau.tabNom.length;
const maxPrenom = tableau.tabPrenom.length;
const maxTele = tableau.tabTelephone.length;
const maxEmail = tableau.tabCourriel.length;


const peupler = () => {
	
    
	let position = Math.floor(Math.random()*maxNom);
    
	let nom = tableau.tabNom[position];
    
	position = Math.floor(Math.random()*maxPrenom);
	let prenom = tableau.tabPrenom[position];
    position = Math.floor(Math.random()*maxTele);
	let telephone = tableau.tabTelephone[position];
    position = Math.floor(Math.random()*maxEmail);
	let courriel = tableau.tabCourriel[position];

	return {
			prenom : prenom,
			nom : nom,
            telephone : telephone,
            courriel : courriel
			}
}


module.exports = peupler