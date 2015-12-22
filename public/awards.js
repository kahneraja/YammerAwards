// 01. The Firestarter. "I start big conversations."
// 02. The Replier. "I don't start many conversations but my replies pack heat."
// 03. The Articulation. "I'm short with my words but I get to the point."
// 04. The Silent Assassin. "I don't post often but when I do people love it."
// 05. The Noisy Train. "I'm basically posting all the time."
// 06. The Dice. "I post random stuff."
// 07. The Night Owl. "I operate under the cover of darkness."
// 08. The Multi Tasker. "I'm on yammer when I really should be at work.
// 09. The Adorer. "I like everything."
// 10. The 

/*
var sorted = _.sortBy(messages, function(m){ return m.liked_by.count; });
var reversed = sorted.reverse();
_.find(reversed, function(m){
  if (!_.findWhere(users, {id: m.sender_id }))
    return false;

  if (m.message_type === "announcement")
    return false;

  return true;
});
*/


var Awards = React.createClass({

  getInitialState: function() {
    return {
      query: `
var sorted = _.sortBy(messages, function(m){ return m.liked_by.count; });
var reversed = sorted.reverse();
_.find(reversed, function(m){
  if (!_.findWhere(window.users, {id: m.sender_id }))
    return false;
  if (m.message_type === 'announcement')
    return false;
  return true;
});
`,
      message: {
        liked_by: {}
      },
      user: {}
    };
  },

  handleChange: function(e) {
    this.setState({query: e.target.value});
  },

  calculate: function() {
    var m = eval(this.state.query);
    var u = _.find(users, function(u){ return u.id === m.sender_id; });
    this.setState({message: m});
    this.setState({user: u});
  },

  render: function () {
    return (
      <div>
        <div>
          <textarea id="txtQuery" rows="15" cols="100" onChange={this.handleChange}>{this.state.query}</textarea>;
        </div>
        <div>
          <button onClick={this.calculate}>calculate</button>
        </div>
        <div>
          <div>Name: {this.state.user.full_name}</div>
          <div>Title: {this.state.message.title}</div>
          <div>Likes: {this.state.message.liked_by.count}</div>
          <div>{this.state.message.web_url}</div>
          <div>Created: {this.state.message.created_at}</div>
        </div>
        <hr/>
      </div>
    );
  }
});

ReactDOM.render(
    <Awards />
    , document.getElementById('awards'));
