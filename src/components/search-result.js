export class SearchResult {
  /*
   * SEARCH RESULT OBJECT
   * - initializes with JSON response of server
   * - transforms data in array format sorted by date
   * - chaining methods for easy readable data manipulation
   * - Type defines the 3 possible scopes "D" (days) / "M" (months) / "Y" (years)
   */

  constructor(jsonData, maxInterval = 200) {
    this.data = { days: {}, invalid: {} };
    this.maxInterval = maxInterval;
    this.validateJsonData(jsonData);
    this.aggregateMonthlyData();
    this.aggregateYearlyData();
  }

  validateJsonData(jsonData) {
    const days = {};
    const invalid = {};
    Object.keys(jsonData).sort().forEach(key => {
      if (this.isValidDatestr(key)) {
        this.data.days[key] = Number(jsonData[key]);
      } else {
        this.data.invalid[key] = Number(jsonData[key]);
      }
    });
  }

  getMinDateStr() {
    return Object.keys(this.data.days).sort()[0];
  }
  getMinDate() {
    return new Date(this.getMinDateStr());
  }

  getMaxDateStr() {
    let days = Object.keys(this.data.days);
    return days.sort()[days.length - 1];
  }
  getMaxDate() {
    return new Date(this.getMaxDateStr());
  }

  getIntervallSizes() {
    return this.computeIntervallSizes(this.getMinDate(), this.getMaxDate());
  }

  isValidDatestr(str) {
    let split = str.split("-");
    if (split.length !== 3) return false;
    let year  = split[0];
    let month = split[1];
    let day   = split[2];
    if (year === "0000" || day === "00" || month === "00") return false;
    if (Number(day) < 1 || Number(day) > 31)               return false;
    if (Number(month) < 1 || Number(month) > 12 )          return false;
    // if all checks are passed => valid datestring!
    return true;
  }

  export(startDateStr, endDateStr) {
    // if not specified, use MIN and MAX date as default intervall (export all data)
    startDateStr = startDateStr || this.getMinDateStr();
    endDateStr   = endDateStr   || this.getMaxDateStr();
    if (!this.isValidDatestr(startDateStr) || !this.isValidDatestr(endDateStr)) {
      throw new Error("invalid startDate or endDate format. Expected String 'YYYY-MM-DD'")
    }
    let startDate = new Date(startDateStr);
    let endDate   = new Date(endDateStr);
    // export type ("D","M","Y") based on intervallsize
    if (this.computeIntervallSize(startDate, endDate, "D") <= this.maxInterval) {
      console.log("Export DAYS");
      return this.exportDays(startDate, endDate);
    } else if (this.computeIntervallSize(startDate, endDate, "M") <= this.maxInterval) {
      console.log("Export MONTHS");
      return this.exportMonths(startDate, endDate);
    } else if (this.computeIntervallSize(startDate, endDate, "Y") <= this.maxInterval) {
      console.log("Export YEARS");
      return this.exportYears(startDate, endDate);
    } else {
      throw new Error(`IntervallSize to big (allowed maxInterval of ${this.maxInterval} is exceeded!)`);
    }
  }

  exportDays(startDate, endDate) {
    startDate = startDate || this.getMinDate();
    endDate   = endDate   || this.getMaxDate();
    let categories = this.getArray(startDate, endDate, "D");
    let values = categories.map(day => {
      return this.data.days[day] || 0;
    })
    return {
      categories: categories,
      values: values,
    };
  }

  exportMonths(startDate, endDate) {
    startDate = startDate || this.getMinDate();
    endDate   = endDate   || this.getMaxDate();
    let categories = this.getArray(startDate, endDate, "M");
    let values = categories.map(month => {
      return this.data.months[month] || 0;
    })
    return {
      categories: categories,
      values: values,
    };
  }

  exportYears(startDate, endDate) {
    startDate = startDate || this.getMinDate();
    endDate   = endDate   || this.getMaxDate();
    let categories = this.getArray(startDate, endDate, "Y");
    let values = categories.map(year => {
      return this.data.years[year] || 0;
    })
    return {
      categories: categories,
      values: values,
    };
  }

  aggregateMonthlyData() {
    let months = {};
    Object.keys(this.data.days).forEach(dayStr => {
      let monthStr = dayStr.substr(0, 7);
      months[monthStr] = months[monthStr] ? months[monthStr] + this.data.days[dayStr] : this.data.days[dayStr];
    })
    this.data.months = months;
  }

  aggregateYearlyData() {
    let years = {};
    Object.keys(this.data.days).forEach(dayStr => {
      let yearStr = dayStr.substr(0, 4);
      years[yearStr] = years[yearStr] ? years[yearStr] + this.data.days[dayStr] : this.data.days[dayStr];
    })
    this.data.years = years;
  }

  getDateStrLenght(type) {
    let dateStrLengthLookup = {
      "D": 10, // "2012-01-01".length => 10
      "M": 7,  // "2012-01".length => 7
      "Y": 4   // "2012".length => 4
    }
    return dateStrLengthLookup[type]
  }

  // https://stackoverflow.com/a/4413721/6272061
  getArray(startDate, stopDate, type) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = this.increaseDateBy(type, currentDate);
    }
    return dateArray.map(date => date.toISOString().substr(0, this.getDateStrLenght(type)));
  }

  computeIntervallSizes(startDate, endDate) {
    return {
      "D": this.computeIntervallSize(startDate, endDate, "D"),
      "M": this.computeIntervallSize(startDate, endDate, "M"),
      "Y": this.computeIntervallSize(startDate, endDate, "Y")
    }
  }

  computeIntervallSize(startDate, endDate, type) {
    let currentDate = startDate;
    let count = 0;
    while (currentDate <= endDate) {
      count++;
      currentDate = this.increaseDateBy(type, currentDate);
    }
    return count;
  }

  increaseDateBy(type, date) {
    switch(type) {
      case "D":
        return date.addDays(1);
      case "M":
        return date.addMonths(1);
      case "Y":
        return date.addYears(1);
    }
  }
}



/*
 * EXTEND DATE OBJECT TO USEFULL METHODS
 *
 *
 */
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Date.prototype.addMonths = function(months) { // https://stackoverflow.com/a/2706169/6272061
  var date = new Date(this.valueOf());
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}
Date.prototype.addYears = function(years) {
  var date = new Date(this.valueOf());
  date.setFullYear(date.getFullYear() + years);
  return date;
}



// /*
//  * TEST SCRIPT
//  *
//  *
//  */
// let jsonData = {
//   "2020-01-12": 3,
//   "2020-01-13": 41,
//   "2020-03-17": 3,
//   // "2019-01-18": 12,
//   // "2019-01-17": 1,
//   // "2009-01-17": 1,
//   "0000-12-00": 1,
//   "0000-12-00": 1,
//   "123": 1,
// };

// let s = new SearchResult(jsonData);
// // s.aggregateYearlyData();
// window.s = s;
// console.log(s.export());
