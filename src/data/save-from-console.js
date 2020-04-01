console.API = console._commandLineAPI; // get console object (works on linux + chrome)
console.save = function (data, filename) { // create method to save file
  if (!data) {
    console.error('Console.save: No data');
    return;
  }
  if (!filename) filename = 'download.json';
  // if its a JSON -> formatt it (stringify)
  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4)
  }
  var blob = new Blob([data], {type: 'text/json'});
  e = document.createEvent('MouseEvents');
  a = document.createElement('a');
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
}

// save demo (can be object or an array)
const obj = [
  {data: "2020-01-11", value: 1},
  {date:"2020-01-12", value: 12}
]
console.save(obj);
