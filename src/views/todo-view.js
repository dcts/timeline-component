import { LitElement, html } from 'lit-element';
import { TodoTask } from './todo-task.js';
import { style } from './todo-view-styles.js';

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
    return [style];
  }
  //
  render() {
    return html`
      <div class="form-container">
        <input id="inputTask" @keyup="${this.submitByPressingEnter}" type="text" placeholder="new task"/>
        <button
          @click="${this.addTodo}"
          >ADD TASK
        </button>
      </div>
      <p id="taskCounter">${this.todos.length} ${this.todos.length === 1 ? "task" : "tasks"} added</p>

      <div className="todos-list">
        ${this.todos.slice().reverse().map((todo, indx) => {
          return html`
            <todo-task
              task="${todo.task}"
              .completed="${todo.completed}"
              .deleteTask=${this.deleteTask.bind(this, (this.todos.length-1)-indx)}
            ><todo-task>`;
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

  deleteTask(indexToDelete) {
    this.todos = this.todos.filter((_, indx) => indx !== indexToDelete);
  }

  // toggleTask() {
  //   alert("TASK TOGGLED");
  // }

}

customElements.define('todo-view', TodoView);
