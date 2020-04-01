import './styles.css';
import './components/todo-view.js';
import './components/pb-timeline.js';
import './components/pb-line-chart.js';

import { DataLoader } from "./components/data-loader.js";





document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  // const loader = new DataLoader("http://localhost:8080/src/data/kba-data.csv");
  const loader = new DataLoader("http://localhost:8080/src/data/btc-data.csv");

  document.addEventListener("data-loaded", (e) => {
    console.log("asdas")
    const pEl = document.getElementById("data-loading-status");
    pEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;

    const lineChartEl = document.querySelector("pb-line-chart");
    console.log(loader.getJson());
    lineChartEl.loadData(loader.getJson());
  });


});



