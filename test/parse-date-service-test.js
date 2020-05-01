const test = require('ava');
// const ParseDateService = require('../src/services/parse-date-service.js');
import { ParseDateService } from '../src/services/parse-date-service.js';

// import { ParseDateService } from '../src/services/parse-date-service.js';
// console.log(ParseDateService);

test('should return default value for nonsense input', t => {
  t.is("????-??-??", new ParseDateService().run("asdkjh1awd sd23fs2kjh asdjkh asdw"));
});

test('should detect year', t => {
  t.is("2012-01-01", new ParseDateService().run("2012"));
  t.is("1950-01-01", new ParseDateService().run("1950"));
  t.is("1623-01-01", new ParseDateService().run("1623"));
  t.is("1500-01-01", new ParseDateService().run("1500"));
});

test('should detect year with noise', t => {
  t.is("2012-01-01", new ParseDateService().run("asd 2012 f"));
});

test('should detect day', t => {
  t.is("????-??-02", new ParseDateService().run("2. "));
  t.is("????-??-31", new ParseDateService().run("31. "));
  t.is("????-??-21", new ParseDateService().run("21st"));
  t.is("????-??-02", new ParseDateService().run("2nd"));
  t.is("????-??-22", new ParseDateService().run("22nd"));
  t.is("????-??-10", new ParseDateService().run("10th"));
  t.is("????-??-05", new ParseDateService().run("5th"));
  t.is("????-??-01", new ParseDateService().run("1"));
});

test('should ignore incorrect days', t => {
  t.is("????-??-??", new ParseDateService().run("32. "));
  t.is("????-??-??", new ParseDateService().run("52."));
});

test('should detect day with noise', t => {
  t.is("????-??-02", new ParseDateService().run("as 2. sd"));
});

test('should detect months in english', t => {
  t.is("????-01-01", new ParseDateService().run("jan"));
  t.is("????-01-01", new ParseDateService().run("january"));
  t.is("????-02-01", new ParseDateService().run("Feb"));
  t.is("????-02-01", new ParseDateService().run("February"));
  t.is("????-03-01", new ParseDateService().run("mar"));
  t.is("????-03-01", new ParseDateService().run("march"));
  t.is("????-04-01", new ParseDateService().run("apr"));
  t.is("????-04-01", new ParseDateService().run("April"));
  t.is("????-05-01", new ParseDateService().run("may"));
  t.is("????-05-01", new ParseDateService().run("May"));
  t.is("????-06-01", new ParseDateService().run("jun"));
  t.is("????-06-01", new ParseDateService().run("June"));
  t.is("????-07-01", new ParseDateService().run("jul"));
  t.is("????-07-01", new ParseDateService().run("july"));
  t.is("????-08-01", new ParseDateService().run("Aug"));
  t.is("????-08-01", new ParseDateService().run("august"));
  t.is("????-09-01", new ParseDateService().run("sep"));
  t.is("????-09-01", new ParseDateService().run("september"));
  t.is("????-10-01", new ParseDateService().run("oct"));
  t.is("????-10-01", new ParseDateService().run("october"));
  t.is("????-11-01", new ParseDateService().run("nov"));
  t.is("????-11-01", new ParseDateService().run("november"));
  t.is("????-12-01", new ParseDateService().run("dec"));
  t.is("????-12-01", new ParseDateService().run("december"));
});

test('should detect months in german', t => {
  t.is("????-01-01", new ParseDateService().run("Jan"));
  t.is("????-01-01", new ParseDateService().run("januar"));
  t.is("????-02-01", new ParseDateService().run("Feb"));
  t.is("????-02-01", new ParseDateService().run("Februar"));
  t.is("????-03-01", new ParseDateService().run("März"));
  t.is("????-03-01", new ParseDateService().run("märz"));
  t.is("????-04-01", new ParseDateService().run("apr"));
  t.is("????-04-01", new ParseDateService().run("April"));
  t.is("????-05-01", new ParseDateService().run("mai"));
  t.is("????-05-01", new ParseDateService().run("Mai"));
  t.is("????-06-01", new ParseDateService().run("Jun"));
  t.is("????-06-01", new ParseDateService().run("Juni"));
  t.is("????-07-01", new ParseDateService().run("Jul"));
  t.is("????-07-01", new ParseDateService().run("Juli"));
  t.is("????-08-01", new ParseDateService().run("aug"));
  t.is("????-08-01", new ParseDateService().run("August"));
  t.is("????-09-01", new ParseDateService().run("Sep"));
  t.is("????-09-01", new ParseDateService().run("September"));
  t.is("????-10-01", new ParseDateService().run("Oct"));
  t.is("????-10-01", new ParseDateService().run("October"));
  t.is("????-11-01", new ParseDateService().run("Nov"));
  t.is("????-11-01", new ParseDateService().run("November"));
  t.is("????-12-01", new ParseDateService().run("Dec"));
  t.is("????-12-01", new ParseDateService().run("December"));
});

