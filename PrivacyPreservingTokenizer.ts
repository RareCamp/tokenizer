
import { createHash } from 'crypto';


export class PrivacyPreservingTokenizer {
  HASH_FUNCTION: string = 'sha256';

  bloomFilterLength: number;
  numberOfHashFunctions: number;
  flipBitProbability: number;

  constructor(bloomFilterLength: number, numberOfHashFunctions: number, privacyBudget: number) {
    this.bloomFilterLength = bloomFilterLength;
    this.numberOfHashFunctions = numberOfHashFunctions;
    this.flipBitProbability = 1 - 1 / (1 + Math.exp(privacyBudget));
  }

  tokenize(fields: string[]): Uint8Array {
    // Initialize bloom filter
    let bloomFilter = new Uint8Array(this.bloomFilterLength).fill(0);

    // Insert each field into the bloom filter
    fields.reduce(this.bloomFilterInsert.bind(this), bloomFilter);

    // Apply differential privacy
    bloomFilter = this.differentialPrivacy(bloomFilter);

    return bloomFilter;
  }

  /**************************/
  /* Bloom filter functions */
  /**************************/

  private bloomFilterInsert(bf: Uint8Array, field: string): Uint8Array {
    this.hashes(field).map(this.hashIndex, this).forEach(i => bf[i] = 1);
    return bf;
  }

  private hashIndex(hexHash: string): number {
    return Number(BigInt("0x" + hexHash) % BigInt(this.bloomFilterLength)); // this.bloomFilterLength is a Number, so casting from BigInt to Number should be safe
  }

  private hashes(field: string): string[] {
    return [...Array(this.numberOfHashFunctions).keys()].map(i => this.hash(field, i));
  }

  private hash(field: string, hashFunctionNumber: number): string {
    return this.nodeHash(field + "#" + hashFunctionNumber.toString()); // TODO: is this a safe way to hash?
  }

  private nodeHash(field: string): string {
    return createHash(this.HASH_FUNCTION).update(field).digest('hex');
  }

  /************************/
  /* Differential privacy */
  /************************/

  private differentialPrivacy(bf: Uint8Array): Uint8Array {
    return bf.map(this.diffuseBit, this);
  }

  private diffuseBit(bit: number): number {
    if (bit !== 0 && bit !== 1) { // TODO: is this necessary? We only call this function internally
      throw Error("bit must be 0 or 1");
    }

    return this.random() <= this.flipBitProbability ? 1 - bit : bit;
  }

  private random(): number {
    return Math.random();
  }
}