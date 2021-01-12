// Copyright (c) 2020 Thatguyjs All Rights Reserved.


const CalcHistory = {

	// History button & entries
	_button: document.getElementById('history-toggle'),
	_list: document.getElementById('history-entries'),


	// Active equation
	active: "",


	// Last result
	last: { equation: "", result: "", error: 0 },


	// All stored results
	stored: [],


	// Add an equation to the entries list
	_addEquation: function(node) {
		let container = document.createElement('div');

		let equation = document.createElement('span');
		equation.className = 'history-equation';
		equation.innerText = node.equation;

		let result = document.createElement('span');
		result.className = 'history-result';
		result.innerText = node.result;

		container.appendChild(equation);
		container.appendChild(document.createElement('div'));
		container.appendChild(result);

		equation.addEventListener('click', () => {
			input.value = node.equation;
		});

		result.addEventListener('click', () => {
			input.value = node.result;
		});

		// container.addEventListener('click', () => {
		// 	input.value = node.equation;
		// });

		this._list.insertBefore(container, this._list.children[0]);
	},


	// Initialize calculator history
	init: function() {
		this.load();

		input.addEventListener('input', () => {
			if(input.value !== this.active) {
				chrome.storage.local.set({ 'active': input.value });
				this.active = input.value;
			}
		});

		this._button.addEventListener('click', () => {
			this._list.classList.toggle('hidden');
		});
	},


	// Load results from storage
	load: function() {
		chrome.storage.local.get(['active', 'history', 'angle'], (data) => {
			this.active = data.active || '';
			input.value = this.active;

			Buttons.setAngleMode(data['angle'] || 'degrees');

			this.stored = data.history || [];
			this.last = this.stored[0] || {};

			let length = this.stored.length;

			for(let s = length - 1; s >= 0; s--) {
				this._addEquation(this.stored[s]);
			}
		});
	},


	// Store a new equation
	store: function(equation, result) {
		if(this.last.equation === equation || equation === result) return;

		chrome.storage.local.set({ 'active': result });
		this.active = result;

		this.last = { equation, result };
		this._addEquation(this.last);

		while(this._list.children.length > 25) {
			this._list.removeChild(this._list.lastChild);
		}

		this.stored.unshift(this.last);
		while(this.stored.length > 25) this.stored.pop();

		chrome.storage.local.set({ history: this.stored });
	},


	// Store the selected angle mode
	storeAngleMode: function(mode) {
		chrome.storage.local.set({ angle: mode });
	},


	// Clear history
	clear: function() {
		chrome.storage.local.set({ history: [] });
	}

};
