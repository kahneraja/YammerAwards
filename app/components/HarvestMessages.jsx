var React = require('react');
var ReactDOM = require('react-dom');
var lzString = require('lz-string');
var $ = require('jquery');
var _ = require('underscore');

module.exports = React.createClass({

	getInitialState: function() {
		var totalDays = 365;
		var startDate = new Date();
		var lastId = null;
		var length = 0;
		var isComplete = false;	
		var isActive = false;

		startDate.setDate(startDate.getDate() - totalDays);

		var compressed = localStorage.getItem('yammer-messages');
		if (compressed){
			var decompressed = lzString.decompress(compressed);
			var json = JSON.parse(decompressed);
			length = json.length;			

			var lastMessage = json[json.length - 1];
			lastId = lastMessage.id;
			if (lastMessage.isLast){
				isComplete = true;
				isActive = true;
			}
				
		}

		return {
			totalDays: totalDays,
			lastId: lastId,
			length: length,
			isComplete: isComplete,
			isActive: isActive,
			startDate: startDate
		};
	},

	componentDidMount: function() {
		var compressed = localStorage.getItem('yammer-messages');
		if (!compressed)
			return this.setState({progress: 0});

		var decompressed = lzString.decompress(compressed);
		var json = JSON.parse(decompressed);
		var lastMessage = json[json.length - 1];
		this.progress(lastMessage);
	},

	toggle: function() {
		if (this.state.isActive)
			this.stop();
		else
			this.activate();
	},

	activate: function(){
		this.setState({isActive : true});
		this.get();
	},

	stop: function(){
		this.setState({isActive : false});
	},

	finish: function(){
		this.setState({isComplete: true});
		this.setState({progress: 100});

		var compressed = localStorage.getItem('yammer-messages');
		var decompressed = lzString.decompress(compressed);
		var json = JSON.parse(decompressed);
		json[json.length - 1].isLast = true;
		var data = JSON.stringify(json);
		localStorage.setItem("yammer-messages", lzString.compress(data));	
	},

	clear: function(){
		localStorage.removeItem('yammer-messages');
		this.setState({ length: 0});
		this.setState({ lastId: 0});
		this.setState({ isComplete: false});
		this.setState({ isActive: false});
		this.progress();
	},

	get: function() {
		if (this.state.isComplete)
			return;

		var url = 'https://api.yammer.com/api/v1/messages.json?';
		if (this.state.lastId)
			url += 'older_than=' + this.state.lastId;

		var token = "Bearer " + this.props.token;
		$.ajax({
			url: url,
			dataType: 'json',
			cache: false,
			headers: {
			"Authorization": token
			},
			success: function(data) {
				this.process(data.messages);
			}.bind(this),
			error: function(xhr, status, err) {
				this.stop();
			}.bind(this)
		});
	},

	compress: function(messages){
		return _.map(messages, function(m){
			delete m.body;
			delete m.attachments;
			m.content_excerpt = m.content_excerpt.substring(0, 140);
			return m;
		});
	},	

	filter: function(messages){
		var startDate = this.state.startDate;
		return _.filter(messages, function(m){
			var d = new Date(m.created_at);
			if (d > startDate)
				return m;
		});
	},

	process: function(messages){
		var compressed = this.compress(messages);
		var filtered = this.filter(compressed);

		if (filtered.length === 0)
			return this.finish();

		var lastMessage = this.save(filtered);
		if (this.state.isActive)
			this.getNextPage(lastMessage);
	},	

	save: function(messages){
		var compressed = localStorage.getItem('yammer-messages');
		var decompressed = '[]';
		
		if (compressed)
			decompressed = lzString.decompress(compressed);

		var json = JSON.parse(decompressed);
		var items = json.concat(messages);
		var data = JSON.stringify(items);
		localStorage.setItem("yammer-messages", lzString.compress(data));
		this.setState({length: items.length});

		this.props.onUpdate();

		return items[items.length - 1];
	},

	progress: function(message){
		if (!message)
			return this.setState({progress:0});

		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var a = this.state.startDate;
		var b = new Date(message.created_at);
		var diffDays = this.state.totalDays - Math.round(Math.abs((b.getTime() - a.getTime())/(oneDay)));
		var progress = (diffDays / this.state.totalDays) * 100;
		this.setState({progress : progress.toFixed(2) });
	},

	getNextPage: function(message){
		if (!message)
			return this.finish();

		this.setState({lastId: message.id});
		setTimeout(function(){ this.progress(message); }.bind(this), 0);
		setTimeout(function(){ this.get(); }.bind(this), 1000);
	},	

	render: function(){
		var progressClassNames = 'progress-bar';
		if (!this.state.isActive)
			progressClassNames += ' progress-bar-danger';
		if (this.state.isComplete)
			progressClassNames += ' progress-bar-success';

		return (
			<div>
				<div className="col-md-12">
					<div className="panel panel-default">
					  <div className="panel-heading">Messages</div>
					  <div className="panel-body">
						<div className="progress">
						  <div className={progressClassNames} role="progressbar" aria-valuenow={ this.state.progress } aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress + '%'}}>
						    { this.state.progress }%
						  </div>
						</div>
					  </div>
					  <ul className="list-group"> 
					  	<li className="list-group-item list-group-item-danger">This can take hours...</li>
					    <li className="list-group-item">
							<div className="btn-group">
								{ this.state.length ?
									<button className="btn btn-default"  onClick={this.clear}>Clear</button>
								: null }
								{ !this.state.isComplete ? 
									<button className="btn btn-default"  onClick={this.toggle}>
										{ this.state.length === 0 ? 'Harvest' : null }
										{ this.state.length > 0 && this.state.isActive ? 'Pause' : null }
										{ this.state.length > 0 && !this.state.isActive ? 'Continue' : null }
									</button>
								: null }
							</div>
					    </li>
					    <li className="list-group-item">
					    	<span>Messages: {this.state.length}</span>
					    </li>
					  </ul>
					</div>

				</div>
			</div>
		)
	}
});

