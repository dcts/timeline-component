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
  new LoadDataService("Brief");  // dispatches "json-data-for-development-loaded" event
  // dev controls data switching functionality
  initDevControls();
});

document.addEventListener("json-data-for-development-loaded", (e) => {
  console.log(`DATA LOADED`);
  const jsonData = e.detail.jsonData;
  console.log("Adding random values in 1650 to make visibility of chart for decades");
  jsonData["1650-01-12"] = 1667;
  jsonData["1660-01-12"] = 2637;
  jsonData["1670-01-12"] = 637;
  jsonData["1720-01-12"] = 9627;
  jsonData["1735-01-12"] = 627;
  jsonData["1851-01-12"] = 24;
  jsonData["1877-01-12"] = 1244;
  jsonData["1865-01-12"] = 1334;
  jsonData["1895-01-12"] = 287;
  window.jsonData = jsonData;
  // change radiobuttons states to ready
  document.querySelector("vaadin-radio-group").setAttribute("label", "Select Sample Data");
  document.querySelectorAll("vaadin-radio-button").forEach(radioButton => radioButton.removeAttribute("disabled"));
});

const initDevControls = () => {
  const radioButtonGroup = document.querySelector('vaadin-radio-group');
  radioButtonGroup.addEventListener('value-changed', function(event) {
    // transform selection to boundry dateStr's
    const startDateStr = radioButtonGroup.value.split(",")[0];
    const endDateStr = radioButtonGroup.value.split(",")[1];
    // filter jsonData (was previously loaded)
    const newJsonData = {};
    Object.keys(jsonData).filter(key => key >= startDateStr && key < endDateStr).forEach(key => {
      newJsonData[key] = jsonData[key];
    })
    // init seearch result object and make visible to window
    const searchResult = new SearchResultService(newJsonData);
    window.sr = searchResult;
    // Output intervallsizes to console
    let sizes = window.sr.getIntervallSizes();
    const maxInterval = 60;
    const selection = sizes["D"] <= maxInterval ? "D" : sizes["W"] <= maxInterval ? "W" : sizes["M"] <= maxInterval ? "M" : sizes["Y"] <= maxInterval ? "Y" : sizes["5Y"] <= maxInterval ? "5Y" : sizes["10Y"] <= maxInterval ? "10Y" : "invalid";
    console.log(`-----------------------------`);
    console.log(`from ${startDateStr} to ${endDateStr}`);
    Object.keys(sr.getIntervallSizes()).forEach(scope => {
      console.log(`${scope.padStart(3, " ")} : ${sizes[scope]} ${selection === scope ? "<----" : ""}`);
    })
    // dispatch event to commuicate with components (daterange picker + timeline)
    dispatchPbTimelineDataLoadedEvent(newJsonData);
  });
}

const dispatchPbTimelineDataLoadedEvent = (jsonData) => {
  document.dispatchEvent(new CustomEvent('pb-timeline-data-loaded', {
    bubbles: true,
    detail: {
      jsonData: jsonData,
    }
  }));
}
