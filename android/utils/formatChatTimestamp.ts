const formatChatTimestamp = (createdAt: string | number | Date): string => {
	const date = new Date(createdAt);
	const now = new Date();

	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	const pad = (n: number) => n.toString().padStart(2, "0");

	const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

	// Today
	if (diffDays === 0) {
		return time;
	}

	// Yesterday
	if (diffDays === 1) {
		return `Yesterday, ${time}`;
	}

	// Within last week
	if (diffDays < 7) {
		return `${diffDays}d ago, ${time}`;
	}

	// Older than a week
	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1);
	const year = date.getFullYear().toString().slice(-2);

	return `${day}/${month}/${year}, ${time}`;
};

export default formatChatTimestamp;