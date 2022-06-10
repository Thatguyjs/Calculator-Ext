// Manage the calculator input field, so all input can be processed

import { el } from "./common/element.mjs";

import HistoryStorage from "./history/storage.mjs";


const Input = {
	element: el('#input'),
	_listeners: {},

	// Used for history navigation by arrow keys
	state: {
		index: 0, // 0 = current, 1..25 = history entry
		current: "" // Current calculator value
	},


	init() {
		this.element.focus();

		// Keep the input field focused
		window.addEventListener('click', ev => {
			if(ev.target !== this.element)
				this.element.focus();
		});

		// Go back / forward in history
		window.addEventListener('keydown', async ev => {
			if(ev.code === 'ArrowUp') {
				this.state.index = Math.min(await HistoryStorage.count(), this.state.index + 1);

				if(this.state.index > 0) {
					this.set_value((await HistoryStorage.at(this.state.index - 1)).input);
				}
			}
			else if(ev.code === 'ArrowDown') {
				this.state.index = Math.max(0, this.state.index - 1);

				if(this.state.index > 0)
					this.set_value((await HistoryStorage.at(this.state.index - 1)).input);
				else
					this.set_value(this.state.current);
			}
		});

		this.element.addEventListener('input', () => {
			this.emit('update', this.element.value);
		});

		this.on('update', value => {
			if(this.state.index === 0)
				this.state.current = value;
		});
	},


	set_value(value="") {
		this.element.value = value;
		this.emit('update', this.element.value);
	},

	get value() {
		return this.element.value;
	},

	set value(value) {
		this.set_value(value);
	},

	append(value) {
		this.set_value(this.value + value);
	},


	on(event, callback) {
		if(!(event in this._listeners))
			this._listeners[event] = [];

		this._listeners[event].push(callback);
	},

	emit(event, ...args) {
		for(let l in this._listeners[event])
			this._listeners[event][l](...args);
	}
};


export default Input;
