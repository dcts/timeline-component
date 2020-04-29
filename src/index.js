import './styles.css';
import './components/pb-daterange-picker.js';
import './components/pb-bar-chart.js';
import './components/pb-timeline.js';
import './components/pb-brushing-layer.js';
import '@vaadin/vaadin-select';
import '@vaadin/vaadin';
// import '@vaadin/vaadin-radio-group';

import { LoadDataService } from "./services/load-data-service.js";
import { SearchResultService } from "./services/search-result-service.js";
import { ParseDateService } from "./services/parse-date-service.js";


document.addEventListener("DOMContentLoaded", () => {
  // load json data from KBA Anton
  new LoadDataService("Brief");

  document.addEventListener("json-data-for-development-loaded", (e) => {
    console.log(`DATA LOADED`);
    const jsonData = e.detail.jsonData;
    window.jsonData = jsonData;

    // change radiobuttons states to ready
    document.querySelector("vaadin-radio-group").setAttribute("label", "Select Sample Data");
    document.querySelectorAll("vaadin-radio-button").forEach(radioButton => radioButton.removeAttribute("disabled"));
  });

  customElements.whenDefined('vaadin-radio-button').then(function () {
    const radioButtonGroup = document.querySelector('vaadin-radio-group');
    const output = document.querySelector('#output');
    radioButtonGroup.addEventListener('value-changed', function (event) {
      const startDateStr = radioButtonGroup.value.split(",")[0];
      const endDateStr = radioButtonGroup.value.split(",")[1];
      console.log(`from ${startDateStr} to ${endDateStr}`);

      // new jsonData
      const newJsonData = {};
      Object.keys(jsonData).filter(key => key >= startDateStr && key < endDateStr).forEach(key => {
        newJsonData[key] = jsonData[key];
      })
      window.newJsonData = newJsonData;

    });
  });
});
