const Record = require('./encode');
const Types = require('./bloomfilter');

/**
 * Entry point for the Anonymizer library. 
 */

module.exports = {
    "Record": Record,
    "DateType": Types.DateType,
    "StringType": Types.StringType,
    "GenderType": Types.GenderType,
}
