export const READY = 'readyUI';

export function readyUI( game: Phaser.Game ) {
	return {
		type: READY,
		game
	};
}

export const SETTINGS = 'saveSettings';

export function saveSettings( settings: any ) {
	return {
		type: SETTINGS,
		settings
	};
}
