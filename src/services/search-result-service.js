export class SearchResultService {
  /*
   * SEARCH RESULT OBJECT
   * - initializes with JSON response of server
   * - transforms data in array format sorted by date
   * - chaining methods for easy readable data manipulation
   * - Type defines the 3 possible scopes "D" (days) / "M" (months) / "Y" (years)
   */

  constructor(jsonData, maxInterval = 60) {
    this.data = { invalid: {}, scoped: { "D": {}, "M": {}, "Y": {}, "5Y": {}, "10Y": {} } };
    this.maxInterval = maxInterval;
    this.validateJsonData(jsonData);
    this.aggregateMonthlyData();
    this.aggregateYearlyData();
    this.aggregate5YearData();
    this.aggregateDecadeData();
  }

  validateJsonData(jsonData) {
    Object.keys(jsonData).sort().forEach(key => {
      if (this.isValidDatestr(key)) {
        this.data.scoped["D"][key] = Number(jsonData[key]);
      } else {
        this.data.invalid[key] = Number(jsonData[key]);
      }
    });
  }

  getMinDateStr() {
    return Object.keys(this.data.scoped["D"]).sort()[0];
  }
  getMinDate() {
    return new Date(this.getMinDateStr());
  }

  getMaxDateStr() {
    let days = Object.keys(this.data.scoped["D"]);
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
    // export scopes ("D","M","Y", "5Y", "10Y") based on intervallsize
    if (this.computeIntervallSize(startDate, endDate, "D") <= this.maxInterval) {
      return this.exportDays(startDate, endDate);
    } else if (this.computeIntervallSize(startDate, endDate, "M") <= this.maxInterval) {
      return this.exportMonths(startDate, endDate);
    } else if (this.computeIntervallSize(startDate, endDate, "Y") <= this.maxInterval) {
      return this.exportYears(startDate, endDate);
    } else if (this.computeIntervallSize(startDate, endDate, "5Y") <= this.maxInterval) {
      return this.exportNYears(startDate, endDate, 5);
    } else if (this.computeIntervallSize(startDate, endDate, "10Y") <= this.maxInterval) {
      return this.exportNYears(startDate, endDate, 10);
    } else {
      throw new Error(`IntervallSize to big (allowed maxInterval of ${this.maxInterval} is exceeded!)`);
    }
  }

  exportDays(startDate, endDate) {
    startDate = startDate || this.getMinDate();
    endDate   = endDate   || this.getMaxDate();
    let categories = this.getArray(startDate, endDate, "D");
    let values = categories.map(day => {
      return this.data.scoped["D"][day] || 0;
    })
    return {
      categories: categories,
      values: values,
      scope: "D"
    };
  }

  // exportWeeks(startDate, endDate) {
  //   startDate = startDate || this.getMinDate();
  //   endDate = endDate || this.getMaxDate();
  //   let categories = this.getArray(startDate, endDate, "W");
  //   // let values = categories.map(day => {
  //   //   return this.data.days[day] || 0;
  //   // })
  //   // return {
  //   //   categories: categories,
  //   //   values: values,
  //   //   scope: "D"
  //   // };
  // }

  exportMonths(startDate, endDate) {
    startDate = startDate || this.getMinDate();
    endDate   = endDate   || this.getMaxDate();
    let categories = this.getArray(startDate, endDate, "M");
    let values = categories.map(month => {
      return this.data.scoped["M"][month] || 0;
    })
    return {
      categories: categories,
      values: values,
      scope: "M"
    };
  }

  exportYears(startDate, endDate) {
    startDate = startDate || this.getMinDate();
    endDate = endDate || this.getMaxDate();
    let categories = this.getArray(startDate, endDate, "Y");
    let values = categories.map(year => {
      return this.data.scoped["Y"][year] || 0;
    })
    return {
      categories: categories,
      values: values,
      scope: "Y",
    };
  }

  exportNYears(startDate, endDate, N) {
    startDate = startDate || this.getMinDate();
    endDate = endDate || this.getMaxDate();
    let scope = `${N > 1 ? N : ""}Y`;
    console.log(scope);
    let categories = this.getArray(startDate, endDate, scope);
    let values = categories.map(year => {
      return this.data.scoped[scope][year] || 0;
    })
    return {
      categories: categories,
      values: values,
      scope: scope,
    };
  }

  aggregateMonthlyData() {
    let months = {};
    Object.keys(this.data.scoped["D"]).forEach(dayStr => {
      let monthStr = dayStr.substr(0, 7);
      months[monthStr] = months[monthStr] ? months[monthStr] + this.data.scoped["D"][dayStr] : this.data.scoped["D"][dayStr];
    })
    this.data.scoped["M"] = months;
  }

  aggregateYearlyData() {
    let years = {};
    Object.keys(this.data.scoped["D"]).forEach(dayStr => {
      let yearStr = dayStr.substr(0, 4);
      years[yearStr] = years[yearStr] ? years[yearStr] + this.data.scoped["D"][dayStr] : this.data.scoped["D"][dayStr];
    })
    this.data.scoped["Y"] = years;
  }

  aggregate5YearData() {
    let years5 = {};
    Object.keys(this.data.scoped["D"]).forEach(dayStr => {
      let yearStr = dayStr.substr(0, 4);
      let years5str = (Math.floor(Number(yearStr) / 5) * 5).toString()
      years5[years5str] = years5[years5str] ? years5[years5str] + this.data.scoped["D"][dayStr] : this.data.scoped["D"][dayStr];
    })
    this.data.scoped["5Y"] = years5;
  }

  aggregateDecadeData() {
    let decades = {};
    Object.keys(this.data.scoped["D"]).forEach(dayStr => {
      let yearStr = dayStr.substr(0, 4);
      let decadeStr = (Math.floor(Number(yearStr) / 10) * 10).toString()
      decades[decadeStr] = decades[decadeStr] ? decades[decadeStr] + this.data.scoped["D"][dayStr] : this.data.scoped["D"][dayStr];
    })
    this.data.scoped["10Y"] = decades;
  }

  getDateStrLenght(scope) {
    let dateStrLengthLookup = {
      "D": 10,  // "2012-01-01".length => 10
      "W": 8,   // "2012-W52".length => 8
      "M": 7,   // "2012-01".length => 7
      "Y": 4,   // "2012".length => 4
      "5Y": 4,  // "2012".length => 4
      "10Y": 4  // "2012".length => 4
    }
    return dateStrLengthLookup[scope]
  }

  // returns array with categories based on intervall and scope (in correct ordering)
  getArray(startDate, stopDate, scope) {
    let dateArray = new Array();
    let currentDate = startDate;
    if (scope === "5Y" || scope === "10Y") {
      const n = Number(scope.replace("Y", ""));
      const startYear = Math.floor(Number(currentDate.toISOString().split("-")[0]) / n) * n;
      currentDate = new Date(Date.UTC(startYear, 1, 1));
    }
    while (currentDate <= stopDate) {
      dateArray.push(currentDate);
      currentDate = this.increaseDateBy(scope, currentDate);
    }
    return dateArray.map(date => date.toISOString().substr(0, this.getDateStrLenght(scope)));
  }

  computeIntervallSizes(startDate, endDate) {
    return {
      "D": this.computeIntervallSize(startDate, endDate, "D"),
      "W": this.computeIntervallSize(startDate, endDate, "W"),
      "M": this.computeIntervallSize(startDate, endDate, "M"),
      "Y": this.computeIntervallSize(startDate, endDate, "Y"),
      "5Y": this.computeIntervallSize(startDate, endDate, "5Y"),
      "10Y": this.computeIntervallSize(startDate, endDate, "10Y"),
    }
  }

  computeIntervallSize(startDate, endDate, scope) {
    let currentDate = startDate; //normalizeDate(startDate, scope);
    let count = 0;
    while (currentDate <= endDate) {
      count++;
      currentDate = this.increaseDateBy(scope, currentDate);
    }
    return count;
  }

  increaseDateBy(scope, date) {
    switch(scope) {
      case "D":
        return this.addDays(date, 1);
      case "W":
        return this.addDays(date, 7);
      case "M":
        return this.addMonths(date, 1);
      case "Y":
        return this.addYears(date, 1);
      case "5Y":
        return this.addYears(date, 5);
      case "10Y":
        return this.addYears(date, 10);
    }
  }

  /*
   * assign date to category based on scope.
   * EXAMPLES:
   * categorizeDateStr("1956-01-01", "5Y")  // => "1955"
   * categorizeDateStr("1954-01-01", "10Y") // => "1950"
   * categorizeDateStr("1954-01-01", "M")   // => "1954-01"
   * categorizeDateStr("1954-01-01", "M")   // => "1954-01"
   * categorizeDateStr("1954-01-01", "W")   // => "1954-W01"
   */
  categorizeDateStr(startDateStr, scope) {

  }

  /*
   * opposite function than categorizeDateStr
   * EXAMPLES:
   * categoryToDateStr("1956-01-01", "5Y")  // => "1955"
   * categoryToDateStr("1954-01-01", "10Y") // => "1950"
   * categoryToDateStr("1954-01-01", "M")   // => "1954-01"
   * categorizeDateStr("1954-01-01", "M")   // => "1954-01"
   * categorizeDateStr("1954-01-01", "W")   // => "1954-W01"
   */
  categoryToDateStr(category) {

  }

  addDays(date, days) {
    let newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  addMonths(date, months) {
    let newDate = new Date(date.valueOf());
    let d = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + +months);
    if (newDate.getDate() != d) {
      newDate.setDate(0);
    }
    return newDate;
  }

  addYears(date, years) {
    let newDate = new Date(date.valueOf());
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }

  /*
   * Approximation, this function is not exact
   * returns same result for all years, which is not correct.
   */
  // week2month(weeknr) {
  //   return {
  //     "1":  1,   "2": 1,   "3": 1,   "4": 1, "5": 1,
  //     "6":  2,   "7": 2,   "8": 2,   "9": 2,
  //     "10": 3,  "11": 3,  "12": 3,  "13": 3, "14": 3,
  //     "15": 4,  "16": 4,  "17": 4,  "18": 4,
  //     "19": 5,  "20": 5,  "21": 5,  "22": 5,
  //     "23": 6,  "24": 6,  "25": 6,  "26": 6, "27": 6,
  //     "28": 7,  "29": 7,  "30": 7,  "31": 7,
  //     "32": 8,  "33": 8,  "34": 8,  "35": 8,
  //     "36": 9,  "37": 9,  "38": 9,  "39": 9,  "40": 9,
  //     "41": 10, "42": 10, "43": 10, "44": 10,
  //     "45": 11, "46": 11, "47": 11, "48": 11,
  //     "49": 12, "50": 12, "51": 12, "52": 12, "53": 12
  //   }[weeknr.toString()];
  // }
  // getWeek(originalDate) { // https://weeknumber.net/how-to/javascript
  //   var date = new Date(originalDate.getTime());
  //   date.setHours(0, 0, 0, 0);
  //   // Thursday in current week decides the year.
  //   date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  //   // January 4 is always in week 1.
  //   var week1 = new Date(date.getFullYear(), 0, 4);
  //   // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  //   return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
  //     - 3 + (week1.getDay() + 6) % 7) / 7);
  // }
}

