var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var HarvestMessages = require('./HarvestMessages.jsx');
var HarvestUsers = require('./HarvestUsers.jsx');
var HarvestGroups = require('./HarvestGroups.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			token: document.location.hash.split('=')[1],
			current: null
		};
	},

	componentDidMount: function() {
		if (!this.state.token)
			return;

		var url = 'https://api.yammer.com/api/v1/users/current.json';
		var token = "Bearer " + this.state.token;
		$.ajax({
			url: url,
			dataType: 'json',
			cache: false,
			headers: {
			"Authorization": token
			},
			success: function(data) {
				this.setState({current: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(url, status, err.toString());
			}.bind(this)
		});
	},

	render: function(){
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
					{ !this.state.token ? 
						<div className="btn-group">
							<a className="btn btn-default" href={ "https://www.yammer.com/dialog/oauth?client_id=" + this.props.client_id  + "&redirect_uri=" + window.location.href + "&response_type=token" }>Login</a>
						</div>
					: null }
					{ this.state.current ? 
					<div className="row">
						<HarvestMessages token={this.state.token} /> 
						<HarvestUsers token={this.state.token} />
						<HarvestGroups token={this.state.token} />
					</div>
					: null }						
					</div>
				</div>
			</div>
		)
	}
});
