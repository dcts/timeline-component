import './styles.css';
import './components/pb-timeline.js';
import '@vaadin/vaadin-select';

import { LoadDataService } from "./components/load-data-service.js";


let dataLoadingStatusEl;
let selectDataEl;

document.addEventListener("DOMContentLoaded", () => {
  dataLoadingStatusEl = document.getElementById("data-loading-status");
  selectDataEl = document.getElementById("select-data-dropdown");

  selectDataEl.addEventListener('change', function(event) {
    load(event.target.value);
  });

  document.addEventListener("pb-timeline-data-loaded", (e) => {
    dataLoadingStatusEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;
  });
});


window.load = function(query) {
  // let filepath = `https://dcts-todo-app.web.app/data/kba-${query}.json`; // for production on firebase deploy
  let filepath = `http://localhost:8080/src/data/kba-${query}.json`;
  let loadDataService = new LoadDataService(filepath); // dispatches 'pb-timeline-data-loaded' event
}
