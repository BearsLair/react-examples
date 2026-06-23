import { Component } from 'react';

class Count extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <p>Current Todo Count: {this.props.todos.length}</p>;
  }
}

class ClassInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [
        { task: 'Just some demo tasks', editMode: false },
        { task: 'As an example', editMode: false },
      ],
      inputVal: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleInputChange(e) {
    this.setState((state) => ({
      ...state,
      inputVal: e.target.value,
    }));
  }

  // handleEditTodo(todo) {
  //   // Find index of indiviual todo in todos array
  // }

  handleSubmit(e) {
    e.preventDefault();
    this.setState((state) => ({
      todos: state.todos.concat({ task: state.inputVal, editMode: false }),
      inputVal: '',
    }));
  }

  handleDelete(todo) {
    this.setState((state) => {
      let index = state.todos.findIndex((item) => item.task === todo);
      console.log('index to delete, ', index);
      let updatedTodos = [
        ...state.todos.slice(0, index),
        ...state.todos.slice(index + 1),
      ];

      return { todos: updatedTodos };
    });
  }

  render() {
    return (
      <section>
        <h3>{this.props.name}</h3>
        {/* The input field to enter To-Do's */}
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="task-entry">Enter a task: </label>
          <input
            type="text"
            name="task-entry"
            value={this.state.inputVal}
            onChange={this.handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        <h4>All the tasks!</h4>
        {/* The list of all the To-Do's, displayed */}
        <ul>
          {this.state.todos.map((todo) => (
            <li
              // onClick={() => {
              //   handleEditTodo(todo);
              // }}
              key={todo.task}
            >
              {todo.task}
              <button
                type="button"
                onClick={() => this.handleDelete(todo.task)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <Count todos={this.state.todos} />
      </section>
    );
  }
}

export default ClassInput;
