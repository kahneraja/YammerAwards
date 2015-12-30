// 01. The Firestarter. "I start big conversations."
// 02. The Replier. "I don't start many conversations but my replies pack heat."
// 03. The Articulation. "I'm short with my words but I get to the point."
// 04. The Silent Train. "I don't post often but when I do people love it."
// 05. The Noisy Train. "I'm basically posting all the time."
// 06. The Dice. "I post random stuff."
// 07. The Night Owl. "I only ever post under the cover of darkness."
// 08. The Multi Tasker. "I'm on yammer when I really should be at work."
// 09. The Adorer. "I don't write but I like everything."
// 10. The One Hit Wonder: "I post once a year and when I do it's awesome."

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
      query: '',
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
    debugger;
    var u = _.find(users, function(u){ return u.id === m.sender_id; });
    this.setState({message: m});
    this.setState({user: u});
  },

  populateQuery: function(value){
    var q = '';

    if (value.target.value === 'firestarter')
      q = `// firestarter
var sorted = _.sortBy(messages, function(m){ return m.liked_by.count; });
var reversed = sorted.reverse();
_.find(reversed, function(m){
  if (!_.findWhere(window.users, {id: m.sender_id }))
    return false;
  if (m.message_type === 'announcement')
    return false;

  return true;
});
`;


    if (value.target.value === 'replier')
      q = `// replier
var sorted = _.sortBy(messages, function(m){ return m.liked_by.count; });
var reversed = sorted.reverse();
_.find(reversed, function(m){
  if (!_.findWhere(window.users, {id: m.sender_id }))
    return false;
  if (m.message_type === 'announcement')
    return false;
  if (m.id === m.thread_id)
    return false;
  return m;
});
`;

    if (value.target.value === 'nightOwl')
      q = `// nightOwl
var dayMessages = _.filter(messages, function(m){
  var h = new Date(m.created_at).getHours();
  if (h > 6 && h < 22)
    return true;
});

var nightMessages = _.filter(messages, function(m){
  var h = new Date(m.created_at).getHours();
  if (h <= 6 || h >= 22)
    return true;
});

var nightUsers = _.filter(users, function(u){
  var isDayUser = _.findWhere(dayMessages, { sender_id: u.id });
  var isNightUser = _.findWhere(nightMessages, { sender_id: u.id });

  if (isNightUser && !isDayUser)
    return true;
});

console.log('nightUsers: ' + nightUsers.length);

var m = {
  sender_id : nightUsers[0].id,
  liked_by: {
    count: 0
  }
};

m;

`;

    if (value.target.value === 'liker')
      q = `
var likes = _.chain(messages)
  .reduce(function(a,b){
    return a.concat(b.liked_by.names);
  }, [])
  .groupBy(function(a){ 
    return a.user_id; 
  })
  .sortBy(function(a){ 
    return a.length; 
  })
  .last()
  .value();

var m = {
  sender_id : _.first(likes).user_id,
  liked_by: {
    count: likes.length
  }
};

m;

    `;

    this.setState({query:q});
  },

  render: function () {
    return (
      <div>
        <div>
          <button value="firestarter" onClick={this.populateQuery}>firestarter</button>
          <button value="replier" onClick={this.populateQuery}>replier</button>
          <button value="nightOwl" onClick={this.populateQuery}>nightOwl</button>
          <button value="liker" onClick={this.populateQuery}>liker</button>

        </div>
        <div>
          <textarea id="txtQuery" rows="15" cols="100" onChange={this.handleChange} value={this.state.query}></textarea>;
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
