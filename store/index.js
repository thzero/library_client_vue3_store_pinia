import { createPinia, defineStore } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import Response from '@thzero/library_common/response';

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
		// const logger = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_LOGGER);

		const initialStoreConfig = this._initStoreConfigBase();
		const appStoreConfig = this._initStoreConfig();
		initialStoreConfig.actions = Object.assign(initialStoreConfig.actions, appStoreConfig.actions);
		initialStoreConfig.dispatcher = Object.assign(initialStoreConfig.dispatcher, appStoreConfig.dispatcher);
		initialStoreConfig.getters = Object.assign(initialStoreConfig.getters, appStoreConfig.getters);

		const initialState = initialStoreConfig.state();
		const appState = appStoreConfig.state();
		const state = Object.assign(initialState, appState);
		initialStoreConfig.state = () => state;

		return {
			func: {
				install(app, options) {
					const storeConfig = options.storeConfig;

					options.actionGetters = storeConfig.getters;
					options.actionDispatcher = storeConfig.dispatcher;
					if (!options.actionDispatcher)
						options.actionDispatcher = {};

					const pluginPersistType = options.pluginPersistType();
					const additionalPaths = storeConfig.pluginPersistPaths ? storeConfig.pluginPersistPaths[pluginPersistType] : null;

					if (options.pluginPersistSetup && options.pluginPersistType && options.pluginPersistConfig && options.pluginPersistConfig && options.pluginPersistConfig[pluginPersistType])
						options.pluginPersistSetup(pluginPersistType, storeConfig, options.pluginPersistConfig[pluginPersistType], options.pluginPersistSetupOverride, {
							additionalPaths: additionalPaths
						});

					// if (storeConfig.pluginPersistPaths && storeConfig.pluginPersistPaths[pluginPersistType])
					// 	storeConfig[pluginPersistType].paths = [ ...storeConfig[pluginPersistType].paths, ...storeConfig.pluginPersistPaths[pluginPersistType] ];
					delete storeConfig.pluginPersistPaths;

					const storeFunc = defineStore('main', storeConfig);
					LibraryClientUtility.$store = storeFunc(options.pinia);
					//LibraryClientUtility.$store.$logger = options.logger;
					Object.defineProperty(LibraryClientUtility.$store, '$logger', {
						get() {
							if (!this._logger)
								this._logger = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_LOGGER);
							return this._logger;
						},
					  });

					const storeFuncModules = [];
					// options.addModule('adminNews', adminNews, options.actionDispatcher, pluginPersistType, options.pluginPersistConfig, options.pinia, logger);
					// options.addModule('adminUsers', adminUsers, options.actionDispatcher, pluginPersistType, options.pluginPersistConfig, options.pinia, logger);
					// storeFuncModules.push(options.addModule('news', news, options.actionDispatcher, options.actionGetters, storeConfig.persist, pluginPersistType, options.pluginPersistSetup, options.pluginPersistSetupOverride, options.pinia, logger));
					// storeFuncModules.push(options.addModule('user', user, options.actionDispatcher, options.actionGetters, storeConfig.persist, pluginPersistType, options.pluginPersistSetup, options.pluginPersistSetupOverride, options.pinia, logger));
					storeFuncModules.push(options.addModule('news', news, options.actionDispatcher, options.actionGetters, storeConfig.persist, pluginPersistType, options.pluginPersistSetup, options.pluginPersistSetupOverride, options.pinia));
					storeFuncModules.push(options.addModule('user', user, options.actionDispatcher, options.actionGetters, storeConfig.persist, pluginPersistType, options.pluginPersistSetup, options.pluginPersistSetupOverride, options.pinia));

					storeFuncModules.push(...options.initModules());

					LibraryClientUtility.$store.dispatcher = options.actionDispatcher;
					LibraryClientUtility.$store.getters = options.actionGetters;
				}
			},
			options: {
				actionDispatcher: this.actionDispatcher,
				actionGetters: this.actionGetters,
				addModule: this._addModule,
				initModules: this._initModules,
				// logger: logger,
				pinia: this.pinia,
				pluginPersistConfig: this._initPluginPersistConfig(),
				pluginPersistSetupOverride: this._initPluginPersistConfigSetupOverride,
				pluginPersistSetup: this._initPluginPersistConfigSetup,
				pluginPersistType: this._initPluginPersistType,
				storeConfig: initialStoreConfig
			}
		};
	}

	// _addModule(key, storeConfig, actionDispatcher, actionGetters, pluginPersistConfig, pluginPersistType, pluginPersistSetup, pluginPersistSetupOverride, pinia, logger) {
		_addModule(key, storeConfig, actionDispatcher, actionGetters, pluginPersistConfig, pluginPersistType, pluginPersistSetup, pluginPersistSetupOverride, pinia) {
		if (pluginPersistType && pluginPersistSetup && storeConfig.pluginPersistPaths && storeConfig.pluginPersistPaths[pluginPersistType]) {
			pluginPersistConfig = LibraryCommonUtility.cloneDeep(pluginPersistConfig);
			pluginPersistSetup(pluginPersistType, storeConfig, pluginPersistConfig, pluginPersistSetupOverride, {
				additionalPaths: storeConfig.pluginPersistPaths[pluginPersistType],
				keySuffix: `_${key}`
			});
		}
		actionDispatcher[key] = storeConfig.dispatcher;
		delete storeConfig.dispatcher;
		actionGetters[key] = storeConfig.getters;
		delete storeConfig.getters;
		delete storeConfig.pluginPersistPaths;
		const storeFunc = defineStore(key, storeConfig);
		LibraryClientUtility.$store[key] = storeFunc(pinia);
		// LibraryClientUtility.$store[key].$logger = logger;
		Object.defineProperty(LibraryClientUtility.$store[key], '$logger', {
			get() {
				if (!this._logger)
					this._logger = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_LOGGER);
				return this._logger;
			},
		});
		return { key: key, storeFunc: storeFunc };
	}

	_initModules() {
		return [];
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

	_initPluginPersistConfigSetup(type, storeConfig, persistConfig, override, options) {
		if (type === BaseStore.PersistanceTypePersist) {
			if (options && !String.isNullOrEmpty(options.keyOverride))
				persistConfig.key = options.keyOverride;
			if (options && !String.isNullOrEmpty(options.keySuffix))
				persistConfig.key += options.keySuffix;
			if (options && options.additionalPaths)
				persistConfig.pick = [ ...persistConfig.paths, ...options.additionalPaths ];
			storeConfig.persist = persistConfig;
			return;
		}
		if (type === BaseStore.PersistanceTypePersist2) {
			if (options && !String.isNullOrEmpty(options.keyOverride))
				persistConfig.key = options.keyOverride;
			if (options && !String.isNullOrEmpty(options.keySuffix))
				persistConfig.key += options.keySuffix;
			if (options && options.additionalPaths)
				persistConfig.includePaths = [ ...persistConfig.includePaths, ...options.additionalPaths ];
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

	_initStoreConfig() {
		throw new NotImplementedError();
	}

	_initStoreConfigBase() {
		return {
			pluginPersistPaths: {
				persist: [
					'openSource',
					'plans',
					'version'
				]
			},
			state: () => ({
				checksumLastUpdate: [],
				openSource: [],
				plans: [],
				version: null
			}),
			actions: {
				async initialize(correlationId) {
					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
					const response = await service.initialize(correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setPlans(correlationId, response.results.plans);
						await this.setVersion(correlationId, response.results.version);
						if (this._initialize)
							await this._initialize(correlationId, response.results);
					}
				},
				async requestOpenSource(correlationId) {
					const openSourceCheck = LibraryClientUtility.$store.openSource;
					if (openSourceCheck && Array.isArray(openSourceCheck) && openSourceCheck.length > 0)
						return Response.success(correlationId, openSourceCheck);

					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
					const response = await service.openSource(correlationId);
					this.$logger.debug('store', 'requestOpenSource', 'response', response, correlationId);
					const openSource = response.results ? response.results : null;
					if (Response.hasFailed(response))
						return response;
					await this.setOpenSource(correlationId, openSource);
					return Response.success(correlationId, openSource);
				},
				async requestPlans(correlationId) {
					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_PLANS);
					const response = await service.plans(correlationId);
					this.$logger.debug('store', 'requestPlans', 'response', response, correlationId);
					const plans = response.results ? response.results.data : [];
					if (Response.hasFailed(response))
						return response;
					await this.setPlans(correlationId, plans);
					return Response.success(plans);
				},
				async requestVersion(correlationId) {
					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_VERSION);
					const version = await service.version(correlationId);
					await this.setVersion(correlationId, version);
				},
				async setOpenSource(correlationId, openSource) {
					this.$logger.debug('store', 'setOpenSource', 'openSource.a', openSource, correlationId);
					this.$logger.debug('store', 'setOpenSource', 'openSource.b', this.openSource, correlationId);
					this.openSource = openSource;
					this.$logger.debug('store', 'setOpenSource', 'openSource.c', this.openSource, correlationId);
				},
				async setPlans(correlationId, plans) {
					this.$logger.debug('store', 'setPlans', 'plans.a', plans, correlationId);
					this.$logger.debug('store', 'setPlans', 'plans.b', this.plans, correlationId);
					this.plans = plans;
					this.$logger.debug('store', 'setPlans', 'plans.c', this.plans, correlationId);
				},
				async setVersion(correlationId, version) {
					if (!version)
						return;
					// this.$logger.debug('store', 'getVersion', 'version', version, correlationId);
					// commit('setVersion', { correlationId: correlationId, version: version });
					this.$logger.debug('store', 'setVersion', 'version', version, correlationId);
					this.version = version;
				}
			},
			getters: {
				getOpenSource(correlationId) {
					return LibraryClientUtility.$store.openSource;
				},
				getPlan(correlationId, id) {
					if (LibraryClientUtility.$store.plans == null)
						return null;
					return LibraryClientUtility.$store.plans.find(plan => plan.id === id);
				}
			},
			dispatcher: {
				async requestOpenSource(correlationId) {
					return await LibraryClientUtility.$store.requestOpenSource(correlationId);
				},
				async requestPlans(correlationId) {
					return await LibraryClientUtility.$store.requestPlans(correlationId);
				},
				async requestVersion(correlationId) {
					await LibraryClientUtility.$store.requestVersion(correlationId);
				},
				async initialize(correlationId) {
					await LibraryClientUtility.$store.initialize(correlationId);
				}
			}
		};
	}

	static PersistanceTypeOverride = 'override';
	static PersistanceTypePersist = 'persist';
	static PersistanceTypePersist2 = 'persist2';
}

export default BaseStore;
