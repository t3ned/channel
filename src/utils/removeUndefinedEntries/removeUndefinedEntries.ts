export const removeUndefinedEntries = <T extends Entries>(entries: T): Partial<T> => {
	for (const [key, value] of Object.entries(entries)) {
		if (typeof value === "undefined") delete entries[key];
	}

	return entries;
};

export interface Entries {
	[key: PropertyKey]: unknown;
}
