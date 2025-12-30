function formatMessageTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();

    // Helper: strip time
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    const time = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    if (date >= startOfToday) {
        // Today
        return time;
    }

    if (date >= startOfYesterday && date < startOfToday) {
        // Yesterday
        return `Yesterday, ${time}`;
    }

    // Older
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return `${formattedDate}, ${time}`;
}

export default formatMessageTime;