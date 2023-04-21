// NOTE: with this design, we need to sanitize and expand each type separately
//       We may want to join the Sanitizer and Expander classes.

export class StringSanitizer {

  constructor() {
  }

  sanitize(record: string): string {
    return record;
  }
}

export class GenderSanitizer {

  constructor() {
  }

  sanitize(record: string): string {
    return "M";
  }
}

export class DateSanitizer {

  constructor() {
  }

  sanitize(date: Date): Date {
    return date;
  }
}