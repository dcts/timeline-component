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
    // @TOASK1: the todo-task gets rendered twice!
    return html`
      <div class="form-container">
        <input id="inputTask" @keyup="${this.submitByPressingEnter}" type="text" placeholder="new task"/>
        <button
          @click="${this.addTodo}"
          >ADD TASK
        </button>
      </div>
      <p id="taskCounter">${this.todos.length} ${this.todos.length === 1 ? "task" : "tasks"} added</p>
      <!-- @TOASK4: best practice to bind functions to this and give the index as argument? Other (better solutions)? -->
      <div className="todos-list">
        ${this.todos.map((todo, indx) => {
          console.log("todo" + indx);
          console.log(todo);
          return html`
            <todo-task
              data-indx="${indx}"
              task="${todo.task}"
              .completed="${todo.completed}"
              .deleteTask=${this.deleteTask.bind(this, indx)}
              .toggleTask=${this.toggleTask.bind(this, indx)}
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
      this.todos = [ {
        task: input,
        completed: false
      }, ... this.todos]; // add new todo in the beginning
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
    console.log(`deleting task with index ${indexToDelete}`);
    this.todos = this.todos.filter((_, indx) => indx !== indexToDelete);
  }

  toggleTask(indexToToggle) {
    // @TOASK5: we are responsible to keep stuff in sync, right?
    // change child element (toggle state)
    const todoTasks = Array.prototype.slice.call(this.shadowRoot.querySelectorAll("todo-task"));
    todoTasks.find(task => Number(task.dataset.indx) === indexToToggle).toggleState();
    // adapt this.todos
    this.todos[indexToToggle].completed = !this.todos[indexToToggle].completed;
    this.requestUpdate(); // @TOASK3: WHY DO I NEED THIS
  }

}

customElements.define('todo-view', TodoView);
