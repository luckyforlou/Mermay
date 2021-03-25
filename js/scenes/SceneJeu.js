//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Class representant la scène du jeu comme tel
 */

export class SceneJeu extends Phaser.Scene {

	constructor() {
		super("SceneJeu");

		this.scoreTxt = null; // Le texte du score
		this.fond = null; //Le fond déroulant
		this.perso = null; //Le personnage du jeu

		this.vitesseEnnemi = 500 * GrilleMontage.ajusterRatioY(); //Vitesse de descente pour les ennemis
		this.vitesseDauphin = 1000 * GrilleMontage.ajusterRatioY(); //Vitesse de descente pour les dauphins
		this.vitesseBalle = 700 * GrilleMontage.ajusterRatioY(); //Vitesse de descente pour les dauphins

		this.GrEnnemis = null; //Groupe physique d'ennemis en groupe de 5
		this.intervalEnnemis = { //Intervals de temps pour faire apparaître chaque file d'ennemis
			min: 1000,
			max: 2000
		};

		this.compteurDauphins = 0; //Compteur pour faire apparaître un dauphin 
		this.intervalDauphins = 6; //Interval pour faire apparaître des dauphins
		this.tabPosEnnemis = [0, 1, 2, 3, 4, 5, 6]; // Tableau pour décider le nombre d'ennemis présents sur une rangée

		//Les flèches du clavier	
		this.lesfleches = null;

		// Bouton pour tirer
		this.boutonTire = null;
		this.intervalTirer = 100; //interval pour sdfasdfasdjkfh
		this.GrBalle = null;

		//Propriété des objets sonores
		this.pew = null;
		this.musique = null;
	} //Fin constructor()


	init() {
		// Initialiser le score
		game.jeuMermay.score = 0;

		//Compteur de dauphins
		this.compteurDauphins = 0;
	} //Fin init()


	create() {
		this.pew = this.sound.add("pew");
		this.musique = this.sound.add("jeu");
		this.musique.play();
		this.musique.loop = true;

		//Fond
			this.fond = this.add.tileSprite(game.config.width / 2, game.config.height/2, 576, 1024, 'fond');
			GrilleMontage.mettreEchelleLargeurJeu(this.fond);
			
			console.log(this.fond.width);
			console.log(this.fond.height);
			this.fond.setDepth(-2);
			this.physics.add.existing(this.fond, true);
			this.afficherTexteScore();

		//Définir l'animation du perso
		this.anims.create({
			key: "animPerso",
			frames: this.anims.generateFrameNumbers("Perso", {
				start: 0,
				end: 4
			}),
			frameRate: 12,
			yoyo: 1,
			repeat: -1

		});

		//Mettre le perso en bas de la scène
		this.perso = this.physics.add.sprite(game.config.width / 2, game.config.height - 124, "Perso");
		this.perso.setOrigin(0.5, 0);
		// GrilleMontage.mettreEchelleHauteurJeu(this.perso,0.5);

		//Faire jouer son animation
		this.perso.anims.play("animPerso");

		//Le perso ne peut pas sortir des limites du jeu
		this.perso.setCollideWorldBounds(true);
		this.perso.body.setSize(this.perso.displayWidth * 0.7, this.perso.displayHeight);
		

		this.GrEnnemis = this.physics.add.group();
		this.physics.add.overlap(this.perso, this.GrEnnemis, this.verifierCollision, null, this);

		this.GrBalle = this.physics.add.group();
		this.physics.add.overlap(this.GrBalle, this.GrEnnemis, this.verifierTire, null, this);

		this.creerGroupeEnnemis();


		//Gérer les contrôles selon desktop ou mobile
		if (this.sys.game.device.os.desktop === true) { 
			//Bouton fleches pour bouger + Tirer
			this.lesfleches = this.input.keyboard.createCursorKeys();
			this.boutonTirer = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		} 

		else { //Mobile

			this.lesfleches = this.input.keyboard.createCursorKeys();
			this.boutonTirer = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

			//Création des flèches virtuelles
			//this.lesfleches = this.joyStick.createCursorKeys();
			// this.boutonTirer = this.joyStick

			this.verifierOrientation();
			this.scale.on('resize', this.verifierOrientation, this);
		}


		/*if (!this.sys.game.device.os.iOS) {
			if (this.sys.game.device.fullscreen.available) {
				//On peut gérer le mode FullScreen alors on affiche le bouton         
				this.boutonPleinEcran = this.add.image(0, 0, "pleinEcranBtn", 0);
				this.grille.placerIndexCellule(26, this.boutonPleinEcran, false);
				GrilleMontage.mettreEchelleRatioMin(this.boutonPleinEcran, 1024, 576);

				this.boutonPleinEcran.setInteractive({
					useHandCursor: true
				});

				//Gestionnaire d'événement sur le bouton
				this.boutonPleinEcran.on("pointerup", this.mettreOuEnleverPleinEcran, this);
			}
		}*/
	} //Fin create()

