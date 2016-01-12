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
		
		var keyPair = _.chain(this.props.messages)
			.filter(function(a){
				return a.isThreadStart;
			})
			.reduce(function(collection, item){
				if (item.replies().length)
					var collection = collection.concat(_.chain(item.replies()).last().value());
				return collection;
			}, [])
			.countBy('sender_id')
			.pairs()
			.sortBy(1)
			.last()
			.value();

		var id = parseInt(keyPair[0]);
		var fatalities = keyPair[1];

		var user = _.chain(this.props.users)
			.where({'id': id})
			.last()
			.value();

		var mugshot = user.mugshot_url_template;
		mugshot = mugshot.replace('{width}', 150);
		mugshot = mugshot.replace('{height}', 150);

		this.setState({full_name : user.full_name});
		this.setState({mugshot : mugshot});
		this.setState({fatalities : fatalities});
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
							<h4 className="media-heading">Fatality Award: {this.state.full_name}</h4>
						  		<p>I end conversations.</p>
						  		<p>
						  			Fatalities <span className="badge">{this.state.fatalities}</span>
						  		</p>
						  		<p>
						  		</p>							  		
						</div>
					</div>
			  	: null }	
			</div>
		)
	}
});

