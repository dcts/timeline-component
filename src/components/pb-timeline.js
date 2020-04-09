import { LitElement, html, css } from 'lit-element';
import { LoadDataService } from "./load-data-service.js";
import { SearchResult } from './search-result.js';

import './pb-daterange-picker.js';
import './pb-bar-chart.js';

/**
* A timeline component to display aggregated data. For example:
* - number of letters send/received per year / month / day.
*
*
*/
export class PbTimeline extends LitElement {

  static get styles() {
    return css`
      .timeline-wrapper {
        border: 0.5px dashed rgba(0,0,0,0.1);
      }
    `;
  }

  static get properties() {
    return {
      /**
      *
      */
      // timelineData: {
      //   type: Object
      // },
    };
  }

  constructor() {
    super();
    document.addEventListener("DOMContentLoaded", () => {
      this.daterangeEl = this.shadowRoot.querySelector("pb-daterange-picker");
      this.barchartEl = this.shadowRoot.querySelector("pb-bar-chart");
    })

    let filepath = "http://localhost:8080/src/data/kba-predigten.json";
    let loadDataService = new LoadDataService(filepath); // dispatches 'pb-timeline-data-loaded' event

    document.addEventListener("pb-timeline-data-loaded", (e) => {
      console.log("HI FROM IMELINE COMPONENT, i received the event!");
      this.searchResult = new SearchResult(e.detail.data);
      this.barchartEl.loadData(this.searchResult.export());
    });
  }

  render() {
    return html`
    <div class="timeline-wrapper">
      <pb-daterange-picker></pb-daterange-picker>
      <pb-bar-chart
        width="960"
        height="150"
      ></pb-bar-chart>
    </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define('pb-timeline', PbTimeline);

