// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';
import '@vaadin/vaadin-date-picker';
import '@polymer/paper-input/paper-input.js';

// const ParseDateService = require('../services/parse-date-service.js');
import { ParseDateService } from "../services/parse-date-service.js";


// Extend the LitElement base class
class PbDaterangePicker extends LitElement {

  static get styles() {
    return css`
     :host([theme~="custom-input-field-style"]) [part="input-field"] {
        border: 1px solid black;
        background-color: white;
      }
      .date-picker-group > * {
        margin: 10px;
      }
      .flex {
        display: flex;
      }
      .justify-center {
        justify-content: center;
      }
    `;
  }

  // @TODO: first updated callback nutzen um shadow dom elemente zu bekommen
  // constructor / connectedCallback / firstUpdated /
  constructor() {
    super();
  }

  firstUpdated() {
    this.dateFromEl = this.shadowRoot.querySelector("paper-input#datepicker-from");
    this.dateToEl = this.shadowRoot.querySelector("paper-input#datepicker-to");

    // this.resetRangeButton = this.shadowRoot.querySelector("vaadin-button#reset-range");

    [this.dateFromEl, this.dateToEl].forEach(datePicker => {
      datePicker.addEventListener('change', () => {
        let startDateStr = this.dateFromEl.value;
        let endDateStr = this.dateToEl.value;
        if (this.rangeIsValid(startDateStr, endDateStr)) {
          this.dispatchDaterangeChangedEvent(startDateStr, endDateStr);
        }
      });
    });
    // this.resetRangeButton.addEventListener("click", () => {
    //   this.resetRange();
    // });

    // EXERNAL EVENTS
    // document.addEventListener("pb-timeline-data-loaded", (event) => {
    //   this.searchResult = event.detail.searchResult; // save SearchResult instance
    //   this.initializeRange(this.searchResult.getMinDateStr(), this.searchResult.getMaxDateStr());
    // });

    // this event is triggered by the componeent itself but can be also triggered by another component
    // document.addEventListener("pb-timeline-daterange-changed", (event) => {
    //   const startDateStr = event.detail.startDateStr;
    //   const endDateStr = event.detail.endDateStr;
    //   this.setRange(startDateStr, endDateStr);
    // });
    //

    document.addEventListener("pb-update-daterange-picker", (event) => {
      const startDateStr = event.detail.startDateStr;
      const endDateStr = event.detail.endDateStr;
      this.setRange(startDateStr, endDateStr);
    });

    this.shadowRoot.querySelectorAll("paper-input").forEach(paperInput => {
      paperInput.addEventListener("keyup", (e) => {
        const input = e.target.value;
        if (input === "") {
          e.target.label = e.target.dataset.labeltext;
        } else {
          e.target.label = `${e.target.dataset.labeltext}: ${new ParseDateService().run(input)}`;
        }
      });
    });
  }

  initializeRange(startDateStr, endDateStr) {
    this.initialRange = {
      startDateStr: startDateStr,
      endDateStr: endDateStr,
    }
    this.dateFromEl.value = startDateStr;
    this.dateToEl.value = endDateStr;
  }

  rangeIsValid(startDateStr, endDateStr) {
    return startDateStr < endDateStr;
  }

  resetRange() {
    this.dateFromEl.value = this.initialRange.startDateStr;
    this.dateToEl.value = this.initialRange.endDateStr;
    this.dispatchDaterangeChangedEvent(this.initialRange.startDateStr, this.initialRange.endDateStr);
  }

  setRange(startDateStr, endDateStr) {
    this.dateFromEl.value = startDateStr;
    this.dateToEl.value = endDateStr;
  }

  dispatchDaterangeChangedEvent(startDateStr, endDateStr) {
    document.dispatchEvent(new CustomEvent('pb-timeline-daterange-changed', {
      bubbles: true,
      detail: {
        startDateStr: startDateStr,
        endDateStr: endDateStr,
      }
    }));
  }

  render(){
    // @TOASK: why is onclick event or the buttton 'onclick="this.resetRange();"' not working?
    return html`
      <div class="flex justify-center ">
        <paper-input id="datepicker-from" data-labeltext="From Date" label="From Date"></paper-input>
        <paper-input id="datepicker-to" data-labeltext="To Date" label="To Date"></paper-input>

        <!-- <vaadin-form-layout class="date-picker-group ">
          <vaadin-date-picker id="datepicker-from" clear-button-visible label="From Date" placeholder="MM/DD/YYYY" theme="custom-input-field-style" ></vaadin-date-picker>
          <vaadin-date-picker id="datepicker-to" clear-button-visible label="To Date" placeholder="MM/DD/YYYY"></vaadin-date-picker>
          <vaadin-button id="reset-range" theme="primary">Reset Range</vaadin-button>
        </vaadin-form-layout> -->
      </div>
    `;
  }
}
// Register the new element with the browser.
customElements.define('pb-daterange-picker', PbDaterangePicker);
