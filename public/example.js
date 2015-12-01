var MessageList = React.createClass({
  getInitialState: function() {
    return {messages: []};
  }, 

  loadMessages: function() {
    var url = 'https://api.yammer.com/api/v1/messages.json';
    var token = "Bearer " + this.props.token;
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      headers: {
        "Authorization": token
      },
      success: function(data) {
        this.setState({messages: data.messages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  render: function () {
    return (
      <div>
        <h2>Messages</h2>
        <div onClick={this.loadMessages}>Load Messages</div>
        <ul>
          {
            this.state.messages.map((item, i) => { 
              return <li>{ item.id }</li> 
            })
          }
        </ul>

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