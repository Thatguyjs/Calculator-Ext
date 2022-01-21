import { expect_eq, finish } from "./lib.mjs";

import addons from "../popup/addons.mjs";
import Calculator from "../Calc-JS/src/include.mjs";

let test_results = { total: 0, passed: 0, failed: [] };

function calculate(input) {
	let result = Calculator.eval(input, addons);
	let res_list = [];

	for(let r in result) {
		let val = result[r].value;

		if(Array.isArray(val)) val = `[${val.join(', ')}]`;
		else val = val?.toString();

		res_list.push(result[r].error.has_error() ? result[r].error.message : val);
	}

	return res_list.join(', ');
}

function test(input, expected, without_space=true) {
	let res = expect_eq(expected, calculate(input), null, input);

	if(without_space) {
		const stripped_input = input.replaceAll(/\s+/g, '');
		if(res && stripped_input !== input) res = expect_eq(expected, calculate(stripped_input), null, stripped_input);
	}

	return res;
}


// Basic number & order of operations tests
test("1", "1");
test("-1", "-1");
test("2 + -3", "-1");
test("-3 + 5", "2");
test("-3 * 5", "-15");
test("-3 / 2", "-1.5");
test("110 + 50", "160");
test("50 - 110", "-60");
test("1 + 2 * 3", "7");
test("110 + 50 + (4 - 2 * 5) - 10 + 40", "184");
test("(110 + 50) * (2 - 4)", "-320");
test("2 ^ 5 * (3 - 4)", "-32");
test("2 ^ 6", "64");
test("0 - 8 - 0 - 5 ^ 3", "-133");
test("2E3", "2000");
test("4! - 3", "21");
test("-2^3", "-8");
test("-2^4", "-16");
test("2^-4", "0.0625");
test("(-2)^4", "16");

// Boolean & Bitwise operators
test("1 > 2", "0");
test("1 < 2", "1");
test("-3 + 5 > 2", "0");
test("-3 + 5 > 1.99", "1");
test("-3 + 5 < 2.01", "1");
test("2 | 8", "10");
test("3 | 2", "3");
test("7 & 2", "2");
test("7 & 2 > 1.99", "1");
test("7 & 2 < 2.01", "1");

// Constants
test("pi * 2.5", "7.853981634");
test("2.5pi", "7.853981634");

// Variables
test("x = 4, x", "4");
test("x, x = 4", "4");
test("x = -2, x", "-2");
test("x, x = -2", "-2");

// Functions
test("max(-1, 5)", "5");
test("max(1, 2, 3, 4)", "4");
test("min(-1, 5)", "-1");
test("min(4, 3, 2, 1)", "1");
test("isprime(1)", "0");
test("isprime(497)", "0");
test("isprime(499)", "1");
test("gcd(6, 9)", "3");
test("gcf(0, 4)", "4");
test("gcd(4, 0)", "4");
test("gcf(230, 590)", "10");

// Macros
test("hex(ff)", "255");
test("hex(1fc8)", "8136");
test("hex(0x1fc8)", "8136");
test("hex(fg)", "Invalid Hex String");
test("oct(173)", "123");
test("oct(17710)", "8136");
test("oct(0o17710)", "8136");
test("oct(79)", "Invalid Octal String");
test("bin(10)", "2");
test("bin(111)", "7");
test("bin(1111111001000)", "8136");
test("bin(0b1111111001000)", "8136");
test("bin(2)", "Invalid Binary String");
test("convert(100 meters as feet)", "328.08399", false);
test("convert(4.5 yd, mi)", "0.0025568133");
test("convert(48 * 2 kg to lb)", "211.6437950272", false);
test("convert(42 oz, dram)", "672");
test("convert(360 / 2 deg as rad)", "3.1415926536", false);
test("convert(1 rad, deg)", "57.2957795131");
test("convert(600 secs to days)", "0.0069444444", false);
test("convert(1 - 0.6 yr, mins)", "210239.695152442");
test("convert()", "Missing Parameters");
test("convert(2 meters)", "Missing Parameters");
test("convert(25 programmers to people)", "Unknown Unit", false);
test("f(x, x + 2, 0, 4)", "[2, 3, 4, 5, 6]");
test("f(y, y * 4, -1, 1, 0.25)", "[-4, -3, -2, -1, 0, 1, 2, 3, 4]");
test("f(x, -x, -3, 3)", "[3, 2, 1, 0, -1, -2, -3]");

// Tests from Calculator-Ext
test("1", "1");
test("-1", "-1");
test("1 + 2", "3");
test("5 - 22", "-17");
test("10 - 7", "3");
test("2 * 3", "6");
test("8 / 2", "4");
test("5 % 3", "2");
test("2 ^ 6", "64");
test("10E2", "1000");
test("300E-2", "3");
test("6!", "720");
test("0.1 + 0.2", "0.3");

// Multiple expressions, no variables
test("1 + 1, 2 + 3", "2, 5");
test("7 - 21, 3 * 5", "-14, 15");
test("5 / 2, 0.25 * 4 / 2", "2.5, 0.5");
test("3 - 2, 2, 5 / 2 + 0.5", "1, 2, 3");

// Implicit multiplication
test("2(3)", "6");
test("(7)2", "14");
test("a = 3, 6a", "18");
test("2sqrt(169)", "26");
test("sqrt(169)3", "39");
test("(2)3!", "12");
test("a = 11, b = 3, (a)b + 1", "34");

// Variables (single & multiple expressions)
test("a = 5, a + 1", "6");
test("a + 1, a = 5", "6");
test("a = 6, b = 4, a + b", "10");
test("a + b, a = 6, b = 4", "10");
test("a = 6, a + b, b = 4", "10");
test("a = 4 * 2, b = 16 / 4 + 4, a + b", "16");
test("a = 31, b = a + 11, a, b", "31, 42");
test("a, b, a = 31, b = a + 11", "31, 42");

// Functions & constants
test("pi", "3.1415926536");
test("e", "2.7182818285");
test("sqrt(36)", "6");
test("sum(2, 5, 9, 16)", "32");
test("sum()", "0");
test("round(0.49)", "0");
test("round(0.5)", "1");
test("floor(4.99)", "4");
test("ceil(2.01)", "3");
test("sum(2 + 3 / 2, 4 * 5)", "23.5");

test("(-1)!", "Invalid Operation");
test("( )", "Invalid Expression");
test("(", "Invalid Expression");
test(")", "Invalid Expression");
test("1, ,2", "Invalid Expression");
test("a==1", "Invalid Expression");
test("4 + a", "Unknown Variable");
test("notafunc(123, 456)", "Unknown Function");

finish();
