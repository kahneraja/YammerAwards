var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var config = require('./config.js');

module.exports = React.createClass({
	
	componentDidMount: function() {

	},

	render: function(){
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<div className="btn-group">
							<a className="btn btn-default" href={ "https://www.yammer.com/dialog/oauth?client_id=" + config.getClientID()  + "&redirect_uri=" + window.location.href + "&response_type=token" }>Login</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
});
