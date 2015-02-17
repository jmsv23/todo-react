var ListItem =  React.createClass({
  delete: function() {
    this.props.handlerDeleteTodo(this.props.idDelete);
  },
  update: function() {
    this.props.handlerUpdateTodo(this.props.idDelete);
    console.log(['update', this.props.idDelete]);
  },
  render: function() {
    var classString = 'list-group-item';
    if(this.props.done) {
      classString += ' done';
    }
    return (
      <li className={classString}>
      <button onClick={this.update} type="button" className="btn btn-success"><span className="glyphicon glyphicon-ok"></span></button>
      {this.props.text} 
      <button onClick={this.delete} type="button" className="btn btn-danger pull-right"><span className="glyphicon glyphicon-trash"></span></button>
      </li>
    );
  }
});

var TodoListForm = React.createClass({
  submitTodo: function(e){
    e.preventDefault();
    if(this.refs.text.getDOMNode().value != '') {
      this.props.handlerSubmitTodo({text: this.refs.text.getDOMNode().value});
      this.refs.text.getDOMNode().value = '';
    }
  },
  render: function() {
    return (
      <form className="form-inline" onSubmit={this.submitTodo}>
        <div className="form-group">
          <label className="sr-only" for="todoText">New Task</label>
          <input type="text" className="form-control" id="todoText" ref="text" placeholder="Task" />
        </div>
        <button type="submit" className="btn btn-default">Add</button>
      </form>
    )
  }
});

var TodoList = React.createClass({
  render: function() {
    var self = this;
    var items = this.props.data.map(function(task, index){
        return (
          <ListItem text={task.text} done={task.done} idDelete={index} handlerDeleteTodo={self.props.handlerDeleteTodo} handlerUpdateTodo={self.props.handlerUpdateTodo} />
        )
      });
    var n = this.props.data.filter(function(task, index){
        if(typeof task.done == 'undefined') {
          return task;
        }
      });

    if(items.length == 0) {
      items = <li className="list-group-item">Add a new task</li>;
    }
    return (
      <div>
        <span>{n.length} active tasks</span>
        <ul className="list-group">
          {items}
        </ul>
        <TodoListForm handlerSubmitTodo={this.props.handlerSubmitTodo} />
      </div>
    );
  }
});

var TodoListBox = React.createClass({
  getInitialState: function(){
    return {data: []};
  },
  loadCommentsFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        success: function(data) {
          // console.log(data);
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },
  handlerSubmitTodo: function(task) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: task,
      success: function(data) {
        // this.loadCommentsFromServer();
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handlerDeleteTodo: function(id) {
    $.ajax({
      url: this.props.url + '?id=' + id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        // this.loadCommentsFromServer();
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handlerUpdateTodo: function(id) {
    $.ajax({
      url: this.props.url + '?id=' + id,
      dataType: 'json',
      type: 'PUT',
      success: function(data) {
        // this.loadCommentsFromServer();
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
      <TodoList data={this.state.data} handlerSubmitTodo={this.handlerSubmitTodo} handlerDeleteTodo={this.handlerDeleteTodo} handlerUpdateTodo={this.handlerUpdateTodo} />
    );
  }
});

React.render(
  <TodoListBox url="todo.php" />,
  document.getElementById("todo-container")
);