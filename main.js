// Copyright (c) 2020 Thatguyjs All Rights Reserved.


const input = document.getElementById('input');
const equals = document.getElementById('equals');


const Main = {

	// Input area & equals button
	input: document.getElementById('input'),
	equals: document.getElementById('equals'),


	// Initialize
	init: function() {
		this.input.focus();

		this.input.addEventListener('focusout', () => {
			this.input.focus();
		});

		this.equals.addEventListener('click', () => {
			this.calculate();
		});

		window.addEventListener('keydown', (event) => {
			if(event.key === 'Enter') this.calculate();
		});
	},


	// Run a calculation
	calculate: function() {
		if(!input.value.length) return;

		const result = Calculator.eval(this.input.value);

		if(!result.error) this.input.value = result.value.toString();
		else this.input.value = Calculator.errorMessage(result.error);
	}

};
