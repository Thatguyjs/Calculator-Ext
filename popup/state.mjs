// Manages application state (input, button state)

import Buttons from "./buttons.mjs";
import Input from "./input.mjs";


const State = {
	storage: ('chrome' in window) ? chrome.storage : console.error("TODO: load Storage API"),
	input: null,
	angle_toggle: null,


	init() {
		Buttons.on_angle_mode_change(angle => {
			this.storage.local.set({ angle });
		});

		Input.on('update', active => {
			this.storage.local.set({ active });
		});
	},

	// Load state when the popup is initially loaded
	async load_state() {
		return new Promise(res => {
			this.storage.local.get(['active', 'angle'], data => {
				Input.value = data.active ?? ''; // Directly set this, it doesn't need to be saved
				this.angle_toggle.setAttribute('data-mode', data.angle ?? 'Rad');

				res();
			});
		});
	},


	set_elements(angle_toggle) {
		this.angle_toggle = angle_toggle;
	}
};


export default State;
