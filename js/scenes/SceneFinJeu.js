//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Class representant la scène du jeu comme tel
 */

export class SceneFinJeu extends Phaser.Scene {

	constructor() {
		super("SceneFinJeu");
		this.musique = null;
		this.fondFin = null;
	}


	create() {
		//Chargement de l'image de fond
		this.fondFin=this.add.image(game.config.width/2, game.config.height/2, 'fondFin');
		GrilleMontage.mettreEchelleLargeurJeu(this.fondFin);

		//Musique d'intro
		this.musique = this.sound.add("intro");
		this.musique.play();
		this.musique.loop = true;
		//Vérifie si le score est plus grand que le dernier meilleur score et l'enregistre si c'est le cas
		game.jeuMermay.meilleurScore = Math.max(game.jeuMermay.score, game.jeuMermay.meilleurScore);
		localStorage.setItem(game.jeuMermay.NOM_LOCAL_STORAGE, game.jeuMermay.meilleurScore);

		//Texte de score et de retour au jeu
		let tailleTexte = Math.round(40 * GrilleMontage.ajusterRatioX());
		let Txt = "Votre meilleur score est :";
		Txt += "\n" + game.jeuMermay.meilleurScore;
		Txt += "\n";
		Txt += "\nCliquez sur l'écran pour réessayer! ";

		let consigneFinTxt = this.add.text(game.config.width / 2, game.config.height / 4, Txt, {
			font: `bold ${tailleTexte}px Caveat`,
			color: "#b0ffef",
			align: "center",
			wordWrap: {
				width: game.config.width * 0.9
			}
		});
		consigneFinTxt.setOrigin(0.5);

		//Clic dans l'écran
		this.input.once("pointerdown", this.rejouer, this);

	}

	rejouer(pointer) {
		//arrêter la musique
		this.musique.stop();
		//Aller à l'écran de jeu
		this.scene.start("SceneJeu");
	}

}