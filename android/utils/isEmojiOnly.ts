const getEmojiCount = (text: string) => {
    const cleaned = text.trim();

    // Match all emojis
    const emojis = cleaned.match(
        /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu
    );

    // If text contains non-emoji chars, reject
    const nonEmoji = cleaned.replace(
        /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu,
        ''
    );

    if (nonEmoji.length > 0) return 0;

    return emojis?.length ?? 0;
}

export default getEmojiCount;