// Manage history state & the history menu

import Input from "../input.mjs";
import HistoryStorage from "./storage.mjs";

import ErrorDisplay from "../calc/errors.mjs";


// The name "History" is already a global object
const CalcHistory = {
	popup: {
		button: null,
		dropdown: null
	},


	// Called when the current expression is evaluated, chooses whether to ignore or save the result
	async handle_result(input, result) {
		if(input === result.values.join(', ')) return;

		const last_entry = await HistoryStorage.last();
		let is_duplicate = true;

		if(input !== last_entry.input ||
			result.values.length !== last_entry.result.values.length ||
			result.errors.length !== last_entry.result.errors.length) {

			is_duplicate = false;
		}
		else {
			for(let v in result.values)
				if(result.values[v].toString() !== last_entry.result.values[v].toString()) {
					is_duplicate = false;
					break;
				}

			if(!is_duplicate) {
				for(let e in result.errors)
					if(result.errors[e].message !== last_entry.result.errors[e].message) {
						is_duplicate = false;
						break;
					}
			}
		}

		if(!is_duplicate) {
			HistoryStorage.push(input, result.values, result.errors);
			this.add_dropdown_entry(input, result);
		}
	},


	// Show / hide the history dropdown menu
	toggle_dropdown() {
		this.popup.dropdown.classList.toggle('hidden');
	},

	add_dropdown_entry(input, result) {
		const container = document.createElement('div');
		container.classList.add('history-item');

		if(result.errors.length === 0) {
			container.classList.add('history-item-ok');

			const input_elem = document.createElement('pre');
			input_elem.classList.add('history-item-input');
			input_elem.innerText = input;

			const result_elem = document.createElement('pre');
			result_elem.classList.add('history-item-result');
			result_elem.innerText = result.values.join(', ');

			container.appendChild(input_elem);
			container.appendChild(result_elem);
		}
		else {
			container.classList.add('history-item-error');

			const sections = ErrorDisplay.get_sections(input, result.errors);

			for(let s in sections) {
				const el = document.createElement('pre');
				el.classList.add('history-item-section', `history-item-section-${sections[s].type}`);
				el.innerText = sections[s].text;

				container.appendChild(el);
			}
		}

		container.addEventListener('click', this.load_to_input.bind(this, input, result));

		this.popup.dropdown.insertBefore(container, this.popup.dropdown.children[0]);

		while(this.popup.dropdown.childElementCount > 25)
			this.popup.dropdown.removeChild(this.popup.dropdown.lastChild);
	},

	// Called when the user clicks on a history entry
	load_to_input(input, result, ev) {
		ErrorDisplay.clear_display();

		if(ev.target.classList.contains('history-item-section') || ev.target.classList.contains('history-item-error')) {
			Input.value = input;

			const sections = ErrorDisplay.get_sections(input, result.errors);
			ErrorDisplay.display_sections(sections);
		}
		else if(ev.target.classList.contains('history-item-input')) {
			Input.value = input;
		}
		else if(ev.target.classList.contains('history-item-result')) {
			Input.value = result.values.join(', ');
		}
	},


	async set_element(popup) {
		this.popup.button = popup.querySelector('button');
		this.popup.dropdown = popup.querySelector('div');

		this.popup.button.addEventListener('click', this.toggle_dropdown.bind(this));

		// Load all history entries
		const items = await HistoryStorage.all();
		const item_count = items.length;

		for(let i = item_count - 1; i >= 0; i--)
			this.add_dropdown_entry(items[i].input, items[i].result);
	}
};


export default CalcHistory;
