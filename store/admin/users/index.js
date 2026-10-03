import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import Response from '@thzero/library_common/response';

// An optional module: an app registers it from its store's _initModules as
//   addModule('adminUsers', adminUsers)
// The dispatchers below and the admin components both expect that key.
const store = {
	state: () => ({
		users: null
	}),
	actions: {
		async deleteAdminUser(correlationId, id) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_USERS);
			const response = await service.delete(correlationId, id);
			this.$logger.debug('store.admin.users', 'deleteAdminUser', 'response', response, correlationId);
			// deleteArrayById removes in place and returns nothing; assigning its
			// result is what emptied the list
			if (Response.hasSucceeded(response))
				LibraryCommonUtility.deleteArrayById(this.users, id);
			return response;
		},
		async searchAdminUsers(correlationId, params) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_USERS);
			const response = await service.search(correlationId, params);
			this.$logger.debug('store.admin.users', 'searchAdminUsers', 'response', response, correlationId);
			if (Response.hasSucceeded(response)) {
				const list = response.success && response.results ? response.results.data : null;
				this.$logger.debug('store.admin.users', 'searchAdminUsers', 'list.a', list, correlationId);
				this.$logger.debug('store.admin.users', 'searchAdminUsers', 'list.b', this.users, correlationId);
				this.users = list;
				this.$logger.debug('store.admin.users', 'searchAdminUsers', 'list.c', this.users, correlationId);
			}
		},
		async updateAdminUser(correlationId, item) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_ADMIN_USERS);
			const response = await service.update(correlationId, item);
			this.$logger.debug('store.admin.users', 'updateAdminUser', 'response', response, correlationId);
			if (Response.hasSucceeded(response) && response.results) {
				this.$logger.debug('store.admin.users', 'updateAdminUser', 'items.a', response.results, correlationId);
				this.$logger.debug('store.admin.users', 'updateAdminUser', 'items.b', this.users, correlationId);
				// updateArrayById takes (array, id, object); called with two arguments
				// it put the item in the id slot and appended undefined
				this.users = LibraryCommonUtility.updateArrayByObject(this.users ?? [], response.results);
				this.$logger.debug('store.admin.users', 'updateAdminUser', 'items.c', this.users, correlationId);
			}
			return response;
		}
	},
	// module actions live on $store.adminUsers, not on the root $store
	dispatcher: {
		async deleteAdminUser(correlationId, id) {
			return await LibraryClientUtility.$store.adminUsers.deleteAdminUser(correlationId, id);
		},
		async searchAdminUsers(correlationId, params) {
			await LibraryClientUtility.$store.adminUsers.searchAdminUsers(correlationId, params);
		},
		async updateAdminUser(correlationId, item) {
			return await LibraryClientUtility.$store.adminUsers.updateAdminUser(correlationId, item);
		}
	}
};

export default store;
