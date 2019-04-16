const mobile = ( typeof window.orientation !== 'undefined' ) || ( navigator.userAgent.indexOf( 'IEMobile' ) !== -1 );

export default {
	size:  {
		width:  1280,
		height: 720
	},
	mobile,
	debug: true
};
