import { LitElement, html, css } from 'lit-element';
import { SearchResultService } from "../services/search-result-service.js";
import { ParseDateService } from "../services/parse-date-service.js";

/**
* A timeline component to display aggregated data. For example:
* - number of letters send/received per year / month / day.
*
*
*/
export class PbTimeline extends LitElement {

  static get styles() {
    return css`
      .wrapper {
        margin: 0 auto;
        width: 800px;
        height: 80px;
        display: flex;
        justify-content: center;
        cursor: crosshair;
        position: relative;
      }
      .bin-container {
        min-width: var(--pb-timeline-max-width, 14px);
        max-width: var(--pb-timeline-max-width, 20px);
        flex-grow: 1;
        flex-basis: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: relative;
      }
      .bin {
        width: 80%;
        background-color: #ccc;
        border-radius: 2px;
        user-select: none;
      }
      p, .bin {
        user-select: none;
      }
      p.bin-title {
        pointer-events: none;
        position: absolute;
        top: 5px;
        font-size: 10px;
        z-index: 10;
        margin: 0;
        /* font-weight: bold; */
        font-size: 12px;
        user-select: none;
      }
      p.bin-title.months {
        top: -1px;
      }
      p.bin-title.weeks {
        top: -1px;
      }
      p.bin-title.days {
        top: -1px;
      }
      p.rotated {
        transform: rotate(-90deg);
      }
      .bin-container.border-left {
        border-left: 1px solid rgba(0,0,0,0.4);
      }
      .bin-container:nth-child(2n) {
        background-color: rgba(0,0,0,0.1);
        background-color: #f8f8f8;
        background-color: #f1f1f1;
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
      .invisible {
        opacity: 0;
      }

      .tooltiptext.hidden {
        visibility: hidden;
      }
      .tooltiptext {
        /* min-width: 10px; */
        display: inline-block;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
        position: absolute;
        font-size: 11px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 10px;
        top: 85px;
        left: 0;
      }

      .tooltiptext::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent black transparent;
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
    this.maxHeight = 80;
    this.multiplier = 0.75;
    this.mousedown = false;
    this.resetSelection();
    // this.setData({ data: [], scope: "" });
  }

  setData(dataObj) {
    this.dataObj = dataObj;
    this.maxValue = Math.max(...this.dataObj.data.map(binObj => binObj.value));
    this.requestUpdate();
    this.updateComplete.then(() => {
      this.bins = this.shadowRoot.querySelectorAll(".bin-container");
      this.resetSelectedBins();
    });
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
    });

    // this event is triggered by the componeent itself but can be also triggered by another component
    document.addEventListener("pb-timeline-reset-selection", () => {
      this.resetSelectedBins();
      this.resetSelection();
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

  getElementInterval(nodeElement) {
    let rect = this.shadowRoot.querySelector(".wrapper").getBoundingClientRect();
    let bin = nodeElement;
    let interval = [bin.getBoundingClientRect().x, bin.getBoundingClientRect().x + bin.getBoundingClientRect().width]
    let x1 = interval[0] - rect.left + 1; //x position within the element.
    let x2 = interval[1] - rect.left + 1; //x position within the element.
    return [x1,x2];
  }

  mouseMove(event) {
    if (this.mousedown) {
      this.brushing(event);
    }
    this.showtooltip(event);
  }

  brushing(event) {
    this.selection.end = this.getMousePosition(event).x;
    this.applySelectionToBins();
  }

  showtooltip(event) {
    // this.tooltip.style.left = (this.getMousePosition(event).x - this.tooltip.offsetWidth / 2) + "px";
    const interval = this.getElementInterval(event.currentTarget);
    const offset = Math.round((((interval[0] + interval[1]) / 2) - this.tooltip.offsetWidth / 2));
    this.tooltip.style.left = offset + "px";
    const datestr = event.currentTarget.dataset.tooltip;
    const value = event.currentTarget.dataset.value;
    this.tooltip.innerHTML = `<strong>${datestr}</strong>: ${value}`;
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
    return this.shadowRoot.querySelectorAll(".bin-container.selected")[0].dataset.datestr;
  }

  getSelectedEndDateStr() {
    const selectedBins = this.shadowRoot.querySelectorAll(".bin-container.selected");
    return selectedBins[selectedBins.length-1].dataset.datestr;
  }

  hideTooltip() {
    this.tooltip.classList.add("hidden");
  }

  displayTooltip() {
    this.tooltip.classList.remove("hidden");
  }

  render() {
    return html`
      <div class="wrapper"
        @mouseenter="${this.displayTooltip}"
        @mouseleave="${this.hideTooltip}">
        ${this.dataObj ? this.renderBins() : ""}
        <div id="tooltip" class="tooltiptext hidden"><strong>1928</strong>: 128</div>
      </div>
    `;
  }

  renderBins() {
    return html`
      ${this.dataObj.data.map((binObj, indx) => {
        return html`
          <div class="bin-container ${binObj.seperator ? "border-left" : ""}
            ${this.dataObj.scope === "D" && binObj.weekend ? "grey" : this.dataObj.scope === "D" ? "white" : indx % 2 === 0 ? "grey" : "white"}"
            data-tooltip="${binObj.tooltip}"
            data-selectionStart="${binObj.selectionStart}"
            data-selectionEnd="${binObj.selectionEnd}"
            data-isodatestr="${binObj.dateStr}"
            data-datestr="${binObj.dateStr}"
            data-value="${binObj.value}"
            @mousemove="${this.mouseMove}"
            @mousedown="${this.mouseDown}">
            <div class="bin" style="height: ${(binObj.value / this.maxValue) * this.maxHeight * this.multiplier}px"></div>
            <p class="bin-title
              ${this.dataObj.binTitleRotated ? "rotated" : ""}
              ${this.dataObj.scope === "M" ? "months" : this.dataObj.scope === "W" ? "weeks:" : this.dataObj.scope === "D" ? "days:" : ""}"
              >${binObj.binTitle || ""}
            </p>
          </div>
        `;
      })}
    `
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define('pb-timeline', PbTimeline);

// @mouseup="${this.mouseUp}"
