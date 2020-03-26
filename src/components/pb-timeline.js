import { LitElement, html } from 'lit-element'
import { style } from './pb-timeline-styles.js'
// import * as d3 from "d3";


/**
* A timeline component to display aggregated data. For example:
* - number of letters send/received per year / month / day.
*
*
*/
export class PbTimeline extends LitElement {

  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      /**
      * reference to actual CodeMirror object
      */
      // timelineData: {
      //   type: Object
      // },
    };
  }

  constructor() {
    super();
    this.startDate = "1900-01-01";
    this.timelineData = {};
  }

  render() {
    return html`
      <div class="charts-container">
        <div id="mainchart"></div>
        <div id="mainchart2"></div>
        <div id="mainchart3"></div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  loadData() {
    // this.loadLineChartFromCsv("mainchart", "%Y-%m-%d", "src/data/btc-data.csv");
    // this.loadLineChartFromCsv("mainchart2", "%Y", "src/data/kba-data-year.csv");

    this.loadLineChartFromJson("mainchart3", "%Y-%m-%d", "src/data/mock-data.json");


    /*
     * BARCHART WITH ARRAY AS INPUT!!!
     */
    // d3.select(this.shadowRoot.querySelector("#mainchart2"))
    //   .selectAll("div")
    //   .data()
    //     .enter()
    //     .append("div")
    //     .style("width", function(d) { return d + "px"; })
    //     .text(function(d) { return d; });

    // var margin = {top: 20, right: 20, bottom: 70, left: 40},
    // width = 600 - margin.left - margin.right,
    // height = 300 - margin.top - margin.bottom;

    // // Parse the date / time
    // var  parseDate = d3.time.format("%Y-%m").parse;
    // var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    // var y = d3.scale.linear().range([height, 0]);
    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom")
    //     .tickFormat(d3.time.format("%Y-%m"));
    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left")
    //     .ticks(10);
    // var svg = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform",
    //           "translate(" + margin.left + "," + margin.top + ")");
    // d3.csv("bar-data.csv", function(error, data) {
    //     data.forEach(function(d) {
    //         d.date = parseDate(d.date);
    //         d.value = +d.value;
    //     });
    //   x.domain(data.map(function(d) { return d.date; }));
    //   y.domain([0, d3.max(data, function(d) { return d.value; })]);

    //   svg.append("g")
    //       .attr("class", "x axis")
    //       .attr("transform", "translate(0," + height + ")")
    //       .call(xAxis)
    //     .selectAll("text")
    //       .style("text-anchor", "end")
    //       .attr("dx", "-.8em")
    //       .attr("dy", "-.55em")
    //       .attr("transform", "rotate(-90)" );
    //   svg.append("g")
    //       .attr("class", "y axis")
    //       .call(yAxis)
    //     .append("text")
    //       .attr("transform", "rotate(-90)")
    //       .attr("y", 6)
    //       .attr("dy", ".71em")
    //       .style("text-anchor", "end")
    //       .text("Value ($)");
    //   svg.selectAll("bar")
    //       .data(data)
    //     .enter().append("rect")
    //       .style("fill", "steelblue")
    //       .attr("x", function(d) { return x(d.date); })
    //       .attr("width", x.rangeBand())
    //       .attr("y", function(d) { return y(d.value); })
    //       .attr("height", function(d) { return height - y(d.value); });
    // });
  }


  loadLineChartFromJson(elementId, dateFormat, path) {

    // Read the data
    // d3.json("src/data/mock-data.json",
    //   function(d){
    //     // convert data to needed format
    //     d = Object.keys(d).map(key => {
    //       return {
    //         date: key,
    //         value: d[key]
    //       }
    //     });
    //     d = d.filter(obj => !obj.date.startsWith("0000"));
    //     console.log(d);
    //     d = Object.keys(d).map(key => {

    //     }
    //     // d.map(obj => {
    //     //   date:
    //     // })
    //     return d;
    //   },
    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60};
    let width = 460 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const targetEl = this.shadowRoot.querySelector(`#${elementId}`);
    console.log(targetEl);
    // console.log(this.shadowRoot);
    var svg = d3.select(targetEl)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
    d3.csv("src/data/btc-data.csv",
      // When reading the csv, I must format variables:
      function(d){
        return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
      },
      // Now I can use this dataset:
      function(data) {
        console.log("TARGET DATASET");
        console.log(data);
      //   // Add X axis --> it is a date format
      //   var x = d3.scaleTime()
      //     .domain(d3.extent(data, function(d) { return d.date; }))
      //     .range([ 0, width ]);
      //   svg.append("g")
      //     .attr("transform", "translate(0," + height + ")")
      //     .call(d3.axisBottom(x));
      //   // Add Y axis
      //   var y = d3.scaleLinear()
      //     .domain([0, d3.max(data, function(d) { return +d.value; })])
      //     .range([ height, 0 ]);
      //   svg.append("g")
      //     .call(d3.axisLeft(y));
      //   // Add the line
      //   svg.append("path")
      //     .datum(data)
      //     .attr("fill", "none")
      //     .attr("stroke", "steelblue")
      //     .attr("stroke-width", 1.5)
      //     .attr("d", d3.line()
      //       .x(function(d) { return x(d.date) })
      //       .y(function(d) { return y(d.value) })
      //       )
    })
  }

  loadLineChartFromCsv(elementId, dateFormat, fullpath) {
    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60};
    let width = 960 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const targetEl = this.shadowRoot.querySelector(`#${elementId}`);
    console.log(targetEl);
    // console.log(this.shadowRoot);
    var svg = d3.select(targetEl)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    // load data (example here "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv")
    d3.csv(fullpath,
      // When reading the csv, I must format variables:
      function(d){ /* %Y-%m-%d */
        return { date : d3.timeParse(dateFormat)(d.date), value : d.value }
      },
      // Now I can use this dataset:
      function(data) {
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.value; })])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));
        // Add the line
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
            )
    })
  }
}

customElements.define('pb-timeline', PbTimeline);

