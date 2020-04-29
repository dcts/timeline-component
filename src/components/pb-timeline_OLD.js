import { LitElement, html, css } from 'lit-element';
import { LoadDataService } from "../services/load-data-service.js";
import { SearchResultService } from '../services/search-result-service.js';

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

    // document.addEventListener("pb-timeline-data-loaded", (e) => {
    //   this.searchResult = new SearchResultService(e.detail.data);
    //   this.barchartEl.updateData(this.searchResult.export());
    //   this.daterangeEl.initializeRange(this.searchResult.getMinDateStr(), this.searchResult.getMaxDateStr());
    // });

    // document.addEventListener("pb-timeline-daterange-changed", (e) => {
    //   console.log("FOUND EVENT")
    //   this.barchartEl.updateData(this.searchResult.export(e.detail.startDateStr, e.detail.endDateStr));
    // });
  }

  firstUpdated() {
    this.daterangeEl = this.shadowRoot.querySelector("pb-daterange-picker");
    this.barchartEl = this.shadowRoot.querySelector("pb-bar-chart");
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

