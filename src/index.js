import './styles.css';
import './components/pb-timeline.js';

let dataLoadingStatusEl;

document.addEventListener("DOMContentLoaded", () => {
  dataLoadingStatusEl = document.getElementById("data-loading-status");
  document.addEventListener("pb-timeline-data-loaded", (e) => {
    dataLoadingStatusEl.innerText = `file ${e.detail.filepath} succesfullly loaded. timestamp: ${e.detail.timestamp}`;
  });
});


// window.changeView = (scope) => {
//   let barChartData = {};
//   switch(scope) {
//     case "D":
//       barChartEl.updateData(searchResult.exportDays());
//       break;
//     case "M":
//       barChartEl.updateData(searchResult.exportMonths());
//       break;
//     case "Y":
//       barChartEl.updateData(searchResult.exportYears());
//       break;
//     default:
//       barChartEl.updateData(searchResult.export());
//       break;
//   }
// }

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


