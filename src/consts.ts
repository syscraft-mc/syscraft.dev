export const SITE = {
	title: 'Syscraft',
	description: 'A community for Minecraft server admins, developers and hosts.',
	defaultLanguage: 'en-us',
} as const;

export const OPEN_GRAPH = {
	image: {
		src: '/default-og-image.jpg',
		alt:
			'syscraft logo with a dark blue background,' +
			' with text saying "A community for Minecraft server admins, developers and hosts"',
	},
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/syscraft-mc/syscraft.dev/blob/main`;

export const COMMUNITY_INVITE_URL = `https://discord.gg/Dx6SSkx`;

export const REDDIT_URL = `https://reddit.com/r/syscraft`;

export const GITHUB_ORG_URL = `https://github.com/syscraft-mc`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'syscraft',
	appId: 'G3UIT7DZCW',
	apiKey: 'dc2aa8b99cc010d3ae8c61e6d5139a39',
};

export type Sidebar = Record<
	(typeof KNOWN_LANGUAGE_CODES)[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	en: {
		'Admin': [
			{ text: 'Starter Server', link: 'en/starter-server' },
			{ text: 'Getting Players', link: 'en/getting-players' },
			{ text: 'Choosing Server Software', link: 'en/server-software' },
			{ text: 'Recommended Plugins', link: 'en/recommended-plugins' },
			{ text: 'Server Security Tips', link: 'en/server-security' },
		],
		// 'Develop': [
		//
		// ],
		'Host': [
			{ text: 'Choosing A Server Host', link: 'en/server-hosting' },
			{ text: 'Improving Server Performance', link: 'en/server-performance' },
		],
	},
};
