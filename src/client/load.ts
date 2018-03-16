import Socket from './socket';

export default class Load extends Phaser.State {
	
	public preloadBar: Phaser.Sprite;
	
	public preload() {
		// socket
		new Socket(this.game);
		
		this.setup();
		// load assets
		this.preloadBar = this.drawLoadBar();
		this.load.setPreloadSprite(this.preloadBar);
		this.load.pack('assets', 'assets/assets.json');
		$('#overlay').text('Loading...');
	}
	
	public create() {
	
	}
	
	/**
	 * Sets up environment.
	 *
	 * Keep scale, expand and shrink based on window size.
	 * No pausing on loss of focus, track fps.
	 */
	public setup() {
		// limits phaser to use 1 input (no double touch)
		this.input.maxPointers = 1;
		// scales screen to fit screen dimensions
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// prevents pausing on loss of focus
		this.stage.disableVisibilityChange = true;
		// fps timing
		this.time.advancedTiming = true;
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