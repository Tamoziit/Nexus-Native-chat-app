import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export function generateIdentityKeyPair() {
    const keyPair = nacl.box.keyPair();

    return {
        publicKey: naclUtil.encodeBase64(keyPair.publicKey),
        privateKey: naclUtil.encodeBase64(keyPair.secretKey)
    };
}

export function encryptMessage(
    secretKey: string,
    peerPublicKey: string,
    message: string
) {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const cipher = nacl.box(
        naclUtil.decodeUTF8(message),
        nonce,
        naclUtil.decodeBase64(peerPublicKey),
        naclUtil.decodeBase64(secretKey)
    )

    return {
        cipherText: naclUtil.encodeBase64(cipher),
        nonce: naclUtil.encodeBase64(nonce)
    };
}

export function decryptMessage(
    secretKey: string,
    peerPublicKey: string,
    cipherText: string,
    nonce: string
) {
    const decrypted = nacl.box.open(
        naclUtil.decodeBase64(cipherText),
        naclUtil.decodeBase64(nonce),
        naclUtil.decodeBase64(peerPublicKey),
        naclUtil.decodeBase64(secretKey)
    );

    if (!decrypted) return null;
    return naclUtil.encodeUTF8(decrypted);
}