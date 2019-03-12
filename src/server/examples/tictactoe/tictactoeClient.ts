import { names } from '../../../shared/constants';
import RoomClient from '../../room/roomClient';

export default class TictactoeClient extends RoomClient {
	
	public name: string;
	
	public ready = false;
	
	get data() {
		return {
			...super.data,
			name: this.name
		};
	}
	
	constructor( args ) {
		super( args );
		
		this.name = names[ Math.floor( Math.random() * names.length ) ];
	}
	
}
