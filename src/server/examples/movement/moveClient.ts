import { colors, names } from '../../../shared/constants';
import { moveInfo } from '../../../shared/data';
import RoomClient from '../../room/roomClient';

export default class MoveClient extends RoomClient {
	
	public name: string;
	public color: string;
	
	public dirty: boolean = true;
	
	public x: number;
	public y: number;
	
	get data() {
		return {
			...super.data,
			name:  this.name,
			color: this.color,
			x:     this.x,
			y:     this.y
		};
	}
	
	constructor( args ) {
		super( args );
		
		this.name = names[ Math.floor( Math.random() * names.length ) ];
		this.color = colors[ Math.floor( Math.random() * colors.length ) ];
		
		this.x = Math.floor( Math.random() * moveInfo.world.width );
		this.y = Math.floor( Math.random() * moveInfo.world.height );
		
	}
	
	public moveTo( x, y ) {
		this.dirty = true;
		this.x = x;
		this.y = y;
	}
	
}
