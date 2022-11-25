import { createPinia, defineStore } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

// import adminNews from './admin/news/pinia';
// import adminUsers from './admin/users/pinia';

import news from './news';
import user from './user';

class BaseStore {
	async initialize() {
		this.pinia = createPinia();

		this._initPluginPersist();

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

					if (options.pluginPersistSetup && options.pluginPersistType && options.pluginPersistConfig && options.pluginPersistConfig['root'])
						options.pluginPersistSetup(options.pluginPersistType(), storeConfig, options.pluginPersistConfig['root'], options.pluginPersistSetupOverride);

					const storeFunc = defineStore('main', storeConfig);
					GlobalUtility.$store = storeFunc(options.pinia);
					GlobalUtility.$store.$logger = options.logger;

					// options.addModule('adminNews', adminNews, options.actionDispatcher, options.pluginPersistType(), options.pluginPersistConfig, options.pinia, logger);
					// options.addModule('adminUsers', adminUsers, options.actionDispatcher, options.pluginPersistType(), options.pluginPersistConfig, options.pinia, logger);
					options.addModule('news', news, options.actionDispatcher, options.pluginPersistType(), options.pluginPersistSetup, options.pluginPersistConfig, options.pluginPersistSetupOverride, options.pinia, logger);
					options.addModule('user', user, options.actionDispatcher, options.pluginPersistType(), options.pluginPersistSetup, options.pluginPersistConfig, options.pluginPersistSetupOverride, options.pinia, logger);
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
				pluginPersistConfig: this._initPluginPersistConfig(),
				pluginPersistSetupOverride: this._initPluginPersistConfigSetupOverride,
				pluginPersistSetup: this._initPluginPersistConfigSetup,
				pluginPersistType: this._initPluginPersistType,
				storeConfig: this._init()
			}
		};
	}

	_addModule(key, storeConfig, actionDispatcher, pluginPersistType, pluginPersistSetup, pluginPersistConfig, pluginPersistSetupOverride, pinia, logger) {
		if (pluginPersistType && pluginPersistSetup && pluginPersistConfig && pluginPersistConfig[key])
			pluginPersistSetup(pluginPersistType, storeConfig, pluginPersistConfig['root'], pluginPersistSetupOverride);
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
		if (this._initPluginPersistType() === BaseStore.PersistanceTypePersist) {
			this.pinia.use(piniaPluginPersistedState);
			return;
		}
		if (this._initPluginPersistType() === BaseStore.PersistanceTypePersist2) {
			const installPersistedStatePlugin = createPersistedStatePlugin();
			this.pinia.use((context) => installPersistedStatePlugin(context));
			return;
		}
		if (this._initPluginPersistType() === BaseStore.PersistanceTypeOverride) {
			const override = this._initPluginPersistOverride();
			if (override) {
				override(this.pinia);
				return;
			}
		}

		throw Error('Unknown persistance engine for Pinia store.');
	}

	_initPluginPersistConfig() {
		return null;
	}

	_initPluginPersistOverride() {
		return null;
	}

	_initPluginPersistType() {
		return BaseStore.PersistanceTypePersist;
	}

	_initPluginPersistConfigSetup(type, storeConfig, persistConfig, override) {
		if (type === BaseStore.PersistanceTypePersist) {
			storeConfig.persist = persistConfig;
			return;
		}
		if (type === BaseStore.PersistanceTypePersist2) {
			storeConfig.persistedState = persistConfig;
			return;
		}
		if (type === BaseStore.PersistanceTypeOverride) {
			if (override) {
				override(storeConfig, persistConfig);
				return;
			}
		}

		throw Error('Unknown persistance engine for Pinia store.');
	}

	_initPluginPersistConfigSetupOverride(storeConfig, persistConfig) {
	}

	static PersistanceTypeOverride = 'override';
	static PersistanceTypePersist = 'persist';
	static PersistanceTypePersist2 = 'persist2';
}

export default BaseStore;
