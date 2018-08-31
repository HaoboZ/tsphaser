import Room from './connect/room';

const Main = new class {
	
	public global: Room;
	
	init() {
		this.global = new Room( 'global' );
	}
	
};
export default Main;
