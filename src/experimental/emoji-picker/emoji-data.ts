export const EMOJI_COLUMNS = 7;

export const emojiItems = [
	{ value: "😀", label: "Grinning face", keywords: "happy smile hello" },
	{ value: "😊", label: "Smiling face", keywords: "happy blush thanks" },
	{ value: "😂", label: "Tears of joy", keywords: "laugh funny lol" },
	{ value: "🥰", label: "Smiling face with hearts", keywords: "love affection" },
	{ value: "😎", label: "Sunglasses", keywords: "cool sunny face" },
	{ value: "🤔", label: "Thinking face", keywords: "think question hmm" },
	{ value: "🥳", label: "Partying face", keywords: "celebrate birthday party" },
	{ value: "😍", label: "Heart eyes", keywords: "love face happy" },
	{ value: "😭", label: "Crying face", keywords: "sad tears" },
	{ value: "😴", label: "Sleeping face", keywords: "sleep tired rest" },
	{ value: "🤩", label: "Star eyes", keywords: "excited amazed face" },
	{ value: "🫡", label: "Saluting face", keywords: "respect yes salute" },
	{ value: "👋", label: "Waving hand", keywords: "hello goodbye hi" },
	{ value: "👍", label: "Thumbs up", keywords: "yes like good approve" },
	{ value: "👏", label: "Clapping hands", keywords: "applause bravo" },
	{ value: "🙌", label: "Raised hands", keywords: "hooray celebrate" },
	{ value: "🤝", label: "Handshake", keywords: "deal agree together" },
	{ value: "💪", label: "Flexed biceps", keywords: "strong muscle workout" },
	{ value: "❤️", label: "Red heart", keywords: "love favorite" },
	{ value: "💜", label: "Purple heart", keywords: "love favorite" },
	{ value: "💙", label: "Blue heart", keywords: "love favorite" },
	{ value: "🔥", label: "Fire", keywords: "hot lit flame" },
	{ value: "✨", label: "Sparkles", keywords: "magic shine stars" },
	{ value: "⭐", label: "Star", keywords: "favorite rating gold" },
	{ value: "🎉", label: "Party popper", keywords: "celebrate congratulations confetti" },
	{ value: "🎂", label: "Birthday cake", keywords: "celebrate dessert food" },
	{ value: "🎁", label: "Wrapped gift", keywords: "present birthday surprise" },
	{ value: "🚀", label: "Rocket", keywords: "launch ship space" },
	{ value: "💡", label: "Light bulb", keywords: "idea bright think" },
	{ value: "✅", label: "Check mark", keywords: "done complete yes success" },
	{ value: "🎯", label: "Bullseye", keywords: "target goal focus" },
	{ value: "🏆", label: "Trophy", keywords: "win award champion" },
	{ value: "🌈", label: "Rainbow", keywords: "color sky pride" },
	{ value: "☀️", label: "Sun", keywords: "sunny weather bright" },
	{ value: "🌙", label: "Crescent moon", keywords: "night sleep sky" },
	{ value: "🌱", label: "Seedling", keywords: "plant grow nature" },
	{ value: "🌸", label: "Cherry blossom", keywords: "flower spring pink" },
	{ value: "🐶", label: "Dog face", keywords: "puppy pet animal" },
	{ value: "🐱", label: "Cat face", keywords: "kitten pet animal" },
	{ value: "🦋", label: "Butterfly", keywords: "nature insect fly" },
	{ value: "🍕", label: "Pizza", keywords: "food lunch cheese" },
	{ value: "☕", label: "Hot beverage", keywords: "coffee tea drink" },
];

export function matchingEmoji(query: string) {
	const words = query.trim().toLocaleLowerCase().split(/\s+/);
	return emojiItems.filter((item) =>
		words.every((word) =>
			`${item.value} ${item.label} ${item.keywords}`.toLocaleLowerCase().includes(word),
		),
	);
}
