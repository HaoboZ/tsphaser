import { chatInfo } from '../../../shared/events';
import Client from '../../connect/client';
import Room from '../../room/room';
import ChatClient from './chatClient';

export default class ChatRoom extends Room<ChatClient> {
	
	public type = chatInfo.type;
	protected baseClient = ChatClient;
	
	public log: Array<{ clientId, clientName, message }> = [];
	
	protected roomEvents( chatClient: ChatClient ): chatInfo.events.server.local {
		const client = chatClient.client;
		return {
			...super.roomEvents( chatClient ),
			[ chatInfo.message ]: ( roomId, { message } ) => {
				if ( this.id !== roomId ) return;
				
				this.send( client, message );
			}
		};
	}
	
	public send( client: Client, message ) {
		const chatClient = this.clients.get( client.id );
		
		const data = { ...chatClient.data, message };
		
		this.log.push( data );
		this.roomEmit( chatInfo.message, data );
	}
	
}
