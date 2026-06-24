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
      // This state holds the value for the currently active editable item.
      // It starts empty so that when we enter a new edit mode, it gets populated immediately.
      editInputValue: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleEditInput = this.handleEditInput.bind(this);
    this.enterEditMode = this.enterEditMode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleInputChange(e) {
    this.setState((state) => ({
      ...state,
      inputVal: e.target.value,
    }));
  }

  handleEditInput(e) {
    // We update the state directly here.
    // Because we are inside a render cycle where editMode is true,
    // this will trigger another re-render, but it's safe because
    // the DOM element (input) still exists and hasn't been swapped yet.
    this.setState((state) => ({
      ...state,
      editInputValue: e.target.value,
    }));
  }

  enterEditMode(todoTask) {
    const index = this.state.todos.findIndex((t) => t.task === todoTask);

    if (index !== -1) {
      // CRITICAL FIX: We now perform a single setState call to handle both
      // the value reset and the mode switch. This prevents the race condition
      // where multiple state updates confuse React's batching.

      this.setState({
        editInputValue: todoTask, // Set it immediately to current task text
        todos: [...this.state.todos], // Create a new array reference
      });

      // Now update the specific item in the new array
      const updatedTodos = [...this.state.todos];
      updatedTodos[index] = {
        ...updatedTodos[index],
        editMode: true,
      };

      this.setState({ todos: updatedTodos, isEditing: true });
    }
  }

  handleEdit(todoTask) {
    const index = this.state.todos.findIndex((t) => t.task === todoTask);

    if (index !== -1 && this.state.editInputValue.trim() !== '') {
      let updatedTodos = [...this.state.todos];

      // Update the specific item with the new value and disable edit mode
      updatedTodos[index] = {
        task: this.state.editInputValue,
        editMode: false,
      };

      // CRITICAL FIX: Explicitly clear editInputValue here.
      // This ensures that if we switch to another task immediately after saving,
      // the next enterEditMode() call will start with an empty string (or rather,
      // it will overwrite whatever garbage is there with the new task text).
      this.setState({
        todos: updatedTodos,
        editInputValue: '', // Reset for the next user action
        isEditing: false, // Re-enable clicks on others
      });
    } else if (this.state.editInputValue.trim() === '') {
      // Handle empty submission gracefully by resetting state
      this.setState({
        todos: [...this.state.todos],
        editInputValue: '',
        isEditing: false,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState((state) => ({
      todos: [...state.todos, { task: state.inputVal.trim(), editMode: false }],
      inputVal: '',
    }));
  }

  handleDelete(todoTask) {
    const index = this.state.todos.findIndex((t) => t.task === todoTask);

    if (index !== -1) {
      let updatedTodos = [
        ...this.state.todos.slice(0, index),
        ...this.state.todos.slice(index + 1),
      ];

      // Ensure we aren't stuck in edit mode after delete
      this.setState({
        todos: updatedTodos,
        isEditing: false,
        editInputValue: '',
      });
    }
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
            <li key={todo.task}>
              {/* 
                Logic: 
                1. If editMode is true -> Show Input + ReSubmit Button
                   The input value comes from state.editInputValue.
                   When enterEditMode runs, it sets this to the current task text.
                2. Else if isEditing flag is true -> Hide Clicks/Buttons for this item
                3. Else -> Show Text + Delete Button (and allow click to enter edit)
              */}

              {todo.editMode ? (
                <>
                  <input
                    type="text"
                    placeholder={todo.task}
                    value={this.state.editInputValue}
                    onChange={this.handleEditInput}
                  />
                  <button
                    type="button"
                    onClick={() => this.handleEdit(todo.task)}
                  >
                    ReSubmit (Save)
                  </button>
                </>
              ) : (
                <>
                  {/* Only allow clicking to edit if we are NOT currently editing another item */}
                  {!this.state.isEditing && (
                    <p onClick={() => this.enterEditMode(todo.task)}>
                      {todo.task}
                    </p>
                  )}

                  {/* Only show Delete button if we are NOT currently editing another item */}
                  {!this.state.isEditing && (
                    <button
                      type="button"
                      onClick={() => this.handleDelete(todo.task)}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <Count todos={this.state.todos} />
      </section>
    );
  }
}

export default ClassInput;
