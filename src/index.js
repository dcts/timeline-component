import './styles.css';
import './components/pb-timeline.js';
import './components/pb-daterange-picker.js';
import './components/pb-line-chart.js';
import './components/pb-bar-chart.js';


// import { SearchResultsManager } from './components/search-results-manager.js';
import { SearchResult } from './components/search-result.js';
import { LoadDataService } from "./components/load-data-service.js";




let searchResult;
let barChartEl;
let dataLoadingStatusEl;

window.changeView = (scope) => {
  let barChartData = {};
  switch(scope) {
    case "D":
      barChartEl.updateData(searchResult.exportDays());
      break;
    case "M":
      barChartEl.updateData(searchResult.exportMonths());
      break;
    case "Y":
      barChartEl.updateData(searchResult.exportYears());
      break;
    default:
      barChartEl.updateData(searchResult.export());
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  barChartEl = document.querySelector("pb-bar-chart");
  dataLoadingStatusEl = document.getElementById("data-loading-status");

  // let filepath = "https://kba.anton.ch/api/timeline?object_type=Predigt";
  // let filepath = "https://kba.anton.ch/api/timeline?object_type=Brief";
  // let filepath = "http://localhost:8080/src/data/kba-briefe.json";
  let filepath = "http://localhost:8080/src/data/kba-predigten.json";
  let loadDataService = new LoadDataService(filepath);


  document.addEventListener("pb-timeline-data-loaded", (e) => {
    searchResult = new SearchResult(e.detail.data);
    if (dataLoadingStatusEl) {
      dataLoadingStatusEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;
    }
    window.s = searchResult;
    window.bc = barChartEl;
  });
});


// let jsonData = {
//   "2020-01-12": 3,
//   "2020-01-13": 8,
//   "2020-01-13": 41,
//   "2020-03-17": 3,
//   "2019-01-18": 12,
//   "2019-01-17": 1,
//   "0000-12-00": 1,
//   "0000-12-00": 1,
//   "123": 1,
// };

// let s = new SearchResult(jsonData);
// window.s = s;


