export const SCENE = 'SCENE';

export const setScene = ( scene: Phaser.Scene ) => ( {
	type: SCENE,
	scene
} );
