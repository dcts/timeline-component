import { LitElement, html, css } from 'lit-element';
import { SearchResultService } from "../services/search-result-service.js";

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
    const mockData = { categories: [], values: [], type: "" };
    this.maxHeight = 80;
    this.multiplier = 0.8;
    this.mousedown = false;
    this.selectionStart = undefined;
    this.selectionEnd = undefined;
    this.setData(mockData);
  }

  setData(data) {
    this.data = data;
    this.maxValue = Math.max(...this.data.values);
    this.requestUpdate();
    this.updateComplete.then(() => {
      this.bins = this.shadowRoot.querySelectorAll(".bin-container");
    });
  }

  firstUpdated() {
    this.addEventListener("mousedown", () => {
      this.mousedown = true;
    });
    this.addEventListener("mouseup", () => {
      this.mousedown = false;
    });
    this.bins = this.shadowRoot.querySelectorAll(".bin-container");

    document.addEventListener("pb-timeline-data-loaded", e => {
      this.searchResult = new SearchResultService(e.detail.jsonData);
      this.setData(this.searchResult.export());
    })
  }

  brushing(event) {
    this.bins.forEach(bin => {
      bin.classList.remove("selected");
    });

    if (this.mousedown) {
      console.log("down");
      if (!this.selectionStart) {
        this.selectionStart = event.currentTarget;
      }
      this.selectionEnd = event.currentTarget;

      if (this.selectionEnd.getBoundingClientRect().x < this.selectionStart.getBoundingClientRect().x) {
        const selectionStart = this.selectionEnd;
        const selectionEnd = this.selectionStart;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.selectionStart = selectionStart;
        this.selectionEnd = selectionEnd;
      }

      console.log("this.selectionStart");
      console.log(this.selectionStart);
      console.log("this.selectionEnd");
      console.log(this.selectionEnd);
      // get all bins

      // iterate through all of them
      let selectionOn = false;
      this.bins.forEach(bin => {
        if (selectionOn || bin === this.selectionStart) {
          selectionOn = true;
          bin.classList.add("selected");
        }
        if (bin === this.selectionEnd) {
          selectionOn = false;
        }
      })
    }
  }

  resetBrushing() {
    this.mousedown = false;
    alert(`selected: ${this.getSelectedStartDateStr()} - ${this.getSelectedEndDateStr()}`);
    this.bins.forEach(bin => {
      bin.classList.remove("selected");
    });
    this.selectionStart = undefined;
    this.selectionEnd = undefined;
  }

  getSelectedStartDateStr() {
    for (let i=0; i<this.bins.length; i++) {
      if (this.bins[i].classList.contains("selected")) {
        return this.bins[i].querySelector("p").innerText;
      }
    };
  }

  getSelectedEndDateStr() {
    let lastValue = "NA";
    this.bins.forEach(bin => {
      if (bin.classList.contains("selected")) {
        lastValue = bin.querySelector("p").innerText;
      }
    })
    return lastValue;
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.data.values.map((value, indx) => {
          return html`
            <div class="bin-container" @mousemove="${this.brushing}" @mouseup="${this.resetBrushing}">
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

