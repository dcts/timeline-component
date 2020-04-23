class ParseDateService {
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

    this.findYear();
    this.findMonth();
    this.findDay();

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

  findYear() {
    let regex = /[1-9]{1}[0-9]{3}/;
    const result = this.input.match(regex)
    if (result) {
      this.year = result[0];
      this.removeMatchFromInput();
    }
  }

  findMonth() {
    // let regex = /[1-9]{1}[0-9]{3}/;


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
      this.day = result[0];
      if (this.day.length == 1) {
        this.day = "0" + this.day;
      }
    }
  }

  removeMatchFromInput(matchObj) {
    if (matchObj && matchObj[0] && matchObj.index) {
      let len = matchObj[0].length;
      let charArr = this.input.split('');
      charArr.splice(matchObj.index, lens);
      this.input = charArr.join("");
    }
  }

  monthDictonary() {
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
}

module.exports = ParseDateService;
