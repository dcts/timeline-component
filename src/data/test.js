var json = require('./mock-data.json');
// console.log(json);


const aggregated = {};


Object.keys(json).forEach(key => {
  if (!key.startsWith("0000")) {
    let year = key.substring(0,4);
    if (aggregated[year]) {
      aggregated[year] += 1;
    } else {
      aggregated[year] = 1;
    }
  }
})
// console.log(aggregated);


console.log("date,value")
Object.keys(aggregated).forEach(key => {
  console.log(`${key},${aggregated[key]}`);
})




