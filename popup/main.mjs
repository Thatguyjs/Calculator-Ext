// Copyright (c) 2021 Thatguyjs All Rights Reserved.

import addons from "./addons.mjs";
import CalcHistory from "./history.mjs";
import Calculator from "/Calc-JS/src/include.mjs";


const Main = {

	// Input state / history
	input_state: {
		current: 'live', // 'live', 'history'
		history: 0, // Index into calculator history
		live: "" // Input that hasn't been calculated yet
	},

	// Initialize
	init: function() {
		input.focus();

		input.addEventListener('focusout', () => {
			input.focus();
		});

		input.addEventListener('keyup', () => {
			if(this.input_state.current === 'live')
				this.input_state.live = input.value;
		});

		equals.addEventListener('click', () => {
			this.calculate();
		});

		window.addEventListener('keydown', (event) => {
			if(event.key === 'Enter') this.calculate();
			else if(event.key === 'ArrowUp') this.move_back(event.shiftKey);
			else if(event.key === 'ArrowDown') this.move_forward(event.shiftKey);
			else if(event.key === 'Backspace' && event.shiftKey) input.value = "";
		});
	},


	// Move back in calculator history
	move_back: function(shift=false) {
		if(shift) {
			this.input_state.current = 'history';
			this.input_state.history = 24;
		}
		else if(this.input_state.current === 'live')
			this.input_state.current = 'history';
		else if(this.input_state.history < 24)
			this.input_state.history++;

		input.value = CalcHistory.stored[this.input_state.history].equation;
	},

	// Move forward in calculator history / towards live input
	move_forward: function(shift=false) {
		if(!shift && this.input_state.history > 0) {
			this.input_state.history--;
			input.value = CalcHistory.stored[this.input_state.history].equation;
		}
		else {
			this.input_state.current = 'live';
			this.input_state.history = 0;
			input.value = this.input_state.live;
		}
	},


	// Evalulate an equation
	calculate: function() {
		if(!input.value.length) return;

		const results = Calculator.eval(input.value, addons);
		let res_data = [];

		for(let r in results) {
			res_data.push(results[r].error.has_error() ? results[r].error.message : results[r].value.toString());
		}

		let res_string = res_data.join(', ');
		CalcHistory.store(input.value, res_string);
		input.value = res_string;

		this.input_state.current = 'live';
		this.input_state.history = 0;
		this.input_state.live = input.value;
	}

};


export default Main;

