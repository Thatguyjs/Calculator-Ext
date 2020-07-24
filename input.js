// Copyright (c) 2020 Thatguyjs All Rights Reserved.


const Buttons = {
	buttons: [
		...document.getElementsByClassName('number'),
		...document.getElementsByClassName('operator'),
		...document.getElementsByClassName('function')
	],

	modifier: function(button) {
		switch(button.getAttribute('name')) {

			case 'angle':
				break;

			case 'invert':
				break;

			case 'clear':
				input.value = '';
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

		}
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
		});
	}
}
