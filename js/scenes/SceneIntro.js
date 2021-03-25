//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneIntro extends Phaser.Scene {

	constructor() {
		super("SceneIntro");
		this.musique = null;
		this.fondIntro = null;
		this.fondinstructions = null;
	}

	create() {
		//Musique d'intro
		this.musique = this.sound.add("intro");
		this.musique.play();
		this.musique.loop = true;
		this.fondIntro = this.add.image(game.config.width/2, game.config.height/2, 'fondIntro');
		GrilleMontage.mettreEchelleLargeurJeu(this.fondIntro);

		let Titre = this.add.image(game.config.width/2, -game.config.height, 'Titre');
		GrilleMontage.mettreEchelleLargeurJeu(Titre, 0.8);
		

		//Animation du texte d'intro
		this.tweens.add({
			targets: Titre,
			props:{
				y: game.config.height/4,
				rotation : Phaser.Math.DegToRad(-20),
			},
			duration: 3000,
			ease: 'Back.easeInOut',
			callbackScope: this,
			onComplete: this.afficherBouton
		});
	}// Fin create

	afficherBouton() {

		//Instancier le bouton, le dimensionner
		let posX = game.config.width / 2,
			posY = game.config.height * 0.8,
			leBouton;

		leBouton = this.add.image(posX, posY, "boutons", 0);
		//Mettre à l'échelle selon le ratio horizontal
		GrilleMontage.mettreEchelleRatioX(leBouton);
		let echelleInit = leBouton.scaleX;

		//Animation du bouton - 
		this.tweens.add({
			targets: leBouton,
			props: {
				scaleY: echelleInit * 1.2
			},
			duration: 750,
			repeat: -1,
			yoyo: true,
		});

		//Aller à l'écran de jeu en cliquant sur le bouton
		leBouton.setInteractive();
		
		leBouton.on('pointerover',function(){
			leBouton.setFrame(1);
		})
		
		leBouton.on('pointerout',function(){
			leBouton.setFrame(0);
		})

		leBouton.once("pointerdown", this.afficherInstructions, this);
		
	}// Fin afficherBouton


	afficherInstructions(){
		this.fondinstructions = this.add.image(game.config.width/2, game.config.height/2, 'fondinstructions');
		GrilleMontage.mettreEchelleLargeurJeu(this.fondinstructions);

		//Afficher le texte d'intro

		this.time.addEvent({
			delay: 2000,
			callback: this.afficherTxt,
			callbackScope: this
		});

	}// Fin afficherInstructions


	/*
	 * Fonction pour afficher la consigne et mettre l'écouteur pour débuter le jeu
	 */

	afficherTxt() {
		//Consigne
		let tailleTexte = Math.round(32 * GrilleMontage.ajusterRatioX());
		let consigneTxt = this.add.text(game.config.width/2, game.config.height, "Plongez dans le jeu! ", {
			font: `bold ${tailleTexte}px Caveat`,
			color: "#0f2451",
			align: "center"
		}); 
		consigneTxt.setOrigin(0.5, 2);
		this.input.once("pointerdown", this.allerEcranJeu, this);
		console.log(consigneTxt.style.fontFamily);

	}// Fin afficherTxt

	allerEcranJeu() {
		//arrêter la musique d'intro
		this.musique.stop();
		//Aller à l'écran de jeu
		this.scene.start("SceneJeu");
	}
}