	/**
	 * Affiche le score
	 * @param null
	 */
	afficherTexteScore() {
		//Mettre le texte du score en haut à gauche
		let tailleTexte = Math.round(36 * GrilleMontage.ajusterRatioX());
		let leStyle = {
			font: `bold ${tailleTexte}px Changa`,
			fill: "#3b79db",
		};
		this.scoreTxt = this.add.text(0, 0, "Score: " + game.jeuMermay.score, leStyle);

	} //Fin afficherTexteScore()

	/**
	 * Creer le group des ennemis
	 * @param null
	 */
	creerGroupeEnnemis() {
		let delai;
		this.tabPosEnnemis = Phaser.Utils.Array.Shuffle(this.tabPosEnnemis);

		this.compteurDauphins++;
		if (this.compteurDauphins === this.intervalDauphins) {
			this.placerEnnemis("dauphins");
			delai = 350;
			this.compteurDauphins = 0;

		} else {
			for (let j = 0; j < (Math.floor(Math.random() * 6)); j++) {
				let imgEnnemis = Phaser.Utils.Array.GetRandom(["meduses", "pieuvres"]);
				this.placerEnnemis(imgEnnemis, j);
				delai = Phaser.Math.RND.realInRange(this.intervalEnnemis.min, this.intervalEnnemis.max);
			}

		}

		//On part un timer pour placer un nouveau groupe
		this.minuterie = this.time.addEvent({
			delay: delai,
			callback: this.creerGroupeEnnemis,
			callbackScope: this
		});
	} //Fin creerGroupeEnnemis()


	/**
	 *Fonction pour placer des éléments dans le paysage en bas de l'écran 
	 * @param {String} elmEnnemis clé de l'image de l'ennemis à placer dans le paysage
	 * @param {number} i 
	 */
	placerEnnemis(elmEnnemis, i) {
		let ennemis;
		let hauteurSprite = 96;
		//console.log(this.tabPosEnnemis[i]);
		if (elmEnnemis === "meduses" || elmEnnemis === "pieuvres") {
			ennemis = this.GrEnnemis.create(hauteurSprite * this.tabPosEnnemis[i], -hauteurSprite, elmEnnemis);
			ennemis.body.velocity.y += this.vitesseEnnemi;
		} else {
			ennemis = this.GrEnnemis.create(Math.floor(Math.random() * (game.config.width - 96)), 0, elmEnnemis);
			ennemis.body.velocity.y += this.vitesseDauphin;
		}

		GrilleMontage.mettreEchelleRatioX(ennemis);
		ennemis.setOrigin(0);


		if (elmEnnemis === "pieuvres") {
			ennemis.setDepth(-1);
		}
	} //Fin placerEnnemis()

