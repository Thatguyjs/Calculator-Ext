// Copyright (c) 2021 Thatguyjs All Rights Reserved.

import Calculator from "./calculate.mjs";


Calculator.addConstant('e', Math.E);

Calculator.addConstant('pi', Math.PI);



Calculator.addFunction('abs', (value) => {
	return Math.abs(value);
});

Calculator.addFunction('rand', (min=1, max=0) => {
	if(max < min) {
		let tmp = min;
		min = max;
		max = tmp;
	}

	return Math.random() * (max - min) + min;
});



Calculator.addFunction('sqrt', (value) => {
	return Math.sqrt(value);
});

Calculator.addFunction('cbrt', (value) => {
	return Math.cbrt(value);
});



Calculator.addFunction('floor', (value) => {
	return Math.floor(value);
});

Calculator.addFunction('round', (value) => {
	return Math.round(value);
});

Calculator.addFunction('ceil', (value) => {
	return Math.ceil(value);
});



Calculator.addFunction('sin', (value) => {
	if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
	return Math.sin(value);
});

Calculator.addFunction('asin', (value) => {
	let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
	return Math.asin(value) * mult;
});

Calculator.addFunction('cos', (value) => {
	if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
	return Math.cos(value);
});

Calculator.addFunction('acos', (value) => {
	let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
	return Math.acos(value) * mult;
});

Calculator.addFunction('tan', (value) => {
	if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
	return Math.tan(value);
});

Calculator.addFunction('atan', (value) => {
	let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
	return Math.atan(value) * mult;
});



Calculator.addFunction('log', (value) => {
	return Math.log10(value);
});

Calculator.addFunction('ln', (value) => {
	return Math.log(value);
});
