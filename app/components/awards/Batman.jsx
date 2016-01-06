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
				<div className="col-md-12">
					<div className="panel panel-default">
					  <div className="panel-heading">
					  	Batman Award: <span>{this.state.full_name}</span>
					  </div>
					  <div className="panel-body">
					  	<p>I only ever post at night.</p>
					  	{ this.state.isReady ?
					  		<div>
							  	<div className="row">
							  		<div className="col-md-12">
							  			<img src={this.state.mugshot} alt=""/>
							  		</div>
							  		<div className="col-md-12">
										<p>
									  		Messages: {this.state.messages}
									  	</p>
							  		</div>
							  	</div>
						  	</div>
					  	: null }	
					  </div>
					</div>
				</div>
			</div>
		)
	}
});

