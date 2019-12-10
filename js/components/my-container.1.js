//import { html, render } from 'https://unpkg.com/lit-html@0.7.1/lib/lit-extended.js';

// Views of the theme
const theme = {};

theme.styles = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.42/css/uikit.min.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"/>
  <style>
    .todo-input {
      border-top: none;
      border-left: none;
      border-right: none;
    }
    .todo-list {
      height: 300px;
      overflow: scroll;
    }
  </style>
`;

theme.todo = (todo, handleDelete) => `
  <div class="uk-flex">
    <button class="uk-button uk-button-link uk-margin-large-right" onclick="${() => handleDelete()}"><i class="fa fa-check" aria-hidden="true"></i></button>
    <p>${todo.title}</p>
  </div>
`;

theme.addTodoForm = addTodo => {
  const handleSubmit = event => {
    event.preventDefault();
    const titleInput = event.target.elements["title"];
    addTodo(titleInput.value);
    titleInput.value = "";
  };

  return `
    <form onsubmit="${event => handleSubmit(event)}" class="uk-inline uk-width-1-1">
      <input class="todo-input uk-input" name="title" placeholder="Todo" type="text"/>
      <input type="submit" hidden/>
    </form>
  `;
}

theme.todoList = (todoList, addTodo, deleteTodo) => {
  const handleDelete = index => {
    return () => deleteTodo(index);
  };

  return `
    <div class="uk-card uk-card-body uk-card-default">
      ${theme.addTodoForm(addTodo)}
      <ul class="todo-list uk-list uk-list-divider">
        ${todoList.map((todo, index) => `<li>${theme.todo(todo, handleDelete(index))}</li>`)}
      </ul>
    </div>
  `;
}

///////////////////////////////////////////////////////////////////////////
// A React Like Functional HTML Library that supports stateless and stateful
// components as well as component composition in less than 20 lines
//
let render = function (component, initState = {}, mountNode = 'body') {
  initState.render = function (stateRepresentation, options = {}) {
    const start = (options.focus) ? document.getElementById(options.focus).selectionStart : 0;
    (document.getElementById(mountNode) || {}).innerHTML = stateRepresentation
    if (options.focus) {
      let f = document.getElementById(options.focus)
      f.selectionStart = start
      f.focus()
    }
  }

  let stateRepresentation = component(initState)

  initState.render((typeof stateRepresentation === 'function') ? stateRepresentation() : stateRepresentation)
}

// Todo Application
export class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Initialize the model
    this.model = this.initModel();

    // Binding "this" context to the actions
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);

    // Render the view of the initial model
    this.state(this.model);
  }

  // Model
  initModel() {
    return { todoList: [] };
  }

  present(data) {
    const acceptors = {
      addTodo: todo => {
        this.model.todoList.unshift(todo);
      },

      deleteTodo: index => {
        this.model.todoList.splice(index, 1)
      }
    }

    const key = Object.keys(data)[0];
    const value = data[key];

    acceptors[key](value);

    this.state(this.model);
  }

  // Actions
  addTodo(title) {
    this.present({ addTodo: { title, isDone: false } });
    return false;
  }

  deleteTodo(index) {
    this.present({ deleteTodo: index });
    return false;
  }

  // State
  state(model) {
    this.stateRepresentation(model);
    this.nextAction(model);
  }

  stateRepresentation(model) {
    // const template = this.template(
    //   model.todoList,
    //   this.addTodo,
    //   this.deleteTodo
    // );

    //render(template, this.shadowRoot);

    const template = () => this.template(
      model.todoList,
      this.addTodo('hello'),
      this.deleteTodo
    );

    render(template, {}, 'body');
  }

  nextAction(model) {
    // nyi
  }

  // View
  template(todoList, addTodo, deleteTodo) {
    return `
      ${theme.styles}
      ${theme.todoList(todoList, addTodo, deleteTodo)}
    `;
  }

}

customElements.define('app-container', AppContainer);
