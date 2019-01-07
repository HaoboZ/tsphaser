import Client from '../connect/client';

export default class RoomClient {
	
	public client: Client;
	
	public events: Object;
	
	get data() {
		return this.client.data;
	}
	
	constructor( client: Client ) {
		this.client = client;
	}
	
}
