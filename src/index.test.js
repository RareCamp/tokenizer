const anonymizer = require('./index');

test('Anonymizer is wired correctly', () => {

    const firstName = new anonymizer.StringType("firstName");
    const lastName = new anonymizer.StringType("lastName");
    const dateOfBirth = new anonymizer.DateType(1,1,2023);
    const cityOfBirth = new anonymizer.StringType("cityOfBirth");
    const genderCode = new anonymizer.GenderType("genderCode");

    const record = new anonymizer.Record(firstName, lastName, dateOfBirth, cityOfBirth, genderCode);

    expect(record.encode()).toStrictEqual([
        "firstName", "lastName", "1", "1", "2023", "cityOfBirth", "genderCode"
    ]);
})
