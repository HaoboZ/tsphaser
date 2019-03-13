const mobile = ( typeof window.orientation !== 'undefined' ) || ( navigator.userAgent.indexOf( 'IEMobile' ) !== -1 );

export default {
	size:  {
		width:  mobile ? 720 : 1280,
		height: mobile ? 1280 : 720
	},
	mobile,
	debug: true
};
