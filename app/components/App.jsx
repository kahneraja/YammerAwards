"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var lzString = require('lz-string');
var _ = require('underscore');
var Token = require("./Token.jsx");
var BangForBuck = require('./awards/BangForBuck.jsx');
var GroupCreator = require('./awards/GroupCreator.jsx');
var ILikeYou = require('./awards/ILikeYou.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			users: [],
			messages: [],
			groups: [],
			isReady: false
		};
	},

	componentDidMount: function() {
		var users = this.getUsers();
		var messages = this.getMessages(users);
		var groups = this.getGroups(messages, users);
		this.setState({users: users});
		this.setState({groups: groups});
		this.setState({messages: messages});

		if(users.length && messages.length)
			this.setState({isReady: true});
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
					return _.filter(messages, function(b){
						if (b.thread_id === a.id && b.id !== a.id)
							return b;
					}); 
				};
				a.likes = function(){
					return this.liked_by.names.length
				};
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

	render: function(){
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<Token client_id="l6qqulIRaKKpItaVEyxMw"/>
					</div>
				</div>
				{ this.state.isReady ?
				<div className="row">
					<div className="col-md-12">
						<BangForBuck users={this.state.users} messages={this.state.messages} />
						<GroupCreator users={this.state.users} messages={this.state.messages} groups={this.state.groups} />
						<ILikeYou users={this.state.users} messages={this.state.messages} />
					</div>
				</div>
				: null }
			</div>
		)
	}
});


