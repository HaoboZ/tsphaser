import * as React from 'react';
import Interface from '../interface/interface';

import './style.less';

export default class Menu extends Phaser.State {
	
	public create() {
		Interface.render( <div className='txt'>Hello World</div>, $( '#JQoverlay' )[ 0 ] );
	}
	
	public update() {
	
	}
	
}
