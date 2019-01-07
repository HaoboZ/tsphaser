import { chatInfo } from '../../../shared/events';
import Client from '../../connect/client';
import Room from '../../room/room';
import ChatClient from './chatClient';

export default class ChatRoom extends Room<ChatClient> {
	
	public type = chatInfo.type;
	protected baseClient = ChatClient;
	
	public log = [];
	
	protected roomEvents( chatClient: ChatClient ) {
		let client = chatClient.client;
		return {
			...super.roomEvents( chatClient ),
			[ chatInfo.message ]: ( roomId, { message } ) => {
				if ( this.id !== roomId ) return;
				
				this.send( client, message );
			}
		};
	}
	
	public send( client: Client, message ) {
		let chatClient = this.clients.get( client.id );
		
		let data: chatInfo.message = { ...chatClient.data, message };
		
		this.log.push( data );
		this.roomEmit( chatInfo.message, data );
	}
	
}
