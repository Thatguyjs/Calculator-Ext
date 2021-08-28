// Copyright (c) 2020 Thatguyjs All Rights Reserved.

import CalcHistory from "./history.mjs";
import Calculator from "/calculate/calculate.mjs";


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
		Calculator.clearVariables();

		const results = Calculator.eval(input.value);
		let resString = "";

		for(let r in results) {
			if(!results[r].error) resString += results[r].value.toString();
			else resString += Calculator.errorMessage(results[r].error);
			resString += ', ';
		}

		resString = resString.slice(0, -2);

		CalcHistory.store(input.value, resString);
		input.value = resString;
	}

};


export default Main;
