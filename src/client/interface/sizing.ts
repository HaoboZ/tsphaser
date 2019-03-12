import config from '../config';

const Sizing = new class {
	
	private game: Phaser.Game;
	
	// scales screen to fit screen dimensions
	public init( game: Phaser.Game ) {
		this.game = game;
		
		$( '#overlay' )
			.innerWidth( config.size.width )
			.innerHeight( config.size.height );
		this.onResize();
		this.game.scale.on( 'resize', this.onResize );
	}
	
	private onResize = () => {
		$( '#overlay' ).css( 'transform',
			`translate(-50%, -50%) scale(${1 / this.game.scale.displayScale.x}, ${1 / this.game.scale.displayScale.y})` );
	};
	
};
export default Sizing;
