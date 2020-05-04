export class SearchResultServiceNew {
  /*
   * SEARCH RESULT OBJECT
   * - initializes with JSON response of server
   * - transforms data in array format sorted by date
   * - chaining methods for easy readable data manipulation
   * - Type defines the 3 possible scopes "D" (days) / "M" (months) / "Y" (years)
   */

  constructor(jsonData = {}, maxInterval = 60) {
    this.data = { invalid: {}, valid: {} };
    this.maxInterval = maxInterval;
    this.scopes = ["10Y", "5Y", "Y", "M", "W", "D"];
    this.validateJsonData(jsonData);
  }

  validateJsonData(jsonData) {
    Object.keys(jsonData).sort().forEach(key => {
      if (this.isValidDatestr(key)) {
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
      case "10Y", "5Y":
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
    if (categoryStr.match(/^\d{4}-\d{2}-\d{2}$/)) { // YYYY-MM-DD
      return categoryStr;
    }
    if (categoryStr.match(/^\d{4}-\d{2}$/)) { // YYYY-MM
      return `${categoryStr}-01`;
    }
    if (categoryStr.match(/^\d{4}$/)) { // YYYY
      return `${categoryStr}-01-01`;
    }
    if (categoryStr.match(/^\d{4}-W(5[0-3]|[1-4][0-9]|[1-9])$/)) {
      const split = categoryStr.split("-");
      const year = Number(split[0]);
      const weekNummber = Number(split[1].replace("W", ""));
      return this.getDateStrOfISOWeek(year, weekNummber);
    }
    throw new Error("invalid categoryStr");
  }

  dateStrToUTCDate(dateStr) {
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error(`invalid dateStr format, expected "YYYY-MM-DD", got: "${dateStr}".`);
    }
    const split = dateStr.split("-");
    const year  = Number(split[0]);
    const month = Number(split[1]);
    const day   = Number(split[2]);
    return new Date(Date.UTC(year, month - 1, day));
  }

  UTCDateToDateStr(UTCDate) {
    return UTCDate.toISOString();
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
}


