// import { useAuthContext } from '@/context/AuthContext';
// import { Chat, Participant } from '@/interfaces/interfaces';
// import { View, Text } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import getEmojiCount from '@/utils/isEmojiOnly';
// import * as SecureStore from 'expo-secure-store';
// import { useEffect, useState } from 'react';
// import { decryptMessage, deriveSharedSecret } from '@/utils/crypto';

// interface ChatProps {
// 	chat: Chat;
// 	participants: Participant[];
// }

// const ChatBox = ({ chat, participants }: ChatProps) => {
// 	const { authUser } = useAuthContext();
// 	const forMe = chat.receiver === authUser?._id;
// 	const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

// 	useEffect(() => {
// 		const decrypt = async () => {
// 			const myPrivateKey = await SecureStore.getItemAsync('NEMESIS_PRIVATE_IDENTITY_KEY');

// 			if (!myPrivateKey || !authUser) return;

// 			const otherUserId = chat.sender === authUser._id ? chat.receiver : chat.sender;

// 			const otherParticipant = participants.find(p => p._id === otherUserId);
// 			const otherPublicKey = otherParticipant?.publicKey;

// 			if (!otherPublicKey) {
// 				console.error("No public key found for user:", otherUserId);
// 				return;
// 			}

// 			const sharedSecret = deriveSharedSecret(
// 				myPrivateKey,
// 				otherPublicKey
// 			);

// 			const plainText = decryptMessage(
// 				chat.cipherText,
// 				chat.nonce,
// 				sharedSecret
// 			);
// 			console.log(chat.sender, " to ", chat.receiver, " : ", plainText)
// 			setDecryptedMessage(plainText);
// 		};

// 		decrypt();
// 	}, [chat._id, authUser?._id, participants]);

// 	if (!decryptedMessage) return;

// 	const emojiCount = getEmojiCount(decryptedMessage);
// 	const isBigEmoji = emojiCount > 0 && emojiCount <= 2;

// 	return (
// 		<View
// 			className={`w-full flex ${forMe ? 'items-start' : 'items-end'
// 				} my-0.5`}
// 		>
// 			<LinearGradient
// 				colors={
// 					forMe
// 						? ['#374151', '#1F2937']
// 						: ['#2563EB', '#1D4ED8']
// 				}
// 				start={{ x: 0, y: 0 }}
// 				end={{ x: 0, y: 1 }}
// 				className={`px-4 py-2 max-w-[75%] overflow-hidden rounded-2xl ${forMe ? 'rounded-tl-sm' : 'rounded-tr-sm'
// 					}`}
// 			>
// 				<Text
// 					className="text-gray-100 font-arimo-medium"
// 					style={{
// 						fontSize: isBigEmoji ? 36 : 16,
// 						lineHeight: isBigEmoji ? 42 : 22
// 					}}
// 				>
// 					{decryptedMessage ?? '🔒 Encrypted'}
// 				</Text>
// 			</LinearGradient>
// 		</View>
// 	);
// };

// export default ChatBox;

// ChatBox.tsx - CORRECTED VERSION
import { useAuthContext } from '@/context/AuthContext';
import { Chat, Participant } from '@/interfaces/interfaces';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import getEmojiCount from '@/utils/isEmojiOnly';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { decryptMessage, deriveSharedSecret } from '@/utils/crypto';

interface ChatProps {
  chat: Chat;
  participants: Participant[];
}

const ChatBox = ({ chat, participants }: ChatProps) => {
  const { authUser } = useAuthContext();
  const forMe = chat.receiver === authUser?._id;
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

  useEffect(() => {
    const decrypt = async () => {
      const myPrivateKey = await SecureStore.getItemAsync('NEMESIS_PRIVATE_IDENTITY_KEY');

      if (!myPrivateKey) {
        console.log('No private key found');
        return;
      }

      // Find the OTHER person's ID (not me)
      const otherUserId = participants.find(
        p => p._id !== authUser?._id
      )?._id;

      if (!otherUserId) {
        console.log('Could not find other user');
        return;
      }

      // Get the OTHER person's public key
      const otherPublicKey = participants.find(
        p => p._id === otherUserId
      )?.publicKey;

      if (!otherPublicKey) {
        console.log('Could not find other user public key');
        return;
      }

      console.log('Decrypting message:');
      console.log('  My ID:', authUser?._id);
      console.log('  Other ID:', otherUserId);
      console.log('  Sender:', chat.sender);
      console.log('  Receiver:', chat.receiver);

      const sharedSecret = deriveSharedSecret(
        myPrivateKey,
        otherPublicKey
      );

      const plainText = decryptMessage(
        chat.cipherText,
        chat.nonce,
        sharedSecret
      );
      
      console.log(chat.sender, " to ", chat.receiver, " : ", plainText);
      setDecryptedMessage(plainText);
    };

    decrypt();
  }, [chat, participants, authUser?._id]);

  if (!decryptedMessage) return null;

  const emojiCount = getEmojiCount(decryptedMessage);
  const isBigEmoji = emojiCount > 0 && emojiCount <= 2;

  return (
    <View
      className={`w-full flex ${forMe ? 'items-start' : 'items-end'} my-0.5`}
    >
      <LinearGradient
        colors={
          forMe
            ? ['#374151', '#1F2937']
            : ['#2563EB', '#1D4ED8']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className={`px-4 py-2 max-w-[75%] overflow-hidden rounded-2xl ${
          forMe ? 'rounded-tl-sm' : 'rounded-tr-sm'
        }`}
      >
        <Text
          className="text-gray-100 font-arimo-medium"
          style={{
            fontSize: isBigEmoji ? 36 : 16,
            lineHeight: isBigEmoji ? 42 : 22
          }}
        >
          {decryptedMessage ?? '🔒 Encrypted'}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default ChatBox;