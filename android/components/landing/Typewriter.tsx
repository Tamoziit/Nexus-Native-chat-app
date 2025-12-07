import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const Typewriter = () => {
  const taglines = [
    "Connect. Instantly. Effortlessly.",
    "Built for the way you connect today.",
    "Linking people, building vibes."
  ];

  const [text, setText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // jitter
  const jitter = (base: number, offset = 15) =>
    base + Math.floor(Math.random() * offset * 2 - offset);

  useEffect(() => {
    const current = taglines[taglineIndex];

    // Fast, but with randomness
    const speed = jitter(isDeleting ? 25 : 40, 12);

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setText(current.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // small random pause before delete
          setTimeout(() => setIsDeleting(true), jitter(450, 120));
        }
      } else {
        if (charIndex > 0) {
          setText(current.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTaglineIndex((taglineIndex + 1) % taglines.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, taglineIndex]);

  return (
    <View className="items-center text-center">
      <Text className="text-xl font-arimo-bold text-accent-300">
        {text}
        <Text className="text-accent-500">|</Text>
      </Text>
    </View>
  );
};

export default Typewriter;