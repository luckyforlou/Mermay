/**
 * Class representant la scène du jeu qui charge les médias.
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene {

	constructor() {
		super("SceneChargement");
	}

	preload() {

		// //Charger le plugin pour le joystic virtuel
		// let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
		// this.load.plugin('rexvirtualjoystickplugin', url, true);

		//Partie du chemin commun aux images...
		this.load.setPath("medias/img/");

		//Charger les images du jeu
		this.load.image("Titre");
		this.load.image("fond");
		this.load.image("fondIntro");
		this.load.image("fondinstructions");
		this.load.image("fondFin");
		this.load.image("meduses");
		this.load.image("pieuvres");
		this.load.image("dauphins");
		this.load.image("balle");

		
		this.load.spritesheet("boutons", "boutons.png", {
			frameWidth: 192,
			frameHeight: 64
		});

		//Charger les feuilles de sprite
		//Perso
		this.load.spritesheet("Perso", "perso.png", {
			frameWidth: 72,
			frameHeight: 96,
		});

		//Bouton pour le plein écran
		this.load.spritesheet("pleinEcranBtn", "pleinEcranBtn.png", {
			frameWidth: 64,
			frameHeight: 64
		})

		// //Charger les sons
		this.load.setPath("medias/sons/");
		this.load.audio("jeu", ["SonJeu.mp3", "SonJeu.ogg"]);
		this.load.audio("intro", ["Intro.mp3", "Intro.ogg"]);
		this.load.audio("pew", ["pew.mp3", "pew.ogg"]);
	}
	create() {
		this.scene.start("SceneIntro");
	}
}