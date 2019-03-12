import { moveInfo } from '../../../shared/data';
import Room from '../../room/room';
import MoveClient from './moveClient';

export default class MoveRoom extends Room<MoveClient> {
	
	public type = moveInfo.type;
	protected baseClient = MoveClient;
	
	private interval: NodeJS.Timeout;
	
	protected roomEvents( moveClient: MoveClient ): moveInfo.events.server.local {
		return {
			...super.roomEvents( moveClient ),
			[ moveInfo.move ]: ( roomId, { x, y } ) => {
				if ( this.id !== roomId ) return;
				
				moveClient.moveTo( x, y );
			}
		};
	}
	
	protected onCreate() {
		this.interval = setInterval( () => {
			const clientData: { [ id: string ]: { x, y } } = {};
			this.clients.iterate( ( item, id ) => {
				if ( item.dirty ) {
					clientData[ id ] = { x: item.x, y: item.y };
					item.dirty = false;
				}
			} );
			
			this.roomEmit( moveInfo.move, { clientData } );
		}, 1000 / moveInfo.fps );
	}
	
	protected onRemove() {
		clearInterval( this.interval );
	}
	
}
