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
		setTimeout(function(){ this.calculate(); }.bind(this), 0);
	},

	calculate: function(){
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
				<div className="col-md-12">
					<div className="panel panel-default">
					  <div className="panel-heading">
					  	Group Creator Award: <span>{this.state.full_name}</span>
					  </div>
					  <div className="panel-body">
					  	<p>Creator of most popular new group.</p>
					  	{ this.state.isReady ?
					  		<div>
							  	<div className="row">
							  		<div className="col-md-12">
							  			<img src={this.state.mugshot} alt=""/>
							  		</div>
							  		<div className="col-md-12">
									  	<p>
									  		{this.state.full_name}
									  	</p>							  		
									  	<p>
									  		<a href={this.state.web_url} target="_blank">{this.state.group_name}</a>
									  	</p>
									  	<p>
									  		Messages: {this.state.messages}
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

