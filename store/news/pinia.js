import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

const store = {
	state: () => ({
		latest: null
	}),
	actions: {
		async getLatestNews(correlationId) {
			const service = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_NEWS);
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
			// await GlobalUtility.$store.dispatch('getLatestNews', correlationId);
			await GlobalUtility.$store.news.getLatestNews(correlationId);
		}
	}
};

export default store;
