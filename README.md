![GitHub package.json version](https://img.shields.io/github/package-json/v/thzero/library_client_vue3_store_pinia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# library_client_vue3_store_pinia

The application store for [library_client_vue3](https://github.com/thzero/library_client_vue3), on [Pinia](https://pinia.vuejs.org), with persistence through [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate).

## Requirements

### NodeJs

[NodeJs](https://nodejs.org) version 22+.

## Installation

[![NPM](https://nodei.co/npm/@thzero/library_client_vue3_store_pinia.png?compact=true)](https://npmjs.org/package/@thzero/library_client_vue3_store_pinia)

```
npm install @thzero/library_client_vue3_store_pinia
```

It installs `pinia` and `pinia-plugin-persistedstate`, and requires `@thzero/library_client`, `@thzero/library_client_vue3` and `@thzero/library_common` as peers.

## Usage

### The store

Extend `BaseStore` with the application's own state, actions, getters and dispatchers, and export the class:

```js
import BaseStore from '@thzero/library_client_vue3_store_pinia/store/index';

class AppStore extends BaseStore {
	_initStoreConfig() {
		return {
			state: () => ({
				launches: []
			}),
			actions: {
				async requestLaunches(correlationId) { /* ... */ }
			},
			getters: {
				getLaunch(id) { /* ... */ }
			},
			dispatcher: {
				async requestLaunches(correlationId) {
					return await LibraryClientUtility.$store.requestLaunches(correlationId);
				}
			}
		};
	}

	_initPluginPersistConfig() {
		return {
			persist: {
				key: '<your application>',
				storage: localStorage,
				paths: [ 'launchesSettings' ]
			}
		};
	}
}

export default AppStore;
```

Pass the class (not an instance) to `start` in `main.js`; it creates the store, installs Pinia and the persistence plugin, and makes it available as `LibraryClientUtility.$store`. Application code calls actions through `LibraryClientUtility.$store.dispatcher`.

`_initPluginPersistConfig` names the state to keep in `storage` between visits; `paths` lists the state keys. Nothing else is persisted.

### The store service

Register the store service in the application's services boot:

```js
import storeService from '@thzero/library_client_vue3_store_pinia/service/store/index';

class ServiceBoot extends RootServicesBoot {
	_initializeStore(injector) {
		return new storeService(injector);
	}
}
```

### Modules

The `news` and `user` modules are always registered: the latest news, and the signed-in user with their settings, claims and token.

The admin modules are optional. Register them by overriding `_initModules`, which receives the function that adds a module:

```js
import adminNews from '@thzero/library_client_vue3_store_pinia/store/admin/news';
import adminUsers from '@thzero/library_client_vue3_store_pinia/store/admin/users';

class AppStore extends BaseStore {
	_initModules(addModule) {
		return [
			addModule('adminNews', adminNews),
			addModule('adminUsers', adminUsers)
		];
	}
}
```

Each module's actions are on `LibraryClientUtility.$store.<key>`, and its dispatchers on `LibraryClientUtility.$store.dispatcher.<key>`. The admin components in [library_client_vue3](https://github.com/thzero/library_client_vue3) expect the keys `adminNews` and `adminUsers`.

## Development

```
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev) with a real Pinia; the `test` folder and the configuration files are not published.

## License

[MIT](license.md)
