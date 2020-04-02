import { LitElement, html, css } from 'lit-element'
import * as d3 from "d3";
import * as c3 from "c3";


/**
* A zoomable linechart component build with d3js
*
*
*/
export class PbBarChart extends LitElement {

  static get styles() {
    return css`
      // CSS goes here
    `;
  }

  static get properties() {
    return {
      width: {
        type: Number
      },
      height: {
        type: Number
      },
    };
  }

  constructor() {
    console.log("asdasdasd");
    console.log(c3);
    super();
    this.height = 100;
    this.width = 960;
    document.addEventListener("DOMContentLoaded", () => {
      this.chartEl = this.shadowRoot.getElementById("chart");
      this.drawChart();
    })
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.15/c3.min.css">
      <div id="chart"></div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  loadData(data) {
    this.data = data.map(obj => {
      return {
        date: d3.timeParse("%Y-%m-%d")(obj.date),
        value: Number(obj.value)
      }
    });
    // this.data = this.data.filter(obj => obj.date && obj.value);
    // this.resetChart();
    // this.drawChart();
  }

  resetChart() {
    this.chartEl.innerHTML = "";
  }

  drawChart() {
    var chart = c3.generate({
      bindto: this.chartEl,
      data: {
        columns: [
          ['Anzahl Briefe', 1, 1, 1, 1, 1, 2, 1, 3, 7, 4, 5, 10, 3, 13, 20, 9, 24, 17, 39, 43, 60, 71, 82, 128, 141, 160, 109, 130, 175, 203, 178, 223, 176, 230, 281, 271, 243, 246, 262, 300, 302, 314, 311, 320, 328, 331, 338, 353, 362, 366, 359, 354, 366, 354, 327, 351, 330, 334, 332, 366, 365, 367, 368, 362, 359, 355, 354, 353, 361, 345, 362, 351, 345, 345, 344, 354, 344, 341, 328, 296, 305, 304, 304, 3, 1, 2, 3, 1, 1, 1, 1, 1, 2, 1],
        ],
        type: 'bar'
      },
      bar: {
        width: {
          ratio: 1 // this makes bar width 50% of length between ticks
        },
          // or
          // width: 100 // this makes bar width 100px
      },
      axis: {
        x: {
          type: 'category',
          categories: [1753, 1834, 1847, 1868, 1877, 1886, 1891, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1975, 1977, 1978, 1981, 1986, 1992]
        }
      },
      legend: {
        position: 'inset'
      },
      zoom: {
        enabled: true,
        rescale: true
      },
      // subchart: {
      //   show: true
      // }
    });

    d3.select(chart.element)
        .call( d3.brush()                     // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [400,400] ] )       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      )
  }
}

customElements.define('pb-bar-chart', PbBarChart);
