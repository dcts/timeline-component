import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import { ParseDateService } from "../services/parse-date-service.js";
import { SearchResultService } from "../services/search-result-service.js";

// Extend the LitElement base class
class PbDaterangePicker extends LitElement {

  static get styles() {
    return css`
      .date-picker-group > * {
        margin: 10px;
      }
      .paper-elements-group {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      paper-button#apply-range {
        max-height: 48px;
        font-size: 14px;
        padding: 8px 16px !important;
      }
      #dateinput-from, #dateinput-to {
        margin-right: 20px;
      }
      paper-button.custom:hover {
        background-color: var(--paper-indigo-500);
      }
      paper-button.indigo {
        background-color: var(--paper-indigo-500);
        color: white;
        --paper-button-raised-keyboard-focus: {
          background-color: var(--paper-pink-a200) !important;
          color: white !important;
        };
      }

      paper-input.red {
        --paper-input-container-focus-color: red;
      }
    `;
  }

  static get properties() {
    return {
      buttonDisabled: {
        type: Boolean
      },
      inputsDisabled: {
        type: Boolean
      },
      range: {
        type: Object
      },
      selection: {
        type: Object
      }
    }
  }

  // @TODO: first updated callback nutzen um shadow dom elemente zu bekommen
  // constructor / connectedCallback / firstUpdated /
  constructor() {
    super();
    this.buttonDisabled = true;
    this.inputsDisabled = true;
    this.range     = { start: null, end: null };
    this.selection = { start: null, end: null };
  }

  firstUpdated() {
    this.dateInputFrom = this.shadowRoot.querySelector("paper-input#dateinput-from");
    this.dateInputTo = this.shadowRoot.querySelector("paper-input#dateinput-to");
    this.resetRangeButton = this.shadowRoot.querySelector("paper-button#reset-range");

    // EVENTS
    document.addEventListener("pb-timeline-data-loaded", (event) => {
      // save search result
      this.searchResult = new SearchResultService(event.detail.jsonData); // save SearchResult instance
      // reset selection + initialize range
      this.setRange(this.searchResult.getMinDateStr(), this.searchResult.getMaxDateStr());
      // enable inputs
      this.inputsDisabled = false;
    });

    // this event is triggered by the component itself but can be also triggered by another component
    document.addEventListener("pb-timeline-daterange-changed", (event) => {
      const startDateStr = event.detail.startDateStr;
      const endDateStr = event.detail.endDateStr;
      this.setSelection(startDateStr, endDateStr);
    });

    // this event is triggered by the component itself but can be also triggered by another component
    document.addEventListener("pb-timeline-reset-selection", () => {
      this.resetInputErrors();
      this.selection = { start: null, end: null };
      this.setInputs(this.range.start, this.range.end);
      this.buttonDisabled = true;
    });
  }

  stats() {
    console.log("--- DATERANGE PICKER STATES ---");
    console.log(`range    : ${this.range.start} - ${this.range.end}`);
    console.log(`selection: ${this.selection.start} - ${this.selection.end}`);
    console.log(`inputs   : ${this.inputsDisabled ? "disabled" : "on"}`);
    console.log(`button   : ${this.buttonDisabled ? "disabled" : "on"}`);
  }

  // update labels while typing (selection not applied yet)
  keyup(event) {
    if (event.key === "Enter") {
      console.log("key enter pressed");
      if (event.currentTarget === this.dateInputFrom) {
        this.dateInputTo.focus();
      }
      this.validateSelectionRange(event);


      // this.dateInputTo.focus(); // this triggeres the "unfocus" event in both cases (which trigger the validateDate function):
      // this.validateDate();
      // FROM input -> calling focus() on the TO input unfocuses the FROM input (which is the current target).
      // TO input -> calling focus() on the TO input (which is the current target and focused) unfocuses it.
    } else { // apply the date parsing algorithm and display prediction on paperinput label
      this.liveUpdateLabel(event)
    }
  }

  fullIntervalSelected() {
    return (this.range.start === this.selection.start && this.range.end === this.selection.end)
  }

  liveUpdateLabel(keyboardEvent) {
    const paperInput = keyboardEvent.currentTarget;
    const input = keyboardEvent.target.value;
    if (input === "") {
      paperInput.label = paperInput.dataset.labeltext;
    } else {
      paperInput.label = `${paperInput.dataset.labeltext}: ${new ParseDateService().run(input)}`;
    }
  }

