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
		var user = _.chain(this.props.users)
			.sortBy(function(a){
				return a.likedMessages().length;
			})
			.last()
			.value();

		var mugshot = user.mugshot_url_template;
		mugshot = mugshot.replace('{width}', 150);
		mugshot = mugshot.replace('{height}', 150);

		this.setState({full_name : user.full_name});
		this.setState({mugshot : mugshot});
		this.setState({likes : user.likedMessages().length});
		this.setState({isReady: true});
	},

	render: function(){
		return (
			<div>
				<div className="col-md-12">
					<div className="panel panel-default">
					  <div className="panel-heading">
					  	I Like You Award: <span>{this.state.full_name}</span>
					  </div>
					  <div className="panel-body">
					  	<p>Shows most support by liking your work.</p>
					  	{ this.state.isReady ?
					  		<div>
							  	<div className="row">
							  		<div className="col-md-3">
							  			<img src={this.state.mugshot} alt=""/>
							  		</div>
							  		<div className="col-md-9">
									  	<p>
									  		Likes: {this.state.likes}
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

