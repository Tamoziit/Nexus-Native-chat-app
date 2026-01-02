import { useAuthContext } from '@/context/AuthContext';
import { Chat } from '@/interfaces/interfaces';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatProps {
  chat: Chat;
}

const ChatBox = ({ chat }: ChatProps) => {
  const { authUser } = useAuthContext();
  const forMe = chat.receiver === authUser?._id;

  return (
    <View
      className={`w-full flex ${
        forMe ? 'items-start' : 'items-end'
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
        className={`px-4 py-2 max-w-[75%] overflow-hidden rounded-2xl ${
          forMe ? 'rounded-tl-sm' : 'rounded-tr-sm'
        }`}
      >
        <Text className="text-gray-100 text-base font-arimo-medium">
          {chat.message}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default ChatBox;
