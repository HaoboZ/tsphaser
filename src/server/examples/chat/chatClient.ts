import { names } from '../../../shared/constants';
import RoomClient from '../../room/roomClient';

export default class ChatClient extends RoomClient {
	
	public name: string = names[ Math.floor( Math.random() * names.length ) ];
	
	get data() {
		return {
			...super.data,
			name: this.name
		};
	}
	
}
