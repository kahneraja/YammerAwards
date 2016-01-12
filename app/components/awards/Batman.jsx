var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var _ = require('underscore');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			name: '',
			web_url: '',
			content_excerpt: '',
			created_at: '',
			likes: '',
			mugshot: '',
			isReady: false
		};
	},

	componentDidMount: function() {
		this.calculate();
	},	


	calculate: function(){
		if (!this.props.users.length)
			return;
		
		var user = _.chain(this.props.users)
			.filter(function(user){
				var dayMessages = _.filter(user.messages(), function(message){
					var d = new Date(message.created_at);
					var hour = d.getHours();
					if ((hour > 7 && hour < 12) || (hour >= 1 && hour <= 19)) // 7AM to 7PM
						return message;
				});
				if (!dayMessages.length)
					return user;
			})
			.sortBy(function(user){
				return user.messages().length;
			})
			.last()
			.value();

		var mugshot = user.mugshot_url_template;
		mugshot = mugshot.replace('{width}', 150);
		mugshot = mugshot.replace('{height}', 150);

		this.setState({full_name : user.full_name});
		this.setState({mugshot : mugshot});
		this.setState({messages : user.messages().length});
		this.setState({isReady: true});

	},

	render: function(){
		return (
			<div>
			  	{ this.state.isReady ?
			  		<div className="media">
						<div className="media-left">
							<a href="#">
								<img className="media-object" width="50" src={this.state.mugshot} alt="..." />
							</a>
						</div>
						<div className="media-body">
							<h4 className="media-heading">Batman Award: {this.state.full_name}</h4>
						  		<p>I only ever post at night.</p>
						  		<p>
						  			Messages <span className="badge">{this.state.messages}</span>
						  		</p>							  		
						</div>
					</div>
			  	: null }
			</div>
		)
	}
});

