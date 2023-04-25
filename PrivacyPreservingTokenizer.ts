
import { createHash } from 'crypto';


export class PrivacyPreservingTokenizer {
  HASH_FUNCTION: string = 'sha256';

  bloomFilterLength: number;
  numberOfHashFunctions: number;
  eta: number; // Probability of *not* flipping a bit

  constructor(bloomFilterLength: number, numberOfHashFunctions: number, privacyBudget: number) {
    this.bloomFilterLength = bloomFilterLength;
    this.numberOfHashFunctions = numberOfHashFunctions;
    this.eta = 1 / (1 + Math.exp(privacyBudget)); // Laplacian?
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

  /*
  private bloomFilterInsertAllInOne(bf: Uint8Array, field: string): Uint8Array {
    for (let i = 0; i < this.numberOfHashFunctions; i++) {
      const saltedField = field + "#" + i.toString();
      const hash = nodeHash(saltedField);
      const index = Number(BigInt("0x" + hash) % BigInt(this.bloomFilterLength));
      bf[index] = 1;
    }
    return bf;
  }
  */

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

  private hash(field: string, hashIndex: number): string {
    return this.nodeHash(field + "#" + hashIndex.toString()); // TODO: is this a safe way to hash?
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

    return this.random() <= this.eta ? bit : 1 - bit;
  }

  private random(): number {
    return Math.random();
  }
}