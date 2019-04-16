import { Client } from 'colyseus.js';
import config from '../../server/config';

const Server = new class {
	
	private _client: Client;
	
	public init() {
		this._client = new Client( 'ws://localhost:' + config.port );
	}
	
	public get client() {
		return this._client;
	}
	
};
export default Server;
