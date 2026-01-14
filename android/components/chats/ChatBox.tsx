import { useAuthContext } from '@/context/AuthContext';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import getEmojiCount from '@/utils/isEmojiOnly';
import { useEffect, useState } from 'react';
import decryptMessageOnRender from '@/utils/decryptMessageOnRender';
import { ChatProps } from '@/interfaces/interfaces';
import LinkifiedText from './LinkifiedText';
import formatChatTimestamp from '@/utils/formatChatTimestamp';

const ChatBox = ({ chat, participants, onLayout, myPrivateKey }: ChatProps) => {
  const { authUser } = useAuthContext();
  const forMe = chat.receiver === authUser?._id;
  const isMe = chat.sender === authUser?._id;
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;
    let mounted = true;

    const run = async () => {
      const plainText = await decryptMessageOnRender({
        myPrivateKey,
        authUser,
        isMe,
        participants,
        chat
      });

      if (mounted) {
        setDecryptedMessage(plainText ?? null);
      }
    };
    run();

    return () => {
      mounted = false;
    };
  }, [authUser, isMe, participants, chat]);

  if (!decryptedMessage) return;

  const emojiCount = getEmojiCount(decryptedMessage);
  const isBigEmoji = emojiCount > 0 && emojiCount <= 2;

  return (
    <View
      onLayout={onLayout}
      className={`w-full flex ${forMe ? 'items-start' : 'items-end'
        } my-0.5`}
    >
      <LinearGradient
        colors={
          forMe
            ? ['#374151', '#1F2937']
            : ['#2563EB', '#1D4ED8']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className={`px-4 py-2 max-w-[75%] overflow-hidden rounded-2xl ${forMe ? 'rounded-tl-sm' : 'rounded-tr-sm'
          }`}
      >
        <Text
          className="text-gray-100 font-arimo-medium"
        >
          {LinkifiedText(
            decryptedMessage,
            {
              fontSize: isBigEmoji ? 36 : 16,
              lineHeight: isBigEmoji ? 42 : 22,
              color: '#f3f4f6'
            },
            {
              fontSize: isBigEmoji ? 36 : 16,
              lineHeight: isBigEmoji ? 42 : 22,
              color: '#bfdbfe',
              textDecorationLine: 'underline'
            }
          ) ?? '...Error: 🔒 Encrypted...'}
        </Text>
      </LinearGradient>

      <Text className='text-gray-400 text-xs mt-0.5 ml-2 mr-2'>
        {formatChatTimestamp(chat.createdAt)}
      </Text>
    </View>
  );
};

export default ChatBox;