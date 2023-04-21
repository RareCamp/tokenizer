
import * as crypto from 'crypto';

export class BloomFilter {
  k: number;
  bf: Uint8Array;

  constructor(l: number = 1000, k: number = 10) {
    this.bf = new Uint8Array(l);
    this.bf.fill(0);

    this.k = k;

    // False Positive Rate = (1 - e^(-kn/l))^k
  }

  insert(record: string): void {
    this.hashes(record).forEach(hash => {
      const index = this.hashIndex(hash);
      this.bf[index] = 1;
    });
  }

  // Hash functions

  hashIndex(hash: string): number {
    let hashBigInt = BigInt("0x" + hash);
    let bfLengthBigInt = BigInt(this.bf.length);
    let indexBigInt = hashBigInt % bfLengthBigInt;
    let index = Number(indexBigInt);
    return index;
  }

  hashes(record: string): string[] {
    return [...Array(this.k).keys()].map(i => this.hash(record, i));
  }

  hash(record: string, hashIndex: number): string {
    record += "#" + hashIndex.toString();
    return this.nodeHash(record);
  }

  nodeHash(record: string): string {
    return crypto.createHash('sha256').update(record).digest('hex');
  }

  // TODO: in order to use this, we need to make everything async
  async webCryptoHash(record: string): Promise<string> {
    const utf8 = new TextEncoder().encode(record);
    const h = crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      //console.log(hashArray);
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      console.log(hashHex);
      return hashHex;
    });
    await h;
    console.log("h: " + h);

    throw new Error('Failed to hash record: ' + record);
  }
}