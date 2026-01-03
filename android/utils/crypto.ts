import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export function generateIdentityKeyPair() {
    const keyPair = nacl.box.keyPair();

    return {
        publicKey: naclUtil.encodeBase64(keyPair.publicKey),
        privateKey: naclUtil.encodeBase64(keyPair.secretKey)
    };
}

export function deriveSharedSecret(
    myPrivateKey: string,
    friendPublicKey: string
) {
    return nacl.box.before(
        naclUtil.decodeBase64(friendPublicKey),
        naclUtil.decodeBase64(myPrivateKey)
    );
}

export function encryptMessage(
    message: string,
    sharedSecret: Uint8Array
) {
    const nonce = nacl.randomBytes(24);
    const cipher = nacl.box.after(
        naclUtil.decodeUTF8(message),
        nonce,
        sharedSecret
    );

    return {
        cipherText: naclUtil.encodeBase64(cipher),
        nonce: naclUtil.encodeBase64(nonce)
    };
}

export function decryptMessage(
    cipherText: string,
    nonce: string,
    sharedSecret: Uint8Array
) {
    const decrypted = nacl.box.open.after(
        naclUtil.decodeBase64(cipherText),
        naclUtil.decodeBase64(nonce),
        sharedSecret
    );

    if (!decrypted) return null;
    return naclUtil.encodeUTF8(decrypted);
}