import nacl from "tweetnacl";
import * as Random from 'expo-random';

nacl.setPRNG((x, n) => {
    const randomBytes = Random.getRandomBytes(n);
    for (let i = 0; i < n; i++) {
        x[i] = randomBytes[i];
    }
});