// Copyright (c) 2020 Thatguyjs All Rights Reserved.


Calculator.addConstant('e', Math.E);

Calculator.addConstant('pi', Math.PI);



Calculator.addFunction('abs', (value) => {
	return Math.abs(value);
});

Calculator.addFunction('rand', (...values) => {
	switch(values.length) {

		case 1:
		return Math.random() * values[0];

		case 2:
		return Math.random() * (values[1] - values[0]) + values[0];

		default:
		return Math.random();

	}
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
	return Math.sin(value);
});

Calculator.addFunction('cos', (value) => {
	return Math.tan(value);
});

Calculator.addFunction('tan', (value) => {
	return Math.tan(value);
});



Calculator.addFunction('log', (value) => {
	return Math.log10(value);
});

Calculator.addFunction('ln', (value) => {
	return Math.log(value);
});
