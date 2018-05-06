import Load from './core/load';
import Menu from './menu/menu';

import config from './config';

const game = new Phaser.Game(config.width, config.height, Phaser.AUTO, 'screen', {
	init() {
		// limits phaser to use 1 input (no double touch)
		this.input.maxPointers = 1;
		
		// scales screen to fit screen dimensions
		let w = $(window);
		let scale = () => {
			let s = $('#screen');
			let width       = w.width(),
			    height      = w.height(),
			    widthRatio  = width / config.width,
			    heightRatio = height / config.height,
			    scale       = Math.min(widthRatio, heightRatio);
			
			s.css('transform', 'translate(-50%, -50%) ' +
			                   'scale(' + scale + ', ' + scale + ')');
		};
		w.on('resize', scale);
		scale();
		
		// sets overlay width height
		$('#overlay').width(config.width).height(config.height);
		
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
		game.state.add('Menu', Menu);
		
		game.state.start('Load');
	}
});