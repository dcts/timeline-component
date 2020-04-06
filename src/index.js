import './styles.css';
import './components/pb-timeline.js';
import './components/pb-daterange-picker.js';
import './components/pb-line-chart.js';
import './components/pb-bar-chart.js';

import { DataLoader } from "./components/data-loader.js";



let loader;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  // const loader = new DataLoader("http://localhost:8080/src/data/kba-data.csv");
  loader = new DataLoader("http://localhost:8080/src/data/kba-data-year.csv");
  window.loader = loader;

  document.addEventListener("pb-timeline-data-loaded", (e) => {
    const pEl = document.getElementById("data-loading-status");
    if (pEl) {
      pEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;
    }
    const barChartEl = document.querySelector("pb-bar-chart");
    console.log(barChartEl);
    barChartEl.loadData(e.detail.data);
  });
});



