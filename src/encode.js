/**
 * This class holds a data record that will be encoded using the Anonymizer algorithm.
 */
class Record {

    /**
     * 
     * @param {StringType} firstName First name of the patient
     * @param {StringType} lastName Last name of the patient
     * @param {DateType} dateOfBirth  Date of birth of patient
     * @param {StringType} cityOfBirth City of Birth of patient
     * @param {GenderType} genderCode Gender of the patient
     */
    constructor(firstName, lastName, dateOfBirth, cityOfBirth, genderCode) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.cityOfBirth = cityOfBirth;
        this.genderCode = genderCode;
    }

    /**
     * Returns an encoded version of the record
     */
    encode() {
        return this.#normalizeRecordElements()
    }

    /**
     * Normalizes individual data elements and returns a list.
     * 
     * @returns List of normalized values of the record for encoding
     */
    #normalizeRecordElements(){

        // NOTE: PRESERVE THE ORDER OF ELEMENTS RETURNED IN THE LIST
        // Encoding might break if the order changes
        return [].concat(
            this.firstName.normalize(),
            this.lastName.normalize(),
            this.dateOfBirth.normalize(),
            this.cityOfBirth.normalize(),
            this.genderCode.normalize()
        )
    }
}


module.exports = Record;