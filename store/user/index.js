import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';
import VueUtility from '@thzero/library_client_vue3/utility';

import Response from '@thzero/library_common/response';

const store = {
	state: () => ({
		authCompleted: false,
		claims: null,
		isLoggedIn: false,
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
			settings = VueUtility.settings().mergeUser(params.correlationId, settings);
			const response = await service.updateSettings(params.correlationId, this.user, settings);
			this.$logger.debug('store.user', 'setUserSettings', 'response', response);
			if (Response.hasSucceeded(response) && response.results)
				this.setUser(correlationId, response.results);
			return response;
		},
		async setUserSettings2(correlationId, settings) {
			const service = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_USER);
			settings = VueUtility.settings().mergeUser(params.correlationId, settings);
			const response = await service.updateSettings(params.correlationId, this.user, settings);
			this.$logger.debug('store.user', 'setUserSettings', 'response', response);
			if (Response.hasSucceeded(response) && response.results) {
				// commit('setUserSettings', { correlationId: params.correlationId, user: response.results });
				const user = response.results;
				user.settings = VueUtility.settings().mergeUser(correlationId, user.settings);
				this.user = user;
			}
			return response;
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
	dispatcher: {
		async refreshUserSettings(correlationId) {
			// await GlobalUtility.$store.dispatch('refreshUserSettings', correlationId);
			await GlobalUtility.$store.user.refreshUserSettings(correlationId);
		},
		async resetUser(correlationId) {
			// await GlobalUtility.$store.dispatch('resetUser', correlationId);
			await GlobalUtility.$store.user.resetUser(correlationId);
		},
		async setAuthCompleted(correlationId, authCompleted) {
			// await GlobalUtility.$store.dispatch('setUserAuthCompleted', { correlationId: correlationId, authCompleted: authCompleted });
			await GlobalUtility.$store.user.setUserAuthCompleted(correlationId, authCompleted);
		},
		async setClaims(correlationId, claims) {
			// await GlobalUtility.$store.dispatch('setUserClaims', { correlationId: correlationId, authCompleted: claims });
			await GlobalUtility.$store.user.setUserClaims(correlationId, claims);
		},
		async setLoggedIn(correlationId, isLoggedIn) {
			// await GlobalUtility.$store.dispatch('setUserLoggedIn', { correlationId: correlationId, isLoggedIn: isLoggedIn });
			await GlobalUtility.$store.user.setUserLoggedIn(correlationId, isLoggedIn);
		},
		async setUserSettings(correlationId, settings) {
			// return await GlobalUtility.$store.dispatch('setUserSettings', { correlationId: correlationId, settings: settings });
			await GlobalUtility.$store.user.setUserSettings(correlationId, settings);
		},
		async setTokenResult(correlationId, tokenResult) {
			// await GlobalUtility.$store.dispatch('setUserTokenResult', { correlationId: correlationId, tokenResult: tokenResult });
			await GlobalUtility.$store.user.setUserTokenResult(correlationId, tokenResult);
		},
		async setUser(correlationId, user) {
			// await GlobalUtility.$store.dispatch('setUser', { correlationId: correlationId, user: user });
			await GlobalUtility.$store.user.setUser(correlationId, user);
		}
	}
};

export default store;
