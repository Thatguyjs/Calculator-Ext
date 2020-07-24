// Copyright (c) 2020 Thatguyjs All Rights Reserved.


const input = document.getElementById('input');
const equals = document.getElementById('equals');


// Load history
CalcHistory.load();
input.value = CalcHistory.active || "";


// Store equation & input data
input.addEventListener('keyup', (event) => {
	CalcHistory.storeActive(input.value);
});


// Keep the input area focused
input.focus();
input.addEventListener('focusout', input.focus);


// Evaluate an expression
input.addEventListener('keydown', (event) => {
	if(event.code === "Enter") evalInput();
	else if(event.code === 'Backspace' && event.shiftKey) input.value = "";
});

equals.addEventListener('click', evalInput);

function evalInput() {
	let result = Calculator.eval(input.value);

	if(result.error) {
		input.value = Calculator.getError(result.error);
	}
	else if(input.value !== result.value.toString()) {
		CalcHistory.store(input.value, result);
		CalcHistory.storeActive(result.value);

		input.value = result.value;
	}
}


// History dropdown menu
const historyToggle = document.getElementById('history-toggle');
const historyEntries = document.getElementById('history-entries');

historyToggle.addEventListener('click', () => {
	historyEntries.classList.toggle('hidden');
});
