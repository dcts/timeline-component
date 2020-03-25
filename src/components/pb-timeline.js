import { LitElement, html } from 'lit-element'
import { style } from './pb-timeline-styles.js'
import * as d3 from "d3";


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
      // timelineData: {
      //   type: Object
      // },
    };
  }

  constructor() {
    super();
    this.startDate = "1900-01-01";
    this.timelineData = {};
  }

  render() {
    return html`
      <div class="wrapper">
        <div id="mainchart"></div>
        <div id="minichart"></div>
      </div>
    `;
  }

  // connectedCallback() {
  //   super.connectedCallback();
  //   // this.loadData([30, 86, 168, 281, 303, 365]);
  // }

  transformData(inputData){

  }



  loadData(data) {
    console.log("loading data:");
    console.log(data);
    window.d3 = d3;
    console.log(d3);
    d3.select(this.shadowRoot.querySelector("#mainchart"))
      .selectAll("div")
      .data(data)
        .enter()
        .append("div")
        .style("width", function(d) { return d + "px"; })
        .text(function(d) { return d; });
  }
}

customElements.define('pb-timeline', PbTimeline);

