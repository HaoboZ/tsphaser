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
	
	get count(): number {
		return Object.keys( this.list ).length;
	}
	
	public loop( fn: ( item: T | any, id: string ) => boolean | void ) {
		for ( let id in this.list ) {
			if ( fn( this.list[ id ], id ) ) return;
		}
	}
	
	public getFirst( fn: ( item: T | any ) => boolean ): T {
		for ( let id in this.list ) {
			if ( fn( this.list[ id ] ) ) return this.list[ id ];
		}
		return null;
	}
	
}
