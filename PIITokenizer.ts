

import { DateSanitizer, GenderSanitizer, StringSanitizer } from "./Sanitizer";
import { QGramExpander, DateExpander } from "./Expander";
import { PrivacyPreservingTokenizer } from "./PrivacyPreservingTokenizer";

export class PIITokenizer {
  stringSanitizer: StringSanitizer;
  dateSanitizer: DateSanitizer;
  genderSanitizer: GenderSanitizer;

  dateExpander: DateExpander;
  qGramExpander: QGramExpander;

  tokenizer: PrivacyPreservingTokenizer;

  constructor(bloomFilterLength: number = 500, numberOfHashFunctions: number = 20, privacyBudget: number = 3.0) {
    this.stringSanitizer = new StringSanitizer();
    this.dateSanitizer = new DateSanitizer();
    this.genderSanitizer = new GenderSanitizer();
    
    this.dateExpander = new DateExpander();
    this.qGramExpander = new QGramExpander();
  
    this.tokenizer = new PrivacyPreservingTokenizer(bloomFilterLength, numberOfHashFunctions, privacyBudget);
  }

  tokenize(firstName: string, lastName: string, dateOfBirth: Date, gender: string, other: string[] = []): Uint8Array {

    // Sanitize fields
    firstName = this.stringSanitizer.sanitize(firstName);
    lastName = this.stringSanitizer.sanitize(lastName);
    gender = this.genderSanitizer.sanitize(gender);

    // Expand fields
    let fields: string[] = [
      ...this.qGramExpander.expand(firstName),
      ...this.qGramExpander.expand(lastName),
      ...this.dateExpander.expand(dateOfBirth),
      gender,
    ];

    // Create Bloom filter
    let tokens = this.tokenizer.tokenize(fields);
    return tokens;
  }
}