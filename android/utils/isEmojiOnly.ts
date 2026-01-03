const getEmojiCount = (text: string) => {
    const cleaned = text.trim();

    // Matching all emojis
    const emojis = cleaned.match(
        /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu
    );

    // Rejecting texts containing non-emoji chars
    const nonEmoji = cleaned.replace(
        /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu,
        ''
    );

    if (nonEmoji.length > 0) return 0;

    return emojis?.length ?? 0;
}

export default getEmojiCount;