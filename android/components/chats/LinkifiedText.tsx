import { Linking, Text, TextStyle } from 'react-native';

const URL_REGEX =
	/((https?:\/\/[^\s]+)|(www\.[^\s]+)|([\w-]+\.(ai|io|com|org|net|dev|app|in|co)(\/[^\s]*)?))/gi;

const LinkifiedText = (
	text: string,
	textStyle: TextStyle,
	linkStyle: TextStyle
) => {
	const elements: React.ReactNode[] = [];
	let lastIndex = 0;

	for (const match of text.matchAll(URL_REGEX)) {
		const matchText = match[0];
		const start = match.index ?? 0;

		if (start > lastIndex) {
			elements.push(
				<Text key={lastIndex} style={textStyle}>
					{text.slice(lastIndex, start)}
				</Text>
			);
		}

		let url = matchText;
		if (!url.startsWith('http')) {
			url = `https://${url}`;
		}

		// Link text
		elements.push(
			<Text
				key={start}
				style={linkStyle}
				onPress={() => Linking.openURL(url)}
				suppressHighlighting
			>
				{matchText}
			</Text>
		);

		lastIndex = start + matchText.length;
	}

	// Remaining text after last link
	if (lastIndex < text.length) {
		elements.push(
			<Text key={lastIndex + '-end'} style={textStyle}>
				{text.slice(lastIndex)}
			</Text>
		);
	}

	return elements;
}

export default LinkifiedText;