import { describe, expect, it } from 'vitest';

import { install, TestStore } from './helpers';

describe('install', () => {
	it('works for a store that does not override _initModules', async () => {
		// _initModules returned null and install iterated it: "modules is not iterable"
		const store = await install(TestStore);

		expect(store.dispatcher.news).toBeDefined();
		expect(store.dispatcher.user).toBeDefined();
	});
});
