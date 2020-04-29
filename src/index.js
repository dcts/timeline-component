import './styles.css';
import './components/pb-daterange-picker.js';
import './components/pb-bar-chart.js';
import '@vaadin/vaadin-select';

import { LoadDataService } from "./services/load-data-service.js";
import { SearchResultService } from "./services/search-result-service.js";
import { ParseDateService } from "./services/parse-date-service.js";

let ex1 = {};
let ex2 = {};
let ex3 = {};
let ex4 = {};
let ex5 = {};
let ex6 = {};

/*
   * EXTEND DATE OBJECT TO USEFULL METHODS
   *
   *
   */
// Date.prototype.addDays = function (days) {
//   var date = new Date(this.valueOf());
//   date.setDate(date.getDate() + days);
//   return date;
// }
// Date.prototype.addMonths = function (months) { // https://stackoverflow.com/a/2706169/6272061
//   var date = new Date(this.valueOf());
//   var d = date.getDate();
//   date.setMonth(date.getMonth() + +months);
//   if (date.getDate() != d) {
//     date.setDate(0);
//   }
//   return date;
// }
// Date.prototype.addYears = function (years) {
//   var date = new Date(this.valueOf());
//   date.setFullYear(date.getFullYear() + years);
//   return date;
// }

document.addEventListener("DOMContentLoaded", () => {
  new LoadDataService("Brief");

  document.addEventListener("json-data-for-development-loaded", (e) => {
    console.log(`DATA LOADED`);
    const data = new SearchResultService(e.detail.jsonData);
    window.data = data;

  })
});

