"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var lzString = require('lz-string');
var _ = require('underscore');
var Token = require("./Token.jsx");
var HarvestMessages = require('./HarvestMessages.jsx');
var HarvestUsers = require('./HarvestUsers.jsx');
var HarvestGroups = require('./HarvestGroups.jsx');
var BangForBuck = require('./awards/BangForBuck.jsx');
var GroupCreator = require('./awards/GroupCreator.jsx');
var ILikeYou = require('./awards/ILikeYou.jsx');
var Silent = require('./awards/Silent.jsx');
var Contributor = require('./awards/Contributor.jsx');
var Batman = require('./awards/Batman.jsx');
var Hashtagger = require('./awards/Hashtagger.jsx');
var Linkaholic = require('./awards/Linkaholic.jsx');
var Rambling = require('./awards/Rambling.jsx');
var Fatality = require('./awards/Fatality.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			users: [],
			messages: [],
			groups: [],
			isReady: false,
			token: document.location.hash.split('=')[1]
		};
	},

	componentDidMount: function() {
		this.calculate();
	},

	calculate:function(){
		var users = this.getUsers();
		var messages = this.getMessages(users);
		var groups = this.getGroups(messages, users);

		if (!users || !messages || !groups)
			return;

		this.setState({users: users});
		this.setState({groups: groups});
		this.setState({messages: messages});
		this.setState({isReady: true});

		setTimeout(function(){
			this.refs.bangForBuck.calculate();
			this.refs.groupCreator.calculate();
			this.refs.iLikeYou.calculate();
			this.refs.silent.calculate();
			this.refs.contributor.calculate();
			this.refs.batman.calculate();
			this.refs.hashtagger.calculate();
			this.refs.linkaholic.calculate();
			this.refs.rambling.calculate();
			this.refs.fatality.calculate();
		}.bind(this), 1000);		
	},

	getUsers: function(){
		var compressed = localStorage.getItem('yammer-users');
		if (!compressed)
			return;
		var decompressed = lzString.decompress(compressed);
		var json = JSON.parse(decompressed);

		return json;
	},

	getMessages: function(users){
		var compressed = localStorage.getItem('yammer-messages');
		if (!compressed)
			return;
		var decompressed = lzString.decompress(compressed);
		var messages = JSON.parse(decompressed);
		messages = _.chain(messages)
			.filter(function(a){
				// remove messages from staff you have quit!
				var user = _.where(users, { id: a.sender_id});
				if (user.length)
					return a;
			})			
			.map(function(a){
				a.replies = function(){ 
					return _.chain(messages)
							.filter(function(b){
								if (b.thread_id === a.id && b.id !== a.id)
									return b;
							})
							.sortBy(function(b){
								return new Date(b.created_at);
							})
							.value(); 
				};
				a.likes = function(){
					return this.liked_by.names.length
				};
				a.isThreadStart = (a.thread_id === a.id);				
				return a;
			})
			.value();

		users = _.chain(users)	
			.map(function(a){
				a.likedMessages = function(){
					return _.filter(messages, function(b){
						var like = _.filter(b.liked_by.names, function(c){
							if (c.user_id === a.id)
								return c;
						});
						if (like.length)
							return b;
					});
				};

				a.messages = function(){
					return _.filter(messages, {sender_id: a.id});
				};

				a.hashtags = _.reduce(a.messages(), function(collection, item){
					if (item.hashtags)
						collection = collection.concat(item.hashtags);
					return collection;
				}, []);


				a.links = _.reduce(a.messages(), function(collection, item){
					if (item.links)
						collection = collection.concat(item.links);
					return collection;
				}, []);

				a.accumulatedWordCount = _.reduce(a.messages(), function(wordCount, item){
					return wordCount + item.wordCount;
				}, 0);				

				return a;
			})
			.value();			

		return messages;
	},

	getGroups: function(messages, users){
		var compressed = localStorage.getItem('yammer-groups');
		if (!compressed)
			return;
		var decompressed = lzString.decompress(compressed);
		var json = JSON.parse(decompressed);
		var groups = _.chain(json)
			.filter(function(a){
				// remove groups created by staff you have quit!
				var user = _.where(users, { id: a.creator_id});
				if (user.length)
					return a;
			})			
			.map(function(a){
				a.messages = function(){
					return _.filter(messages, {group_id : a.id});
				};
				return a;
			})
			.value();

		return groups;
	},

	handleUpdate: function(){
		this.calculate();
	},	

	render: function(){
		return (
			<div>
				{ !this.state.token ? 
				<div className="row">
					<div className="col-md-12">
						<Token />
					</div>
				</div>
				: null }
				{ this.state.token ? 
				<div>
					<div className="row">
						<div className="col-md-4">
							<HarvestMessages token={this.state.token} onUpdate={this.handleUpdate}/> 
						</div>
						<div className="col-md-4">
							<HarvestUsers token={this.state.token} onUpdate={this.handleUpdate} />
						</div>
						<div className="col-md-4">
							<HarvestGroups token={this.state.token} onUpdate={this.handleUpdate} />
						</div>
					</div>
					<div className="row">
						<div className="alert alert-info" role="alert">Harvest data to see awards appearing.</div>
					</div>
					<div>
						<div className="row">



							
							<div className="col-md-6">
								<ILikeYou users={this.state.users} messages={this.state.messages} ref="iLikeYou" />
							</div>


							<div className="col-md-6">
								<Batman users={this.state.users} ref="batman" />
							</div>
							<div className="col-md-6">
								<Hashtagger users={this.state.users} ref="hashtagger" />
							</div>
							<div className="col-md-6">
								<Linkaholic users={this.state.users} ref="linkaholic" />
							</div>					
							<div className="col-md-6">
								<Rambling users={this.state.users} ref="rambling" />
							</div>
							<div className="col-md-6">
								<Fatality users={this.state.users} messages={this.state.messages} ref="fatality" />
							</div>							
							<div className="col-md-6">
								<BangForBuck users={this.state.users} messages={this.state.messages} ref="bangForBuck" />
							</div>	
							<div className="col-md-6">
								<Contributor users={this.state.users} ref="contributor" />
							</div>
							<div className="col-md-6">
								<Silent users={this.state.users} ref="silent" />
							</div>	
							<div className="col-md-6">
								<GroupCreator users={this.state.users} messages={this.state.messages} groups={this.state.groups} ref="groupCreator" />
							</div>													
						</div>						
					</div>
				</div>
				: null}
			</div>
		)
	}
});


