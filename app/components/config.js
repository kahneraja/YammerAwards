
var config = {
	dev : 'wRYlevX0104HYGbbpnDvqw',
	prod: 'l6qqulIRaKKpItaVEyxMw',
	getClientID: function(){
		if (window.location.href.substring(0, 16) === 'http://localhost')
			return this.dev;
		else
			return this.prod;
	}
}

module.exports = config;