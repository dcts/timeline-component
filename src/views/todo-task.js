import { LitElement, html, css} from 'lit-element';

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
    return css`
      .dot {
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 50%;
        display: inline-block;
        margin-right: 12px;
      }
      .dot.active {
        background-color: rgba(31,104,244,0.6) !important;
      }
      div.task {
        margin-bottom: 7px;
        display: flex;
        cursor: pointer;
      }
      div.task:hover .dot {
        background-color: #ddd;
      }
    `;
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
