
class StringType {

    constructor(data) {
        this.data = data;
    }

    /**
     * Returns a list of q-grams from the string. Q-Grams allow matching of strings with typos/errors 
     * to get encoded to a similar Bloom filter
     */
    normalize() {
        return [this.data]
    }

}

class DateType {

    /**
     * Create a date object to hold day, month, year of a date
     *  
     * @param {Number} day  A day value - between 1 and 31
     * @param {Number} month A month value - betweeen 1 and 12
     * @param {Number} year  A year value 
     */
    constructor(day, month, year){
        this.day = day;
        this.month = month;
        this.year = year;
    }

    /**
     * Returns a list of strings that can be used for encoding. The strings are obtained
     * by applying "q-gram" style transformations to the date entity
     */
    normalize() {
        return [''+this.day, ''+this.month, ''+this.year]
    }
} 

class GenderType {

    constructor(genderCode) {
        this.genderCode = genderCode;
    }

    /**
     * Gender type is an enum and as such not normalized or transformed
     * 
     * @returns String representing the gender code
     */
    normalize() {
        return this.genderCode;
    }
}

module.exports = {
    "DateType": DateType,
    "StringType": StringType,
    "GenderType": GenderType
}