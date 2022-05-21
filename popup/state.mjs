// Manages application state (input, button state)

import Input from "./input.mjs";


const State = {
	storage: ('chrome' in window) ? chrome.storage : console.error("TODO: load Storage API"),
	input: null,
	angle_toggle: null,


	init() {
		Input.on('update', active => {
			this.storage.local.set({ active });
		});
	},

	// Load state when the popup is initially loaded
	async load_state() {
		return new Promise(res => {
			this.storage.local.get(['active', 'angle'], data => {
				Input.value = data.active;
				this.angle_toggle.setAttribute('data-mode', data.angle);

				res();
			});
		});
	},


	set_elements(angle_toggle) {
		this.angle_toggle = angle_toggle;
	}
};


export default State;
