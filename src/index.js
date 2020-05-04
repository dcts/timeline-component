import './styles.css';
import './components/pb-daterange-picker.js';
import './components/pb-bar-chart.js';
import './components/pb-timeline.js';
import './components/pb-brushing-layer.js';
import '@vaadin/vaadin'; // import all vadin components (only for showcase)

// import services
import { LoadDataService } from "./services/load-data-service.js";
import { SearchResultService } from "./services/search-result-service.js";
import { ParseDateService } from "./services/parse-date-service.js";

// load json data for development
import { jsonDataDev } from './data/dev-data.js';
const jsonData = jsonDataDev;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("vaadin-radio-group").setAttribute("label", "Select Sample Data");
  document.querySelectorAll("vaadin-radio-button").forEach(radioButton => radioButton.removeAttribute("disabled"));
  initDevControls();
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
    window.srn = new SearchResultServiceNew(newJsonData);;
    // Output intervallsizes to console
    let sizes = window.sr.getIntervallSizes();
    const maxInterval = 60;
    const selection = sizes["D"] <= maxInterval ? "D" : sizes["W"] <= maxInterval ? "W" : sizes["M"] <= maxInterval ? "M" : sizes["Y"] <= maxInterval ? "Y" : sizes["5Y"] <= maxInterval ? "5Y" : sizes["10Y"] <= maxInterval ? "10Y" : "invalid";
    let msg = `${startDateStr} to ${endDateStr}\n------------------------\n`;
    Object.keys(sr.getIntervallSizes()).forEach(scope => {
      msg += `${scope.padStart(3, " ")} : ${sizes[scope]} ${selection === scope ? "<----" : ""}\n`;
    })
    document.querySelector("textarea#logs").innerHTML = msg;
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
