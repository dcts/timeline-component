export class LoadDataService {
  /*
   * LOAD DATA SERVICE
   * only for development currently
   */

  // CONSTRUCTOR BROADER -> use after cors policy issue fixed
  constructor(query, startDateStr, endDateStr) { // hardcoded queries: "Predigt" or "Briefe"
    this.startDateStr = startDateStr;
    this.endDateStr = endDateStr;

    if (query !== "Predigt" && query !== "Brief" ) {
      throw new Error(`Invalid query. Allowed queries 'Predigt' or 'Brief'. Got: ${query}`);
    }
    const proxy = "https://cors-anywhere.herokuapp.com/"; // bypass CORS policy
    const baseUrl = "https://kba.anton.ch/api/timeline";
    const paramsObj = {
      "object_type": query,
      "api_token": "g73eNpprfHz9nMSEbo072HWmO8tbMEJPCu4KEhGi7on42dJzXD12veztQbM7"
    };
    this.url = proxy + baseUrl + "?" + this.getParamsStr(paramsObj);
    this.fetchJson();
  }

  getParamsStr(paramsObj) {
    let paramsArray = [];
    for (let [key, value] of Object.entries(paramsObj)) {
      paramsArray.push(`${key}=${value}`);
    }
    return paramsArray.join("&");
  }

  /*
   * FETCH JSON DATA
   * - runs search query and expects results as JSON
   * - in the future query could store params which define parameters pased
   *   to an API that is connected to the database
   */
  fetchJson() {
    fetch(this.url).then(response => response.json()).then(jsonData => {
      this.dispatchLoadedEvent(jsonData, this.url);
    });
  }

  dispatchLoadedEvent(jsonData, url) {
    document.dispatchEvent(new CustomEvent('json-data-for-development-loaded', {
      bubbles: true,
      detail: {
        jsonData: jsonData,
        filepath: url,
        timestamp: Date.now(),
      }
    }));
  }
}

/*
 * FETCH CSV FILE (depricated, lets make JSON standard)
 *
 */
// fetchCsv(url) {
//   console.log("fetchCsv");
//   fetch(url).then(response => response.text()).then(text => {
//     let rows = text.split("\n"); // split rows to array
//     rows = rows.slice(1, rows.length); // omit first row -> headers
//     this.data = rows.map(row => {
//       const cells = row.split(",");
//       return {
//         date: cells[0],
//         value: Number(cells[1]),
//       };
//     })
//     console.log("FETCHED DATA");
//     console.log(this.data)
//     this.dispatchLoadedEvent(this.getDataArrayFormat(), url);
//   })
// }
