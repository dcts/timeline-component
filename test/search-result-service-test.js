const test = require('ava');
// const ParseDateService = require('../src/services/parse-date-service.js');
import { SearchResultService } from '../src/services/search-result-service.js';

test('check if correct ISO week found', t => {
  t.is("2016-W23", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2016, 6-1, 11))));
  t.is("2015-W39", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2015, 9-1, 26))));
  t.is("2015-W53", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2016, 1-1, 1))));
  t.is("2016-W1", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2016, 1-1, 4))));
  t.is("2016-W2", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2016, 1-1, 11))));
  t.is("2016-W39", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2016, 9-1, 26))));
  t.is("2016-W38", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2016, 9-1, 25))));
  t.is("2016-W52", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2017, 1-1, 1))));
  t.is("1913-W1", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(1912, 12-1, 31))));
  t.is("1913-W44", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(1913, 11-1, 1))));
  t.is("2020-W19", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2020, 5-1, 4))));
  t.is("2020-W19", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2020, 5-1, 10))));
  t.is("2020-W18", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2020, 5-1, 3))));
  t.is("2020-W53", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2020, 12-1, 31))));
  t.is("2020-W53", new SearchResultService()._UTCDateToWeekFormat(new Date(Date.UTC(2021, 1-1, 1))));
})

test('_classify() should return correct category strings for dateStr\'s', t => {
  t.is("2010", new SearchResultService()._classify("2016-01-12", "10Y"));
  t.is("2015", new SearchResultService()._classify("2016-01-12", "5Y"));
  t.is("2016", new SearchResultService()._classify("2016-01-12", "Y"));
  t.is("2016-01", new SearchResultService()._classify("2016-01-12", "M"));
  t.is("2016-W2", new SearchResultService()._classify("2016-01-12", "W"));
  t.is("2016-01-12", new SearchResultService()._classify("2016-01-12", "D"));
})
test('_classify() should throw if invalid dateStr\'s', t => {
  t.throws(() => new SearchResultService()._classify("asdasd", "5Y"));
})
test('_classify() should throw if not 2 inputs provided', t => {
  t.throws(() => new SearchResultService()._classify());
  t.throws(() => new SearchResultService()._classify("asd"));
  t.throws(() => new SearchResultService()._classify("2012-05-12"));
  t.throws(() => new SearchResultService()._classify("Y"));
})
test('_getFirstDay() should throw if invalid category provided', t => {
  t.throws(() => new SearchResultService()._getFirstDay("19912"));
  t.throws(() => new SearchResultService()._getFirstDay("19912-May"));
  t.throws(() => new SearchResultService()._getFirstDay("2012-05-"));
  t.throws(() => new SearchResultService()._getFirstDay(123));
})
test('_getFirstDay() should return correct dateStr for obvious categories', t => {
  t.is("2012-01-01", new SearchResultService()._getFirstDay("2012"));
  t.is("2012-12-01", new SearchResultService()._getFirstDay("2012-12"));
  t.is("2001-08-26", new SearchResultService()._getFirstDay("2001-08-26"));
})
test('_getFirstDay() should return computed correct values for weeks', t => {
  t.is("2020-05-04", new SearchResultService()._getFirstDay("2020-W19"));
  t.is("2016-12-26", new SearchResultService()._getFirstDay("2016-W52"));
  t.is("2015-12-28", new SearchResultService()._getFirstDay("2015-W53"));
  t.is("2016-01-04", new SearchResultService()._getFirstDay("2016-W1"));
})

