import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

const store = {
	pluginPersistPaths: {
		persist: [
			'news'
		]
	},
	state: () => ({
		latest: null
	}),
	actions: {
		async getLatestNews(correlationId) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_NEWS);
			const response = await service.latest(correlationId);
			this.$logger.debug('store.news', 'getLatestNews', 'response', response);
			// commit('setLatestNews', { correlationId: correlationId, latest: response.success && response.results ? response.results.data : null });
			const latest = response.success && response.results ? response.results.data : null;
			this.$logger.debug('store.news', 'setLatest', 'item.a', latest, correlationId);
			this.$logger.debug('store.news', 'setLatest', 'item.b', this.latest, correlationId);
			this.latest = latest;
			this.$logger.debug('store.news', 'setLatest', 'item.c', this.latest, correlationId);
		}
	},
	mutations: {
		// setLatestNews(state, params) {
		// 	this.$logger.debug('store.news', 'setLatest', 'item.a', params.latest, params.correlationId);
		// 	this.$logger.debug('store.news', 'setLatest', 'item.b', state.latest, params.correlationId);
		// 	state.latest = params.latest;
		// 	this.$logger.debug('store.news', 'setLatest', 'item.c', state.latest, params.correlationId);
		// }
	},
	dispatcher: {
		async getLatest(correlationId) {
			// await LibraryClientUtility.$store.dispatch('getLatestNews', correlationId);
			await LibraryClientUtility.$store.news.getLatestNews(correlationId);
		}
	}
};

export default store;