  // is called on focuseout event of both inputs
  // if daterange is valid -> set selection
  // else => notify user and set selection to range (= allowed boundaries)
  validateSelectionRange(event) {


    this.resetInputErrors();
    let startDateStr = new ParseDateService().run(this.dateInputFrom.value);
    let endDateStr = new ParseDateService().run(this.dateInputTo.value);
    // check if both dates are valid dateStr's
    if (!startDateStr.match(/\d{4}-\d{2}-\d{2}/) || !endDateStr.match(/\d{4}-\d{2}-\d{2}/)) {
      // date entered is not valid -> set reset button true
      this.buttonDisabled = false;
      return;
    }
    // check if within range
    if (startDateStr < this.range.start) {
      console.log("startdate was out of range, automatically changed to fit boundaries");
      startDateStr = this.range.start;
      this.setInputFrom(startDateStr);
    }
    if (endDateStr > this.range.end || endDateStr < this.range.start) {
      console.log("enddate was out of range, automatically changed to fit boundaries");
      endDateStr = this.range.end;
      this.setInputTo(endDateStr);
    }
    // check if valid
    if (startDateStr < endDateStr) {
      this.setInputs(startDateStr, endDateStr);
      this.selection = { start: startDateStr, end: endDateStr };
      this.dispatchDaterangeChangedEvent(startDateStr, endDateStr);
    } else {
      this.dateInputFrom.invalid = true;
      this.dateInputTo.invalid = true;
      if (event.currentTarget === this.dateInputFrom) {
        this.dateInputFrom.errorMessage = "must start before 'To Date'";
      } else {
        this.dateInputTo.errorMessage = "must end after 'From Date'";
      }
      this.buttonDisabled = false;
    }
  }

  // resets selection when clicked on reset selection button
  resetSelection() {
    this.dispatchResetSelectionEvent();
  }

  setRange(startDateStr, endDateStr) {
    this.range     = { start: startDateStr, end: endDateStr }; // set range (interval)
    this.selection = { start: null, end: null }; // reset current selection
    this.buttonDisabled = true;                  // if no selection -> resetbutton disabled
    this.setInputs(startDateStr, endDateStr); // set input fields
  }

  setSelection(startDateStr, endDateStr) {
    this.selection = { start: startDateStr, end: endDateStr };
    this.setInputs(startDateStr, endDateStr);
    this.buttonDisabled = false; // enable reset selection button
  }

  setInputs(startDateStr, endDateStr) {
    this.setInputFrom(startDateStr);
    this.setInputTo(endDateStr);
    this.inputsDisabled = false;
  }

  resetInputErrors() {
    this.dateInputFrom.errorMessage = "";
    this.dateInputTo.errorMessage = "";
    this.dateInputFrom.invalid = false;
    this.dateInputTo.invalid = false;
  }

  setInputFrom(dateStr) {
    this.dateInputFrom.label = `From Date: ${dateStr}`;
    this.dateInputFrom.value = dateStr;
  }

  setInputTo(dateStr) {
    this.dateInputTo.label = `To Date: ${dateStr}`;
    this.dateInputTo.value = dateStr;
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

  dispatchResetSelectionEvent() {
    document.dispatchEvent(new CustomEvent('pb-timeline-reset-selection', {
      bubbles: true,
    }));
  }

  render(){
    return html`
      <div class="paper-elements-group">
        <paper-input
          id="dateinput-from"
          data-labeltext="From Date"
          label="From Date"
          @keyup="${this.keyup}"
          @focusout="${this.validateSelectionRange}"
          ?disabled="${this.inputsDisabled}"
          ></paper-input>
          <paper-input
          id="dateinput-to"
          data-labeltext="To Date"
          label="To Date"
          @keyup="${this.keyup}"
          @focusout="${this.validateSelectionRange}"
          ?disabled="${this.inputsDisabled}"
        ></paper-input>
        <paper-button
          id="reset-range"
          class="${this.buttonDisabled ? "" : "custom indigo"}"
          raised
          @click="${this.resetSelection}"
          ?disabled="${this.buttonDisabled}">reset
        </paper-button>
      </div>
    `;
  }
}
// Register the new element with the browser.
customElements.define('pb-daterange-picker', PbDaterangePicker);
