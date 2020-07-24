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

		let equation = document.createElement('h2');
		equation.innerText = node.equation;

		let result = document.createElement('p');
		result.innerText = node.result.value;

		container.appendChild(equation);
		container.appendChild(result);

		container.addEventListener('click', () => {
			input.value = node.equation;
		});

		this._element.insertBefore(container, this._element.children[0]);
	},


	// Load results from storage
	load: function() {
		chrome.storage.local.get(['active', 'history'], (data) => {
			this.active = data['active'] || '';
			input.value = this.active;

			this.stored = data['history'] || [];
			this.last = this.stored[0] || {};

			let length = this.stored.length;

			for(let s = length - 1; s >= 0; s--) {
				this._addEquation(this.stored[s]);
			}
		});
	},


	// Store a new result
	store: function(equation, result) {
		if(this.last.equation === equation) return;

		this.last = { equation, result };
		this._addEquation(this.last);

		while(this._element.children.length > 25) {
			this._element.removeChild(this._element.lastChild);
		}

		this.stored.unshift(this.last);
		while(this.stored.length > 25) this.stored.pop();

		chrome.storage.local.set({ history: this.stored });
	},


	// Store the active equation
	storeActive: function(string) {
		this.active = string;

		chrome.storage.local.set({ active: this.active });
	},


	// Clear history
	clear: function() {
		chrome.storage.local.set({ history: [] });
	}

};
