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
		setTimeout(function(){ this.calculate(); }.bind(this), 0);
	},	


	calculate: function(){
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
				<div className="col-md-12">
					<div className="panel panel-default">
					  <div className="panel-heading">
					  	Bang For Buck Award: <span>{this.state.full_name}</span>
					  </div>
					  <div className="panel-body">
					  	<p>Most engaging post in under 140 characters.</p>
					  	{ this.state.isReady ?
					  		<div>
							  	<div className="row">
							  		<div className="col-md-3">
							  			<img src={this.state.mugshot} alt=""/>
							  		</div>
							  		<div className="col-md-9">
									  	<p>
									  		<a href={this.state.web_url} target="_blank">{this.state.content_excerpt}</a>
									  	</p>
									  	<p>
									  		Likes: {this.state.likes}
									  	</p>
									  	<p>
									  		Replies: {this.state.replies}
									  	</p>
									  	<p>
									  		<span>{this.state.created_at}</span>
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

