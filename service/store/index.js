import GlobalUtility from '@thzero/library_client/utility/global';

import Service from '@thzero/library_client/service/index';

class PiniaStoreService extends Service {
	get dispatcher() {
		return GlobalUtility.$store.dispatcher;
	}

	get getters() {
		return GlobalUtility.$store;
	}

	get state() {
		return GlobalUtility.$store;
	}
}

export default PiniaStoreService;
