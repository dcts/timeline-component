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
    return this.buildResult();
  }

  buildResult() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  findYear() {
    let regex = /[1-9]{1}[0-9]{3}/;
    this.input
  }
}

module.exports = ParseDateService;
