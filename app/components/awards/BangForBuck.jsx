var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var _ = require('underscore');
var ReactIntl = require('react-intl');

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
		if (!this.props.users.length || !this.props.messages.length)
			return;
		
		var message = _.chain(this.props.messages)
			.filter(function(a){
				if (a.content_excerpt.length <  140)
					return true;
			})
			.sortBy(function(a){
				return a.likes() + a.replies().length;
			})
			.last()
			.value();

		var user = _.chain(this.props.users)
			.where({ id: message.sender_id })
			.first()
			.value();

		var mugshot = user.mugshot_url_template;
		mugshot = mugshot.replace('{width}', 150);
		mugshot = mugshot.replace('{height}', 150);

		this.setState({full_name : user.full_name});
		this.setState({mugshot : mugshot});
		this.setState({web_url : message.web_url});
		this.setState({content_excerpt : message.content_excerpt});
		this.setState({created_at : message.created_at});
		this.setState({likes : message.likes()});
		this.setState({replies : message.replies().length});
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
							<h4 className="media-heading">Bang For Buck Award: {this.state.full_name}</h4>
						  		<p>Most engaging post in under 140 characters.</p>
						  		<p>"<a href={this.state.web_url} target="_blank">{this.state.content_excerpt}</a>"</p>
						  		<p>
						  			Likes <span className="badge">{this.state.likes}</span>
						  		</p>
						  		<p>
						  			Replies <span className="badge">{this.state.replies}</span>
						  		</p>							  		
						</div>
					</div>
			  	: null }	
			</div>
		)
	}
});

