// Run this file to run tests

import { expect_eq, finish } from "./lib.js";
import Calculator from "../calculate/calculate.mjs";
import "../calculate/addons.mjs";


function calculate(input) {
	Calculator.clearVariables();

	const results = Calculator.eval(input);
	let resString = "";

	for(let r in results) {
		if(!results[r].error) resString += results[r].value.toString();
		else resString += Calculator.errorMessage(results[r].error);
		resString += ', ';
	}

	return resString.slice(0, -2);
}


function expect_eq_calc(result, input) {
	return expect_eq(result, calculate(input));
}


// Single operations / expressions
expect_eq_calc("1", "1");
expect_eq_calc("-1", "-1");
expect_eq_calc("3", "1 + 2");
expect_eq_calc("-17", "5 - 22");
expect_eq_calc("3", "10 - 7");
expect_eq_calc("6", "2 * 3");
expect_eq_calc("4", "8 / 2");
expect_eq_calc("2", "5 % 3");
expect_eq_calc("64", "2 ^ 6");
expect_eq_calc("1000", "10E2");
expect_eq_calc("3", "30E-1");
expect_eq_calc("720", "6!");

// Multiple expressions, no variables
expect_eq_calc("2, 5", "1 + 1, 2 + 3");
expect_eq_calc("-14, 15", "7 - 21, 3 * 5");
expect_eq_calc("2.5, 0.5", "5 / 2, 0.25 * 4 / 2");
expect_eq_calc("1, 2, 3", "3 - 2, 2, 5 / 2 + 0.5");

// Variables (single & multiple expressions)
expect_eq_calc("6", "a = 5, a + 1");
expect_eq_calc("6", "a + 1, a = 5");
expect_eq_calc("10", "a = 6, b = 4, a + b");
expect_eq_calc("10", "a + b, a = 6, b = 4");
expect_eq_calc("10", "a = 6, a + b, b = 4");
expect_eq_calc("16", "a = 4 * 2, b = 16 / 4 + 4, a + b");
expect_eq_calc("31, 42", "a = 31, b = a + 11, a, b");
expect_eq_calc("31, 42", "a, b, a = 31, b = a + 11");

// Functions & constants
expect_eq_calc("3.1415926536", "pi");
expect_eq_calc("2.7182818285", "e");
expect_eq_calc("6", "sqrt(36)");

// Errors
expect_eq_calc("Invalid Operation", "(-1)!");

finish();
