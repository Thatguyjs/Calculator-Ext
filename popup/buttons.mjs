// Button / Key handling

import { el, els_arr } from "./common/element.mjs";
import EventEmitter from "./common/events.mjs";

import Input from "./input.mjs";

import ErrorDisplay from "./calc/errors.mjs";
import HistoryStorage from "./history/storage.mjs";


const Buttons = new class extends EventEmitter {
	constructor() {
		super();

		this.equals_btn = el('#button-equals');
		this.angle_mode_btn = el('#angle-mode');
		this.clear_btn = el('#clear');

		this.buttons = {
			modifiers: els_arr('.modifier'),
			operators: els_arr('.operator'),
			functions: els_arr('.function'),
			constants: els_arr('.constant'),
			numbers: els_arr('.number')
		};
	}


	init() {
		Input.on('update', data => {
			if(data.length === 0) {
				this.clear_btn.setAttribute('data-mode', "clear");
				this.clear_btn.innerText = "C";
			}
			else {
				this.clear_btn.setAttribute('data-mode', "clear-entry");
				this.clear_btn.innerText = "CE";
			}
		});

		this.equals_btn.addEventListener('click', () => {
			this._do_eval();
		});

		window.addEventListener('keydown', ev => {
			if(ev.code === 'Enter')
				this._do_eval();
			else if(ev.code === 'Backspace' && ev.shiftKey)
				Input.value = "";
		});

		// The 'mousedown' event feels more responsive than 'click'

		for(let btn of this.buttons.modifiers)
			btn.addEventListener('mousedown', this._click_modifier.bind(this, btn));

		for(let btn of this.buttons.operators)
			btn.addEventListener('mousedown', this._click_operator.bind(this, btn));

		for(let btn of this.buttons.functions)
			btn.addEventListener('mousedown', this._click_function.bind(this, btn));

		for(let btn of this.buttons.constants)
			btn.addEventListener('mousedown', this._click_constant.bind(this, btn));

		for(let btn of this.buttons.numbers)
			btn.addEventListener('mousedown', this._click_number.bind(this, btn));
	}


	// Only allow left clicks
	_can_click(ev) {
		if(ev.button !== 0) {
			ev.preventDefault();
			return false;
		}

		// Clear any errors
		if(ErrorDisplay.has_errors)
			ErrorDisplay.clear_display();

		return true;
	}

	async _click_modifier(button, ev) {
		if(!this._can_click(ev)) return;

		if(button.id === "angle-mode") {
			button.setAttribute('data-mode', button.getAttribute('data-mode') === "Deg" ? "Rad" : "Deg");

			this.emit('angle_toggle', this.get_angle_mode());
		}
		else if(button.innerText === "Inv") {
			button.setAttribute('data-active', button.getAttribute('data-active') === "false" ? "true" : "false");

			for(let c in this.buttons) {
				for(let btn of this.buttons[c]) {
					const inverse = btn.getAttribute('data-inverse');
					const inverse_name = btn.getAttribute('data-inverse-name');
					if(!inverse) continue;

					btn.setAttribute('data-inverse', btn.innerText);
					btn.innerText = inverse;

					let has_name = false;

					if(btn.name.length > 0) {
						btn.setAttribute('data-inverse-name', btn.name);
						btn.name = "";
						has_name = true;
					}

					if(inverse_name) {
						btn.name = inverse_name;

						if(!has_name)
							btn.removeAttribute('data-inverse-name');
					}
				}
			}
		}
		else if(button.getAttribute('data-mode') === "clear-entry") {
			Input.value = Input.value.slice(0, -1);
		}
		else if(button.getAttribute('data-mode') === "clear") {
			Input.value = "";
		}
		else if(button.innerText === "Ans") {
			const last = await HistoryStorage.last();
			if(last.result.errors.length > 0) return; // Don't add the last entry if there were errors

			Input.value += last.result.values.join(', ');
		}
	}

	_click_operator(button, ev) {
		if(!this._can_click(ev)) return;

		Input.append(button.name || button.innerText);
	}

	_click_function(button, ev) {
		if(!this._can_click(ev)) return;

		Input.append((button.name || button.innerText) + '(');
	}

	_click_constant(button, ev) {
		if(!this._can_click(ev)) return;

		Input.append(button.name);
	}

	_click_number(button, ev) {
		if(!this._can_click(ev)) return;

		Input.append(button.innerText);
	}


	// Called when 'Enter' is pressed or the Equals button is clicked
	_do_eval() {
		this.emit('eval', Input.value);

		this.clear_btn.setAttribute('data-mode', "clear");
		this.clear_btn.innerText = "C";
	}


	get_angle_mode(fallback="Rad") {
		return this.angle_mode_btn?.getAttribute('data-mode') ?? fallback;
	}
}();


Buttons.init();
export default Buttons;
