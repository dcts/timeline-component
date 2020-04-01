import { LitElement, html, css } from 'lit-element'
import * as d3 from "d3";


/**
* A zoomable linechart component build with d3js
*
*
*/
export class PbLineChart extends LitElement {

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
    super();
    this.height = 200;
    this.width = 960;
    document.addEventListener("DOMContentLoaded", () => {
      this.chartEl = this.shadowRoot.getElementById("chart");
    })
  }

  render() {
    return html`<div id="chart"></div>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  loadData(data) {
    console.log("data inputtere");
    console.log(data);
    this.data = data.map(obj => {
      return {
        date: d3.timeParse("%Y-%m-%d")(obj.date),
        value: Number(obj.value)
      }
    });
    this.data = this.data.filter(obj => obj.date && obj.value);
    this.resetChart();
    this.drawChart();
  }

  resetChart() {
    this.chartEl.innerHTML = "";
  }

  drawChart() {
    let margin = {top: 10, right: 30, bottom: 30, left: 60};
    let width = this.width - margin.left - margin.right;
    let height = this.height - margin.top - margin.bottom;

    // append the svg object to DOM element
    let svg = d3.select(this.chartEl)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date))
      .range([ 0, width ]);
    let xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => +d.value)])
      .range([ height, 0 ]);
    let yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    let clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    let brush = d3.brushX()                // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)                     // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    let line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
      .datum(this.data)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => x(d.date) )
        .y(d => y(d.value) )
      );

    // Add the brushing
    line.append("g")
      .attr("class", "brush")
      .call(brush);

    // A function that set idleTimeOut to null
    let idleTimeout;
    const idled = () => idleTimeout = null;

    // A function that update the chart for given boundaries
    function updateChart() {
      // What are the selected boundaries?
      let extent = d3.event.selection;
      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([4,8]);
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }
      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line.select('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(d => x(d.date))
          .y(d => y(d.value))
        );
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",() => {
      x.domain(d3.extent(this.data, d => d.date));
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(d => x(d.date))
          .y(d => y(d.value))
      );
    });
  }
}

customElements.define('pb-line-chart', PbLineChart);
