import { LitElement, html, css } from 'lit-element';
import { tickStep } from 'd3';

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
        justify-content: space-around;
        cursor: crosshair;
      }
      .bin-container {
        width: var(--pb-timeline-max-width, 14px);
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
      }
      .bin-container:nth-child(10n+1) p.year {
        /* font-weight: bold; */
        font-size: 12px;
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
        z-index: 1;
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
    this.mockData = {
      "categories": ["1900", "1901", "1902", "1903", "1904", "1905", "1906", "1907", "1908", "1909", "1910", "1911", "1912", "1913", "1914", "1915", "1916", "1917", "1918", "1919", "1920", "1921", "1922", "1923", "1924", "1925", "1926", "1927", "1928", "1929", "1930", "1931", "1932", "1933", "1934", "1935", "1936", "1937", "1938", "1939", "1940", "1940", "1941", "1943", "1944", "1945", "1946", "1947", "1948", "1949", "1950"],
      "values": [23, 10, 29, 18, 48, 46, 69, 80, 103, 163, 168, 337, 142, 223, 267, 341, 260, 384, 271, 411, 565, 539, 486, 499, 545, 748, 724, 819, 876, 1095, 1159, 1330, 1234, 1942, 2431, 2448, 1895, 1458, 1825, 1434, 1080, 1080, 1424, 936, 954, 2207, 2710, 2562, 2238, 1722, 1581],
      "title": "count"
    }
    this.mockData = {
      "categories": ["1918", "1919", "1920", "1921", "1922", "1923", "1924", "1925", "1926", "1927", "1928", "1929", "1930", "1931", "1932", "1933", "1934", "1935", "1936", "1937", "1938", "1939", "1940", "1940", "1941", "1943", "1944", "1945", "1946", "1947", "1948", "1949", "1950"],
      "values": [271, 411, 565, 539, 486, 499, 545, 748, 724, 819, 876, 1095, 1159, 1330, 1234, 1942, 2431, 2448, 1895, 1458, 1825, 1434, 1080, 1080, 1424, 936, 954, 2207, 2710, 2562, 2238, 1722, 1581],
      "title": "count"
    }
    this.maxValue = Math.max(...this.mockData.values);
    this.maxHeight = 60;
    this.multiplier = 0.9;

    this.mousedown = false;
  }

  firstUpdated() {
    this.addEventListener("mousedown", () => {
      this.mousedown = true;
    });
    this.addEventListener("mouseup", () => {
      this.mousedown = false;
    });
    this.bins = this.shadowRoot.querySelectorAll(".bin-container");
  }

  brushing(event) {
    if (this.mousedown) {
      event.currentTarget.classList.add("selected");
    }
  }

  resetBrushing() {
    this.mousedown = false;
    alert(`selected: ${this.getSelectedStartDateStr()} - ${this.getSelectedEndDateStr()}`);
    this.bins.forEach(bin => {
      bin.classList.remove("selected");
    });
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
        ${this.mockData.values.map((value, indx) => {
          return html`
            <div class="bin-container" @mousemove="${this.brushing}" @mouseup="${this.resetBrushing}">
              <div class="bin" style="height: ${(value / this.maxValue) * this.maxHeight * this.multiplier}px"></div>
              <p class="year ${indx % 10 === 0 ? "" : "invisible" }">${this.mockData.categories[indx]}</p>
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

