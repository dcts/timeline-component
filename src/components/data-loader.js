
export class DataLoader {
  /*
   * Loads Data from url
   * - csv or json
   * - trasforms to needed format
   */

  constructor(url) {
    if (url.endsWith(".csv")) {
      console.log("csv");
      this.fetchCsv(url);
    } else if (url.endsWith(".json")) {
      console.log("json");
      this.fetchJson(url);
    } else {
      throw new Error(`Invalid url. Allowed are .csv or .json, you inputted ${url}`);
    }
  }

  getJson() {
    return this.data;
  }

  display() {
    console.log(this.data);
  }

  fetchCsv(url) {
    console.log("fetchCsv");
    fetch(url).then(response => response.text()).then(text => {
      let rows = text.split("\n"); // split rows to array
      rows = rows.slice(1, rows.length); // omit first row -> headers
      this.data = rows.map(row => {
        const cells = row.split(",");
        return {
          date: cells[0],
          value: cells[1],
        };
      })
      this.dispatchLoadedEvent(url);
    })
  }

  dispatchLoadedEvent(url) {
    document.dispatchEvent(new CustomEvent('data-loaded', {
      bubbles: true,
      detail: {
        filepath: url,
        timestamp: Date.now()
      }
    }));
  }

  fetchJson(url) {
    console.log("fetchJson");
    fetch(url).then(response => response.json()).then(data => {
      this.data = data;
      this.dispatchLoadedEvent(url);
    });
  }
}
