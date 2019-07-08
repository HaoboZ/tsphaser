import { Client } from 'colyseus.js';

import config from '../../server/config';


const Server = new class {
	
	public init() {
		this.client = new Client( `ws://${window.location.host}:${config.port}` );
	}
	
	public client: Client;
	
};
export default Server;
