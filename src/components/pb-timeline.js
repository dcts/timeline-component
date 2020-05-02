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
      p.year {
        pointer-events: none;
        position: absolute;
        top: -4px;
        font-size: 10px;
        transform: rotate(-90deg);
        z-index: 10;
      }
      .bin-container:nth-child(10n+1) p.year {
        /* font-weight: bold; */
        font-size: 12px;
      }
      .bin-container:nth-child(10n+1) {
        border-left: 1px solid rgba(0,0,0,0.2);
      }
      .bin-container:nth-child(2n) {
        background-color: rgba(0,0,0,0.1);
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
      .bin-container.selected {
        background-color: #e6eaff;
      }
      .invisible {
        opacity: 0;
      }

      .tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
      }

      .tooltip .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 100;
        top: 100%;
        left: 50%;
        margin-left: -60px;
      }

      .tooltip:hover .tooltiptext {
        visibility: visible;
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
    this.multiplier = 0.8;
    this.mousedown = false;
    this.resetSelection();
    this.setData({ categories: [], values: [], scope: "" });
  }

  setData(data) {
    this.data = data;
    this.maxValue = Math.max(...this.data.values);
    this.requestUpdate();
    this.updateComplete.then(() => {
      this.bins = this.shadowRoot.querySelectorAll(".bin-container");
      this.resetSelectedBins();
    });
  }

  firstUpdated() {
    this.bins = this.shadowRoot.querySelectorAll(".bin-container");
    document.addEventListener("pb-timeline-data-loaded", e => {
      this.searchResult = new SearchResultService(e.detail.jsonData);
      this.setData(this.searchResult.export());
    })
    document.addEventListener("mouseup", () => {
      this.mouseUp();
    })

    // this event is triggered by the componeent itself but can be also triggered by another component
    document.addEventListener("pb-timeline-daterange-changed", (event) => {
      // console.log("CATCHING DATE CHANGED EVENT");
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

  brushing(event) {
    if (this.mousedown) {
      this.selection.end = this.getMousePosition(event).x;
      this.applySelectionToBins();
    }
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
    for (let i=0; i<this.bins.length; i++) {
      if (this.bins[i].classList.contains("selected")) {
        return this.bins[i].dataset.datestr;
      }
    };
  }

  getSelectedEndDateStr() {
    let lastValue = "NA";
    this.bins.forEach(bin => {
      if (bin.classList.contains("selected")) {
        lastValue = bin.dataset.datestr;
      }
    })
    return lastValue;
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.data.values.map((value, indx) => {
          return html`
            <div class="bin-container"
              data-isodatestr="${new ParseDateService().run(this.data.categories[indx])}"
              data-datestr="${this.data.categories[indx]}"
              @mousemove="${this.brushing}"
              @mousedown="${this.mouseDown}">
              <div class="bin" style="height: ${(value / this.maxValue) * this.maxHeight * this.multiplier}px"></div>
              <p class="year ${indx % 10 === 0 ? "" : "invisible" }">${this.data.categories[indx]}</p>
            </div>
          `;
        })}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define('pb-timeline', PbTimeline);

// @mouseup="${this.mouseUp}"
