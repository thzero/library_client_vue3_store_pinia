import { beforeAll, describe, expect, it } from 'vitest';

import BaseStore from '../store/index';
import adminNews from '../store/admin/news/index';
import adminUsers from '../store/admin/users/index';

import { install, TestStore } from './helpers';

class TestStoreWithAdmin extends TestStore {
	_initModules(addModule) {
		return [ addModule('adminNews', adminNews), addModule('adminUsers', adminUsers) ];
	}
}

let store;
let dispatcher;

beforeAll(async () => {
	// with state as an object, registering either admin module crashed pinia
	store = await install(TestStoreWithAdmin);
	dispatcher = store.dispatcher;
});

describe('admin news', () => {
	it('registers under adminNews', () => {
		expect(store.adminNews).toBeDefined();
		expect(dispatcher.adminNews).toBeDefined();
	});

	it('searches, creates, updates and deletes', async () => {
		await dispatcher.news.getLatest('cid');
		await dispatcher.adminNews.searchAdminNews('cid', {});
		expect(store.adminNews.news.map(x => x.id)).toEqual([ 'n1', 'n2' ]);

		await dispatcher.adminNews.createAdminNews('cid', { title: 'three' });
		expect(store.adminNews.news.map(x => x.id)).toEqual([ 'n1', 'n2', 'n3' ]);

		await dispatcher.adminNews.updateAdminNews('cid', { id: 'n2', title: 'TWO' });
		expect(store.adminNews.news).toHaveLength(3);
		expect(store.adminNews.news[1].title).toBe('TWO');

		// it assigned deleteArrayById's undefined to the list
		await dispatcher.adminNews.deleteAdminNews('cid', 'n1');
		expect(store.adminNews.news.map(x => x.id)).toEqual([ 'n2', 'n3' ]);
		// and removes it from the public news list too
		expect(store.news.latest.map(x => x.id)).toEqual([ 'n2' ]);
	});

	it('keeps searchNews as an alias', async () => {
		await dispatcher.adminNews.searchNews('cid', {});
		expect(store.adminNews.news).toHaveLength(2);
	});
});

describe('admin users', () => {
	it('updates before any search has run', async () => {
		store.adminUsers.users = null;

		await dispatcher.adminUsers.updateAdminUser('cid', { id: 'u9', name: 'new' });

		expect(store.adminUsers.users).toEqual([ { id: 'u9', name: 'new' } ]);
	});

	it('searches, updates and deletes', async () => {
		await dispatcher.adminUsers.searchAdminUsers('cid', {});

		// updateArrayById was called with two arguments, so the item went in the id slot
		await dispatcher.adminUsers.updateAdminUser('cid', { id: 'u2', name: 'B' });
		expect(store.adminUsers.users).toHaveLength(2);
		expect(store.adminUsers.users[1].name).toBe('B');

		await dispatcher.adminUsers.deleteAdminUser('cid', 'u1');
		expect(store.adminUsers.users.map(x => x.id)).toEqual([ 'u2' ]);
	});
});

describe('main store', () => {
	it('requestPlans returns the plans', async () => {
		const response = await dispatcher.requestPlans('cid');

		// the plans went in the correlationId slot
		expect(response.correlationId).toBe('cid');
		expect(response.results).toEqual([ { id: 'p1' } ]);
	});
});

describe('user', () => {
	it('refreshUserSettings sets the user', async () => {
		store.user.user = { id: 'u1' };

		await dispatcher.user.refreshUserSettings('cid');

		// setUser was called without the correlationId, so the user became undefined
		expect(store.user.user).toMatchObject({ id: 'u1', name: 'refreshed' });
		expect(store.user.settings).toMatchObject({ merged: true });
	});

	it('sets and reads the theme', async () => {
		await dispatcher.user.setUserTheme('cid', 'dark');

		expect(store.user.theme).toBe('dark');
		expect(store.getters.user.getUserTheme('cid')).toBe('dark');
	});

	it('stores the token result', async () => {
		await dispatcher.user.setUserTokenResult('cid', { token: 't1', claims: { x: 1 } });

		expect(store.user.tokenResult).toMatchObject({ token: 't1' });
		expect(store.user.token).toBe('t1');
	});
});

describe('persistence config', () => {
	it('takes the app list from pick (pinia-plugin-persistedstate 4)', () => {
		const storeConfig = {};
		new TestStore()._initPluginPersistConfigSetup(BaseStore.PersistanceTypePersist, storeConfig, { key: 'k', pick: [ 'a' ] }, null, { additionalPaths: [ 'b' ] });

		expect(storeConfig.persist.pick).toEqual([ 'a', 'b' ]);
	});

	it('takes the app list from paths (pinia-plugin-persistedstate 3)', () => {
		const storeConfig = {};
		new TestStore()._initPluginPersistConfigSetup(BaseStore.PersistanceTypePersist, storeConfig, { key: 'k', paths: [ 'a' ] }, null, { additionalPaths: [ 'b' ] });

		expect(storeConfig.persist.pick).toEqual([ 'a', 'b' ]);
	});
});
