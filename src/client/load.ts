import Socket from './socket';

export default class Load extends Phaser.State {
	
	public preloadBar: Phaser.Sprite;
	
	public preload() {
		// socket
		new Socket(this.game);
		
		// loading bar
		this.preloadBar = this.drawLoadBar();
		this.load.setPreloadSprite(this.preloadBar);
		
		// load assets
		// pack needs to include tilesets for tilemap since there's no reference to frame
		this.load.pack('pack', 'assets/assets-pack.json');
		this.load.atlas('atlas', 'assets/assets-atlas.png', 'assets/assets-atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
	}
	
	public create() {
		this.state.start('Menu');
	}
	
	/**
	 * Draws a white bar at the bottom to load assets.
	 *
	 * Takes up 1/32 of the screen.
	 *
	 * @returns {Phaser.Sprite}
	 */
	private drawLoadBar() {
		const g = this.make.graphics(0, 0);
		g.beginFill(0xffffff);
		g.drawRect(0, 0, this.game.width, this.game.height / 32);
		g.endFill();
		const t = g.generateTexture();
		g.destroy();
		return this.game.add.sprite(0, this.game.height - t.height, t);
	}
	
}