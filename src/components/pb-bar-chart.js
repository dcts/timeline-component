import { LitElement, html, css } from 'lit-element'
import * as d3 from "d3";
import * as c3 from "c3";

/**
* A zoomable barchart component build with c3js
*
*
*/
export class PbBarChart extends LitElement {

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
    this.maxInterval = 300;

    window.hardcodedThis = this;
  }

  firstUpdated() {
    this.chartEl = this.shadowRoot.getElementById("chart");
    this.c3chart = this.initChart();

    // EXERNAL EVENTS
    document.addEventListener("pb-timeline-data-loaded", (event) => {
      console.log("THIS.SEARCHRESUT initialized");
      this.searchResult = event.detail.searchResult; // save SearchResult instance
      this.updateData(this.searchResult.export());
    });
    // this event is triggered by the componeent itself but can be also triggered by another component
    document.addEventListener("pb-timeline-daterange-changed", (event) => {
      const startDateStr = event.detail.startDateStr;
      const endDateStr = event.detail.endDateStr;
      this.updateData(this.searchResult.export(startDateStr, endDateStr));
    });
  }

  connectedCallback() {
    super.connectedCallback();
  }

  updateData(data) {
    if (data.categories.length > this.maxInterval) {
      throw new Error(`Interval size too big. Cannot display more than ${this.maxInterval} datapoint. Got: ${data.categories.length} datapoints`);
    }
    this.data = data;
    this.c3chart.load({
      columns: [
        ['my-x-axis', data.categories].flat(),
        [data.title, data.values].flat(),
      ],
    });
  }

  loadData(data) {
    if (data.categories.length > this.maxInterval) {
      throw new Error(`Interval size too big. Cannot display more than ${this.maxInterval} datapoint. Got: ${data.categories.length} datapoints`);
    }
    this.data = data;
    this.reset();
    this.updateData(data);
  }

  reset() {
    this.data = {};
    this.c3chart.unload();
  }

  getData() {
    return {
      categories: this.c3chart.categories(),
      values: this.c3chart.data()[0].values.map(it => it.value)
    }
  }

  // currentDiplaySize() {
  //   return this.getData().categories.length;
  // }

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
        rescale: true,
        onzoomend: this.onzoom
      },
      // subchart: {
      //   show: true
      // }
    });
  }

  onzoom(currenPixelRange) {
    const nbrOfPins = window.hardcodedThis.getData().categories.length;
    console.log(currenPixelRange);
    const percRange = {
      min: Math.max(0, Math.min(Number(currenPixelRange[0]) / nbrOfPins, 1)),
      max: Math.max(0, Math.min(Number(currenPixelRange[1]) / nbrOfPins, 1))
    }
    console.log(percRange);
    const minDate = window.hardcodedThis.searchResult.getMinDate();
    const maxDate = window.hardcodedThis.searchResult.getMaxDate();
    const computedMinDate = new Date(minDate.getTime() + ((maxDate - minDate) * percRange.min));
    const computedMaxDate = new Date(minDate.getTime() + ((maxDate - minDate) * percRange.max));
    window.minDate = minDate;
    window.maxDate = maxDate;
    window.min = computedMinDate;
    window.max = computedMaxDate;
    window.percRange = percRange;
    const computedStartDateStr = computedMinDate.toISOString().split("T")[0];
    const computedEndDateStr = computedMaxDate.toISOString().split("T")[0];
    console.log(`${computedStartDateStr} to ${computedEndDateStr}`);
    window.hardcodedThis.dispatchUpdateDaterangePickerEvent(computedStartDateStr, computedEndDateStr);
  }

  dispatchUpdateDaterangePickerEvent(startDateStr, endDateStr) {
    document.dispatchEvent(new CustomEvent('pb-update-daterange-picker', {
      bubbles: true,
      detail: {
        startDateStr: startDateStr,
        endDateStr: endDateStr,
      }
    }));
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.15/c3.min.css">
      <div id="chart"></div>
    `;
  }

  static get styles() {
    return css`
      // CSS goes here
    `;
  }
}

customElements.define('pb-bar-chart', PbBarChart);
