export class ParseDateService {
  /*
   * PARSE DATE SERVICE
   * whenever the user inputs a date it should be automatically detected
   * a lot of formats should be supported, for example:
   * - 1. April 1970
   * - 1970 (only year)
   * - 1970-12-23
   * - 1900 12 23
   * - 1 jan 1970
   */

  // single purpose object, each initialization runs the parsing
  constructor() {
  }

  run (input) {
    this.input = input;
    this.day = "??";
    this.month = "??";
    this.year = "????";

    const resultIsoMatch = this.input.match(this.isoMatchRegex());
    const resultCustomMatch = this.input.match(this.customRegex());
    const resultWeekMatch = this.input.match(this.weekMatchRegex());
    const resultYearAndMonthMatch = this.input.match(this.yearAndMonthRegex());
    if (resultIsoMatch) {
      const split = resultIsoMatch[0].split(/-|\/|\s/);
      this.year  = split[0];
      this.month = this.setWithLeadingZero(split[1]);
      this.day   = this.setWithLeadingZero(split[2]);
    } else if (resultYearAndMonthMatch) {
      const split = resultYearAndMonthMatch[0].split("-");
      this.year = split[0];
      this.month = this.setWithLeadingZero(split[1]);
      this.day = "01";
    } else if (resultCustomMatch) {
      const split = resultCustomMatch[0].split(/\.|\s|\/|-/);
      this.day = this.setWithLeadingZero(split[0]);
      this.month = this.setWithLeadingZero(split[1]);
      this.year = split[2];
    } else if (resultWeekMatch) {
      const split = resultWeekMatch[0].split(/\.|\s|\/|-/);
      const year = Number(split[0]);
      const week = Number(split[1].replace("W0", "").replace("W", ""));
      return this.getDateStrOfISOWeek(year, week);
    } else {
      this.findYear();
      this.findMonth();
      this.findDay();
    }
    return this.buildResult();
  }

  buildResult() {
    if (this.year != "????" && this.month === "??") {
      this.month = "01";
    }
    if (this.month != "??" && this.day === "??") {
      this.day = "01";
    }
    return `${this.year}-${this.month}-${this.day}`;
  }

  // allowed 2012-01-31 /  2012-1-31 / 2012/01/31 / 2012/1/31 / 2012 1 31 / 2012 01 31
  isoMatchRegex() {
    return /(?<=\s|^)\d{4}(-|\s|\/)([0][1-9]|[1-9]|10|11|12)(-|\s|\/)([0][1-9]|[1-2][0-9]|3[01]|[1-9])(?=\s|$|\.)/;
    //      |        | year         | 01-09 | 1-9 | 10-12   |         |01-09  |10-29     |30,31| 1-9  |
    //      |             | dash or slash                   | dash or slash                           |
    //      |preceding with space or start of string                                                  | end with space endofstr or dot
  }

  customRegex() {
    return /\d{1,2}(\.|\s|\/|-)\d{1,2}(\.|\s|\/|-)\d{4}/;
  }

  weekMatchRegex() {
    return /\d{4}(\.|\s|\/|-)W\d{1,2}(?=\s|$|\.)/;
  }

  yearAndMonthRegex() {
    return /(?<=\s|^)\d{4}-([0][1-9]|[1-9]|10|11|12)(?=\s|$)/;
  }

  findYear() {
    let regex = /[1-9]{1}[0-9]{3}/;
    const result = this.input.match(regex)
    if (result) {
      this.year = result[0];
      this.removeMatchFromInput(result);
    }
  }

  findMonth() {
    const months = this.monthDictionaryValues();
    months.forEach(month => {
      let re = new RegExp(`(?<=\\s|^)(${month})(?=\\s|$|\\.)`, "i")
      const result = this.input.match(re);
      if (result) { // yes => get dict and value + return
        this.month = this.monthDictionary()[result[0].toLowerCase()];
        this.removeMatchFromInput(result);
        return this.month;
      }
    })
    return undefined;
  }

