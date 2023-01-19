import GlobalUtility from '@thzero/library_client/utility/global';

import Service from '@thzero/library_client/service/index';

class PiniaStoreService extends Service {
	get dispatcher() {
		return GlobalUtility.$store.dispatcher;
	}

	get getters() {
		return GlobalUtility.$store.getters;
	}

	get news() {
		return GlobalUtility.$store.news;
	}

	get state() {
		return GlobalUtility.$store;
	}

	get user() {
		return GlobalUtility.$store.user.user;
	}
	
	get userClaims() {
		return GlobalUtility.$store.user.claims;
	}
	
	get userToken() {
		return GlobalUtility.$store.user.token;
	}
	
	get userAuthCompleted() {
		return GlobalUtility.$store.user.authCompleted;
	}
	
	get userAuthIsLoggedIn() {
		return GlobalUtility.$store.user.isLoggedIn;
	}
	
	get userTheme() {
		return GlobalUtility.$store.user.theme;
	}
	
	get userTokenResult() {
		return GlobalUtility.$store.user.tokenResult;
	}
}

export default PiniaStoreService;
