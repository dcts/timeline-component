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

  /**
   * Implement `render` to define a template for your element.
   *
   * You must provide an implementation of `render` for any element
   * that uses LitElement as a base class.
   */
  render(){
    /**
     * `render` must return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function:
     */
    return html`
      <div class="flex justify-center ">
        <vaadin-form-layout class="date-picker-group ">
          <vaadin-date-picker id="datepicker-from" clear-button-visible label="From Date" placeholder="MM/DD/YYYY" theme="custom-input-field-style" ></vaadin-date-picker>
          <vaadin-date-picker id="datepicker-to" clear-button-visible label="To Date" placeholder="MM/DD/YYYY"></vaadin-date-picker>
          <vaadin-button theme="primary">Reset Range</vaadin-button>
        </vaadin-form-layout>
      </div>
    `;
  }
}
// Register the new element with the browser.
customElements.define('pb-daterange-picker', PbDaterangePicker);