test('should detect combined queries', t => {
  t.is("1970-04-02", new ParseDateService().run("2. April 1970"));
  t.is("2012-03-31", new ParseDateService().run("31 März 2012"));
  t.is("2020-07-04", new ParseDateService().run("4th july 2020"));
  t.is("2020-07-04", new ParseDateService().run("4 july 2020"));
  t.is("????-07-04", new ParseDateService().run("4 july"));
});

test('should detect combined queries in reverse order', t => {
  t.is("1954-08-04", new ParseDateService().run("1954 august 4"));
  t.is("1960-12-07", new ParseDateService().run("1960 dec 7"));
});

test('should detect YYYY-MM-DD ISO format (ISO format)', t => {
  t.is("2020-01-12", new ParseDateService().run("2020-01-12"));
  t.is("1950-02-21", new ParseDateService().run("1950-02-21"));
});

test('should detect YYYY-M(M)-D(D) format (ISO format with skipped leading zeros)', t => {
  t.is("2020-01-12", new ParseDateService().run("2020-1-12"));
  t.is("1950-02-04", new ParseDateService().run("1950-2-4"));
});

test('should detect YYYY/MM/DD format (ISO format seperated by slash)', t => {
  t.is("1923-12-24", new ParseDateService().run("1923/12/24"));
  t.is("2001-09-11", new ParseDateService().run("2001/09/11"));
});

test('should detect YYYY/M(M)/D(D) format (ISO format seperated by slash and skipped leading zeros)', t => {
  t.is("1844-01-23", new ParseDateService().run("1844/1/23"));
  t.is("1844-05-01", new ParseDateService().run("1844/5/1"));
});

test('should detect YYYY MM DD format (ISO format seperated by whitespace)', t => {
  t.is("1945-12-01", new ParseDateService().run("1945 12 01"));
  t.is("1930-01-02", new ParseDateService().run("1930 01 02"));
});

test('should detect YYYY MM DD format (ISO format seperated by whitespace skipped leading zeros)', t => {
  t.is("1945-12-01", new ParseDateService().run("1945 12 1"));
  t.is("1930-01-02", new ParseDateService().run("1930 1 2"));
});

test('should detect format dd.mm.yyyy', t => {
  t.is("1991-07-23", new ParseDateService().run("23.07.1991"));
  t.is("1763-02-03", new ParseDateService().run("03.02.1763"));
});

test('should detect format d(d).m(m).yyyy (without leading zeros)', t => {
  t.is("1991-07-23", new ParseDateService().run("23.7.1991"));
  t.is("1763-02-03", new ParseDateService().run("3.2.1763"));
});

test('should detect format dd/mm/yyyy', t => {
  t.is("1991-07-23", new ParseDateService().run("23/07/1991"));
  t.is("1763-02-03", new ParseDateService().run("03/02/1763"));
});

test('should detect format d(d)/m(m)/yyyy (without leading zeros)', t => {
  t.is("1991-07-23", new ParseDateService().run("23/07/1991"));
  t.is("1763-02-03", new ParseDateService().run("03/02/1763"));
});

test('should detect format dd mm yyyy', t => {
  t.is("1991-07-23", new ParseDateService().run("23 07 1991"));
  t.is("1763-02-03", new ParseDateService().run("03 02 1763"));
});

test('should detect format d(d) m(m) yyyy (without leading zeros)', t => {
  t.is("1991-07-23", new ParseDateService().run("23 7 1991"));
  t.is("1763-02-03", new ParseDateService().run("3 2 1763"));
  t.is("1950-01-31", new ParseDateService().run("31 1 1950"));
});

test('should detect week format yyyy-W?? or yyyy/W?? or yyyy W?? or yyyy.W??', t => {
  t.is("1991-01-14", new ParseDateService().run("1991-W03"));
  t.is("1991-01-14", new ParseDateService().run("1991 W03"));
  t.is("1991-01-14", new ParseDateService().run("1991/W03"));
  t.is("1991-01-14", new ParseDateService().run("1991.W03 asd"));
  t.is("1991-01-14", new ParseDateService().run("1991 W03 asd"));
  t.is("2000-03-20", new ParseDateService().run("2000-W12"));
  t.is("2000-03-06", new ParseDateService().run("2000-W10"));
  t.is("1992-12-28", new ParseDateService().run("1992-W53"));
  t.is("1993-12-27", new ParseDateService().run("1993-W52"));
});

test('should fallback if weeknumber doesnot exist', t => {
  t.is("2000-12-31", new ParseDateService().run("2000-W54"));
  t.is("2000-12-31", new ParseDateService().run("2000-W53"));
  t.is("2000-01-01", new ParseDateService().run("2000-W0"));
});

test('should detect year and month seperated by dash format yyyy-mm', t => {
  t.is("2000-01-01", new ParseDateService().run("2000-01"));
  t.is("1867-12-01", new ParseDateService().run("1867-12"));
  t.is("1999-06-01", new ParseDateService().run("1999-06"));
});

test('should detect year and month seperated by dash format yyyy-mm (with leading zeros)', t => {
  t.is("2000-01-01", new ParseDateService().run("2000-1"));
  t.is("1865-02-01", new ParseDateService().run("1867-2"));
  t.is("1999-06-01", new ParseDateService().run("1999-6"));
});

