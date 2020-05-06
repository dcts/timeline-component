import { LitElement, html, css } from 'lit-element';
import { SearchResultService } from "../services/search-result-service.js";
import { ParseDateService } from "../services/parse-date-service.js";

/**
* A timeline component that displays a barchart for search results
* and has 6 different scaling settings (scopes)
* - Decades (10Y)
* - 5 Years (5Y)
* - Years (Y)
* - Months (M)
* - Weeks (W)
* - Days (D)
*
* Features
* - brushing / selection of subdata
* - reset selection
* - tooltip on hover and over selection
*/
export class PbTimeline extends LitElement {

  static get styles() {
    return css`
      .hidden {
        visibility: hidden;
      }
      .draggable {
        cursor: grab;
        user-select: none;
        padding-right: 30px !important;
      }
      .wrapper {
        margin: 0 auto;
        width: 800px;
        height: 80px;
        display: flex;
        justify-content: center;
        position: relative;
      }
      .bin-container {
        cursor: crosshair;
        min-width: var(--pb-timeline-max-width, 14px);
        max-width: var(--pb-timeline-max-width, 20px);
        flex-grow: 1;
        flex-basis: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: relative;
      }
      .bin-container.border-left {
        border-left: 1px solid rgba(0,0,0,0.4);
      }
      .bin-container:hover .bin {
        background-color: #3f52b5;
      }
      .bin-container.selected > .bin {
        background-color: #3f52b5;
      }
      .bin-container.selected p {
        font-weight: bold;
      }
      .bin-container.white {
        background-color: white;
      }
      .bin-container.grey {
        background-color: #f1f1f1;
      }
      .bin-container.selected {
        background-color: #e6eaff !important;
      }
      .bin {
        width: 80%;
        background-color: #ccc;
        border-radius: 2px;
        user-select: none;
      }
      p.bin-title {
        pointer-events: none;
        position: absolute;
        top: 5px;
        font-size: 10px;
        z-index: 10;
        margin: 0;
        font-size: 12px;
        user-select: none;
        white-space: nowrap;
      }
      p.bin-title.months {
        top: -1px;
      }
      p.bin-title.weeks {
        top: 3px;
      }
      p.bin-title.days {
        top: -1px;
      }
      p.bin-title.rotated {
        transform: rotate(-90deg);
      }
      .bins-title {
        cursor: auto;
        font-weight: normal !important;
        margin: 0;
        white-space: nowrap;
        z-index: 200;
        position: absolute;
        left: 0;
        top: -20px;
        font-size: 12px;
        background-color: #535353;
        color: #ffffff;
        padding: 2px 4px;
        border-radius: 5px;
        height: 12px;
        line-height: 12px;
        user-select: none;
      }
      /* TOOLTIP */
      #tooltip {
        display: inline-block;
        white-space: nowrap;
        height: 15px;
        position: absolute;
        font-size: 11px;
        line-height: 15px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 10px;
        top: 85px;
        left: 0;
      }
      #tooltip-close {
        position: absolute;
        top: -13px;
        right: -10px;
      }
      #tooltip::after { /* small triangle that points to top */
        content: "";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent black transparent;
      }
      /* pure css close button for tooltip */
      .close{
        position: relative;
        display: inline-block;
        width: 50px;
        height: 50px;
        overflow: hidden;
        transform: scale(0.25);
      }
      .close.rounded.black {
        cursor: pointer;
      }
      .close::before, .close::after {
        content: '';
        position: absolute;
        height: 2px;
        width: 100%;
        top: 50%;
        left: 0;
        margin-top: -1px;
        background: #fff;
      }
      .close::before {
        transform: rotate(45deg);
      }
      .close::after {
        transform: rotate(-45deg);
      }
      .close.thick::before, .close.thick::after {
        height: 4px;
        margin-top: -2px;
      }
      .close.black::before, .close.black::after {
        height: 8px;
        margin-top: -4px;
      }
      .close.rounded::before, .close.rounded::after {
        border-radius: 5px;
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
    this.maxHeight = 80; // in pixels, has to be identical to the max-height specified in CSS
    this.multiplier = 0.75; // max percentage of bin compared to the bin-conainer. Set 1 for full height (not recommended)
    this.mousedown = false;
    this.resetSelection();
  }

  setData(dataObj) {
    this.dataObj = dataObj;
    this.maxValue = Math.max(...this.dataObj.data.map(binObj => binObj.value));
    this.requestUpdate();
    this.updateComplete.then(() => {
      this.bins = this.shadowRoot.querySelectorAll(".bin-container");
      this.resetSelectedBins();
      this.resetSelection();
      this.resetTooltip();
    });
  }

  resetTooltip() {
    this.hideTooltip();
    this.tooltip.querySelector("#tooltip-text").innerHTML = "";
  }

  firstUpdated() {
    this.bins = this.shadowRoot.querySelectorAll(".bin-container");
    this.tooltip = this.shadowRoot.getElementById("tooltip");
    document.addEventListener("pb-timeline-data-loaded", e => {
      this.searchResult = new SearchResultService(e.detail.jsonData);
      this.setData(this.searchResult.export());
    })
    document.addEventListener("mouseup", () => {
      this.mouseUp();
    })

    // this event is triggered by the componeent itself but can be also triggered by another component
    document.addEventListener("pb-timeline-daterange-changed", (event) => {
      const startDateStr = event.detail.startDateStr;
      const endDateStr = event.detail.endDateStr;
      this.bins.forEach(bin => {
        if (bin.dataset.isodatestr >= startDateStr && bin.dataset.isodatestr <= endDateStr) {
          bin.classList.add("selected");
        } else {
          bin.classList.remove("selected");
        }
      })
      this.showtooltipSelection();
    });

    // this event is triggered by the componeent itself but can be also triggered by another component
    document.addEventListener("pb-timeline-reset-selection", () => {
      this.resetSelectedBins();
      this.resetSelection();
      this.hideTooltip();
    });
  }

  getMousePosition(mouseEvent) {
    let rect = this.shadowRoot.querySelector(".wrapper").getBoundingClientRect();
    let x = mouseEvent.clientX - rect.left + 1; //x position within the element.
    let y = mouseEvent.clientY - rect.top + 1;  //y position within the element.
    return {x: x, y: y};
  }

  mouseDown(event) {
    this.resetSelectedBins();
    this.resetSelection();
    this.mousedown = true;
    this.selection.start = this.getMousePosition(event).x;
    this.applySelectionToBins();
  }

  mouseUp() {
    if (this.mousedown) {
      this.mousedown = false;
      const start = this.getSelectedStartDateStr();
      const end = this.getSelectedEndDateStr();
      if (start) {
        const startDateStr = new ParseDateService().run(start);
        const endDateStr = new ParseDateService().run(end);
        this.dispatchTimelineDaterangeChangedEvent(startDateStr, endDateStr);
      }
    }
  }

  dispatchTimelineDaterangeChangedEvent(startDateStr, endDateStr) {
    document.dispatchEvent(new CustomEvent('pb-timeline-daterange-changed', {
      bubbles: true,
      detail: {
        startDateStr: startDateStr,
        endDateStr: endDateStr,
      }
    }));
  }

  dispatchPbTimelineResetSelectionEvent() {
    document.dispatchEvent(new CustomEvent('pb-timeline-reset-selection', {
      bubbles: true,
      detail: {}
    }));
  }

  getElementInterval(nodeElement) {
    let rect = this.shadowRoot.querySelector(".wrapper").getBoundingClientRect();
    let bin = nodeElement;
    let interval = [bin.getBoundingClientRect().x, bin.getBoundingClientRect().x + bin.getBoundingClientRect().width]
    let x1 = interval[0] - rect.left + 1; //x position within the element.
    let x2 = interval[1] - rect.left + 1; //x position within the element.
    return [x1,x2];
  }

  getSelectedBins() {
    return Array.prototype.slice.call(this.bins).filter(binContainer =>  {
      return binContainer.classList.contains("selected");
    });
  }

  mouseMove(event) {
    if (this.mousedown) {
      this.brushing(event);
      this.showtooltipSelection();
      this.tooltip.classList.add("draggable");
      this.tooltip.querySelector("#tooltip-close").classList.remove("hidden");
    } else if (this.selection.start === undefined) { // no selection currently made
      this.showtooltip(event);
    }
  }

  brushing(event) {
    this.selection.end = this.getMousePosition(event).x;
    this.applySelectionToBins();
  }

  showtooltip(event) {
    const interval = this.getElementInterval(event.currentTarget);
    const offset = Math.round((((interval[0] + interval[1]) / 2) - this.tooltip.offsetWidth / 2));
    this.tooltip.style.left = offset + "px";
    const datestr = event.currentTarget.dataset.tooltip;
    const value = this.numberWithCommas(event.currentTarget.dataset.value);
    this.tooltip.querySelector("#tooltip-text").innerHTML = `<strong>${datestr}</strong>: ${value}`;
  }

  showtooltipSelection() {
    const selectedBins = this.getSelectedBins();
    const intervalStart = this.getElementInterval(selectedBins[0])[0]; // get first selected element left boundary
    const intervalEnd = this.getElementInterval(selectedBins[selectedBins.length-1])[1]; // get last selected element right boundary
    const interval = [intervalStart, intervalEnd];
    const offset = Math.round((((interval[0] + interval[1]) / 2) - this.tooltip.offsetWidth / 2));
    this.tooltip.style.left = offset + "px";
    const label = `${selectedBins[0].dataset.selectionstart} - ${selectedBins[selectedBins.length-1].dataset.selectionend}`;
    const value = selectedBins.map(bin => Number(bin.dataset.value)).reduce((a, b) => a + b);
    const valueFormatted = this.numberWithCommas(value);
    this.tooltip.querySelector("#tooltip-text").innerHTML = `<strong>${label}</strong>: ${valueFormatted}`;
  }

  applySelectionToBins() {
    const selectionInterval = this.getSelectionInterval();
    this.bins.forEach(bin => {
      const elInterval = this.getElementInterval(bin);
      // if (this.intervalsOverlapping(elInterval, selectionInterval)) {
      if (this.areOverlapping(elInterval, selectionInterval)) {
        bin.classList.add("selected");
      } else {
        bin.classList.remove("selected");
      }
    })
  }

  areOverlapping(A, B) {
    return B[0] < A[0] ? B[1] > A[0] : B[0] < A[1];
  }

  getSelectionInterval() {
    return [this.selection.start, this.selection.end].sort((a,b) => a - b);
  }

  resetSelectedBins() {
    this.bins.forEach(bin => {
      bin.classList.remove("selected");
    });
  }

  resetSelection() {
    this.selection = {
      start: undefined,
      end: undefined
    }
  }

  getSelectedStartDateStr() {
    const selectionStartStr = this.shadowRoot.querySelectorAll(".bin-container.selected")[0].dataset.selectionstart;
    return new ParseDateService().run(selectionStartStr);
  }

  getSelectedEndDateStr() {
    const selectedBins = this.shadowRoot.querySelectorAll(".bin-container.selected");
    const selectionEndStr = selectedBins[selectedBins.length-1].dataset.selectionend;
    return new ParseDateService().run(selectionEndStr);
  }

  hideTooltip() {
    if (this.selection.start === undefined) {
      this.tooltip.classList.add("hidden");
      this.tooltip.classList.remove("draggable");
      this.tooltip.querySelector("#tooltip-close").classList.add("hidden");
    }
  }

  displayTooltip() {
    this.tooltip.classList.remove("hidden");
  }

  mouseenter() {
    if (this.dataObj) { // if data is loaded
      this.displayTooltip();
    }
  }

  numberWithCommas(input) {
    return input.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, "'");
  }

  render() {
    return html`
      <div class="wrapper"
        @mouseenter="${this.mouseenter}"
        @mouseleave="${this.hideTooltip}">
        ${this.dataObj ? this.renderBins() : ""}
        ${this.renderTooltip()}
      </div>
    `;
  }

  renderTooltip() {
    return html`
      <div id="tooltip" class="hidden">
        <span id="tooltip-text"></span>
        <div
          id="tooltip-close"
          class="hidden"
          @click="${this.dispatchPbTimelineResetSelectionEvent}"
          ><span class="close rounded black"></span>
        </div>
      </div>
    `;
  }

  renderBins() {
    return html`
      ${this.dataObj.data.map((binObj, indx) => {
        return html`
          <div class="bin-container ${binObj.seperator ? "border-left" : ""}
            ${indx % 2 === 0 ? "grey" : "white"}"
            data-tooltip="${binObj.tooltip}"
            data-selectionstart="${binObj.selectionStart}"
            data-selectionend="${binObj.selectionEnd}"
            data-isodatestr="${binObj.dateStr}"
            data-datestr="${binObj.dateStr}"
            data-value="${binObj.value}"
            @mousemove="${this.mouseMove}"
            @mousedown="${this.mouseDown}">
            <div class="bin" style="height: ${(binObj.value / this.maxValue) * this.maxHeight * this.multiplier}px"></div>
            <p class="bin-title
              ${this.dataObj.binTitleRotated ? "rotated" : ""}
              ${this.dataObj.scope === "M" ? "months" : this.dataObj.scope === "W" ? "weeks" : this.dataObj.scope === "D" ? "days" : ""}"
              >${binObj.binTitle ? binObj.binTitle : ""}
            </p>
            ${binObj.title ? html`
              <p class="bins-title">${binObj.title}</p>
            ` : ""}
          </div>
        `;
      })}
    `
  }
}

customElements.define('pb-timeline', PbTimeline);
