export class SearchResultService {
  /*
   * SEARCH RESULT OBJECT
   * dscription goes here...
   */

  constructor(jsonData = {}, maxInterval = 60) {
    this.data = { invalid: {}, valid: {} };
    this.maxInterval = maxInterval;
    this.scopes = ["10Y", "5Y", "Y", "M", "W", "D"];
    this.validateJsonData(jsonData);
  }

  validateJsonData(jsonData) {
    Object.keys(jsonData).sort().forEach(key => {
      if (this.isValidDateStr(key)) {
        this.data.valid[key] = Number(jsonData[key]);
      } else {
        this.data.invalid[key] = Number(jsonData[key]);
      }
    });
  }

  getMinDateStr() {
    return Object.keys(this.data.valid).sort()[0];
  }
  getMaxDateStr() {
    let days = Object.keys(this.data.valid);
    return days.sort()[days.length - 1];
  }
  getMinDate() {
    return this.dateStrToUTCDate(this.getMinDateStr());
  }
  getMaxDate() {
    return this.dateStrToUTCDate(this.getMaxDateStr());
  }

  export(scope) {
    // validate scope
    if (!this.scopes.includes(scope)) {
      throw new Error(`invalid scope provided, expected: ["10Y", "5Y", "Y", "M", "W", "D"]. Got: "${scope}"`);
    }
    // initialize object to export
    const exportData = {
      data: [],
      scope: scope,
      binTitleRotated: this.binTitleRotatedLookup(scope)
    }
    // intervall
    const startCategory = this.classify(this.getMinDateStr(), scope);
    const startDateStr = this.getFirstDay(startCategory);
    let currentDate = this.dateStrToUTCDate(startDateStr);
    const endDate = this.getMaxDate();
    // initialize all bin Object and push to array
    while (currentDate <= endDate) {
      const currentDateStr = this.UTCDateToDateStr(currentDate);
      const currentCategory = this.classify(currentDateStr, scope);
      exportData.data.push(this.buildBinObject(currentDateStr, currentCategory, scope));
      currentDate = this.increaseDateBy(scope, currentDate);
    }
    // count all values
    Object.keys(this.data.valid).sort().forEach(dateStr => {
      const currentCategory = this.classify(dateStr, scope);
      const targetBinObject = exportData.data.find(it => it.category === currentCategory);
      try {
        targetBinObject.value += this.data.valid[dateStr] || 0;
      } catch(e) {
        console.log(e);
        console.log("currentCategory");
        console.log(currentCategory);
      }
    });
    return exportData;
  }

  binTitleRotatedLookup(scope) {
    const lookup = {
      "10Y": true,
      "5Y": true,
      "Y": true,
      "M": false, // only exception not to rotate in monthly scope
      "W": true,
      "D": true,
    }
    return lookup[scope];
  }

