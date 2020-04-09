import './styles.css';
import './components/pb-timeline.js';

import { LoadDataService } from "./components/load-data-service.js";


let dataLoadingStatusEl;

document.addEventListener("DOMContentLoaded", () => {
  dataLoadingStatusEl = document.getElementById("data-loading-status");
  document.addEventListener("pb-timeline-data-loaded", (e) => {
    dataLoadingStatusEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;
  });



});

window.load = function(query) {
  let filepath = `http://localhost:8080/src/data/kba-${query}.json`;
  // let filepath = "http://localhost:8080/src/data/kba-predigten.json";
  let loadDataService = new LoadDataService(filepath); // dispatches 'pb-timeline-data-loaded' event
}
