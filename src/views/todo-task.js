import { LitElement, html } from 'lit-element';
import { style } from './todo-task-styles.js';

class TodoTask extends LitElement {

  static get properties() {
    return {
      task: { type: String },
      completed: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.task = "asd";
    this.completed = false;
  }

  static get styles() {
    return [style];
  }

  render() {
    return html`
      <div class="task" @click="${this.toggleState}">
        <span class="dot ${this.completed ? 'active' : ''}"></span>
        <span class="task-description">${this.task}</span>
      </div>
    `;
  }

  toggleState() {
    this.completed = !this.completed;
  }
}

customElements.define('todo-task', TodoTask);
