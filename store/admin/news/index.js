import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import Response from '@thzero/library_common/response';

const store = {
	state: {
		news: null
	},
	actions: {
		async createAdminNews(correlationId, item) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.create(correlationId, item);
			this.$logger.debug('store.admin.news', 'createAdminNews', 'response', response);
			if (Response.hasSucceeded(response)) {
				const item = response.success && response.results ? response.results : null;
				this.$logger.debug('store.admin.news', 'setAdminNews', 'items.a', item, correlationId);
				this.$logger.debug('store.admin.news', 'setAdminNews', 'items.b', this.news, correlationId);
				this.news = LibraryCommonUtility.updateArrayById(this.news, item);
				this.$logger.debug('store.admin.news', 'setAdminNews', 'items.c', this.news, correlationId);
			}
			return response;
		},
		async deleteAdminNews(correlationId, id) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.delete(correlationId, id);
			this.$logger.debug('store.admin.news', 'deleteAdminNews', 'response', response);
			if (Response.hasSucceeded(response)) {
				this.news = LibraryCommonUtility.deleteArrayById(this.news, id);
				LibraryClientUtility.$store.dispatcher.news.delete(correlationId, id);
			}
			return response;
		},
		async searchAdminNews(correlationId, params) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.search(correlationId, params);
			this.$logger.debug('store.admin.news', 'searchAdminNews', 'response', response);
			const list = response.success && response.results ? response.results.data : null;
			this.$logger.debug('store.admin.news', 'setAdminNewsListing', 'list.a', list, correlationId);
			this.$logger.debug('store.admin.news', 'setAdminNewsListing', 'list.b', this.news, correlationId);
			this.news = list;
			this.$logger.debug('store.admin.news', 'setAdminNewsListing', 'list.c', this.news, correlationId);
		},
		async updateAdminNews(correlationId, item) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_NEWS);
			const response = await service.update(correlationId, item);
			this.$logger.debug('store.admin.news', 'updateAdminNews', 'response', response);
			if (Response.hasSucceeded(response)) {
				const item = response.success && response.results ? response.results : null;
				this.$logger.debug('store.admin.news', 'setAdminNews', 'items.a', item, correlationId);
				this.$logger.debug('store.admin.news', 'setAdminNews', 'items.b', this.news, correlationId);
				this.news = LibraryCommonUtility.updateArrayById(this.news, item);
				this.$logger.debug('store.admin.news', 'setAdminNews', 'items.c', this.news, correlationId);
			}
			return response;
		}
	},
	dispatcher: {
		async createAdminNews(correlationId, item) {
			return await LibraryClientUtility.$store.createAdminNews(correlationId, item);
		},
		async deleteAdminNews(correlationId, id) {
			return await LibraryClientUtility.$store.deleteAdminNews(correlationId, id);
		},
		async searchNews(correlationId, params) {
			await LibraryClientUtility.$store.searchAdminNews(correlationId, params);
		},
		async updateAdminNews(correlationId, item) {
			return await LibraryClientUtility.$store.updateAdminNews(correlationId, item);
		}
	}
};

export default store;
