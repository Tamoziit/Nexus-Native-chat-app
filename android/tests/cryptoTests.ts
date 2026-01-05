import { deriveSharedSecret, generateIdentityKeyPair } from "../utils/crypto";

const alice = generateIdentityKeyPair();
const bob = generateIdentityKeyPair();

const s1 = deriveSharedSecret(alice.privateKey, bob.publicKey);
const s2 = deriveSharedSecret(bob.privateKey, alice.publicKey);

console.log(
    Buffer.from(s1).toString('hex') ===
    Buffer.from(s2).toString('hex')
);
