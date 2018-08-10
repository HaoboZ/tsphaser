String.prototype.toColor = function () {
	return parseInt( this.substr( 1 ), 16 );
};