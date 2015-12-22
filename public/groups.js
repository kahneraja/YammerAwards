
var Groups = React.createClass({

  getInitialState: function() {
    return {
      token: document.location.hash.split('=')[1],
      pageIndex: 1
    };
  }, 

  getNextPage: function() {
    var url = 'https://api.yammer.com/api/v1/groups.json?page=' + this.state.pageIndex;

    var token = "Bearer " + this.state.token;
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      headers: {
        "Authorization": token
      },
      success: function(data) {
        this.processGroups(data);
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
      url: 'groups.json',
      dataType: 'json',
      success: function(data) {
        window.groups = data;
      }
    });
  },  

  processGroups: function(groups){

    this.saveGroups(groups);

    if (groups.length)
      this.getNextGroups();
  },

  saveGroups: function(groups) {
    
    var items = groups.map(function(e){
      return JSON.stringify(e);
    });
    var json = items.join(",") + ',';
    $.post( "save", json );
  },    

  getNextGroups: function(){
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
      this.getNextGroups();
    }.bind(this), 1000);   
  },

  render: function () {
    return (
      <div>
        <a href={ "https://www.yammer.com/dialog/oauth?client_id=" + this.props.client_id  + "&redirect_uri=" + window.location.href + "&response_type=token" }>Login</a>
        <div>Token: {this.state.token}</div>

        <h2>Groups</h2>
        <hr/>
        <button onClick={this.getNextPage}>Load Groups</button>
        <button onClick={this.togglePause}>Pause</button>
        <hr/>
        <button onClick={this.getLocalDump}>getLocalDump</button>
      </div>
    );
  }
});

ReactDOM.render(
    <Groups client_id="l6qqulIRaKKpItaVEyxMw" redirect_uri="http://localhost:3000" />
    , document.getElementById('content'));