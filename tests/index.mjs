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


// Single operations / expressions
expect_eq("1", calculate("1"));
expect_eq("-1", calculate("-1"));
expect_eq("3", calculate("1 + 2"));
expect_eq("-17", calculate("5 - 22"));
expect_eq("3", calculate("10 - 7"));
expect_eq("6", calculate("2 * 3"));
expect_eq("4", calculate("8 / 2"));
expect_eq("2", calculate("5 % 3"));
expect_eq("64", calculate("2 ^ 6"));
expect_eq("1000", calculate("10E2"));
expect_eq("3", calculate("30E-1"));
expect_eq("720", calculate("6!"));

// Multiple expressions, no variables
expect_eq("2, 5", calculate("1 + 1, 2 + 3"));
expect_eq("-14, 15", calculate("7 - 21, 3 * 5"));
expect_eq("2.5, 0.5", calculate("5 / 2, 0.25 * 4 / 2"));
expect_eq("1, 2, 3", calculate("3 - 2, 2, 5 / 2 + 0.5"));

// Variables
expect_eq("6", calculate("a = 5, a + 1"));
expect_eq("6", calculate("a + 1, a = 5"));
expect_eq("16", calculate("a = 4 * 2, b = 16 / 4 + 4, a + b"));
expect_eq("31, 42", calculate("a = 31, b = a + 11, a, b"));
expect_eq("31, 42", calculate("a, b, a = 31, b = a + 11"));

// Functions & constants
expect_eq("3.1415926536", calculate("pi"));
expect_eq("2.7182818285", calculate("e"));
expect_eq("6", calculate("sqrt(36)"));

// Errors
expect_eq("Invalid Operation", calculate("(-1)!"));

finish();