  buildBinObject(dateStr, category, scope) {
    // for all scopes the same
    const binObject = {
      dateStr: dateStr,
      category: category,
      value: 0
    }
    switch (scope) {
      case "10Y":
        binObject.binTitle       = category;
        binObject.tooltip        = `${category} - ${Number(category) + 9}`; // 1900 - 1999
        binObject.selectionStart = category;
        binObject.selectionEnd   = `${Number(category) + 9}`;
        binObject.seperator      = Number(category) % 100 === 0; // divisible by 100
        break;
      case "5Y":
        binObject.binTitle       = category;
        binObject.tooltip        = `${category} - ${Number(category) + 4}`; // 1995 - 1999
        binObject.selectionStart = category;
        binObject.selectionEnd   = `${Number(category) + 4}`;
        binObject.seperator      = Number(category) % 50 === 0; // divisible by 50
        break;
      case "Y":
        binObject.binTitle       = category;
        binObject.tooltip        = category;
        binObject.selectionStart = category;
        binObject.selectionEnd   = category;
        binObject.seperator      = Number(category) % 10 === 0; // divisible by 10
        break;
      case "M":
        const split    = dateStr.split("-");
        const monthNum = Number(split[1]);
        const month    = this.monthLookup(monthNum); // Jan,Feb,Mar,...,Nov,Dez
        binObject.binTitle       = month[0]; // J,F,M,A,M,J,J,..N,D
        binObject.tooltip        = `${month} ${split[0]}`; // May 1996
        binObject.selectionStart = `${month} ${split[0]}`;
        binObject.selectionEnd   = `${month} ${split[0]}`;
        binObject.title          = monthNum === 1 ? dateStr.split("-")[0] : undefined; // YYYY
        binObject.seperator      = monthNum === 1;
        break;
      case "W":
        const year = category.split("-")[0];; // => 2001
        const week = category.split("-")[1];; // => W52
        binObject.binTitle       = week;
        binObject.tooltip        = `${year} ${week}`; // 1996 W52
        binObject.selectionStart = `${year} ${week}`;
        binObject.selectionEnd   = `${year} ${week}`;
        binObject.seperator      = week === "W1";
        break;
      case "D":
        const yearStr  = dateStr.split("-")[0];
        const monthStr = dateStr.split("-")[1];
        const dayStr   = dateStr.split("-")[2];
        binObject.binTitle = `${Number(dayStr)}.${Number(monthStr)}`; // 26.5
        binObject.tooltip = dateStr;
        binObject.selectionStart = dateStr;
        binObject.selectionEnd = dateStr;
        binObject.title = dayStr === "01" ? `${this.monthLookup(Number(monthStr))} ${yearStr}` : undefined; // May 1996
        binObject.seperator = this.dateStrToUTCDate(dateStr).getUTCDay() === 1; // every monday
        break;
    }
    return binObject;
  }

