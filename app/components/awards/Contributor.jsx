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
			.sortBy(function(a){
				return a.likedMessages().length + a.messages().length;
			})
			.last()
			.value();

		var mugshot = user.mugshot_url_template;
		mugshot = mugshot.replace('{width}', 150);
		mugshot = mugshot.replace('{height}', 150);

		this.setState({full_name : user.full_name});
		this.setState({mugshot : mugshot});
		this.setState({likes : user.likedMessages().length});
		this.setState({messages : user.messages().length});
		this.setState({isReady: true});
	},

	render: function(){
		return (
			<div>
				<div className="col-md-12">
					<div className="panel panel-default">
					  <div className="panel-heading">
					  	Contributor Award: <span>{this.state.full_name}</span>
					  </div>
					  <div className="panel-body">
					  	<p>I get involved by posting and liking more than anyone else.</p>
					  	{ this.state.isReady ?
					  		<div>
							  	<div className="row">
							  		<div className="col-md-12">
							  			<img src={this.state.mugshot} alt=""/>
							  		</div>
							  		<div className="col-md-12">
									  	<p>
									  		Likes: {this.state.likes}
									  	</p>
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

