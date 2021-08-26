// Copyright (c) 2021 Thatguyjs All Rights Reserved.

import Calculator from "./calculate.mjs";


Calculator.addConstant('e', Math.E);
Calculator.addConstant('pi', Math.PI);


Calculator.addFunction('abs', (value) => {
	return Math.abs(value);
}, { min: 1, max: 1 });

Calculator.addFunction('rand', (min=1, max=0) => {
	if(max < min) {
		let tmp = min;
		min = max;
		max = tmp;
	}

	return Math.random() * (max - min) + min;
}, { max: 2 });

Calculator.addFunction('sum', (...nums) => {
	let sum = 0;

	for(let n in nums)
		sum += nums[n];

	return sum;
});

// Inclusive on both ends
Calculator.addFunction('sumrange', (start, stop) => {
	let sum = 0;

	for(let i = start; i <= stop; i++)
		sum += i;

	return sum;
});


Calculator.addFunction('sqrt', Math.sqrt, { min: 1, max: 1 });

Calculator.addFunction('cbrt', Math.cbrt, { min: 1, max: 1 });


Calculator.addFunction('floor', Math.floor, { min: 1, max: 1 });

Calculator.addFunction('round', Math.round, { min: 1, max: 1 });

Calculator.addFunction('ceil', Math.ceil, { min: 1, max: 1 });


Calculator.addFunction('sin', (value) => {
	if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
	return Math.sin(value);
}, { min: 1, max: 1 });

Calculator.addFunction('asin', (value) => {
	let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
	return Math.asin(value) * mult;
}, { min: 1, max: 1 });

Calculator.addFunction('cos', (value) => {
	if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
	return Math.cos(value);
}, { min: 1, max: 1 });

Calculator.addFunction('acos', (value) => {
	let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
	return Math.acos(value) * mult;
}, { min: 1, max: 1 });

Calculator.addFunction('tan', (value) => {
	if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
	return Math.tan(value);
}, { min: 1, max: 1 });

Calculator.addFunction('atan', (value) => {
	let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
	return Math.atan(value) * mult;
}, { min: 1, max: 1 });


Calculator.addFunction('log', Math.log10, { min: 1, max: 1 });

Calculator.addFunction('ln', Math.log, { min: 1, max: 1 });
