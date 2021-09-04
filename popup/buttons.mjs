// Copyright (c) 2020 Thatguyjs All Rights Reserved.

import CalcHistory from "./history.mjs";


const Buttons = {

	// List of calculator buttons
	buttons: [
		...document.getElementsByClassName('number'),
		...document.getElementsByClassName('operator'),
		...document.getElementsByClassName('function')
	],


	// Change the angle mode
	setAngleMode: function(mode) {
		let initial = Buttons.getAngleMode();
		let otherMode = mode === 'degrees' ? 'radians' : 'degrees';

		if(mode === 'degrees' || mode === 'radians') {
			document.querySelector('.rotate-' + mode).classList.add('selected');
			document.querySelector('.rotate-' + otherMode).classList.remove('selected');

			document.querySelector('.rotate-type').setAttribute('data-active', mode);

			CalcHistory.storeAngleMode(mode);
		}
		else if(mode === 'toggle') {
			Buttons.setAngleMode(Buttons.getAngleMode() === 'degrees' ? 'radians' : 'degrees');
		}
	},


	// Get the angle mode
	getAngleMode: function() {
		return document.querySelector('.rotate-type').getAttribute('data-active');
	},


	// Handle modifier button actions
	modifier: function(button) {
		switch(button.getAttribute('name')) {

			case 'angle':
				Buttons.setAngleMode('toggle');
				break;

			case 'invert':
				button.classList.toggle('active');

				for(let b in Buttons.buttons) {
					let btn = Buttons.buttons[b];
					let attr = "";

					if(attr = btn.getAttribute('data-inverse')) {
						btn.setAttribute('data-inverse', btn.innerText);
						btn.innerText = attr;
					}
				}
				break;

			case 'back':
				input.value = input.value.slice(0, -1);
				break;

			case '!':
				input.value += '!';
				break;

			case 'exp':
				input.value += 'E';
				break;

			case 'pi':
				input.value += 'pi';
				break;

			case 'e':
				input.value += 'e';
				break;

			case 'ans':
				input.value += CalcHistory.last.result;
				break;

		}

		input.dispatchEvent(new Event('input'));
	}

};


for(let b in Buttons.buttons) {
	let btn = Buttons.buttons[b];

	if(btn.classList.contains('modifier')) {
		btn.addEventListener('click', Buttons.modifier.bind(Buttons.modifier, btn));
	}
	else {
		btn.addEventListener('click', () => {
			if(btn.classList.contains('number') || btn.classList.contains('operator')) {
				input.value += btn.innerText;
			}
			else {
				input.value += btn.innerText + '(';
			}

			input.dispatchEvent(new Event('input'));
		});
	}
}


export default Buttons;
