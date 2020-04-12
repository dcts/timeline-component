export class LoadDataService {
  /*
   * LOAD DATA SERVICE
   * - currently hard coded 2 queries ("Briefe" or "Predigten")
   * - fetches JSON data from server, expects a single JSON object with the format:
   *   { "2012-01-01": 123, "2012-02-01": 15, ... }
   * - triggers pb-timeline-loaded customEvent on finish
   * - does not validate data, this is done by the SearchResult class.
   * - does not apply filtering, this is done by the SearchResult class (start / end date)
   */

  // CONSTRUCTOR BROADER -> use after cors policy issue fixed
  // constructor(query) { // hardcoded queries: "Predigt" or "Briefe"
  //   if (query !== "Predigten" && query !== "Briefe" ) {
  //     throw new Error(`Invalid query. Allowed queries 'Predigten' or 'Briefe'. Got: ${query}`);
  //   }
  //   // const proxy = "https://cors-anywhere.herokuapp.com/"; // bypass CORS policy
  //   const baseUrl = "https://kba.anton.ch/api/timeline";
  //   const paramsObj = {
  //     "object_type": query,
  //     "api_token": "g73eNpprfHz9nMSEbo072HWmO8tbMEJPCu4KEhGi7on42dJzXD12veztQbM7"
  //   };
  //   this.url = proxy + baseUrl + "?" + this.getParamsStr(paramsObj);
  //   console.log(this.url);
  //   this.fetchJson(this.url);
  // }

  constructor(url) { // alternative method until CORS blocking is resolved
    this.fetchJson(url);
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
  fetchJson(url) {
    fetch(url).then(response => response.json()).then(jsonData => {
      this.dispatchLoadedEvent(jsonData, url);
    });
  }

  dispatchLoadedEvent(data, url) {
    document.dispatchEvent(new CustomEvent('pb-timeline-data-loaded', {
      bubbles: true,
      detail: {
        data: data,
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
