import { LitElement, html } from 'lit-element';
import { style } from './todo-task-styles.js';

class TodoTask extends LitElement {

  static get properties() {
    return {
      task: { type: String },
      completed: { type: Boolean },
      deleteTask: {type: Function}
    }
  }

  // no need for constructor?
  constructor() {
    super();
    this.task = "default task";
    this.completed = false;
  }

  static get styles() {
    return [style];
  }

  render() {
    return html`
      <div class="task">
        <span @click="${this.toggleState}" class="dot ${this.completed ? 'active' : ''}"></span>
        <span @click="${this.toggleState}" class="task-description">${this.task}</span>
        <span @click="${this.deleteTask}" class="task-delete">🗑️</span>
      </div>
    `;
  }

  toggleState() {
    this.completed = !this.completed;
  }

  // delete function already passed as attribute
  // deleteTask() {
  //   this.deleteTask();
  // }

}

customElements.define('todo-task', TodoTask);