  findDay() {
    // find single numbers from 1 - 31
    let regex = /(?<=\s|^)([0][1-9]|[1-2][0-9]|3[01]|[1-9])(?=\s|$|\.|st|nd|rd|th)/;
    //           |         | 01-09 | 10-29    |30,31|1-9    | ends with whitespace, endofstr or dot.
    //           | starts with whitepace or startoftr       | won't be included in match (lookbehind operator)
    //           | look behind operator (not included)
    //           | https://stackoverflow.com/a/6713378/6272061
    const result = this.input.match(regex)
    if (result) {
      this.day = this.setWithLeadingZero(result[0]);
    }
  }

  setWithLeadingZero(str) {
    if (str.length == 1) {
      return "0" + str;
    } else {
      return str;
    }
  }

  removeMatchFromInput(matchObj) {
    if (matchObj && matchObj[0] && matchObj.index) {
      let len = matchObj[0].length;
      let charArr = this.input.split('');
      charArr.splice(matchObj.index, len);
      this.input = charArr.join("");
    }
  }

  monthDictionaryValues() {
    return Object.keys(this.monthDictionary());
  }
  monthDictionary() {
    return {
      // german
      "jan": "01", "januar":    "01",
      "feb": "02", "februar":   "02",
      "mär": "03", "märz":      "03",
      "apr": "04", "april":     "04",
      "mai": "05", "mai":       "05",
      "jun": "06", "juni":      "06",
      "jul": "07", "juli":      "07",
      "aug": "08", "august":    "08",
      "sep": "09", "september": "09",
      "okt": "10", "oktober":   "10",
      "nov": "11", "november":  "11",
      "dez": "12", "dezember":  "12",
      // english
      "jan": "01", "january":   "01",
      "feb": "02", "february":  "02",
      "mar": "03", "march":     "03",
      "apr": "04", "april":     "04",
      "may": "05", "may":       "05",
      "jun": "06", "june":      "06",
      "jul": "07", "july":      "07",
      "aug": "08", "august":    "08",
      "sep": "09", "september": "09",
      "oct": "10", "october":   "10",
      "nov": "11", "november":  "11",
      "dec": "12", "december":  "12",
      // french
      "janv":"01", "janvier":   "01",
      "févr":"02", "février'":  "02",
      "mars":"03", "mars":      "03",
      "avr": "04", "avril":     "04",
      "mai": "05", "mai":       "05",
      "juin":"06", "juin":      "06",
      "juil":"07", "juillet":   "07",
      "août":"08", "août":      "08",
      "sept":"09", "septembre": "09",
      "oct": "10", "octobre":   "10",
      "nov": "11", "novembre":  "11",
      "déc": "12", "décembre":  "12",
      //italian
      "gen": "01", "gennaio":   "01",
      "feb": "02", "febbraio":  "02",
      "mar": "03", "marzo":     "03",
      "apr": "04", "aprile":    "04",
      "mag": "05", "maggio":    "05",
      "giu": "06", "giugno":    "06",
      "lug": "07", "luglio":    "07",
      "ago": "08", "agosto":    "08",
      "set": "09", "settembre": "09",
      "ott": "10", "ottobre":   "10",
      "nov": "11", "novembre":  "11",
      "dic": "12", "dicembre":  "12",
    }
  }

  getDateStrOfISOWeek(y, w) {
    let simple = new Date(y, 0, 1 + (w - 1) * 7);
    // let simple = new Date(Date.UTC(y, 0, 2, 1 + (w - 1) * 7));
    let dow = simple.getDay();
    let ISOweekStart = simple;
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    // do not rollover to next or previous year
    if (ISOweekStart.getFullYear() > y) {
      return `${y}-12-31`;
    } else if (ISOweekStart.getFullYear() < y) {
      return `${y}-01-01`;
    }
    return this.formatDate(ISOweekStart);
  }

  formatDate(date) { // target is ISO format => 2020-05-31
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
}