	update() {
		//Quand les ennemis sortent de l'écran, ils sont détruits
		for (let elem of this.GrEnnemis.getChildren()) {
			if (elem.y > game.config.height) {
				elem.destroy();
			}
		};

		// Quand les balles sortent de l'écran, elles sont détruits 
		for (let elem of this.GrBalle.getChildren()) {
			if (elem.y < 0 - elem.displayHeight) {
				elem.destroy();
			}
		};

		//Faire défiler le fond
		this.fond.tilePositionY += 2;

		if (this.lesfleches.right.isDown) { //Flèche droite abaissée
			this.perso.x += 6;
		} else if (this.lesfleches.left.isDown) { //Flèche gauche abaissée
			this.perso.x -= 6;
		} else {
			this.perso.x = this.perso.x;
		}
		this.boutonTirer.on("up", this.tirerBalle, this);

		if (game.jeuMermay.score < 0) {
			this.allerFinJeu();
		}

	} //Fin Update



	tirerBalle() {

		//Pour empêcher le joueur de tirer tros vite, on met une limite de temps entre chaque tire
		if (this.time.now > this.intervalTirer) {
			this.pew.play();
			this.intervalTirer = this.time.now + 200;
			let balle = this.GrBalle.create(this.perso.x, this.perso.y, "balle");
			balle.body.velocity.y -= this.vitesseEnnemi;
		}

	} //Fin tirerBalle

	/**
	 * 
	 * @param {Phaser.GameObject} balle L'objet représentant la balle
	 * @param {Phaser.GameObject} ennemis Un des ennemis dans la scène
	 */
	verifierTire(balle, ennemis) {
		if (ennemis.texture.key === "meduses") {
			game.jeuMermay.score += 8;
			this.scoreTxt.text = "Score: " + game.jeuMermay.score;
			ennemis.active = false;
			ennemis.destroy();
			balle.destroy();
		} else if (ennemis.texture.key === "pieuvres") {
			game.jeuMermay.score -= 10;
			this.scoreTxt.text = "Score: " + game.jeuMermay.score;
			ennemis.active = false;
			ennemis.destroy();
			balle.destroy();
		} else {
			balle.destroy();
		}
	} //Fin verifierTire()


	/**
	 * @param {Phaser.GameObject} lePerso l'objet représentant le perso
	 * @param {Phaser.GameObject} ennemis Un des ennemis dans la scène
	 */
	verifierCollision(lePerso, ennemis) {

		if (ennemis.texture.key === "meduses" || ennemis.texture.key === "dauphins") {
			lePerso.active = false;
			this.debuterFinJeu();
		}

	} //Fin verifierCollsion()

	debuterFinJeu() {
		//On lui enlève sa vitesseEnnemi sur l'axe des X
		this.perso.setVelocityX(0);

		//On attribue au perso une vitesseEnnemi négative sur l'axe des y
		//pour qu'il monte avec le paysage et on lui permet de sortir de la scène
		this.perso.setVelocityY(+this.vitesseEnnemi);
		this.perso.setCollideWorldBounds(false);

		//On part un timer pour aller à la fin du jeu dans 2 secondes
		this.time.addEvent({
			delay: 1000,
			callback: this.allerFinJeu,
			callbackScope: this
		});
	} //Fin debuterFinJeu

	allerFinJeu() {
		//On va à la scène de la fin du jeu
		this.musique.stop();
		this.scene.start("SceneFinJeu");
	} //Fin allerFinJeu()


	/**
	 * Vérifie l'orientation de l'écran
	 * 
	 */
	verifierOrientation() {

		if (Math.abs(window.orientation) == 90) {
			//On met le jeu en pause et on arrête le son
			this.scene.pause(this);
			//On affiche la balise <div>
			document.getElementById("orientation").style.display = "block";
		} 
		else {
			//On repart le jeu et le son
			this.scene.resume(this);
			//On enlève l'affichage de la balise <div>
			document.getElementById("orientation").style.display = "none";
		}
	}// Fin verifierOrientation

	/**
	 * Gère le mode plein-écran sur un ordinateur de bureau
	 * @param {Phaser.Pointer} pointeur Le dispositif de pointage (souris, doigt...)
	 */
		mettreOuEnleverPleinEcran() {

		// if (this.scale.isFullScreen)
		// {
		// 	this.scale.stopFullScreen();
		// }
		// else
		// {
		// 	this.scale.startFullScreen(false);
		// }
	
	}// Fin mettreOuEnleverPleinEcran*/


} // Fin Class SceneJeu