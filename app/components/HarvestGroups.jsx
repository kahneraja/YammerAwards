var React = require('react');
var ReactDOM = require('react-dom');
var lzString = require('lz-string');
var $ = require('jquery');
var _ = require('underscore');

module.exports = React.createClass({

	getInitialState: function() {
		var length = 0;
		var isComplete = false;	
		var progress = 0;
		var pageSize = 50;
		var pageIndex = 0;
		var localStorageKey = 'yammer-groups';

		var compressed = localStorage.getItem(localStorageKey);
		if (compressed){
			var decompressed = lzString.decompress(compressed);
			var json = JSON.parse(decompressed);
			length = json.length;
			isComplete = true;	
			progress = 100;
		}

		return {
			pageIndex: pageIndex,
			length: length,
			isComplete: isComplete,
			localStorageKey: localStorageKey,
			progress: progress
		};
	},

	componentDidMount: function() {

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
	},

	clear: function(){
		localStorage.removeItem(this.state.localStorageKey);
		this.setState({ length: 0});
		this.setState({ lastId: 0});
		this.setState({ isComplete: false});
		this.setState({ isActive: false});
		this.setState({ pageIndex: 0})
	},

	get: function() {
		if (this.state.isComplete)
			return;

		var url = 'https://api.yammer.com/api/v1/groups.json?page=' + this.state.pageIndex;

		var token = "Bearer " + this.props.token;
		$.ajax({
			url: url,
			dataType: 'json',
			cache: false,
			headers: {
			"Authorization": token
			},
			success: function(data) {
				this.process(data);
			}.bind(this),
			error: function(xhr, status, err) {
				this.stop();
			}.bind(this)
		});
	},

	process: function(groups){
		if (groups.length === 0)
			return this.finish();

		var lastGroup = this.save(groups);
		if (this.state.isActive)
			this.getNextPage(lastGroup);
	},	

	save: function(groups){
		var compressed = localStorage.getItem(this.state.localStorageKey);
		var decompressed = '[]';
		
		if (compressed)
			decompressed = lzString.decompress(compressed);

		var json = JSON.parse(decompressed);
		var items = json.concat(groups);
		var data = JSON.stringify(items);
		localStorage.setItem(this.state.localStorageKey, lzString.compress(data));

		this.setState({length: items.length});

		this.props.onUpdate();
		return items[items.length - 1];
	},

	getNextPage: function(group){
		if (!group)
			return this.finish();

		this.setState({pageIndex: this.state.pageIndex+1});
		setTimeout(function(){ this.get(); }.bind(this), 1000);
	},	

	render: function(){
		var progressClassNames = 'progress-bar';
		if (this.state.isComplete)
			progressClassNames += ' progress-bar-success';

		return (
			<div>
				<div className="col-md-12">

					<div className="panel panel-default">
					  <div className="panel-heading">Groups</div>
					  <div className="panel-body">
						<div className="progress">
						  <div className={progressClassNames} role="progressbar" aria-valuenow={ this.state.progress } aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress + '%'}}>
						    { this.state.progress }%
						  </div>
						</div>
					  </div>

					  <ul className="list-group">
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
					    	<span>Groups: {this.state.length}</span>
					    </li>
					  </ul>
					</div>

				</div>
			</div>
		)
	}
});

