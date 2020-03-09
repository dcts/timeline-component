import { LitElement, html, css} from 'lit-element';
import { TodoTask } from './todo-task.js';

const VisibilityFilters = {
  SHOW_ALL:      "All",
  SHOW_ACTIVE:   "Active",
  SHOW_COMPLEED: "Completed"
};

class TodoView extends LitElement {

  static get properties() {
    return {
      todos: { type: Array },
      filters: { type: String }
    }
  }

  constructor() {
    super();
    this.todos = [];
    this.filters = VisibilityFilters.SHOW_ALL;
  }

  static get styles() {
    return css`
      input,
      button {
        padding: 10px 20px;
        border-radius: 7px;
        font-size: 16px;
        border: none;
      }
      input:focus,
      button:focus {
        outline: none;
      }
      input {
        background: rgba(0,0,0,0.1);
      }
      button {
        background-color: white;
        background-color: #1f68f4;
        color: white;
        font-weight: bold;
        cursor: pointer;
      }
      p#taskCounter {
        margin-top: 5px;
        font-size: 12px;
        font-style: italic;
      }
    `;
  }

  render() {
    const todosReversed = this.todos.slice().reverse();
    const numberOfTasks = this.todos.length;
    return html`
      <input id="inputTask" @keyup="${this.submitByPressingEnter}" type="text" placeholder="new task"/>
      <button
        @click="${this.addTodo}"
        >ADD TASK
      </button>
      <p id="taskCounter">${numberOfTasks} ${numberOfTasks === 1 ? "task" : "tasks"} added</p>

      <div className="todos-list">
        ${todosReversed.map((todo, indx) => {
          return todo.completed ?
            html`<todo-task task="${todo.task}" completed><todo-task>` :
            html`<todo-task task="${todo.task}"><todo-task>`;
        })}
      </div>
    `;
  }

  submitByPressingEnter(event) {
    if (event.key === "Enter") {
      this.addTodo();
    }
  }

  addTodo() {
    const input = this.getInput();
    if (input) { // empty string returns false
      this.todos = [... this.todos, {
        task: input,
        completed: false
      }];
      this.resetInput();
    } else {
      alert("empty task cannot be added!");
    }
  }

  getInput() {
    return this.shadowRoot.getElementById("inputTask").value;
  }

  resetInput() {
    this.shadowRoot.getElementById("inputTask").value = "";
  }

}

customElements.define('todo-view', TodoView);
