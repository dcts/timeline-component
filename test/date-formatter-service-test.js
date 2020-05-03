const test = require('ava');
// const ParseDateService = require('../src/services/parse-date-service.js');
import { DateFoormatterService } from '../src/services/date-formatter-service.js';

test('should return default value for nonsense input', t => {
  t.is("????-??-??", new ParseDateService().run("asdkjh1awd sd23fs2kjh asdjkh asdw"));
});
