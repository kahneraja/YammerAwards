
var Users = React.createClass({

  getInitialState: function() {
    return {
      token: document.location.hash.split('=')[1],
      lastId: null,
      mostRecentDate: '',
      isPaused: false,
      pageIndex: 1
    };
  }, 

  getNextPage: function() {
    var url = 'https://api.yammer.com/api/v1/users.json?page=' + this.state.pageIndex;

    var token = "Bearer " + this.state.token;
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      headers: {
        "Authorization": token
      },
      success: function(data) {
        this.processUsers(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  getLocalDump: function() {
    if (this.state.lastId)
      url += 'older_than=' + this.state.lastId;

    var token = "Bearer " + this.state.token;
    $.ajax({
      url: 'users.json',
      dataType: 'json',
      success: function(data) {
        window.users = data;
      }
    });
  },  

  processUsers: function(users){
    this.saveUsers(users);

    if (users.length)
      this.getNextUsers();
  },

  saveUsers: function(users) {
    var items = users.map(function(e){
      return JSON.stringify(e);
    });
    var json = items.join(",") + ',';
    $.post( "save", json );
  },    

  getNextUsers: function(){
    if (this.state.isPaused)
      return;

    this.setState({pageIndex: this.state.pageIndex + 1});

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
      this.getNextUsers();
    }.bind(this), 1000);   
  },

  render: function () {
    return (
      <div>
        <a href={ "https://www.yammer.com/dialog/oauth?client_id=" + this.props.client_id  + "&redirect_uri=" + window.location.href + "&response_type=token" }>Login</a>
        <div>Token: {this.state.token}</div>

        <h2>Users {this.state.length}</h2>
        <div>{this.state.mostRecentDate}</div>
        <hr/>
        <button onClick={this.getNextPage}>Load Users</button>
        <button onClick={this.togglePause}>Pause</button>
        <hr/>
        <button onClick={this.getLocalDump}>getLocalDump</button>
      </div>
    );
  }
});

ReactDOM.render(
    <Users client_id="l6qqulIRaKKpItaVEyxMw" redirect_uri="http://localhost:3000" />
    , document.getElementById('content'));