import './styles.css';
import './components/pb-timeline.js';
import './components/pb-daterange-picker.js';
import './components/pb-line-chart.js';
import './components/pb-bar-chart.js';


// import { SearchResultsManager } from './components/search-results-manager.js';
import { SearchResult } from './components/search-result.js';
import { LoadDataService } from "./components/load-data-service.js";




// let loader;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  // const loader = new DataLoader("http://localhost:8080/src/data/kba-data.csv");
  // new DataLoader("http://localhost:8080/src/data/mock-data-year.csv");
  // loader = new DataLoader("https://kba.anton.ch/api/timeline?object_type=Predigt");
  // loader = new DataLoader("http://localhost:8080/src/data/kba-predigten.json");
  // loader = new DataLoader("http://localhost:8080/src/data/kba-data-year.csv");
  // window.loader = loader;
  document.addEventListener("pb-timeline-data-loaded", (e) => {
    const pEl = document.getElementById("data-loading-status");
    if (pEl) {
      pEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;
    }
    searchResult = new SearchResult(e.detail.data);
    window.searchResult = searchResult;
    let barChartEl = document.querySelector("pb-bar-chart");
    barChartEl.updateData(searchResult.export());
  });
  let searchResult;
  let loadDataService = new LoadDataService("http://localhost:8080/src/data/kba-predigten.json");

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


