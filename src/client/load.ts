import config from './config';
import Socket from './connect/socket';
import { ChatEvents } from './examples/chat/chatRoom';
import { MoveEvents } from './examples/movement/moveRoom';
import { TictactoeEvents } from './examples/tictactoe/tictactoeRoom';
import Interface from './interface/interface';
import Sizing from './interface/sizing';

export default class Load extends Phaser.Scene {
	
	constructor() {
		super( 'Load' );
	}
	
	public preload() {
		Sizing.init( this.sys.game );
		Interface.init( this.sys.game );
		
		// load assets
		this.loadBar( 24 );
		// this.load.pack( 'pack', 'assets/pack.json' );
	}
	
	public create() {
		Socket.init();
		
		Socket.multiOn( ChatEvents );
		Socket.multiOn( TictactoeEvents );
		Socket.multiOn( MoveEvents );
		
		this.scene.start( 'Movement' );
	}
	
	private loadBar( height: number ) {
		const progressBar = this.add.graphics(),
		      loadingText = this.add.text(
			      2, config.size.height - height,
			      'Loading...',
			      {
				      font: `${height * 0.9}px monospace`,
				      fill: '#ffffff'
			      }
		      );
		
		this.load.on( 'progress', ( value ) => {
			loadingText.setText( `Loading... ${Math.floor( value * 100 )}%` );
			
			progressBar.clear();
			progressBar.fillStyle( Phaser.Display.Color.HexStringToColor( '#bbbbbb' ).color, 1 );
			
			progressBar.fillRect( 0, config.size.height - height - 2, config.size.width * value, height + 4 );
		} );
		
		this.load.on( 'complete', () => {
			progressBar.destroy();
			loadingText.destroy();
		} );
	}
	
}
