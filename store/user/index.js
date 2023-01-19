import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';
import VueUtility from '@thzero/library_client_vue3/utility';

import Response from '@thzero/library_common/response';

const store = {
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
			const service = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);
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
			const service = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);
			settings = VueUtility.settings().mergeUser(correlationId, settings);
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
				user.settings = VueUtility.settings().mergeUser(correlationId, user.settings);
			this.user = user;
		}
	},
	getters: {
		getUser (correlationId) {
			return GlobalUtility.$store.user.user;
		},
		getUserTheme (correlationId) {
			return GlobalUtility.$store.theme;
		},
		getUserSettings(correlationId) {
			if (GlobalUtility.$store.user.user && GlobalUtility.$store.user.user.settings)
				return GlobalUtility.$store.user.user.settings;

			const service = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);
			return service.initializeSettings();
		}
	},
	dispatcher: {
		async refreshUserSettings(correlationId) {
			return await GlobalUtility.$store.user.refreshUserSettings(correlationId);
		},
		async resetUser(correlationId) {
			await GlobalUtility.$store.user.resetUser(correlationId);
		},
		async setUserAuthCompleted(correlationId, authCompleted) {
			await GlobalUtility.$store.user.setUserAuthCompleted(correlationId, authCompleted);
		},
		async setUserClaims(correlationId, claims) {
			await GlobalUtility.$store.user.setUserClaims(correlationId, claims);
		},
		async setUserLoggedIn(correlationId, isLoggedIn) {
			await GlobalUtility.$store.user.setUserLoggedIn(correlationId, isLoggedIn);
		},
		async setUserSettings(correlationId, settings) {
			return await GlobalUtility.$store.user.setUserSettings(correlationId, settings);
		},
		async setUserTheme(correlationId, theme) {
			await GlobalUtility.$store.user.setUserTheme(correlationId, theme);
		},
		async setUserTokenResult(correlationId, tokenResult) {
			await GlobalUtility.$store.user.setUserTokenResult(correlationId, tokenResult);
		},
		async setUser(correlationId, user) {
			await GlobalUtility.$store.user.setUser(correlationId, user);
		}
	}
};

export default store;
