// Manage the calculator input field, so all input can be processed

import { el } from "./common/element.mjs";


const Input = {
	element: el('#input'),
	_listeners: {},


	init() {
		this.element.focus();

		// Keep the input field focused
		window.addEventListener('click', ev => {
			if(ev.target !== this.element)
				this.element.focus();
		});

		this.element.addEventListener('input', () => {
			this.emit('update', this.element.value);
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
