// Copyright (c) 2020 Thatguyjs All Rights Reserved.


const CalcHistory = {

	// History entries element
	_element: document.getElementById('history-entries'),


	// Active equation
	active: "",


	// Last result
	last: {},


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
		result.innerText = node.result.value;

		container.appendChild(equation);
		container.appendChild(result);

		// container.addEventListener('click', () => {
		// 	input.value = node.equation;
		// });

		this._element.insertBefore(container, this._element.children[0]);
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
	},


	// Load results from storage
	load: function() {
		chrome.storage.local.get(['active', 'history', 'angle'], (data) => {
			this.active = data.active || '';
			input.value = this.active;

			Buttons.setAngleMode(data['angle'] || 'degrees');

			console.log('load:', data.history);
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
		if(this.last.equation === equation) return;

		chrome.storage.local.set({ 'active': result });
		this.active = result;

		this.last = { equation, result };
		this._addEquation(this.last);

		while(this._element.children.length > 25) {
			this._element.removeChild(this._element.lastChild);
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
