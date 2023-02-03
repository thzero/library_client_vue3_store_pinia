import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryClientVueUtility from '@thzero/library_client_vue3/utility';

import Response from '@thzero/library_common/response';

const store = {
	pluginPersistPaths: {
		persist: [
			'user'
		]
	},
	state: () => ({
		authCompleted: false,
		claims: null,
		isLoggedIn: false,
		theme: 'defaultTheme',
		token: null,
		tokenResult: null,
		user: null
	}),
	actions: {
		async refreshUserSettings(correlationId) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_USER);
			const response = await service.refreshSettings(correlationId, this.user);
			this.$logger.debug('store.user', 'refreshUserSettings', 'response', response);
			if (Response.hasSucceeded(response) && response.results)
				this.setUser(response.results);
			return response;
		},
		async resetUser(correlationId) {
			this.$patch({
				claims: null,
				isLoggedIn: false,
				token: null,
				tokenResult: null,
				user: null
			});
		},
		async setUserAuthCompleted(correlationId, authCompleted) {
			this.authCompleted = authCompleted;
		},
		async setUserClaims(correlationId, claims) {
			this.claims = claims;
		},
		async setUserLoggedIn(correlationId, isLoggedIn) {
			this.isLoggedIn = isLoggedIn;
		},
		async setUserSettings(correlationId, settings) {
			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_USER);
			settings = LibraryClientVueUtility.settings().mergeUser(correlationId, settings);
			const response = await service.updateSettings(correlationId, this.user, settings);
			this.$logger.debug('store.user', 'setUserSettings', 'response', response);
			if (Response.hasSucceeded(response) && response.results)
				this.user = response.results;
			return response;
		},
		async setUserTheme(correlationId, isLoggedIn) {
			this.theme = theme;
		},
		async setUserTokenResult(correlationId, tokenResult) {
			this.$patch({
				tokenResult: null,
				token: tokenResult ? tokenResult.token : null
			});
		},
		async setUser(correlationId, user) {
			if (user)
				user.settings = LibraryClientVueUtility.settings().mergeUser(correlationId, user.settings);
			this.user = user;
		}
	},
	getters: {
		getUser (correlationId) {
			return LibraryClientUtility.$store.user.user;
		},
		getUserTheme (correlationId) {
			return LibraryClientUtility.$store.theme;
		},
		getUserSettings(correlationId) {
			if (LibraryClientUtility.$store.user.user && LibraryClientUtility.$store.user.user.settings) // TODO: userRef
				return LibraryClientUtility.$store.user.user.settings;

			const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_USER);
			return service.initializeSettings();
		}
	},
	dispatcher: {
		async refreshUserSettings(correlationId) {
			return await LibraryClientUtility.$store.user.refreshUserSettings(correlationId);
		},
		async resetUser(correlationId) {
			await LibraryClientUtility.$store.user.resetUser(correlationId);
		},
		async setUserAuthCompleted(correlationId, authCompleted) {
			await LibraryClientUtility.$store.user.setUserAuthCompleted(correlationId, authCompleted);
		},
		async setUserClaims(correlationId, claims) {
			await LibraryClientUtility.$store.user.setUserClaims(correlationId, claims);
		},
		async setUserLoggedIn(correlationId, isLoggedIn) {
			await LibraryClientUtility.$store.user.setUserLoggedIn(correlationId, isLoggedIn);
		},
		async setUserSettings(correlationId, settings) {
			return await LibraryClientUtility.$store.user.setUserSettings(correlationId, settings);
		},
		async setUserTheme(correlationId, theme) {
			await LibraryClientUtility.$store.user.setUserTheme(correlationId, theme);
		},
		async setUserTokenResult(correlationId, tokenResult) {
			await LibraryClientUtility.$store.user.setUserTokenResult(correlationId, tokenResult);
		},
		async setUser(correlationId, user) {
			await LibraryClientUtility.$store.user.setUser(correlationId, user);
		}
	}
};

export default store;
