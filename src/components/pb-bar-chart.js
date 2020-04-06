import { LitElement, html, css } from 'lit-element'
import * as d3 from "d3";
import * as c3 from "c3";

/**
* A zoomable barchart component build with c3js
*
*
*/
export class PbBarChart extends LitElement {

  static get styles() {
    return css`
      // CSS goes here
    `;
  }

  static get properties() {
    return {
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      data: {
        type: Object
      },
    };
  }

  constructor() {
    super();
    this.height = 100;
    this.width = 960;
    document.addEventListener("DOMContentLoaded", () => {
      this.chartEl = this.shadowRoot.getElementById("chart");
      this.c3chart = this.initChart();
      this.data = {};
    })
    document.addEventListener("pb-timeline-data-loaded", (event) => {
      console.log("data loaded!!")
      console.log(event.detail.data);
    })
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.15/c3.min.css">
      <div id="chart"></div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  updateData(data) {
    this.data = data;
    this.c3chart.load({
      columns: [
        ['my-x-axis', data.categories].flat(),
        [data.title, data.values].flat(),
      ],
    });
  }

  loadData(data) {
    this.data = data;
    this.reset();
    this.updateData(data);
  }

  reset() {
    this.data = {};
    this.c3chart.unload();
  }

  initChart() {
    return c3.generate({
      bindto: this.chartEl,
      data: {
        x: 'my-x-axis', // has to macth the first element of the data.categories array
        columns: [],
        type: 'bar'
      },
      bar: {
        width: {
          ratio: 1 // this makes bar width 50% of length between ticks
        },
      },
      size: {
        height: this.height,
        width: this.width
      },
      axis: {
        x: {
          type: 'category',
        }
      },
      legend: {
        show: false,
      },
      zoom: {
        enabled: true,
        rescale: true
      },
      // subchart: {
      //   show: true
      // }
    });
  }
}

customElements.define('pb-bar-chart', PbBarChart);
