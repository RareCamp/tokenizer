
export class StringSanitizer {

  constructor() {
  }

  sanitize(field: string): string {
    field = field.toLowerCase();
    field = field.trim();
    field = field.replace(/\s/g, ' ');
    field = field.replace(/  +/g, ' ');
    return field;
  }
}

export class GenderSanitizer {

  constructor() {
  }

  sanitize(gender: string): string {
    let stringSanitizer = new StringSanitizer();
    gender = stringSanitizer.sanitize(gender);

    const MALE = ["m", "male", "man", "boy"];
    const FEMALE = ["f", "female", "woman", "girl"];

    if (MALE.includes(gender)) {
      return "M";
    }
    if (FEMALE.includes(gender)) {
      return "F";
    }

    throw Error("Unknown gender: " + gender);
  }
}

export class DateSanitizer {

  constructor() {
  }

  sanitize(date: Date): Date {
    return date;
  }
}