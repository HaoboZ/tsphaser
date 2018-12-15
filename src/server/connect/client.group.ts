import Client from './client';

let ClientGroup = new class {
	
	private list: { [ id: string ]: Client } = {};
	
	public get( id: string ) {
		return this.list[ id ];
	}
	
	public add( client: Client ) {
		this.list[ client.id ] = client;
	}
	
	public remove( client: Client ) {
		delete this.list[ client.id ];
	}
	
};
export default ClientGroup;
