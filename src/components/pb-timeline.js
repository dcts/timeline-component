import { LitElement, html } from 'lit-element'
import { style } from './pb-timeline-styles.js'

/**
* A timeline component to display aggregated data. For example:
* - number of letters send/received per year / month / day.
*
*
*/
export class PbTimeline extends LitElement {

  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      /**
      * reference to actual CodeMirror object
      */
      timelineData: {
        type: Object
      },
    };
  }

  constructor() {
    super();
    this.startDate = "1900-01-01";
    this.timelineData = {};
  }

  render() {
    return html`
      <p>${JSON.stringify(this.timelineData)}</p>
    `;
  }

  loadData(inputData) {
    this.timelineData = inputData;
  }
}

customElements.define('pb-timeline', PbTimeline);

