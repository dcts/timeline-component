// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';
import '@vaadin/vaadin-date-picker';

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
    this.dateFromEl = this.shadowRoot.querySelector("vaadin-date-picker#datepicker-from");
    this.dateToEl = this.shadowRoot.querySelector("vaadin-date-picker#datepicker-to");
    this.resetRangeButton = this.shadowRoot.querySelector("vaadin-button#reset-range");

    [this.dateFromEl, this.dateToEl].forEach(datePicker => {
      datePicker.addEventListener('change', () => {
        this.changeRange();
      });
    });

    this.resetRangeButton.addEventListener("click", () => {
      this.resetRange();
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

  changeRange() {
    // if valid range
    let startDateStr = this.dateFromEl.value;
    let endDateStr = this.dateToEl.value;
    if (startDateStr < endDateStr) {
      // trigger daterange change event
      this.dispatchDaterandChangedEvent(startDateStr, endDateStr)
    } else {
      console.log("invalid range change");
    }
  }

  resetRange() {
    this.dateFromEl.value = this.initialRange.startDateStr;
    this.dateToEl.value = this.initialRange.endDateStr;
    this.dispatchDaterandChangedEvent(this.initialRange.startDateStr, this.initialRange.endDateStr);
  }

  dispatchDaterandChangedEvent(startDateStr, endDateStr) {
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
        <vaadin-form-layout class="date-picker-group ">
          <vaadin-date-picker id="datepicker-from" clear-button-visible label="From Date" placeholder="MM/DD/YYYY" theme="custom-input-field-style" ></vaadin-date-picker>
          <vaadin-date-picker id="datepicker-to" clear-button-visible label="To Date" placeholder="MM/DD/YYYY"></vaadin-date-picker>
          <vaadin-button id="reset-range" theme="primary">Reset Range</vaadin-button>
        </vaadin-form-layout>
      </div>
    `;
  }
}
// Register the new element with the browser.
customElements.define('pb-daterange-picker', PbDaterangePicker);
