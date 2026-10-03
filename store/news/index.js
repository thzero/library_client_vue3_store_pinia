import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

const store = {
	pluginPersistPaths: {
		persist: [
			// the state key; this said 'news', which is not one, so nothing persisted
			'latest'
		]
	},
	state: () => ({
		latest: null
	}),
	actions: {
		async deleteNews(correlationId, id) {
			LibraryCommonUtility.deleteArrayById(this.latest, id);
		},
		async getLatestNews(correlationId) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_NEWS);
			const response = await service.latest(correlationId);
			this.$logger.debug('store.news', 'getLatestNews', 'response', response, correlationId);
			const latest = response.success && response.results ? response.results.data : null;
			this.$logger.debug('store.news', 'getLatestNews', 'item.a', latest, correlationId);
			this.$logger.debug('store.news', 'getLatestNews', 'item.b', this.latest, correlationId);
			this.latest = latest;
			this.$logger.debug('store.news', 'getLatestNews', 'item.c', this.latest, correlationId);
		}
	},
	dispatcher: {
		async delete(correlationId, id) {
			await LibraryClientUtility.$store.news.deleteNews(correlationId, id);
		},
		async getLatest(correlationId) {
			await LibraryClientUtility.$store.news.getLatestNews(correlationId);
		}
	}
};

export default store;
