import LibraryClientConstants from '@thzero/library_client/constants';
import LibraryClientUtility from '@thzero/library_client/utility/index';

import Response from '@thzero/library_common/response';

import BaseStore from '../store/index';

const K = LibraryClientConstants.InjectorKeys;
const ok = Response.success;

// Stub services for every service the store and its modules reach for.
export const createServices = () => ({
	[K.SERVICE_LOGGER]: { debug() {}, error() {}, exception() {} },
	[K.SERVICE_SETTINGS]: { mergeUser: (correlationId, settings) => ({ merged: true, ...(settings ?? {}) }) },
	[K.SERVICE_PLANS]: { plans: async (correlationId) => ok(correlationId, { data: [ { id: 'p1' } ] }) },
	[K.SERVICE_USER]: { refreshSettings: async (correlationId) => ok(correlationId, { id: 'u1', name: 'refreshed', settings: { a: 1 } }) },
	[K.SERVICE_NEWS]: { latest: async (correlationId) => ok(correlationId, { data: [ { id: 'n1' }, { id: 'n2' } ] }) },
	[K.SERVICE_ADMIN_NEWS]: {
		search: async (correlationId) => ok(correlationId, { data: [ { id: 'n1', title: 'one' }, { id: 'n2', title: 'two' } ] }),
		create: async (correlationId, item) => ok(correlationId, { ...item, id: 'n3' }),
		update: async (correlationId, item) => ok(correlationId, { ...item }),
		delete: async (correlationId) => ok(correlationId)
	},
	[K.SERVICE_ADMIN_USERS]: {
		search: async (correlationId) => ok(correlationId, { data: [ { id: 'u1', name: 'a' }, { id: 'u2', name: 'b' } ] }),
		update: async (correlationId, item) => ok(correlationId, { ...item }),
		delete: async (correlationId) => ok(correlationId)
	}
});

// A store with no persistence plugin; persistence needs browser storage and is
// not what these tests are about.
export class TestStore extends BaseStore {
	_initPluginPersistType() {
		return BaseStore.PersistanceTypeOverride;
	}

	_initPluginPersistOverride() {
		return () => {};
	}

	_initStoreConfig() {
		return { state: () => ({}), actions: {}, dispatcher: {}, getters: {} };
	}
}

// Installs the store the way the Vue plugin does. Once per test file: registering
// a module removes its dispatcher from the shared module config.
export const install = async (Clazz) => {
	LibraryClientUtility.$injector = { getService: (key) => createServices()[key] };
	const store = new Clazz();
	await store.initialize();
	const setup = store.setup();
	setup.func.install({}, setup.options);
	return LibraryClientUtility.$store;
};
