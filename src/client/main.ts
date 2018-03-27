import Load from './load';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, undefined, {
	init() {
		// limits phaser to use 1 input (no double touch)
		this.input.maxPointers = 1;
		
		// scales screen to fit screen dimensions
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		
		// prevents pausing on loss of focus
		this.stage.disableVisibilityChange = true;
		
		// pixel perfect :)
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		this.game.renderer.renderSession.roundPixels = true;
		
		// fps timing
		this.time.advancedTiming = true;
	},
	create() {
		game.state.add('Load', Load);
		
		game.state.start('Load');
	}
});