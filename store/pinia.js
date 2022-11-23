import { createPinia, defineStore } from 'pinia';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

// import adminNews from './admin/news/pinia';
// import adminUsers from './admin/users/pinia';

import news from './news/pinia';
import user from './user/pinia';

class BaseStore {
	async initialize() {
		this.pinia = createPinia();

		const pluginPersist = this._initPluginPersist();
		if (pluginPersist) {
			const installPersistedStatePlugin = createPersistedStatePlugin();
			this.pinia.use((context) => installPersistedStatePlugin(context));
		}

		return this.pinia;
	}

	setup() {
		const logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);
		return {
			func: {
				install(app, options) {
					const storeConfig = options.storeConfig;
					
					options.actionDispatcher = storeConfig.dispatcher;
					if (!options.actionDispatcher) 
						options.actionDispatcher = {};

					if (options.pluginPersist && options.pluginPersist['root'])
						storeConfig.persistedState = options.pluginPersist['root'];

					const storeFunc = defineStore('main', storeConfig);
					GlobalUtility.$store = storeFunc(options.pinia);
					GlobalUtility.$store.$logger = options.logger;

					// this._addModule('adminNews', adminNews, logger);
					// this._addModule('adminUsers', adminUsers, logger);
					options.addModule('news', news, options.actionDispatcher, options.pluginPersist, options.pinia, logger);
					options.addModule('user', user, options.actionDispatcher, options.pluginPersist, options.pinia, logger);
					options.initModules();
					GlobalUtility.$store.dispatcher = options.actionDispatcher;
				}
			},
			options: {
				actionDispatcher: this.actionDispatcher,
				addModule: this._addModule,
				initModules: this._initModules,
				logger: logger,
				pinia: this.pinia,
				pluginPersist: this._initPluginPersist(),
				storeConfig: this._init()
			}
		};
	}

	_addModule(key, storeConfig, actionDispatcher, pluginPersist, pinia, logger) {
		if (pluginPersist && pluginPersist[key])
			storeConfig.persistedState = pluginPersist[key];
		actionDispatcher[key] = storeConfig.dispatcher;
		delete storeConfig.dispatcher;
		const storeFunc = defineStore(key, storeConfig);
		GlobalUtility.$store[key] = storeFunc(pinia);
		GlobalUtility.$store[key].$logger = logger;
	}

	_init() {
		throw new NotImplementedError();
	}

	_initModules() {
		throw new NotImplementedError();
	}

	_initPluginPersist() {
		return null;
	}
}

export default BaseStore;
