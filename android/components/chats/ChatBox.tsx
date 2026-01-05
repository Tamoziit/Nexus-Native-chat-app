import { useAuthContext } from '@/context/AuthContext';
import { Chat, Participant } from '@/interfaces/interfaces';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import getEmojiCount from '@/utils/isEmojiOnly';
import { useEffect, useState } from 'react';
import decryptMessageOnRender from '@/utils/decryptMessageOnRender';

interface ChatProps {
  chat: Chat;
  participants: Participant[];
}

const ChatBox = ({ chat, participants }: ChatProps) => {
  const { authUser } = useAuthContext();
  const forMe = chat.receiver === authUser?._id;
  const isMe = chat.sender === authUser?._id;
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;
    let mounted = true;

    const run = async () => {
      const plainText = await decryptMessageOnRender({
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
          style={{
            fontSize: isBigEmoji ? 36 : 16,
            lineHeight: isBigEmoji ? 42 : 22
          }}
        >
          {decryptedMessage ?? '...Error: 🔒 Encrypted...'}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default ChatBox;