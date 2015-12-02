var MessageList = React.createClass({
  getInitialState: function() {
    return {
      lastId: null,
      mostRecentDate: '',
      isPaused: false,
      length: 0
    };
  }, 

  getNextPage: function() {
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
        this.processMessages(data.messages);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  getLocalDump: function() {
    if (this.state.lastId)
      url += 'older_than=' + this.state.lastId;

    var token = "Bearer " + this.props.token;
    $.ajax({
      url: 'messages.json',
      dataType: 'json',
      success: function(data) {
        window.messages = data;
      }
    });
  },  

  processMessages: function(messages){
    if (messages.length == 0)
      return this.finish();

    var messages = this.cleanMessages(messages);
    var lastMessage = messages[messages.length - 1];
    this.setState({length: this.state.length + messages.length});
    this.setState({mostRecentDate: lastMessage.created_at});
    this.setState({lastId: lastMessage.id});  

    this.saveMessages(messages);
    this.getNextMessages();
  },

  saveMessages: function(messages) {
    var items = messages.map(function(e){
      return JSON.stringify(e);
    });
    var json = items.join(",") + ',';
    $.post( "save", json );
  },    

  cleanMessages: function(messages){
    return messages.map((item, i) => {
      delete item.body;
      delete item.content_excerpt;
      delete item.attachments;
      return item;
    });
  },

  getNextMessages: function(){
    if (this.state.isPaused)
      return;

    if (this.state.mostRecentDate.substring(0, 4) !== '2015')
      return alert('Not 2015?!');

    setTimeout(function(){
      this.getNextPage();
    }.bind(this), 1000);
  },

  togglePause: function(){
    if (!this.state.isPaused)
      this.pause();
    else
      this.unPause();
  }, 

  pause: function(){
    this.setState({isPaused : true});
  },

  unPause: function(){
    this.setState({isPaused : false});
    setTimeout(function(){
      this.getNextMessages();
    }.bind(this), 1000);   
  },

  render: function () {
    return (
      <div>
        <h2>Messages {this.state.length}</h2>
        <div>{this.state.mostRecentDate}</div>
        <hr/>
        <button onClick={this.getNextPage}>Load Messages</button>
        <button onClick={this.togglePause}>Pause</button>
        <hr/>
        <button onClick={this.getLocalDump}>getLocalDump</button>
        
      </div>
    );
  }
});


var YammerAwards = React.createClass({
  render: function () {
    var token = document.location.hash.split('=')[1];
    return (
      <div>
        <a href={ "https://www.yammer.com/dialog/oauth?client_id=" + this.props.client_id  + "&redirect_uri=" + window.location.href + "&response_type=token" }>Login</a>
        <div>Token: {token}</div>
        <MessageList token={token} />
      </div>
    );
  }
});

ReactDOM.render(
    <YammerAwards client_id="l6qqulIRaKKpItaVEyxMw" redirect_uri="http://localhost:3000" />
    , document.getElementById('content'));