var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var _ = require('underscore');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			name: '',
			web_url: '',
			created_at: '',
			mugshot: '',
			isReady: false
		};
	},

	componentDidMount: function() {
		this.calculate();		
	},

	calculate: function(){
		if (!this.props.users.length || !this.props.groups.length)		
			return;
		
		var group = _.chain(this.props.groups)
			.filter(function(a){
				var totalDays = 365;
				var startDate = new Date();
				startDate.setDate(startDate.getDate() - totalDays);				
				var d = new Date(a.created_at);
				if (d > startDate)
					return a;
			})
			.sortBy(function(a){
				return a.messages().length;
			})
			.last()
			.value();

		var user = _.chain(this.props.users)
			.where({ id: group.creator_id })
			.first()
			.value();

		var mugshot = user.mugshot_url_template;
		mugshot = mugshot.replace('{width}', 150);
		mugshot = mugshot.replace('{height}', 150);

		this.setState({full_name : user.full_name});
		this.setState({group_name : group.full_name});
		this.setState({mugshot : mugshot});
		this.setState({web_url : group.web_url});
		this.setState({content_excerpt : group.title});
		this.setState({created_at : group.created_at});
		this.setState({messages : group.messages().length});
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
							<h4 className="media-heading">Group Creator Award: {this.state.full_name}</h4>
						  		<p>Creator of most popular new group.</p>
						  		<p><a href={this.state.web_url} target="_blank">{this.state.group_name}</a></p>
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

