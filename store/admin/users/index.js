import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import Response from '@thzero/library_common/response';

const store = {
	state: {
		users: null
	},
	actions: {
		async deleteAdminUser(correlationId, id) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_USERS);
			const response = await service.delete(correlationId, id);
			this.$logger.debug('store.admin.users', 'deleteAdminUser', 'response', response);
			if (Response.hasSucceeded(response)) {
				commit('deleteAdminUser', { correlationId: correlationId, id: id });
				this.users = LibraryCommonUtility.deleteArrayById(this.users, id);
				LibraryClientUtility.$store.dispatcher.users.delete(correlationId, id);
			}
			return response;
		},
		async searchAdminUsers(correlationId, params) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_USERS);
			const response = await service.search(correlationId, params);
			this.$logger.debug('store.admin.users', 'searchAdminUsers', 'response', response);
			if (Response.hasSucceeded(response)) {
				const list = response.success && response.results ? response.results.data : null;
				this.$logger.debug('store.admin.users', 'setAdminUsersListing', 'list.a', list, correlationId);
				this.$logger.debug('store.admin.users', 'setAdminUsersListing', 'list.b', this.users, correlationId);
				this.users = list;
				this.$logger.debug('store.admin.users', 'setAdminUsersListing', 'list.c', this.users, correlationId);
			}
		},
		async updateAdminUser(correlationId, item) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_USERS);
			const response = await service.update(correlationId, item);
			this.$logger.debug('store.admin.users', 'updateAdminUser', 'response', response);
			if (Response.hasSucceeded(response)) {
				const item = response.results;
				this.$logger.debug('store.admin.users', 'setAdminUsers', 'items.a', item, correlationId);
				this.$logger.debug('store.admin.users', 'setAdminUsers', 'items.b', this.users, correlationId);
				this.users = LibraryCommonUtility.updateArrayById(this.users, item);
				this.$logger.debug('store.admin.users', 'setAdminUsers', 'items.c', this.users, correlationId);
			}
			return response;
		}
	},
	dispatcher: {
		async deleteAdminUser(correlationId, id) {
			return await LibraryClientUtility.$store.deleteAdminUser(correlationId, id);
		},
		async searchAdminUsers(correlationId, params) {
			await LibraryClientUtility.$store.searchAdminUsers(correlationId, params);
		},
		async updateAdminUser(correlationId, item) {
			return await LibraryClientUtility.$store.updateAdminUser(correlationId, item);
		}
	}
};

export default store;
