import { LitElement, html } from 'lit-element';
import { style } from './todo-task-styles.js';

class TodoTask extends LitElement {

  static get properties() {
    return {
      task: { type: String },
      completed: { type: Boolean },
      deleteTask: {type: Function},
      toggleTask: {type: Function}
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
        <span @click="${this.toggleTask}" class="dot ${this.completed ? 'active' : ''}"></span>
        <span @click="${this.toggleTask}" class="task-description">${this.task}</span>
        <span @click="${this.deleteTask}" class="task-delete">🗑️</span>
      </div>
    `;
  }

  toggleState() {
    this.completed = !this.completed;
  }

}

customElements.define('todo-task', TodoTask);
