export default class Group<T> {
	
	private list: { [ id: string ]: T } = {};
	
	public add( id: string, item: T ) {
		this.list[ id ] = item;
		return item;
	}
	
	public remove( id: string ) {
		let item = this.list[ id ];
		delete this.list[ id ];
		return item;
	}
	
	public get( id: string ): T {
		return this.list[ id ];
	}
	
	public get count(): number {
		return Object.keys( this.list ).length;
	}
	
	public iterate( fn: ( item: T, id: string ) => boolean | void ) {
		for ( let id in this.list ) {
			if ( fn( this.list[ id ], id ) ) return false;
		}
		return true;
	}
	
	public getFirst( fn: ( item: T ) => boolean ): T {
		for ( let id in this.list ) {
			if ( fn( this.list[ id ] ) ) return this.list[ id ];
		}
		return null;
	}
	
	public get random() {
		return Object.keys( this.list )[ Math.floor( Math.random() * this.count ) ];
	}
	
}
