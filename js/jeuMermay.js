//Importation des scripts et classes nécessaires
import {
	SceneChargement
} from './scenes/SceneChargement.js';

import {
	SceneIntro
} from './scenes/SceneIntro.js';
import {
	SceneJeu
} from './scenes/SceneJeu.js';
import {
	SceneFinJeu
} from './scenes/SceneFinJeu.js';



//On crééra le jeu quand la page HTML sera chargée
window.addEventListener("load", function () {
	//On définit avec des variables les dimensions du jeu sur desktop
	let largeur = 576,
		hauteur = 1024;

	//On fait 2 vérifications la première pour "Mobile" et la seconde pour "Tablet"
	//Et si on est sur un mobile (tablette ou téléphone), on re-dimensionne le jeu
	if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
		console.log("Le jeu est lu sur un mobile... on change les dimensions...");
		largeur = Math.min(window.innerWidth, window.innerHeight);
		hauteur = Math.max(window.innerWidth, window.innerHeight);
	}

	// Object pour la configuration du jeu - qui sera passé en paramètre au constructeur
	let config = {
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: largeur,
			height: hauteur,
		},
		scene: [SceneChargement, SceneIntro, SceneJeu, SceneFinJeu],
		backgroundColor: 0x000000,
		physics: {
			default: 'arcade',
			arcade: {
				debug: false,
			}
		},
		//Limiter le nombre de pointeurs actifs
		input: {
			activePointers: 2,
		}
	}

	//Objet de configuration pour le chargement des fontes
	let webFontConfig = {

		//Nos polices Google
		google: {
			families: ["Caveat","Changa"]
		},

		active: function () {
			console.log("Les polices de caractères sont chargées");
			// Création du jeu
			window.game = new Phaser.Game(config);
			window.game.jeuMermay = {
				score: 0, //Score de la partie courante
				meilleurScore: 0, //Meilleur score antérieur enregistré			
				NOM_LOCAL_STORAGE: "scoreJeu" //Sauvegarde et enregistrement du meilleur score pour ce jeu 
			}
		}
	};

	//Chargement des polices de caractères
	WebFont.load(webFontConfig);

}, false);