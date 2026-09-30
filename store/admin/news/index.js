import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import Response from '@thzero/library_common/response';

// An optional module: an app registers it from its store's _initModules as
//   addModule('adminNews', adminNews)
// The dispatchers below and the admin components both expect that key.
const store = {
	state: () => ({
		news: null
	}),
	actions: {
		async createAdminNews(correlationId, item) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.create(correlationId, item);
			this.$logger.debug('store.admin.news', 'createAdminNews', 'response', response, correlationId);
			if (Response.hasSucceeded(response) && response.results) {
				this.$logger.debug('store.admin.news', 'createAdminNews', 'items.a', response.results, correlationId);
				this.$logger.debug('store.admin.news', 'createAdminNews', 'items.b', this.news, correlationId);
				// the list is null until the first search
				this.news = LibraryCommonUtility.updateArrayByObject(this.news ?? [], response.results);
				this.$logger.debug('store.admin.news', 'createAdminNews', 'items.c', this.news, correlationId);
			}
			return response;
		},
		async deleteAdminNews(correlationId, id) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.delete(correlationId, id);
			this.$logger.debug('store.admin.news', 'deleteAdminNews', 'response', response, correlationId);
			if (Response.hasSucceeded(response)) {
				// deleteArrayById removes in place and returns nothing; assigning its
				// result is what emptied the list
				LibraryCommonUtility.deleteArrayById(this.news, id);
				// and drop it from the public news list too
				await LibraryClientUtility.$store.dispatcher.news.delete(correlationId, id);
			}
			return response;
		},
		async searchAdminNews(correlationId, params) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.search(correlationId, params);
			this.$logger.debug('store.admin.news', 'searchAdminNews', 'response', response, correlationId);
			const list = response.success && response.results ? response.results.data : null;
			this.$logger.debug('store.admin.news', 'searchAdminNews', 'list.a', list, correlationId);
			this.$logger.debug('store.admin.news', 'searchAdminNews', 'list.b', this.news, correlationId);
			this.news = list;
			this.$logger.debug('store.admin.news', 'searchAdminNews', 'list.c', this.news, correlationId);
		},
		async updateAdminNews(correlationId, item) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.update(correlationId, item);
			this.$logger.debug('store.admin.news', 'updateAdminNews', 'response', response, correlationId);
			if (Response.hasSucceeded(response) && response.results) {
				this.$logger.debug('store.admin.news', 'updateAdminNews', 'items.a', response.results, correlationId);
				this.$logger.debug('store.admin.news', 'updateAdminNews', 'items.b', this.news, correlationId);
				this.news = LibraryCommonUtility.updateArrayByObject(this.news ?? [], response.results);
				this.$logger.debug('store.admin.news', 'updateAdminNews', 'items.c', this.news, correlationId);
			}
			return response;
		}
	},
	// module actions live on $store.adminNews, not on the root $store
	dispatcher: {
		async createAdminNews(correlationId, item) {
			return await LibraryClientUtility.$store.adminNews.createAdminNews(correlationId, item);
		},
		async deleteAdminNews(correlationId, id) {
			return await LibraryClientUtility.$store.adminNews.deleteAdminNews(correlationId, id);
		},
		async searchAdminNews(correlationId, params) {
			await LibraryClientUtility.$store.adminNews.searchAdminNews(correlationId, params);
		},
		// the older name for searchAdminNews
		async searchNews(correlationId, params) {
			await LibraryClientUtility.$store.adminNews.searchAdminNews(correlationId, params);
		},
		async updateAdminNews(correlationId, item) {
			return await LibraryClientUtility.$store.adminNews.updateAdminNews(correlationId, item);
		}
	}
};

export default store;
