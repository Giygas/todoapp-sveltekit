import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

const app_name = 'todoapp-items';

export function load() {
	if (!browser) {
		return [];
	}

	if (!localStorage[app_name]) {
		return [];
	}

	return JSON.parse(localStorage[app_name]);
}

export const _app = writable(load());

export function save() {
	_app.update(() => {
		const app = get(_app);
		localStorage[app_name] = JSON.stringify(app);
		return app;
	});
}
