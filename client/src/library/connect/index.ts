import { Client } from 'colyseus.js';

import config from '../../../../server/src/config';


const Connect = new class {
	
	public init() {
		this.client = new Client( `ws://${window.location.host}:${config.port}` );
	}
	
	public client: Client;
	
};
export default Connect;
