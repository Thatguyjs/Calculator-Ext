// Copyright (c) 2020 Thatguyjs All Rights Reserved.

import addons from "./addons.mjs";
import CalcHistory from "./history.mjs";
import Calculator from "/Calc-JS/src/include.mjs";


const Main = {

	// Initialize
	init: async function() {
		input.focus();

		input.addEventListener('focusout', () => {
			input.focus();
		});

		equals.addEventListener('click', () => {
			this.calculate();
		});

		window.addEventListener('keydown', (event) => {
			if(event.key === 'Enter') this.calculate();
			else if(event.key === 'Backspace' && event.shiftKey) input.value = "";
		});
	},


	// Evalulate an equation
	calculate: function() {
		if(!input.value.length) return;

		const results = Calculator.eval(input.value, addons.constants, addons.functions);
		let res_data = [];

		for(let r in results) {
			res_data.push(results[r].error.has_error() ? results[r].error.message : results[r].value.toString());
		}

		let res_string = res_data.join(', ');
		CalcHistory.store(input.value, res_string);
		input.value = res_string;
	}

};


export default Main;
