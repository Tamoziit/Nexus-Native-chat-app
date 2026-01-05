import * as SecureStore from 'expo-secure-store';
import { decryptMessage } from './crypto';
import { DecryptMessageProps } from '@/interfaces/interfaces';

const decryptMessageOnRender = async ({
    authUser,
    isMe,
    participants,
    chat
}: DecryptMessageProps) => {
    const myPrivateKey = await SecureStore.getItemAsync('NEMESIS_PRIVATE_IDENTITY_KEY');

    if (!myPrivateKey || !authUser) return;

    const peerKey = isMe ? (participants.find(p => p._id === authUser?._id)?.publicKey) : (participants.find(p => p._id === chat.sender)?.publicKey);

    if (!peerKey) {
        console.log("Error: No public key found for user");
        return;
    }

    const plainText = decryptMessage(
        myPrivateKey,
        peerKey,
        isMe ? chat.cipherTextSender : chat.cipherTextReceiver,
        isMe ? chat.nonceSender : chat.nonceReceiver,
    );

    return plainText;
}

export default decryptMessageOnRender;