  /*
   * ...classifies dateStr into category (based on scope)
   * EXAMPLES:
   * classify("2016-01-12", "10Y") // => "2010"
   * classify("2016-01-12", "5Y") // => "2015"
   * classify("2016-01-12", "Y") // => "2016"
   * classify("2016-01-12", "M") // => "2010-01"
   * classify("2016-01-12", "W") // => "2016-W2"
   * classify("2016-01-12", "D") // => "2016-01-12"
   */
  classify(dateStr, scope) { // returns category (as string)
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) { // quick validate dateStr
      throw new Error(`invalid dateStr format, expected "YYYY-MM-DD", got: "${dateStr}".`);
    }
    if (!dateStr || !scope) { // both inputs provided
      throw new Error(`both inputs must be provided. Got dateStr=${dateStr}, scope=${scope}`);
    }
    switch (scope) {
      case "10Y": case "5Y":
        const intervalSize = Number(scope.replace("Y", ""));
        const startYear = Math.floor(Number(dateStr.split("-")[0]) / intervalSize) * intervalSize;
        return startYear.toString();
      case "Y":
        return dateStr.substr(0, 4);
      case "M":
        return dateStr.substr(0, 7);
      case "W":
        const UTCDate = this.dateStrToUTCDate(dateStr);
        return this.UTCDateToWeekFormat(UTCDate);
      case "D":
        return dateStr;
    }
  }

  /*
   * ...gets first day as UTC Date, based on the category
   * EXAMPLES:
   * getFirstDay("2010") // =>
   */
  getFirstDay(categoryStr) {
    if (categoryStr.match(/^\d{4}-\d{2}-\d{2}$/)) { // YYYY-MM-DD => return same value
      return categoryStr;
    }
    if (categoryStr.match(/^\d{4}-\d{2}$/)) { // YYYY-MM
      return `${categoryStr}-01`;             // add    -01
    }
    if (categoryStr.match(/^\d{4}$/)) { // YYYY
      return `${categoryStr}-01-01`;    // add -01-01
    }
    if (categoryStr.match(/^\d{4}-W([1-9]|[1-4][0-9]|5[0-3])$/)) { // YYYY-W?  // ? => [1-53]
      //                    |YYYY-W |1-9 | 10-49    | 50-53 |
      const split = categoryStr.split("-");
      const year = Number(split[0]);
      const weekNummber = Number(split[1].replace("W", ""));
      return this.getDateStrOfISOWeek(year, weekNummber);
    }
    throw new Error("invalid categoryStr");
  }

  dateStrToUTCDate(dateStr) {
    if (!this.isValidDateStr(dateStr)) {
      throw new Error(`invalid dateStr, expected "YYYY-MM-DD" with month[1-12] and day[1-31], got: "${dateStr}".`);
    }
    const split = dateStr.split("-");
    const year  = Number(split[0]);
    const month = Number(split[1]);
    const day   = Number(split[2]);
    return new Date(Date.UTC(year, month - 1, day));
  }

  UTCDateToDateStr(UTCDate) {
    return UTCDate.toISOString().split("T")[0];
  }

  UTCDateToWeekFormat(UTCDate) {
    const year = this.getISOWeekYear(UTCDate);
    const weekNbr = this.getISOWeek(UTCDate);
    return `${year}-W${weekNbr}`;
  }

  getISOWeek(UTCDate) { // https://weeknumber.net/how-to/javascript
    let date = new Date(UTCDate.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    let week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  getISOWeekYear(UTCDate) { // https://weeknumber.net/how-to/javascript
    var date = new Date(UTCDate.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
  }

  getDateStrOfISOWeek(year, weekNumber) { // https://stackoverflow.com/a/16591175/6272061
    let simple = new Date(Date.UTC(year, 0, 1 + (weekNumber - 1) * 7));
    let dow = simple.getUTCDay();
    let ISOweekStart = simple;
    if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getUTCDay() + 1);
    else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getUTCDay());
    return ISOweekStart.toISOString().split("T")[0];
  }

  getIntervalSizes() {
    const startDateStr = this.getMinDateStr();
    const endDateStr = this.getMaxDateStr();
    return {
      "D": this.computeIntervalSize(startDateStr, endDateStr, "D"),
      "W": this.computeIntervalSize(startDateStr, endDateStr, "W"),
      "M": this.computeIntervalSize(startDateStr, endDateStr, "M"),
      "Y": this.computeIntervalSize(startDateStr, endDateStr, "Y"),
      "5Y": this.computeIntervalSize(startDateStr, endDateStr, "5Y"),
      "10Y": this.computeIntervalSize(startDateStr, endDateStr, "10Y"),
    }
  }

  computeIntervalSize(startDateStr, endDateStr, scope) {
    const endDate = this.dateStrToUTCDate(endDateStr);
    const startCategory = this.classify(startDateStr, scope);
    const firstDayDateStr = this.getFirstDay(startCategory);
    let currentDate = this.dateStrToUTCDate(firstDayDateStr);
    let count = 0;
    while (currentDate <= endDate) {
      count++;
      currentDate = this.increaseDateBy(scope, currentDate);
    }
    return count;
  }

  increaseDateBy(scope, date) {
    switch (scope) {
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

  addDays(date, days) {
    let newDate = new Date(date.valueOf());
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
  }

  addMonths(date, months) {
    let newDate = new Date(date.valueOf());
    let d = newDate.getUTCDate();
    newDate.setUTCMonth(newDate.getUTCMonth() + +months);
    if (newDate.getUTCDate() != d) {
      newDate.setUTCDate(0);
    }
    return newDate;
  }

  addYears(date, years) {
    let newDate = new Date(date.valueOf());
    newDate.setUTCFullYear(newDate.getUTCFullYear() + years);
    return newDate;
  }

  isValidDateStr(str) {
    let split = str.split("-");
    if (split.length !== 3) return false;
    let year = split[0];
    let month = split[1];
    let day = split[2];
    if (year === "0000" || day === "00" || month === "00") return false;
    if (Number(day) < 1 || Number(day) > 31) return false;
    if (Number(month) < 1 || Number(month) > 12) return false;
    // if all checks are passed => valid datestring!
    return true;
  }

  monthLookup(num) {
    if (num > 12 || num < 1) {
      throw new Error(`invalid 'num' provided, expected 1-12. Got: ${num}`);
    }
    const lookup = {
      "1": "Jan",
      "2": "Feb",
      "3": "Mar",
      "4": "Apr",
      "5": "May",
      "6": "Jun",
      "7": "Jul",
      "8": "Aug",
      "9": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec",
    }
    return lookup[num.toString()];
  }
}


