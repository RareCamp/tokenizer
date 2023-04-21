
import * as crypto from 'crypto';


// False Positive Rate = (1 - e^(-kn/l))^k

export class PrivacyPreservingTokenizer {
  bloomFilterLength: number;
  numberOfHashFunctions: number;
  eta: number; // Probability of *not* flipping a bit

  constructor(bloomFilterLength: number, numberOfHashFunctions: number, privacyBudget: number) {
    this.bloomFilterLength = bloomFilterLength;
    this.numberOfHashFunctions = numberOfHashFunctions;
    this.eta = 1 / (1 + Math.exp(privacyBudget));
  }

  tokenize(fields: string[]): Uint8Array {
    // Initialize bloom filter
    let bf = new Uint8Array(this.bloomFilterLength).fill(0);

    // Insert each field into the bloom filter
    fields.reduce(this.insert, bf);

    // Apply differential privacy
    this.differentialPrivacy(bf);

    return bf;
  }

  /**************************/
  /* Bloom filter functions */
  /**************************/

  private insert(bf: Uint8Array, field: string): Uint8Array {
    this.hashes(field).map(this.hashIndex).forEach(i => bf[i] = 1);
    return bf;
  }

  private hashIndex(hexHash: string): number {
    return Number("0x" + hexHash.slice(-8)) % this.bloomFilterLength;
  }

  private hashes(field: string): string[] {
    return [...Array(this.numberOfHashFunctions).keys()].map(i => this.hash(field, i));
  }

  private hash(field: string, hashIndex: number): string {
    field += "#" + hashIndex.toString();
    return this.nodeHash(field);
  }

  private nodeHash(field: string): string {
    return crypto.createHash('sha256').update(field).digest('hex');
  }

  // TODO: in order to use this, we need to make everything async
  /*
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
  */

  /************************/
  /* Differential privacy */
  /************************/

  private differentialPrivacy(bf: Uint8Array): Uint8Array {
    return bf.map(this.diffuseBit);
  }

  private diffuseBit(bit: number): number {
    return this.random() <= this.eta ? bit : 1 - bit;
  }

  private random(): number {
    return this.mathRandom();
  }

  private mathRandom(): number {
    return Math.random();
  }

  private cryptoRandom(): number {
    let array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / 0xffffffff;
  }
}