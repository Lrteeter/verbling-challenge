var React = require('react'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

var SearchWindow = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function () {
    return {
      search: "",
      // List is stored as a hash so I can use each key value as an Id
      // Useful for keeping track of which list-items are expanded and collapsed.
      list: {
        7: "Hi Verbling! My name is Leanne. I graduated from UNC Chapel Hill with a BS in physics and I finished App Academy about 6 months ago.",
        6: "Check out their website if you're not familiar with App Academy. They're a great bunch of people: www.appacademy.io/immersive/course",
        5: "My strong suits are Ruby, Ruby on Rails, JavaScript, and React.js",
        4: "I love the idea of remote and digital education, especially for continuing-education students, like parents who have too many family obligations to take in-person classes, for example. ",
        3: "(It's amazing and frustrating how much of my Spanish I've forgotten in the last few years!!)",
        2: "I would absolutely love to talk to you guys and learn more about your team and your stack! Please get in touch with me!",
        1: "You can email me at Lrteeter@gmail.com, call me 919-247-8505, or check out my resources online: github.com/Lrteeter, www.linkedin.com/in/leanneteeter",
        0: "Thank you! ~Leanne"
      }
    };
  },

  search: function () {
    // Searching does upset the state of any expanded or collapsed list-items
    if (!this.state.expanded) {
      var expandedArr = [];
    } else {
      var expandedArr = this.state.expanded;
    }
    var string = this.state.search;

    // Uses a simple regex expression for search results
    // Regex expression is updated with every key stroke of the search bar
    var regex = new RegExp(string, 'i');
    var hash = this.state.list;
    var length = Object.keys(hash).length;
    var results = [];
    var emptyFlag = true;
    for (var i = length - 1; i >= 0; i--) {
      var str = hash[i].toString().toLowerCase();
      if (regex.test(str)) {

        // The only difference between expanded and collapsed list-items is
        // buttonText and the styling, which is handled by className in the stylesheet
        if (expandedArr.includes(i)) {
          var classname = "result-item-show";
          var buttonText = "x"
        } else {
          var classname = "result-item";
          var buttonText = "o";
        }

        emptyFlag = false;
        results.push(
          <li className={classname} key={i} onClick={this.handleDetail} id={i}>
            <button className="open-close">{buttonText}</button>
            {hash[i]}
          </li>
        );
      } else {
        // Non-search-result list-items are still included, but are stylized to have 'display: none'
        results.push(<li className="none" key={i}></li>);
      }
    }
    // Uses the boolean emptyFlag to return this message if no matches were found
    if (emptyFlag) {
      results.push(<li id="empty" key={i - 1}>No results found</li>);
    }
    return results;
  },

  // Function handles click events on the list-items
  handleDetail: function(event) {
    event.preventDefault();
    if (!this.state.expanded) {
      var expandedArr = [];
    } else {
      var expandedArr = this.state.expanded;
    }
    expandedArr = this.toggleDetails(expandedArr, parseInt(event.currentTarget.id));
    this.setState({expanded: expandedArr});
  },

  // Finds the status of current list-item and switches it
  toggleDetails: function(list, id){
    if (list.includes(id)) {
      var idx = list.indexOf(id)
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    return list;
  },

  // Expands all list-items, regardless of search string or current view
  openAll: function() {
    var arr = [];
    var length = Object.keys(this.state.list).length;
    for (var i = length - 1; i >= 0; i--) {
      arr.push(i);
    }
    this.setState({
      expanded: arr
    });
  },

  // Closes all list-items, regardless of search string or current view
  closeAll: function() {
    this.setState({
      expanded: []
    });
  },

  // Toggles all list-items, regardless of search string or current view
  toggleAll: function() {
    if (!this.state.expanded || this.state.expanded.length === 0) {
      this.openAll();
      return
    }
    var expanded = this.state.expanded;
    var length = Object.keys(this.state.list).length;
    var arr = [];
    for (var i = 0; i < length; i++) {
      arr.push(i);
    }
    for (var j = 0; j < expanded.length; j++) {
      var expandedArr = this.toggleDetails(arr, parseInt(expanded[j]));
    };
    this.setState({expanded: expandedArr});
  },

  // Takes user input to create a new list-item
  add: function() {
    var string = prompt("New entry").trim();
    if (!this.state.list) {
      this.setState({
        list: {0: string}
      })
    } else {
      var hash = this.state.list;
      var length = Object.keys(hash).length;
      hash[length] = string;
      this.setState({list: hash});
    }
  },

  render: function () {
    var results = this.search();

    return (
      <div className="main-box">
        <input
          className="search-box"
          type="text"
          valueLink={this.linkState("search")}
          placeholder="Search"
        />
        <ul className="results-list">
          {results}
        </ul>
        <div>
          <button className="toggle-button" onClick={this.openAll}>Expand All</button>
          <button className="toggle-button" onClick={this.closeAll}>Collapse All</button>
          <button className="toggle-button" onClick={this.toggleAll}>Toggle All</button>
          <button className="add-button" onClick={this.add}>Add</button>
        </div>
      </div>
    );
  }
})

module.exports = SearchWindow;
