# anonymizer
Code for the anonymization algorithm


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