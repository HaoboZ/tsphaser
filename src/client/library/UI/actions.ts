export const READY = 'readyUI';

export function readyUI( game: Phaser.Game ) {
	return {
		type: READY,
		game
	};
}
