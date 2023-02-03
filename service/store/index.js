import LibraryClientUtility from '@thzero/library_client/utility/index';

import Service from '@thzero/library_client/service/index';

class PiniaStoreService extends Service {
	get dispatcher() {
		return LibraryClientUtility.$store.dispatcher;
	}

	get getters() {
		return LibraryClientUtility.$store.getters;
	}

	get news() {
		return LibraryClientUtility.$store.news;
	}

	get state() {
		return LibraryClientUtility.$store;
	}

	get user() {
		return LibraryClientUtility.$store.user.user;
	}
	
	get userClaims() {
		return LibraryClientUtility.$store.user.claims;
	}
	
	get userToken() {
		return LibraryClientUtility.$store.user.token;
	}
	
	get userAuthCompleted() {
		return LibraryClientUtility.$store.user.authCompleted;
	}
	
	get userAuthIsLoggedIn() {
		return LibraryClientUtility.$store.user.isLoggedIn;
	}
	
	get userTheme() {
		return LibraryClientUtility.$store.user.theme;
	}
	
	get userTokenResult() {
		return LibraryClientUtility.$store.user.tokenResult;
	}
}

export default PiniaStoreService;
